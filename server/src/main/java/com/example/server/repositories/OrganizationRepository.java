package com.example.server.repositories;

import com.example.server.entities.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface OrganizationRepository extends JpaRepository<Organization, UUID> {
    @Override
    Optional<Organization> findById(UUID uuid);
    Optional<Organization> findByCode(String code);

}
