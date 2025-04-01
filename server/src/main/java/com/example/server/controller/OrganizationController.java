package com.example.server.controller;

import com.example.server.dto.JoinRequestDTO;
import com.example.server.dto.OrganizationDTO;
import com.example.server.dto.UserDTO;
import com.example.server.entities.Organization;
import com.example.server.requests.*;
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

    @PostMapping("")
    public ResponseEntity<?> initiate(@RequestBody @NonNull OrganizationInitiateRequest request){
        HashMap<String,Object> h=new HashMap<>();
        h.put("organization",organizationService.initiateOrganization(request));
        return ResponseEntity.ok(h);
    }
    @PostMapping("/join")
    public ResponseEntity<?> join(@RequestBody @NonNull JoinOrganizationRequest request){
        organizationService.requestToJoinOrganization(request.getCode(),request.getRole());
        HashMap<String,Object> h=new HashMap<>();
        h.put("message","request sent");
        return ResponseEntity.ok(h);
    }
//    @PostMapping("/join")
//    public ResponseEntity<?> join(@RequestParam @NonNull String code,@RequestParam @NonNull String role){
//        organizationService.requestToJoinOrganization(code,role);
//        HashMap<String,Object> h=new HashMap<>();
//        h.put("message","request sent");
//        return ResponseEntity.ok(h);
//    }

//    @PutMapping("/respond")
//    public ResponseEntity<?> acceptRequest(@RequestParam @NonNull UUID id,@RequestParam @NonNull String status){
//        logger.info("id :{}",id);
//        organizationService.respondToJoinRequest(ChangeJoinRequestStatusRequest.builder().id(id).status(status).build());
//        HashMap<String,Object> h=new HashMap<>();
//        h.put("message","request accepted");
//        return ResponseEntity.ok(h);
//    }
    @PutMapping("/requests/accept")
    public ResponseEntity<?> acceptRequest(@RequestBody @NonNull ChangeJoinRequestStatusRequest request){
        UserDTO user=organizationService.respondToJoinRequest(request.getRequestId(),"accept");
        HashMap<String,Object> h=new HashMap<>();
        h.put("message","request accepted");
        h.put("user",user);
        return ResponseEntity.ok(h);
    }
    @PutMapping("/requests/reject")
    public ResponseEntity<?> rejectRequest(@RequestBody @NonNull ChangeJoinRequestStatusRequest request){
        organizationService.respondToJoinRequest(request.getRequestId(),"reject");
        HashMap<String,Object> h=new HashMap<>();
        h.put("message","request rejected");
        return ResponseEntity.ok(h);
    }



    @GetMapping("/requests")
    public ResponseEntity<?> loadJoinRequests(){
        Set<JoinRequestDTO> set=organizationService.loadJoinRequest();
        HashMap<String,Object> h=new HashMap<>();
        h.put("requests",set);
        return ResponseEntity.ok(h);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> loadOrganization(@PathVariable @NonNull UUID id){
        OrganizationResponse response=organizationService.loadOrganizationResponse(id);
        HashMap<String,Object> h=new HashMap<>();
        h.put("organization",response);
        return ResponseEntity.ok(h);
    }
//    @GetMapping("/")
//    public ResponseEntity<?> loadOrganization(){
//        OrganizationResponse response=organizationService.loadOrganizationResponse();
//        HashMap<String,Object> h=new HashMap<>();
//        h.put("organization",response);
//        return ResponseEntity.ok(h);
//    }

    @GetMapping("/search")
    public ResponseEntity<?> searchOrganization(@RequestParam @NonNull String query){
        HashMap<String,Object> h=new HashMap<>();
        h.put("organizations",organizationService.searchByName(query));
        return ResponseEntity.ok(h);
    }

    @DeleteMapping("/members")
    public ResponseEntity<?> removeMemberFromOrganization(@RequestBody @NonNull RemoveMemberRequest request){
        organizationService.removeMemberFromOrg(request.getMemberId());
        HashMap<String,Object> h=new HashMap<>();
        h.put("message","member removed from organization");
        return ResponseEntity.ok(h);
    }







}
