package com.example.server.controller;

import com.example.server.dto.JoinRequestDTO;
import com.example.server.dto.OrganizationDTO;
import com.example.server.entities.Organization;
import com.example.server.requests.ChangeJoinRequestStatusRequest;
import com.example.server.requests.JoinOrganizationRequest;
import com.example.server.requests.OrganizationCreateRequest;
import com.example.server.requests.OrganizationInitiateRequest;
import com.example.server.response.ApiResponse;
import com.example.server.response.OrganizationResponse;
import com.example.server.service.OrganizationService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Set;
import java.util.UUID;


@RestController
@RequestMapping("/api/v1/organizations")
@RequiredArgsConstructor
public class OrganizationController {
    private final OrganizationService organizationService;

    @PostMapping("/initiate")
    public ResponseEntity<ApiResponse<String>> initiate(@RequestBody @NonNull OrganizationInitiateRequest request){
        String code=organizationService.initiateOrganization(request);
        return ResponseEntity.ok(ApiResponse.success(code));
    }


    @PostMapping("/join")
    public ResponseEntity<ApiResponse<String>> join(@RequestBody @NonNull JoinOrganizationRequest request){
        organizationService.requestToJoinOrganization(request.getCode(),request.getRole());
        return ResponseEntity.ok(ApiResponse.success("Request sent successfully"));
    }

    @PutMapping("/respond")
    public ResponseEntity<ApiResponse<String>> acceptRequest(@RequestBody @NonNull ChangeJoinRequestStatusRequest request){
        organizationService.respondToJoinRequest(request);
        return ResponseEntity.ok(ApiResponse.success("Request "+request.getStatus()));
    }



    @GetMapping("/requests")
    public ResponseEntity<ApiResponse<Set<JoinRequestDTO>>> loadJoinRequests(){
        Set<JoinRequestDTO> set=organizationService.loadJoinRequest();
        return ResponseEntity.ok(ApiResponse.success(set));
    }

    @GetMapping("/")
    public ResponseEntity<ApiResponse<OrganizationResponse>> loadOrganization(){
        return ResponseEntity.ok(ApiResponse.success(organizationService.loadOrganizationResponse()));
    }






}
