package com.example.server.controller;

import com.example.server.entities.Document;
import com.example.server.repositories.DocumentRepository;
import com.example.server.service.FileStorageService;
import jakarta.persistence.EntityNotFoundException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URISyntaxException;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
public class FileUploadController {
    private final FileStorageService fileStorageService;
    private final DocumentRepository documentRepository;

    @PostMapping("/upload")
    public ResponseEntity<?> upload(@RequestParam("file") MultipartFile file) throws Exception {
        String url = fileStorageService.storeFile(file);
        return ResponseEntity.ok(Map.of("url",url,"file name", file.getOriginalFilename()==null?"temp":file.getOriginalFilename()));
    }

    @GetMapping("/download/{fileName}")
    public ResponseEntity<?> download(@PathVariable @NonNull String fileName){
        Document document=documentRepository.findByFileName(fileName).orElseThrow(()->new EntityNotFoundException("File not found"));
        String url=document.getUrl();
//        if(!document.getExpiresAt().isAfter(LocalDateTime.now())){
//            url=fileStorageService.generatePresignedUrl(fileName);
//            document.setUrl(url);
//            document.setExpiresAt(LocalDateTime.now().plusDays(7));
//            documentRepository.save(document);
//        }
        return ResponseEntity.ok(Map.of("url",url,"file name", document.getFileName()));
    }

}
