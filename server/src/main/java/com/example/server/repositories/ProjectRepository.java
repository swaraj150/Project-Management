package com.example.server.repositories;

import com.example.server.entities.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    @Query("select p from Project p where p.organizationId=:id")
    Optional<Project> findByOrganization(@Param("id") UUID id);

    @Query("select t from Project p join p.teams t where p.id=:id")
    List<UUID> findTeamsById(@Param("id") UUID id);
}
