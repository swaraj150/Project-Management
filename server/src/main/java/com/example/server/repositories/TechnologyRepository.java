package com.example.server.repositories;

import com.example.server.entities.Technology;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TechnologyRepository extends JpaRepository<Technology, UUID> {
    Optional<Technology> findByProjectId(UUID projectId);
}
