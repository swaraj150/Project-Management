package com.example.server.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name="Project")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="project_id")
    private UUID id;

    private String title;
    private String description;
    private Integer teamSize;

    @OneToMany(mappedBy = "project")
    private List<Task> tasks;

    private LocalDate startDate;
    private LocalDate estimatedEndDate;
    private LocalDate endDate;

    @ManyToOne // if organization has multiple projects
    @JoinColumn(name="organization_id")
    private Organization organization;

    private BigDecimal budget;// in INR

    @ManyToMany
    @JoinTable(
            name="tech_stack",
            joinColumns = @JoinColumn(name="project_id"),
            inverseJoinColumns = @JoinColumn(name="tech_id")
    )
    private List<Technology> techStack;

    @Enumerated(EnumType.STRING)
    private CompletionStatus completionStatus;
}
