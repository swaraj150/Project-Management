package com.example.server.controller;

import com.example.server.entities.User;
import com.example.server.enums.ProjectRole;
import com.example.server.requests.AddTeamsToProjectRequest;
import com.example.server.requests.CreateProjectRequest;
import com.example.server.response.ProjectResponse;
import com.example.server.service.ProjectService;
import com.example.server.service.UserService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/projects")
@RequiredArgsConstructor
public class ProjectController {
    private final ProjectService projectService;
    private final UserService userService;
    @PostMapping("")
    public ResponseEntity<?> create(@RequestBody @NonNull CreateProjectRequest request){
        ProjectResponse projectResponse=projectService.createProject(request);
        HashMap<String,Object> h=new HashMap<>();
        h.put("project",projectResponse);
        return ResponseEntity.ok(h);
    }
    @GetMapping("/{id}")
    public ResponseEntity<?> load(@PathVariable @NonNull UUID id){
        ProjectResponse projectResponse=projectService.loadProjectResponse(id);
        HashMap<String,Object> h=new HashMap<>();
        h.put("project",projectResponse);
        return ResponseEntity.ok(h);
    }
//    @PutMapping("/teams")
//    public ResponseEntity<?> addTeam(@RequestBody @NonNull AddTeamsToProjectRequest request){
//        projectService.addTeam(team);
//        HashMap<String,Object> h=new HashMap<>();
//        h.put("message","Team added successfully");
//        return ResponseEntity.ok(h);
//    }
    @PatchMapping("/teams")
    public ResponseEntity<?> addTeams(@RequestBody AddTeamsToProjectRequest request){
        projectService.addTeam(request);
        HashMap<String,Object> h=new HashMap<>();
        h.put("msg","Teams added successfully");
        return ResponseEntity.ok(h);
    }
    @GetMapping("")
    public ResponseEntity<?> getProjectByUser(){
        User user=userService.loadAuthenticatedUser();
        HashMap<String,Object> h=new HashMap<>();
        if(user.getProjectRole()== ProjectRole.PRODUCT_OWNER){
            h.put("projects",projectService.loadAllProjectResponses());
        }else{
            ProjectResponse res = projectService.loadProjectResponseByUser();
            if (res == null) h.put("projects",null);
            else h.put("projects",res);
        }
        return ResponseEntity.ok(h);
    }

    @GetMapping("/suggest-teams")
    public ResponseEntity<?> getTeams(@RequestParam @NonNull UUID projectId){
        HashMap<String,Object> h=new HashMap<>();
        h.put("teams",projectService.suggestTeams(projectId));
        return ResponseEntity.ok(h);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable @NonNull UUID id){
        projectService.deleteProject(id);
        HashMap<String,Object> h=new HashMap<>();
        h.put("msg","Project deleted successfully");
        return ResponseEntity.ok(h);
    }




}
