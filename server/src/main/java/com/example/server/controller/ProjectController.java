package com.example.server.controller;

import com.example.server.requests.AddTeamsToProjectRequest;
import com.example.server.requests.CreateProjectRequest;
import com.example.server.response.ApiResponse;
import com.example.server.response.ProjectResponse;
import com.example.server.service.ProjectService;
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
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody @NonNull CreateProjectRequest request){
        ProjectResponse projectResponse=projectService.createProject(request);
        HashMap<String,Object> h=new HashMap<>();
        h.put("project",projectResponse);
        return ResponseEntity.ok(h);
    }
    @GetMapping("")
    public ResponseEntity<?> load(@RequestParam @NonNull UUID id){
        ProjectResponse projectResponse=projectService.loadProjectResponse(id);
        HashMap<String,Object> h=new HashMap<>();
        h.put("project",projectResponse);
        return ResponseEntity.ok(h);
    }
    @PutMapping("/add-team")
    public ResponseEntity<ApiResponse<String>> addTeam(@RequestParam @NonNull String team){
        projectService.addTeam(team);
        return ResponseEntity.ok(ApiResponse.success("team added successfully"));
    }
    @PutMapping("/add-teams")
    public ResponseEntity<?> addTeams(@RequestBody AddTeamsToProjectRequest request){
        if(request.getTeamNames()==null){
            projectService.addTeamsById(request.getTeamsIds());
        }
        else if(request.getTeamsIds()==null){
            projectService.addTeamsByName(request.getTeamNames());
        }
        HashMap<String,Object> h=new HashMap<>();
        h.put("msg","teams added successfully");
        return ResponseEntity.ok(h);
    }
    @GetMapping("/getAllProjects")
    public ResponseEntity<?> getAllProjects(){
//        User user=userService.loadUser(securityUtils.getCurrentUsername());
//        if(!user.getProjectRole().hasAuthority(ProjectAuthority.VIEW_TEAM)){
//            throw new UnauthorizedAccessException("User does not have the required authority");
//        }
        HashMap<String,Object> h=new HashMap<>();
        h.put("projects",projectService.loadAllProjectResponses());
        return ResponseEntity.ok(h);
    }

    @GetMapping("/suggest-teams")
    public ResponseEntity<?> getTeams(@RequestParam @NonNull UUID projectId){
        HashMap<String,Object> h=new HashMap<>();
        h.put("teams",projectService.suggestTeams(projectId));
        return ResponseEntity.ok(h);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> delete(@RequestParam @NonNull UUID projectId){
        projectService.deleteProject(projectId);
        return ResponseEntity.ok("Deleted Successfully");
    }


}
