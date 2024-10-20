package com.example.server.entities;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import net.minidev.json.annotate.JsonIgnore;

import java.util.HashSet;
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
    @Column(nullable = false,unique = true)
    private String name;
    @Column(name = "product_owner_id")
    private UUID productOwnerId;
    private String code;
    @ElementCollection
    @CollectionTable(name = "projects", joinColumns = @JoinColumn(name = "organization_id"))
    @Column(name = "project_id")
    private Set<UUID> projects = new HashSet<>();
    @ElementCollection
    @CollectionTable(name = "teams", joinColumns = @JoinColumn(name = "organization_id"))
    @Column(name = "team_id")
    private Set<UUID> teams = new HashSet<>();
    @Embedded
    private WorkloadLimit workloadLimit;


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
