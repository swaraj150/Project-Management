package com.example.server.entities;

import com.example.server.enums.DependencyType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
public class Dependency {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Enumerated(EnumType.STRING)
    @Column(name = "dependency_type")
    private DependencyType dependencyType;
//    @Column(name = "dependent_task_id")
    private UUID fromTaskId;
    private UUID toTaskId;
    private Integer lag;// days
    private LocalDateTime triggerAt;// do this in client for accuracy


}
