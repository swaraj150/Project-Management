package com.example.server.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;


@Entity
@Table(name="Team")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="team_id")
    private UUID Id;
    private String name;
    @ManyToOne
    // bidirectional mapping between teams and organization
    @JoinColumn(name = "organization_id")
    private Organization organization;

    @ManyToMany
    // a team has many users and a user can be a part of multiple teams
    @JoinTable(
            name="team_developers",
            joinColumns = @JoinColumn(name="dev_team_id"),
            inverseJoinColumns = @JoinColumn(name="dev_id")
    )
    private List<User> developers;

    @ManyToMany
    // a team has many users and a user can be a part of multiple teams
    @JoinTable(
            name="team_QA",
            joinColumns = @JoinColumn(name="qa_team_id"),
            inverseJoinColumns = @JoinColumn(name="qa_id")
    )
    private List<User> QA;

    @OneToOne
    // for now, one team lead can be a part of one team (may change to many-to-one)
    @JoinColumn(name = "team_lead_id")
    private User teamLead;
}
