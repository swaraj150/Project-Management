package com.example.server.repositories;

import com.example.server.entities.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface MilestoneRepository extends JpaRepository<Milestone, UUID> {

    @Query("select m from Milestone m where p.projectId=:project_id")
    List<Milestone> getMilestonesByProject(@Param("project_id") UUID projectId);
}
