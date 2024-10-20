package com.example.server.repositories;

import com.example.server.entities.UserExpertise;
import com.example.server.enums.Level;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface UserExpertiseRepository extends JpaRepository<UserExpertise, UUID> {
    @Query("select e.level from UserExpertise e where e.userId=:userId and e.projectId=:projectId")
    Optional<Level> findExpertise(@Param("userId") UUID userId,@Param("projectId") UUID projectId);
}
