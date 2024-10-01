package com.example.server.repositories;

import com.example.server.entities.TokenBlacklist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TokenBlacklistRepository extends JpaRepository<TokenBlacklist,UUID> {

    Optional<TokenBlacklist> findByToken(String token);

    @Query("select t from TokenBlacklist t where t.expiry<:currentDate")
    List<TokenBlacklist> findExpiredToken(@Param("currentDate") Date currentDate);
}
