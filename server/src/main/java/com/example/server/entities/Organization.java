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
    @ManyToOne
    // a single user might be responsible for multiple organization
    @JoinColumn(name="product_owner_id")
    private User productOwner;
    @ManyToOne
    // a single user might be responsible for multiple organization
    @JoinColumn(name="project_manager_id")
    private User projectManager;
    @OneToMany(mappedBy = "organization")
    // many teams belong to one organization
    private List<Team> teams;
    @ManyToMany
    // many users can be stakeholders for multiple organization
    @JoinTable(
            name = "organization_stakeholders",
            joinColumns = @JoinColumn(name = "organization_id"),
            inverseJoinColumns = @JoinColumn(name = "stakeholder_id")
    )
    private List<User> stakeholders;

    private String code;
}
