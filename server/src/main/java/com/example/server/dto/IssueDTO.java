package com.example.server.dto;
import com.example.server.entities.Issue;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class IssueDTO {
    private UUID id;
    private String title;
    private String description;
    private Integer priority;
    private UUID raisedByUserId;
    private UUID projectId;
    private UUID taskId;
    private boolean isResolved;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static IssueDTO fromIssue(Issue issue) {
        IssueDTO dto = new IssueDTO();
        dto.setId(issue.getId());
        dto.setTitle(issue.getTitle());
        dto.setDescription(issue.getDescription());
        dto.setPriority(issue.getPriority());
        dto.setRaisedByUserId(issue.getRaisedByUserId());
        dto.setProjectId(issue.getProjectId());
        dto.setTaskId(issue.getTaskId());
        dto.setResolved(issue.isResolved());
        dto.setCreatedAt(issue.getCreatedAt());
        dto.setUpdatedAt(issue.getUpdatedAt());
        return dto;
    }

    public Issue toIssue() {
        Issue issue = new Issue();
        issue.setId(this.id);
        issue.setTitle(this.title);
        issue.setDescription(this.description);
        issue.setPriority(this.priority);
        issue.setRaisedByUserId(this.raisedByUserId);
        issue.setProjectId(this.projectId);
        issue.setTaskId(this.taskId);
        issue.setResolved(this.isResolved);
        // Note: createdAt and updatedAt are managed by JPA
        return issue;
    }
}
