package com.example.server.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.*;

@Data
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "_User")
public class User implements UserDetails {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name="user_id")
    private UUID id;

    @Column(nullable = false)
    private String firstName;

//    @Column(nullable = false)
    private String lastName;

    @Column(unique = true, nullable = false)
    private String email;
    @Column(unique = true, nullable = false)
    private String username;
    @Column(nullable = false)
    private String password;

    @Column(columnDefinition = "varchar(10)")
    @Enumerated(EnumType.STRING)
    private Role role;


    @Column(columnDefinition = "varchar(30)")
    @Enumerated(EnumType.STRING)
    private ProjectRole projectRole;
    private String resetPasswordToken;
    private LocalDateTime resetPasswordTokenExpiry;

    @ManyToOne
    @JoinColumn(name="organization_id")
    private Organization organization;






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