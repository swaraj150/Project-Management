//package com.example.server.entities;
//
//import com.example.server.enums.CompletionStatus;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//
//import java.time.LocalDateTime;
//import java.util.HashSet;
//import java.util.Set;
//import java.util.UUID;
//
//@Entity
//@Data
//@NoArgsConstructor
//@AllArgsConstructor
//public class Milestone {
//    @Id
//    @GeneratedValue(strategy = GenerationType.UUID)
//    @Column(name = "milestone_id")
//    private UUID id;
//    private String title;
//    private String description;
//    private LocalDateTime date;
//    @Column(name = "project_id")
//    private UUID projectId;
//
//    @ElementCollection(fetch = FetchType.EAGER)
//    @CollectionTable(name = "milestone_dependencies", joinColumns = @JoinColumn(name = "milestone_id"))
//    @Column(name = "dependent_task_id")
//    private Set<UUID> dependencies = new HashSet<>();
//
//    private LocalDateTime achievedAt;
//    private LocalDateTime createdAt;
//    private UUID createdBy;
//    @Column(name = "task_id")
//    private UUID parentTaskId;
//    @Enumerated(EnumType.STRING)
//    private CompletionStatus completionStatus;
//
//}
