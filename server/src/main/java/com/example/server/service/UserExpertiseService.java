package com.example.server.service;

import com.example.server.component.SecurityUtils;
import com.example.server.entities.Technology;
import com.example.server.entities.User;
import com.example.server.entities.UserExpertise;
import com.example.server.enums.Level;
import com.example.server.repositories.UserExpertiseRepository;
import com.example.server.requests.CreateUserExpertiseRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.jetbrains.annotations.NotNull;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserExpertiseService {
    private final UserExpertiseRepository userExpertiseRepository;
    private final TechnologyService technologyService;
    private final UserService userService;
    private final SecurityUtils securityUtils;
    private static final double TECH_WEIGHT = 0.6;
    private static final double DOMAIN_WEIGHT = 0.4;


    public void create(@NonNull UUID projectId){
        User user=userService.loadUser(securityUtils.getCurrentUsername());
        Optional<Level> userExpertiseOptional=userExpertiseRepository.findExpertise(user.getId(),projectId);
        if(userExpertiseOptional.isPresent()){
            return;
        }
        double score=calculateSimilarityScore(projectId,user.getSkills(),user.getDomain());
        Level level=Level.BEGINNER;
        if(score>0.8){
            level=Level.EXPERT;
        }
        else if(score>0.3){
            level=Level.INTERMEDIATE;
        }
        UserExpertise userExpertise=UserExpertise.builder()
                .userId(user.getId())
                .projectId(projectId)
                .level(level)
                .build();
        userExpertiseRepository.save(userExpertise);
    }

    public Level findExpertise(@NonNull UUID userId,@NonNull UUID projectId){

        return userExpertiseRepository.findExpertise(userId,projectId).orElseThrow(()->new EntityNotFoundException("expertise level not found"));
    }
    public double calculateSimilarityScore(@NonNull UUID projectId, @NonNull Set<String> tech, @NonNull Set<String> domain){
        Technology technology=technologyService.findByProject(projectId);
        double techSimilarity = calculateSetSimilarity(tech, technology.getTechName());
        double domainSimilarity = calculateSetSimilarity(domain, technology.getDomain());
        return (techSimilarity * TECH_WEIGHT) + (domainSimilarity * DOMAIN_WEIGHT);

    }
    private double calculateSetSimilarity(@NotNull Set<String> set1, @NotNull Set<String> set2) {
        if (set1.isEmpty() && set2.isEmpty()) {
            return 1.0;
        }
        if (set1.isEmpty() || set2.isEmpty()) {
            return 0.0;
        }

        int intersectionSize = calculateIntersectionSize(set1, set2);
        int unionSize = set1.size() + set2.size() - intersectionSize;

        return (double) intersectionSize / unionSize;
    }
    private int calculateIntersectionSize(@NotNull Set<String> set1, @NotNull Set<String> set2) {
        int count = 0;
        for (String item : set1) {
            if (set2.contains(item)) {
                count++;
            } else {
                for (String projectItem : set2) {
                    if (projectItem.toLowerCase().contains(item.toLowerCase()) ||
                            item.toLowerCase().contains(projectItem.toLowerCase())) {
                        count++;
                        break;
                    }
                }
            }
        }
        return count;
    }
}
