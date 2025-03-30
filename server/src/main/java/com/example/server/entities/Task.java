package com.example.server.entities;

import com.example.server.enums.CompletionStatus;
import com.example.server.enums.Level;
import com.example.server.enums.Priority;
import com.example.server.enums.TaskType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="Task")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="task_id")
    private UUID id;
    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    private TaskType type;

    @Enumerated(EnumType.STRING)
    private Level level;


    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private LocalDateTime createdAt;
    private Integer estimatedDays;
    private LocalDateTime completedAt;

    private Integer progress;

    @Column(name = "created_by_user_id")
    private UUID createdBy;

    @Enumerated(EnumType.STRING)
    private CompletionStatus completionStatus;

    @Column(name = "parent_task_id")
    private UUID parentTaskId;

    @Column(name = "project_id")
    private UUID projectId;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "assigned_to", joinColumns = @JoinColumn(name = "task_id"))
    @Column(name = "user_id")
    private Set<UUID> assignedTo = new HashSet<>();
}
