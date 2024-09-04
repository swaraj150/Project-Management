package com.example.server.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Issue {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="issue_id")
    private UUID id;
    private String title;
    private String description;
    private Integer priority;

//    @ManyToOne
//    //an issue is raised by one user, but a user can raise many issues.
//    @JoinColumn(name="user_id")
//    private User raisedBy;
//
//    @ManyToOne
//    //an issue is belongs to one project, but a project can have many issues.
//    @JoinColumn(name="project_id")
//    private Project belongsToProject;
//
//    @ManyToOne
//    //an issue is belongs to one task, but a task can have many issues.
//    @JoinColumn(name="task_id")
//    private Task belongsToTask;
//
    @Column(name = "raised_by_user_id")
    private UUID raisedByUserId;

    @Column(name = "project_id")
    private UUID projectId;

    @Column(name = "task_id")
    private UUID taskId;

    private boolean isResolved;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
