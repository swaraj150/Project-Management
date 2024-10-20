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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Set;
import java.util.UUID;


@RestController
@RequestMapping("/api/v1/organizations")
@RequiredArgsConstructor
public class OrganizationController {
    private final OrganizationService organizationService;
    private static final Logger logger= LoggerFactory.getLogger(OrganizationController.class);

    @PostMapping("/initiate")
    public ResponseEntity<?> initiate(@RequestBody @NonNull OrganizationInitiateRequest request){
        HashMap<String,Object> h=new HashMap<>();
        h.put("organization",organizationService.initiateOrganization(request));
        return ResponseEntity.ok(h);
    }
//    @PostMapping("/join")
//    public ResponseEntity<ApiResponse<String>> join(@RequestBody @NonNull JoinOrganizationRequest request){
//        organizationService.requestToJoinOrganization(request.getCode(),request.getRole());
//        return ResponseEntity.ok(ApiResponse.success("Request sent successfully"));
//    }
    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestParam @NonNull String code,@RequestParam @NonNull String role){
        organizationService.requestToJoinOrganization(code,role);
        HashMap<String,Object> h=new HashMap<>();
        h.put("message","request sent");
        return ResponseEntity.ok(h);
    }

    @PutMapping("/respond")
    public ResponseEntity<?> acceptRequest(@RequestParam @NonNull UUID id,@RequestParam @NonNull String status){
        logger.info("id :{}",id);
        organizationService.respondToJoinRequest(ChangeJoinRequestStatusRequest.builder().id(id).status(status).build());
        HashMap<String,Object> h=new HashMap<>();
        h.put("message","request accepted");
        return ResponseEntity.ok(h);
    }



    @GetMapping("/requests")
    public ResponseEntity<?> loadJoinRequests(){
        Set<JoinRequestDTO> set=organizationService.loadJoinRequest();
        HashMap<String,Object> h=new HashMap<>();
        h.put("requests",set);
        return ResponseEntity.ok(h);
    }

    @GetMapping("/")
    public ResponseEntity<?> loadOrganization(){
        OrganizationResponse response=organizationService.loadOrganizationResponse();
        HashMap<String,Object> h=new HashMap<>();
        h.put("organization",response);
        return ResponseEntity.ok(h);
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchOrganization(@RequestParam @NonNull String key){
        HashMap<String,Object> h=new HashMap<>();
        h.put("organizations",organizationService.searchByName(key));
        return ResponseEntity.ok(h);
    }








}
