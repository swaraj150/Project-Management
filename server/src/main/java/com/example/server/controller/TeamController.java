package com.example.server.controller;

import com.example.server.component.SecurityUtils;
import com.example.server.dto.TeamDTO;
import com.example.server.entities.Organization;
import com.example.server.entities.ProjectAuthority;
import com.example.server.entities.Team;
import com.example.server.entities.User;
import com.example.server.exception.UnauthorizedAccessException;
import com.example.server.repositories.TeamRepository;
import com.example.server.requests.TeamCreateRequest;
import com.example.server.response.ApiResponse;
import com.example.server.response.OrganizationResponse;
import com.example.server.response.TeamResponse;
import com.example.server.service.TeamService;
import com.example.server.service.UserService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/v1/teams")
@RequiredArgsConstructor
public class TeamController {
    private final TeamService teamService;
    private final UserService userService;
    private final SecurityUtils securityUtils;
    private final TeamRepository teamRepository;

    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody @NonNull TeamCreateRequest request){
        TeamResponse teamResponse=teamService.createTeam(request);
        HashMap<String,Object> h=new HashMap<>();
        h.put("status","200");
        h.put("organization",teamResponse);
        return ResponseEntity.ok(h);
    }

    @GetMapping("/")
    public ResponseEntity<?> load(){
        User user=userService.loadUser(securityUtils.getCurrentUsername());
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.VIEW_TEAM)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        TeamResponse teamResponse=teamService.loadTeam(teamRepository.findTeamIdByUserId(user.getId()));
        HashMap<String,Object> h=new HashMap<>();
        h.put("status","200");
        h.put("team",teamResponse);
        return ResponseEntity.ok(h);
    }

    @GetMapping("/getAllTeams")
    public ResponseEntity<?> getAllTeams(){
        User user=userService.loadUser(securityUtils.getCurrentUsername());
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.VIEW_TEAM)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        HashMap<String,Object> h=new HashMap<>();
        h.put("status","200");
        h.put("teams",teamService.loadAllTeamResponses());
        return ResponseEntity.ok(h);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchTeam(@RequestParam @NonNull String key){
        HashMap<String,Object> h=new HashMap<>();
        h.put("status","200");
        h.put("teams",teamService.searchByName(key));
        return ResponseEntity.ok(h);
    }














}
