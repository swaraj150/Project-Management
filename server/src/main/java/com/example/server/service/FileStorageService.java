package com.example.server.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
@RequiredArgsConstructor

public class FileStorageService {

    @Value("${file-upload-dir}")
    private String fileUploadDir;


    public String storeFile(MultipartFile file) throws IOException {
        try {


            String fileName = UUID.randomUUID() + "_" + StringUtils.cleanPath((file.getOriginalFilename()==null)?"temp":file.getOriginalFilename());
            Path uploadPath = Paths.get(fileUploadDir).toAbsolutePath().normalize();
            if(!Files.exists(uploadPath)){
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return "/uploads/" + fileName;
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store file", ex);
        }
    }
}
