package com.example.server.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import net.minidev.json.annotate.JsonIgnore;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Table(name="join_requests")
public class JoinRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    @Column(name = "user_id")
    private UUID userId;
    @Column(name = "organization_id")
    private UUID organizationId;
    @Enumerated(EnumType.STRING)
    private RequestStatus status;
    private LocalDateTime requestDate;
    private String projectRole;

}
