package com.example.server.repositories;

import com.example.server.entities.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TeamRepository extends JpaRepository<Team, UUID> {

    @Query("SELECT t.id FROM Team t WHERE t.organizationId = :organizationId")
    List<UUID> findIdsByOrganizationId(@Param("organizationId") UUID organizationId);

    @Query("select u.id from User u join Team t on t.id = :teamId where u.projectRole = DEVELOPER and u.id in elements(t.memberIds)")
    List<UUID> findDevsById(@Param("teamId") UUID teamId);

    @Query("select u.id from User u join Team t on t.id = :teamId where u.projectRole = QA and u.id in elements(t.memberIds)")
    List<UUID> findQAsById(@Param("teamId") UUID teamId);

    // optimization can be done by only joining it with users within organization
    @Query("select t.id from Team t join t.memberIds u where u = :userId")
    UUID findTeamIdByUserId(@Param("userId") UUID userId);


    Optional<Team> findByName(String name);
}
