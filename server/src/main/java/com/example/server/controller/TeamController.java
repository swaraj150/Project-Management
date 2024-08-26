package com.example.server.controller;

import com.example.server.requests.TeamCreateRequest;
import com.example.server.response.ApiResponse;
import com.example.server.service.TeamService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/teams")
@RequiredArgsConstructor
public class TeamController {
    private final TeamService teamService;

    @GetMapping("/create")
    @PreAuthorize("hasAuthority('CREATE_TEAM')")
    public ResponseEntity<ApiResponse<?>> create(@RequestBody @NonNull TeamCreateRequest request){
        teamService.createTeam(request);
        return ResponseEntity.ok(ApiResponse.success("Team created successfully"));
    }

}
