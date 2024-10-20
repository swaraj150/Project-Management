package com.example.server.service;

import com.example.server.component.SecurityUtils;
import com.example.server.entities.Technology;
import com.example.server.entities.User;
import com.example.server.enums.ProjectAuthority;
import com.example.server.exception.UnauthorizedAccessException;
import com.example.server.repositories.TechnologyRepository;
import com.example.server.requests.CreateTechRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TechnologyService {
    private final TechnologyRepository technologyRepository;
    private final SecurityUtils securityUtils;
    private final UserService userService;


    public void create(@NonNull CreateTechRequest request){
        User user=userService.loadUser(securityUtils.getCurrentUsername());
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.CREATE_PROJECT)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        Technology technology=Technology.builder()
                .techName(request.getTech())
                .domain(request.getDomain())
                .projectId(request.getProjectId())
                .build();
        technologyRepository.save(technology);
    }

    public Technology findByProject(@NonNull UUID projectId){
        return technologyRepository.findByProjectId(projectId).orElseThrow(()->new EntityNotFoundException("Tech not found"));
    }


}
