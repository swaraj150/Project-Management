package com.example.server.entities;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;


@Entity
@Table(name="Team")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Team {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "team_id")
    private UUID id;
    private String name;
    @Column(name = "organization_id")
    private UUID organizationId;
    @Column(name = "team_lead_id")
    private UUID teamLeadId;
    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "team_members", joinColumns = @JoinColumn(name = "team_id"))
    @Column(name = "user_id")
    private Set<UUID> memberIds = new HashSet<>();
    @Column(name = "project_id")
    private UUID projectId;
//    @ManyToOne
//    // bidirectional mapping between teams and organization
//    @JoinColumn(name = "organization_id")
//    @JsonIgnore
//    @ToString.Exclude
//    private Organization organization;
//
//    @ManyToMany
//    // a team has many users and a user can be a part of multiple teams
//    @JoinTable(
//            name="team_developers",
//            joinColumns = @JoinColumn(name="dev_team_id"),
//            inverseJoinColumns = @JoinColumn(name="dev_id")
//    )
//    @JsonIgnore
//    @ToString.Exclude
//    private List<User> developers;
//
//    @ManyToMany
//    // a team has many users and a user can be a part of multiple teams
//    @JoinTable(
//            name="team_QA",
//            joinColumns = @JoinColumn(name="qa_team_id"),
//            inverseJoinColumns = @JoinColumn(name="qa_id")
//    )
//
//    @JsonIgnore
//    @ToString.Exclude
//    private List<User> QA;
//
//    @OneToOne
//    // for now, one team lead can be a part of one team (may change to many-to-one)
//    @JoinColumn(name = "team_lead_id")
//    @JsonIgnore
//    @ToString.Exclude
//    private User teamLead;
}
