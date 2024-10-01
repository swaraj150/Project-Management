package com.example.server.controller;

import com.example.server.requests.CreateProjectRequest;
import com.example.server.requests.TeamCreateRequest;
import com.example.server.response.ApiResponse;
import com.example.server.response.ProjectResponse;
import com.example.server.service.ProjectService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;
    @PostMapping("/create")
    public ResponseEntity<ApiResponse<?>> create(@RequestBody @NonNull CreateProjectRequest request){
        projectService.createProject(request);
        return ResponseEntity.ok(ApiResponse.success("Project created successfully"));
    }
    @GetMapping("/")
    public ResponseEntity<ApiResponse<ProjectResponse>> load(@RequestParam UUID id){
        return ResponseEntity.ok(ApiResponse.success(projectService.loadProjectResponse(id)));
    }

}
