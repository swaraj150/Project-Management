package com.example.server.controller;

import com.example.server.requests.CreateTechRequest;
import com.example.server.service.TechnologyService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tech")
@RequiredArgsConstructor
public class TechnologyController {
    private final TechnologyService technologyService;
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody @NonNull CreateTechRequest createTechRequest){
        technologyService.create(createTechRequest);
        return ResponseEntity.ok("tech added");
    }
    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestParam @NonNull UUID id){
        technologyService.deleteTechnology(id);
        return ResponseEntity.ok("Deleted Successfully");
    }
    // additions and removals will be added later

}
