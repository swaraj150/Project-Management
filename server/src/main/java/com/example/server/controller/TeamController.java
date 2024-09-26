package com.example.server.controller;

import com.example.server.component.SecurityUtils;
import com.example.server.dto.TeamDTO;
import com.example.server.entities.ProjectAuthority;
import com.example.server.entities.User;
import com.example.server.exception.UnauthorizedAccessException;
import com.example.server.repositories.TeamRepository;
import com.example.server.requests.TeamCreateRequest;
import com.example.server.response.ApiResponse;
import com.example.server.service.TeamService;
import com.example.server.service.UserService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/teams")
@RequiredArgsConstructor
public class TeamController {
    private final TeamService teamService;
    private final UserService userService;
    private final SecurityUtils securityUtils;
    private final TeamRepository teamRepository;

    @PostMapping("/create")
    public ResponseEntity<ApiResponse<?>> create(@RequestBody @NonNull TeamCreateRequest request){
        teamService.createTeam(request);
        return ResponseEntity.ok(ApiResponse.success("Team created successfully"));
    }

    @GetMapping("/")
    public ResponseEntity<ApiResponse<?>> load(){
        User user=userService.loadUser(securityUtils.getCurrentUsername());
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.VIEW_TEAM)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }

        return ResponseEntity.ok(ApiResponse.success(teamService.loadTeam(user.getId())));
    }











}
