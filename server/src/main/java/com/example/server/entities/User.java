package com.example.server.entities;

import com.example.server.enums.Level;
import com.example.server.enums.ProjectAuthority;
import com.example.server.enums.ProjectRole;
import com.example.server.enums.Role;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "_user")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="user_id")
    private UUID id;
    @Column(nullable = false)
    private String firstName;
    private String lastName;
    @ElementCollection(fetch=FetchType.EAGER)
    @CollectionTable(name = "user_emails", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "email")
    private Set<String> emails = new HashSet<>();
    @Column(unique = true, nullable = false)
    private String username;
    private String password;
    @Column(columnDefinition = "varchar(10)")
    @Enumerated(EnumType.STRING)
    private Role role;
    @Column(columnDefinition = "varchar(30)")
    @Enumerated(EnumType.STRING)
    private ProjectRole projectRole;
    private String resetPasswordToken;
    private LocalDateTime resetPasswordTokenExpiry;
    @Column(name = "organization_id")
    private UUID organizationId;
    @ElementCollection(fetch = FetchType.EAGER)
    @ToString.Exclude
    @CollectionTable(name = "oauth_identities", joinColumns = @JoinColumn(name = "user_id"))
    @MapKeyColumn(name = "oauth_provider")
    @Column(name = "oauth_id")
    private Map<String, String> oauthIdentities = new HashMap<>();
    // these are absolutes (Should not change according to projects)
    private Set<String> skills;
    private Set<String> domain;
    private Integer yearsOfExp;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        Set<SimpleGrantedAuthority> authorities = new HashSet<>();

        // Add role-based authority
        authorities.add(new SimpleGrantedAuthority(role.name()));

        // Add project role-based authorities
        for (ProjectAuthority authority : projectRole.getAuthorities()) {
            authorities.add(new SimpleGrantedAuthority(authority.toString()));
        }

        return authorities;
    }


    @Override
    public String getPassword() {
        return password;
    }


    @Override
    public String getUsername() {
        return username;
    }


    @Override
    public boolean isAccountNonExpired() {
        return true;
    }


    @Override
    public boolean isAccountNonLocked() {
        return true;
    }


    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }


    @Override
    public boolean isEnabled() {
        return true;
    }
}