package com.example.server.dto;

import com.example.server.enums.CompletionStatus;
import com.example.server.entities.Project;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;



@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProjectDTO {
    private UUID id;
    private String title;
    private String description;
//    private Integer teamSize;
    private List<UUID> tasksIds;
    private Set<UUID> teams;
    private LocalDate startDate;
    private LocalDate estimatedEndDate;
    private LocalDate endDate;
    private UUID organizationId;
    private BigDecimal budget;// in INR
//    private List<UUID> techStack;
    private CompletionStatus completionStatus;

    public static ProjectDTO fromProject(Project project){
        return ProjectDTO.builder()
                .id(project.getId())
                .title(project.getTitle())
                .description(project.getDescription())
                .tasksIds(project.getTasks())
                .teams(project.getTeams())
                .startDate(project.getStartDate())
                .estimatedEndDate(project.getEstimatedEndDate())
                .endDate(project.getEndDate())
                .organizationId(project.getOrganizationId())
                .budget(project.getBudget())
                .completionStatus(project.getCompletionStatus())
                .build();
    }

    public Project toProject(){
        Project project=new Project();
        project.setId(this.getId());
        project.setTitle(this.getTitle());
        project.setDescription(this.getDescription());
        project.setStartDate(this.getStartDate());
        project.setEstimatedEndDate(this.getEstimatedEndDate());
        project.setEndDate(this.getEndDate());
        project.setOrganizationId(this.getOrganizationId());
        project.setBudget(this.getBudget());
        project.setCompletionStatus(this.getCompletionStatus());
        return project;
        // tech stack and taskIds to be set separately
    }
}
