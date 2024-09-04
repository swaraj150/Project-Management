package com.example.server.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import net.minidev.json.annotate.JsonIgnore;

import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name="Organization")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Organization {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "organization_id")
    private UUID id;
    @Column(nullable = false)
    private String name;
    @Column(name = "product_owner_id")
    private UUID productOwnerId;
    @Column(name = "project_manager_id")
    private UUID projectManagerId;
    private String code;
//    In a relational database, it's generally better to avoid storing lists or arrays of IDs directly in a table. This adheres to normalization principles and prevents data redundancy.
//    Instead, relationships are typically managed through foreign keys in the related tables (e.g., a Team table would have an organization_id column).

//    @OneToOne
//    // a single user might be responsible for single organization
//    @JoinColumn(name="product_owner_id")
//    @JsonIgnore
//    @ToString.Exclude
//    private User productOwner;
//
//    @OneToOne
//    // a single user might be responsible for  single organization
//    @JoinColumn(name="project_manager_id")
//    @JsonIgnore
//    @ToString.Exclude
//    private User projectManager;
//
//    @OneToMany(mappedBy = "organization")
//    @JsonIgnore
//    @ToString.Exclude
//    // many teams belong to one organization
//    private List<Team> teams;
//
//    @OneToMany(mappedBy = "organization")
//    @JsonIgnore
//    @ToString.Exclude
//    // many users can be stakeholders for single  organization
//    private List<User> stakeholders;
//
//    private String code;
//
//    @OneToMany(mappedBy = "organization",fetch = FetchType.LAZY)
////    @JsonIgnore
//    @JsonIgnoreProperties("organization")
//    @ToString.Exclude
//    private Set<JoinRequest> joinRequestSet;
//
//    // list of members
//    @OneToMany
//    @ToString.Exclude
//    @JsonIgnore
//    private Set<User> members;
}
