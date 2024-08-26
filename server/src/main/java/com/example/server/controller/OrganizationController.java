package com.example.server.controller;

import com.example.server.requests.OrganizationCreateRequest;
import com.example.server.response.ApiResponse;
import com.example.server.service.OrganizationService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/v1/organizations")
@RequiredArgsConstructor
public class OrganizationController {
    private OrganizationService organizationService;

    @PostMapping("/create")
    @PreAuthorize("hasAuthority('CREATE_ORGANIZATION')")
    public ResponseEntity<ApiResponse<String>> create(@RequestBody @NonNull OrganizationCreateRequest request){
        String code=organizationService.createOrganization(request);
        return ResponseEntity.ok(ApiResponse.success(code));
    }






}
