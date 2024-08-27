package com.example.server.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name="Organization")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="organization_id")
    private UUID id;
    private String name;
    @OneToOne
    // a single user might be responsible for single organization
    @JoinColumn(name="product_owner_id")
    private User productOwner;
    @OneToOne
    // a single user might be responsible for  single organization
    @JoinColumn(name="project_manager_id")
    private User projectManager;
    @OneToMany(mappedBy = "organization")
    // many teams belong to one organization
    private List<Team> teams;
    @OneToMany(mappedBy = "organization")
    // many users can be stakeholders for single  organization
    private List<User> stakeholders;
    private String code;
}
