package com.example.server.controller;

import com.example.server.component.SecurityUtils;
import com.example.server.enums.ProjectAuthority;
import com.example.server.entities.User;
import com.example.server.enums.ProjectRole;
import com.example.server.exception.UnauthorizedAccessException;
import com.example.server.repositories.TeamRepository;
import com.example.server.requests.TeamCreateRequest;
import com.example.server.response.TeamResponse;
import com.example.server.service.ProjectService;
import com.example.server.service.TeamService;
import com.example.server.service.UserService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/v1/teams")
@RequiredArgsConstructor
public class TeamController {
    private final TeamService teamService;
    private final UserService userService;
    private final SecurityUtils securityUtils;
    private final ProjectService projectService;
    private final TeamRepository teamRepository;

    @PostMapping("")
    public ResponseEntity<?> create(@RequestBody @NonNull TeamCreateRequest request){
        TeamResponse teamResponse=teamService.createTeam(request);
        HashMap<String,Object> h=new HashMap<>();
        h.put("team",teamResponse);
        return ResponseEntity.ok(h);
    }


//    @GetMapping("/")
//    public ResponseEntity<?> load(){
//        User user=userService.loadUser(securityUtils.getCurrentUsername());
//        if(!user.getProjectRole().hasAuthority(ProjectAuthority.VIEW_TEAM)){
//            throw new UnauthorizedAccessException("User does not have the required authority");
//        }
//        TeamResponse teamResponse=teamService.loadTeamResponse(teamRepository.findTeamIdByUserId(user.getId()));
//        HashMap<String,Object> h=new HashMap<>();
//        h.put("team",teamResponse);
//        return ResponseEntity.ok(h);
//    }

    @GetMapping("/{id}")
    public ResponseEntity<?> load(@PathVariable @NonNull UUID id){
        User user=userService.loadUser(securityUtils.getCurrentUsername());
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.VIEW_TEAM)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }

        TeamResponse teamResponse=teamService.loadTeamResponse(id);
        HashMap<String,Object> h=new HashMap<>();
        h.put("team",teamResponse);
        return ResponseEntity.ok(h);
    }

    @GetMapping("")
    public ResponseEntity<?> getAllTeams(){
        User user=userService.loadUser(securityUtils.getCurrentUsername());
        HashMap<String,Object> h=new HashMap<>();
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.VIEW_TEAM)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        if(user.getProjectRole()==ProjectRole.PRODUCT_OWNER){
            h.put("teams",teamService.loadAllTeamResponses());
        }
        else if(user.getProjectId()==null){
            h.put("teams",teamService.loadTeamResponsesByUser());
        }
        else {
            h.put("teams",teamService.loadTeamResponsesByProject());
        }
        return ResponseEntity.ok(h);
    }
//    @GetMapping("")
//    public ResponseEntity<?> getAllTeams(){
//        User user=userService.loadUser(securityUtils.getCurrentUsername());
//        if(!user.getProjectRole().hasAuthority(ProjectAuthority.VIEW_TEAM)){
//            throw new UnauthorizedAccessException("User does not have the required authority");
//        }
//        HashMap<String,Object> h=new HashMap<>();
//        h.put("teams",teamService.loadAllTeamResponses());
//        return ResponseEntity.ok(h);
//    }

    @GetMapping("/search")
    public ResponseEntity<?> searchTeam(@RequestParam @NonNull String query){
        HashMap<String,Object> h=new HashMap<>();
        h.put("teams",teamService.searchByName(query));
        return ResponseEntity.ok(h);
    }

//    @GetMapping("/suggestions") // suggest teams based on project workload
//    public ResponseEntity<?> suggest(@RequestParam @NonNull UUID projectId){
//        HashMap<String,Object> h=new HashMap<>();
//        h.put("suggestedMembers",projectService.suggestTeams(projectId));
//        return ResponseEntity.ok(h);
//    }

    @DeleteMapping("")
    public ResponseEntity<?> delete(@PathVariable @NonNull UUID teamId){
        teamService.deleteTeam(teamId);
        HashMap<String,Object> h=new HashMap<>();
        h.put("message","team deleted successfully");
        return ResponseEntity.ok(h);
    }
















}
