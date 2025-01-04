package com.example.server.service;

import com.example.server.dto.UserDTO;
import com.example.server.entities.Milestone;
import com.example.server.entities.Project;
import com.example.server.entities.User;
import com.example.server.enums.ProjectAuthority;
import com.example.server.exception.UnauthorizedAccessException;
import com.example.server.repositories.MilestoneRepository;
import com.example.server.repositories.ProjectRepository;
import com.example.server.requests.WsMilestoneRequest;
import com.example.server.requests.WsTaskRequest;
import com.example.server.response.MilestoneResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MilestoneService {
    private final UserService userService;
    private final ProjectRepository projectRepository;
    private final MilestoneRepository milestoneRepository;
    private final TaskService taskService;

    public Milestone create(WsTaskRequest request){
        User user= userService.loadAuthenticatedUser();
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.CREATE_TASKS)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }

        Milestone milestone=new Milestone();
        Optional.ofNullable(request.getTitle())
                .ifPresent(milestone::setTitle);
        Optional.ofNullable(request.getDescription())
                .ifPresent(milestone::setDescription);
        Optional.ofNullable(request.getDate())
                .ifPresent(milestone::setDate);
        Optional.ofNullable(request.getAchievedAt())
                .ifPresent(milestone::setAchievedAt);

        if(request.getProjectId()!=null){
            UUID projectId=UUID.fromString(request.getProjectId());
            if(projectRepository.existsById(projectId)){
                milestone.setProjectId(projectId);
            }
        }
        milestone.setCreatedAt(LocalDateTime.now());
        milestone.setCreatedBy(user.getId());
        milestone.setTaskId(request.getTaskId());
        milestoneRepository.save(milestone);
        return milestone;
    }

    public Milestone load(UUID id){
        return milestoneRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Milestone not found"));
    }

    public MilestoneResponse loadResponse(Milestone milestone){
        return MilestoneResponse.builder()
                .id(milestone.getId())
                .title(milestone.getTitle())
                .description(milestone.getDescription())
                .date(milestone.getDate())
                .achievedAt(milestone.getAchievedAt())
                .dependencies(milestone.getDependencies().stream().map(taskService::loadTaskResponse).collect(Collectors.toSet()))
                .createdAt(milestone.getCreatedAt())
                .taskId(milestone.getTaskId())
                .createdBy(UserDTO.mapToUserDTO(userService.loadUser(milestone.getCreatedBy())))
                .build();
    }

    public List<MilestoneResponse> loadByProject(UUID projectId){
        return milestoneRepository.getMilestonesByProject(projectId).stream().map(this::loadResponse).collect(Collectors.toList());
    }

}
