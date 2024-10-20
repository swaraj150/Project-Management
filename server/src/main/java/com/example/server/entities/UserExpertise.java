package com.example.server.entities;

import com.example.server.enums.Level;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Set;
import java.util.UUID;
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserExpertise {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "expertise_id")
    private UUID id;
    private UUID userId;
    private UUID projectId;
    @Enumerated(EnumType.STRING)
    private Level level;
}
