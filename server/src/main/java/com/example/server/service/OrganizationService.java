package com.example.server.service;

import com.example.server.component.RoleValidator;
import com.example.server.component.SecurityUtils;
import com.example.server.entities.Organization;
import com.example.server.entities.ProjectRole;
import com.example.server.entities.User;
import com.example.server.repositories.OrganizationRepository;
import com.example.server.repositories.UserRepository;
import com.example.server.requests.OrganizationCreateRequest;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class OrganizationService {
    private final OrganizationRepository organizationRepository;
    private final RoleValidator roleValidator;
    private final UserRepository userRepository;
    private final SecurityUtils securityUtils;
    private final UserService userService;

    public String createOrganization(@NonNull OrganizationCreateRequest request){

        User projectManager=userService.loadUser(request.getProjectManager());
        roleValidator.validaterRole(ProjectRole.PROJECT_MANAGER,projectManager);
        User productOwner=userService.loadUser(securityUtils.getCurrentUsername());
        roleValidator.validaterRole(ProjectRole.PRODUCT_OWNER,productOwner);

        // role and authorities validations
        List<User> stakeholders=new ArrayList<>();
        for(String user:request.getStakeholders()){
            User stakeholder=userService.loadUser(user);
            roleValidator.validaterRole(ProjectRole.STAKEHOLDER,stakeholder);
            stakeholders.add(stakeholder);
        }
        Organization organization=new Organization();
        organization.setName(request.getName());
        organization.setProjectManager(projectManager);
        organization.setStakeholders(stakeholders);
        organization.setProductOwner(productOwner);
        String code= UUID.randomUUID().toString().substring(0,7);
        organization.setCode(code);
        productOwner.setOrganization(organization);
        return code;
    }

    public Organization loadOrganization(@NonNull UUID id){
        Optional<Organization> orgOptional=organizationRepository.findById(id);
        if(orgOptional.isEmpty()){
            throw new IllegalArgumentException("Organization not found");
        }
        return orgOptional.get();
    }

    public void joinOrganization(@NonNull String code){
        User user= userService.loadUser(securityUtils.getCurrentUsername());
        Optional<Organization> orgOptional=organizationRepository.findByCode(code);
        if(orgOptional.isEmpty()){
            throw new IllegalArgumentException("Organization not found");
        }
        Organization organization=orgOptional.get();
        if(!Objects.equals(organization.getCode(), code)){
            throw new IllegalArgumentException("Organization not found");
        }
        user.setOrganization(organization);
    }




}
