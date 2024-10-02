package com.example.server.service;

import com.example.server.component.RoleValidator;
import com.example.server.component.SecurityUtils;
import com.example.server.dto.JoinRequestDTO;
import com.example.server.dto.OrganizationDTO;
import com.example.server.dto.ProjectDTO;
import com.example.server.dto.UserDTO;
import com.example.server.entities.*;
import com.example.server.exception.OrganizationNotFoundException;
import com.example.server.exception.UnauthorizedAccessException;
import com.example.server.repositories.JoinRequestRepository;
import com.example.server.repositories.OrganizationRepository;
import com.example.server.repositories.TeamRepository;
import com.example.server.repositories.UserRepository;
import com.example.server.requests.ChangeJoinRequestStatusRequest;
import com.example.server.requests.OrganizationCreateRequest;
import com.example.server.requests.OrganizationInitiateRequest;
import com.example.server.response.OrganizationResponse;
import com.example.server.response.ProjectResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrganizationService {
    private final OrganizationRepository organizationRepository;
    private final JoinRequestRepository joinRequestRepository;
    private final JoinRequestService joinRequestService;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;
    private final UserService userService;
    private final ProjectService projectService;
    private static final Logger logger= LoggerFactory.getLogger(OrganizationService.class);


    public OrganizationDTO createOrganizationDTO(UUID id){
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Organization not found"));

        OrganizationDTO organizationDTO=OrganizationDTO.fromOrganization(org);
        organizationDTO.setTeamIds(teamRepository.findIdsByOrganizationId(org.getId()));
        organizationDTO.setMemberIds(new HashSet<>(userRepository.findMemberIdsByOrganizationId(org.getId())));
        organizationDTO.setStakeholderIds(userRepository.findStakeholderIdsByOrganizationId(org.getId()));
        organizationDTO.setJoinRequestIds(new HashSet<>(joinRequestRepository.findIdsByOrganizationId(org.getId())));
        organizationDTO.setProjects(new HashSet<>(organizationRepository.findProjectIdsForOrganization(id)));
        return organizationDTO;
    }



    public OrganizationResponse initiateOrganization(@NonNull OrganizationInitiateRequest request){
        // request will have the metadata
        // only product owner will be handled in creation
        User productOwner=userService.loadUser(securityUtils.getCurrentUsername());
        userService.updateProjectRole(ProjectRole.PRODUCT_OWNER,productOwner);
        Organization organization=new Organization();
        organization.setName(request.getName());
        organization.setProductOwnerId(productOwner.getId());
        String code= UUID.randomUUID().toString().substring(0,7);
        organization.setCode(code);
        organizationRepository.save(organization);
        productOwner.setOrganizationId(organization.getId());
        userRepository.save(productOwner);
        return loadOrganizationResponse();
    }

    public Organization loadOrganization(@NonNull UUID id){
        Optional<Organization> orgOptional=organizationRepository.findById(id);
        if(orgOptional.isEmpty()){
            throw new EntityNotFoundException("Organization not found");
        }
        return orgOptional.get();
    }
    public OrganizationResponse loadOrganizationResponse() {
        OrganizationDTO organizationDTO = loadOrganizationDTOByCurrentUser();
        Set<UUID> projects=organizationDTO.getProjects();
        List<UserDTO> stakeholders=new ArrayList<>();
        List<UserDTO> members=new ArrayList<>();
        List<UUID> ids=organizationDTO.getStakeholderIds();
        for(UUID id1:ids){
            stakeholders.add(UserDTO.mapToUserDTO(userRepository.findById(id1).orElseThrow(()->new UsernameNotFoundException("User not found"))));
        }
        Set<UUID> ids2=organizationDTO.getMemberIds();
        for(UUID id1:ids2){
            members.add(UserDTO.mapToUserDTO(userRepository.findById(id1).orElseThrow(()->new UsernameNotFoundException("User not found"))));
        }
//        Set<ProjectResponse> projectResponses=new HashSet<>();
//        for(UUID id1:projects){
//            projectResponses.add(projectService.loadProjectResponse(id1));
//        }
        return OrganizationResponse.builder()
                .name(organizationDTO.getName())
                .productOwner(UserDTO.mapToUserDTO(userRepository.findById(organizationDTO.getProductOwnerId())
                        .orElseThrow(()->new UsernameNotFoundException("User not found"))))
//                .projectManager(UserDTO.mapToUserDTO(userRepository.findById(organizationDTO.getProjectManagerId())
//                        .orElseThrow(()->new UsernameNotFoundException("User not found"))))
                .stakeholders(stakeholders)
                .members(members)
                .code(organizationDTO.getCode())
                .projects(projects)
                .build();
    }
    public OrganizationDTO loadOrganizationDTOByCurrentUser(){
        String username=securityUtils.getCurrentUsername();
        User user=userService.loadUser(username);
        return createOrganizationDTO(user.getOrganizationId());
    }
    public void requestToJoinOrganization(@NonNull String code,@NonNull String projectRole){
        User user= userService.loadUser(securityUtils.getCurrentUsername());
        Organization org = organizationRepository.findByCode(code)
                .orElseThrow(() -> new EntityNotFoundException("Organization not found"));

        JoinRequest request=JoinRequest.builder().userId(user.getId()).organizationId(org.getId()).projectRole(projectRole).requestDate(LocalDateTime.now()).status(RequestStatus.PENDING).build();
        joinRequestRepository.save(request);
    }


    public void respondToJoinRequest(@NonNull ChangeJoinRequestStatusRequest request){
        User user1 = userService.loadUser(securityUtils.getCurrentUsername());
        if (!user1.getProjectRole().hasAuthority(ProjectAuthority.ACCEPT_MEMBERS)) {
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        JoinRequest joinRequest=joinRequestService.loadJoinRequest(request.getId());
        if(Objects.equals(request.getStatus(), "Approved")){
            joinRequest.setStatus(RequestStatus.APPROVED);
            User user=userRepository.findById(joinRequest.getUserId()).orElseThrow(() -> new EntityNotFoundException("User not found"));
            Organization organization=loadOrganization(joinRequest.getOrganizationId());
            user.setProjectRole(joinRequestService.toProjectRole(joinRequest.getProjectRole()));
//            if(user.getProjectRole()==ProjectRole.PROJECT_MANAGER){
//                organization.setProjectManagerId(user.getId());
//            }
            organizationRepository.save(organization);
            user.setOrganizationId(organization.getId());
            joinRequestRepository.save(joinRequest);
            userRepository.save(user);
        }
        else if(Objects.equals(request.getStatus(),"Rejected")){
            joinRequest.setStatus(RequestStatus.REJECTED);
            joinRequestRepository.save(joinRequest);
        }
        else{
            throw new IllegalArgumentException("invalid request status");
        }
    }



    @Transactional(readOnly = true)
    public Set<JoinRequestDTO> loadJoinRequest(){
        User user1=userService.loadUser(securityUtils.getCurrentUsername());
        if(!user1.getProjectRole().hasAuthority(ProjectAuthority.ACCEPT_MEMBERS)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        OrganizationDTO organizationDTO=createOrganizationDTO(user1.getOrganizationId());
        Set<UUID> joinRequests=organizationDTO.getJoinRequestIds();
        Set<JoinRequestDTO> set=new HashSet<>();
        for(UUID id:joinRequests){
            JoinRequest request=joinRequestService.loadJoinRequest(id);
            User user=userRepository.findById(request.getUserId()).orElseThrow(()->new EntityNotFoundException("user not found"));
            Organization organization=loadOrganization(request.getOrganizationId());
            set.add(JoinRequestDTO.builder().id(request.getId()).username(user.getUsername()).organization(organization.getName()).projectRole(request.getProjectRole()).build());
        }


        return set;
//        return org.getJoinRequestSet().stream().map(JoinRequestDTO::mapToJoinRequestDTO).collect(Collectors.toSet());
    }

    public OrganizationDTO loadOrganization(){
        return loadOrganizationDTOByCurrentUser();
    }






}
