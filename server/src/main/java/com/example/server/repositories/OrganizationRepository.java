package com.example.server.repositories;

import com.example.server.entities.Organization;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrganizationRepository extends JpaRepository<Organization, UUID> {
    @Override
    Optional<Organization> findById(UUID uuid);
    Optional<Organization> findByCode(String code);

    @Query("SELECT p FROM Organization o JOIN o.projects p WHERE o.id = :organizationId")
    List<UUID> findProjectIdsForOrganization(@Param("organizationId") UUID organizationId);




}
