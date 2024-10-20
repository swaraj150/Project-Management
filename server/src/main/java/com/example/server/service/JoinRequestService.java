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
        switch (role){
            case "Product Owner" -> {
                return ProjectRole.PRODUCT_OWNER;
            }
            case "Project Manager" -> {
                return ProjectRole.PROJECT_MANAGER;
            }
            case "Developer"-> {
                return ProjectRole.DEVELOPER;
            }
            case "QA"-> {
                return ProjectRole.QA;
            }
            case "Team Lead"-> {
                return ProjectRole.TEAM_LEAD;
            }
            case "Stakeholder"-> {
                return ProjectRole.STAKEHOLDER;
            }

        }
        throw new IllegalRoleException("role doesn't exist");
    }



}
