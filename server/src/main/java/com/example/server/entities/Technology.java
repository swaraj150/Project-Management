package com.example.server.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;


@Entity
@Table(name="Technology")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Technology {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "tech_id")
    private UUID id;
    private Set<String> techName;
    private Set<String> domain;
    private UUID projectId;
    
}
