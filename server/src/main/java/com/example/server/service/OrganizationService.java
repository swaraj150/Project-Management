package com.example.server.service;

import com.example.server.component.SecurityUtils;
import com.example.server.dto.JoinRequestDTO;
import com.example.server.dto.OrganizationDTO;
import com.example.server.dto.UserDTO;
import com.example.server.entities.*;
import com.example.server.enums.ProjectAuthority;
import com.example.server.enums.ProjectRole;
import com.example.server.enums.RequestStatus;
import com.example.server.enums.WorkloadLimitType;
import com.example.server.exception.UnauthorizedAccessException;
import com.example.server.repositories.JoinRequestRepository;
import com.example.server.repositories.OrganizationRepository;
import com.example.server.repositories.TeamRepository;
import com.example.server.repositories.UserRepository;
import com.example.server.requests.OrganizationInitiateRequest;
import com.example.server.response.OrganizationResponse;
import com.example.server.response.OrganizationSearchResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class OrganizationService {
    private final OrganizationRepository organizationRepository;
    private final JoinRequestRepository joinRequestRepository;
    private final JoinRequestService joinRequestService;
    private final TeamRepository teamRepository;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;
    private final UserService userService;


    public OrganizationDTO createOrganizationDTO(UUID id){
        Organization org = organizationRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Organization not found"));

        OrganizationDTO organizationDTO=OrganizationDTO.fromOrganization(org);
        organizationDTO.setTeamIds(new HashSet<>(teamRepository.findIdsByOrganizationId(org.getId())));
        organizationDTO.setMemberIds(new HashSet<>(userRepository.findMemberIdsByOrganizationId(org.getId())));
        organizationDTO.setStakeholderIds(new HashSet<>(userRepository.findStakeholderIdsByOrganizationId(org.getId())));
        organizationDTO.setJoinRequestIds(new HashSet<>(joinRequestRepository.findIdsByOrganizationId(org.getId())));
        organizationDTO.setProjects(new HashSet<>(organizationRepository.findProjectIdsForOrganization(id)));
        return organizationDTO;
    }


    public List<UUID> getProjectsInOrganization(UUID id){
        return organizationRepository.findProjectIdsForOrganization(id);
    }


    public OrganizationResponse initiateOrganization(@NonNull OrganizationInitiateRequest request){
        // request will have the metadata
        // only product owner will be handled in creation
        User productOwner=userService.loadUser(securityUtils.getCurrentUsername());
        userService.updateProjectRole(ProjectRole.PRODUCT_OWNER,productOwner);
        Organization organization=new Organization();
        organization.setName(request.getName());
        organization.setProductOwnerId(productOwner.getId());
        organization.setWorkloadLimit(new WorkloadLimit(40, WorkloadLimitType.WEEK));
        String code= UUID.randomUUID().toString().substring(0,7);
        organization.setCode(code);
        organizationRepository.save(organization);
        productOwner.setOrganizationId(organization.getId());
        userRepository.save(productOwner);
        return loadOrganizationResponseByCurrentUser();
    }

    public Organization loadOrganization(@NonNull UUID id){
        Optional<Organization> orgOptional=organizationRepository.findById(id);
        if(orgOptional.isEmpty()){
            throw new EntityNotFoundException("Organization not found");
        }
        return orgOptional.get();
    }
    public OrganizationResponse loadOrganizationResponseById(UUID id){
        return loadOrganizationResponse(createOrganizationDTO(id));
    }
    public OrganizationResponse loadOrganizationResponseByCurrentUser(){
        return loadOrganizationResponse(loadOrganizationDTOByCurrentUser());
    }

    public Set<UserDTO> loadMembers(){
        User user=userService.loadAuthenticatedUser();
        return userRepository.findMemberIdsByOrganizationId(user.getOrganizationId())
                .stream()
                .map(memberId->{
                    return UserDTO.mapToUserDTO(userRepository.findById(memberId).orElseThrow(()->new UsernameNotFoundException("User not found")));
                })
                .collect(Collectors.toSet());
    }

    public OrganizationResponse loadOrganizationResponse(OrganizationDTO organizationDTO) {
        Set<UserDTO> members=new HashSet<>();
        Set<UUID> stakeholders=new HashSet<>();
        Set<UUID> devs=new HashSet<>();
        Set<UUID> testers=new HashSet<>();
        Set<UUID> managers=new HashSet<>();
        Set<UUID> memberIds =organizationDTO.getMemberIds();
        for(UUID memberId : memberIds){
            UserDTO member=UserDTO.mapToUserDTO(userRepository.findById(memberId).orElseThrow(()->new UsernameNotFoundException("User not found")));
            members.add(member);
            switch (member.getProjectRole()){
                case DEVELOPER -> {
                    devs.add(memberId);
                }
                case QA -> {
                    testers.add(memberId);
                }
                case PROJECT_MANAGER -> {
                    managers.add(memberId);
                }
                case STAKEHOLDER -> {
                    stakeholders.add(memberId);
                }


            }
        }
        return OrganizationResponse.builder()
                .name(organizationDTO.getName())
                .productOwner(organizationDTO.getProductOwnerId())
                .stakeholders(stakeholders)
                .developers(devs)
                .testers(testers)
                .managers(managers)
                .members(members)
                .code(organizationDTO.getCode())
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



    public UserDTO respondToJoinRequest(@NonNull UUID id,@NonNull String status){
        User user1 = userService.loadUser(securityUtils.getCurrentUsername());
        if (!user1.getProjectRole().hasAuthority(ProjectAuthority.ACCEPT_MEMBERS)) {
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        JoinRequest joinRequest=joinRequestService.loadJoinRequest(id);
        if(Objects.equals(status, "accept")){
            joinRequest.setStatus(RequestStatus.APPROVED);
            User user=userRepository.findById(joinRequest.getUserId()).orElseThrow(() -> new EntityNotFoundException("User not found"));
            Organization organization=loadOrganization(joinRequest.getOrganizationId());
            user.setProjectRole(joinRequestService.toProjectRole(joinRequest.getProjectRole()));
//            if(user.getProjectRole()==ProjectRole.PROJECT_MANAGER){
//                organization.setProjectManagerId(user.getId());
//            }
            organizationRepository.save(organization);
            user.setOrganizationId(organization.getId());
//            joinRequestRepository.save(joinRequest);
            joinRequestRepository.delete(joinRequest);
            userRepository.save(user);
            return UserDTO.mapToUserDTO(user);
        }
        else if(Objects.equals(status,"reject")){
            joinRequest.setStatus(RequestStatus.REJECTED);
            joinRequestRepository.delete(joinRequest);
//            joinRequestRepository.save(joinRequest);
        }
        else{
            throw new IllegalArgumentException("invalid request status");
        }
        return null;

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
        if(joinRequests==null || joinRequests.isEmpty()) return set;
        for(UUID id:joinRequests){
            JoinRequest request=joinRequestService.loadJoinRequest(id);
            if(request.getStatus()==RequestStatus.APPROVED || request.getStatus()==RequestStatus.REJECTED) continue;
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

    public Set<OrganizationSearchResponse> searchByName(@NonNull String prefix) {

        List<Organization> organizations = organizationRepository.findAll();
        Set<OrganizationSearchResponse> suggestions = new HashSet<>();
        String escapedPrefix = prefix.replaceAll("([\\\\^$.|?*+()\\[\\]{}])", "\\\\$1").toLowerCase();
        Pattern pattern = Pattern.compile("^" + escapedPrefix, Pattern.CASE_INSENSITIVE);

        for (Organization organization : organizations) {
            if (pattern.matcher(organization.getName()).find()) {
                log.info("matched: {}", organization.getName());
                suggestions.add(OrganizationSearchResponse.builder().name(organization.getName()).code(organization.getCode()).build());
            }
        }
        return suggestions;
    }
    //public Set<OrganizationResponse> searchByName(@NonNull String prefix) {
    //    List<Organization> organizations = organizationRepository.findAll();
    //    Set<OrganizationResponse> suggestions = new HashSet<>();
    //    String lowercasePrefix = prefix.toLowerCase();
    //
    //    for (Organization organization : organizations) {
    //        if (organization.getName().toLowerCase().startsWith(lowercasePrefix)) {
    //            logger.info("matched: {}", organization.getName());
    //            suggestions.add(loadOrganizationResponse(organization.getId()));
    //        }
    //    }
    //    return suggestions;
    //}



    public void removeMemberFromOrg(UUID id){
        User user=userService.loadUser(securityUtils.getCurrentUsername());
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.ACCEPT_MEMBERS)){
            throw new UnauthorizedAccessException("User doesn't have required authority");
        }
        user=userService.loadUser(id);
        user.setOrganizationId(null);
        userRepository.save(user);
    }




}
