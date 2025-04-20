package com.example.server.service;

import com.example.server.config.S3Config;
import com.example.server.entities.Document;
import com.example.server.entities.User;
import com.example.server.repositories.DocumentRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor

public class FileStorageService {

    @Value("${file-upload-dir}")
    private String fileUploadDir;
    private final S3Client s3Client;
    private final S3Presigner presigner;
    private final DocumentRepository documentRepository;
    private final UserService userService;

    public String storeFile(MultipartFile file) throws Exception {
        try {
            User user=userService.loadAuthenticatedUser();
            if(user.getOrganizationId()==null){
                throw new RuntimeException("User must belong to an Organization to upload files");
            }
            String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath((file.getOriginalFilename()==null)?"temp":file.getOriginalFilename());
            String bucket = getBucketFromS3Url(fileUploadDir);
            String prefix = getPrefixFromS3Url(fileUploadDir);
            String key = prefix + fileName;
            PutObjectRequest request = PutObjectRequest.builder()
                    .bucket(bucket)
                    .key(key)
                    .contentType(file.getContentType())
                    .build();
            s3Client.putObject(request, RequestBody.fromInputStream(file.getInputStream(), file.getSize()));
            String url=generatePresignedUrl(fileName);
//            Document document=new Document();
//            document.setFileName(fileName);
//            document.setUrl(url);
//            document.setExpiresAt(LocalDateTime.now().plusDays(7));
//            document.setUploadedBy(user.getId());
//            documentRepository.save(document);
            return url;
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store file", ex);
        }
        catch (Exception e){
            throw new Exception("Something went wrong "+e.getMessage());
        }
    }
    private String getBucketFromS3Url(String url) {
        return url.replace("s3://", "").split("/")[0];
    }

    private String getPrefixFromS3Url(String url) {
        String[] parts = url.replace("s3://", "").split("/", 2);
        return parts.length > 1 ? parts[1] + "/" : "";
    }
    public String generatePresignedUrl(String fileName) {
        String bucket = getBucketFromS3Url(fileUploadDir);
        String prefix = getPrefixFromS3Url(fileUploadDir);
        String key = prefix + fileName;

        GetObjectRequest getObjectRequest = GetObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .build();

        GetObjectPresignRequest presignRequest = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofDays(7))
                .getObjectRequest(getObjectRequest)
                .build();

        return presigner.presignGetObject(presignRequest).url().toString();
    }
}
