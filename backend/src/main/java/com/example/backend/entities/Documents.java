package com.example.backend.entities;

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
public class Documents {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="document_id")
    private UUID id;
    private String fileName;
    private String path;
    @Enumerated(EnumType.STRING)
    private FileType fileType;

    @Column(updatable = false)
    private LocalDateTime uploadedAt;
    @ManyToOne
    //a doc is uploaded by one user, but a user can upload many docs.
    @JoinColumn(name="user_id")
    private User uploadedBy;

    @ManyToOne
    //a doc belongs to one project, but a project can have many docs.
    @JoinColumn(name="project_id")
    private Project belongsToProject;

    @ManyToOne
    //a doc belongs to one task, but a task can have many docs.
    @JoinColumn(name="task_id")
    private Task belongsToTask;

    @PrePersist
    protected void onUpload() {
        uploadedAt = LocalDateTime.now();
    }


}
