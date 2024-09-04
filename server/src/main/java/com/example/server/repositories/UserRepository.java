package com.example.server.repositories;
import com.example.server.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    @Query("select u.id from User u where u.projectRole=STAKEHOLDER and u.organizationId=:organizationId")
    List<UUID> findStakeholderIdsByOrganizationId(@Param("organizationId") UUID organizationId);
    @Query("select u.id from User u where u.organizationId=:organizationId")
    List<UUID> findMemberIdsByOrganizationId(@Param("organizationId") UUID organizationId);
    Optional<User> findByResetPasswordToken(String token);
}
