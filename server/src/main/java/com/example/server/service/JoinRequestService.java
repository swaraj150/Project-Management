package com.example.server.service;

import com.example.server.entities.JoinRequest;
import com.example.server.enums.ProjectRole;
import com.example.server.exception.IllegalRoleException;
import com.example.server.repositories.JoinRequestRepository;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class JoinRequestService {
    private final JoinRequestRepository joinRequestRepository;

    public JoinRequest loadJoinRequest(@NonNull UUID id){
        return joinRequestRepository.findById(id).orElseThrow(IllegalArgumentException::new);
    }

    public ProjectRole toProjectRole(@NonNull String role){
        role=role.toLowerCase();
        switch (role){
            case "product owner" -> {
                return ProjectRole.PRODUCT_OWNER;
            }
            case "project manager" -> {
                return ProjectRole.PROJECT_MANAGER;
            }
            case "developer"-> {
                return ProjectRole.DEVELOPER;
            }
            case "qa"-> {
                return ProjectRole.QA;
            }
            case "team lead"-> {
                return ProjectRole.TEAM_LEAD;
            }
            case "stakeholder"-> {
                return ProjectRole.STAKEHOLDER;
            }

        }
        throw new IllegalRoleException("role doesn't exist");
    }



}
