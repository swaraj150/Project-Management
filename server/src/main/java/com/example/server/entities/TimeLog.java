package com.example.server.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeLog {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "time_log_id")
    private UUID id;
    private String description;
    private LocalDate date;
    private Integer hours;
    private Integer minutes;
    @Column(name="user_id")
    private UUID userId;
    @Column(name="task_id")
    private UUID taskId;
    @Column(name="project_id")
    private UUID projectId;

}