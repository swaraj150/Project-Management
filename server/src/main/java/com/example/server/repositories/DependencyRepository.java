package com.example.server.repositories;

import com.example.server.entities.Dependency;
import com.example.server.enums.DependencyType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;
import java.util.List;

//@Repository
public interface DependencyRepository extends JpaRepository<Dependency, UUID> {

    List<Dependency> findByFromTaskId(UUID id);
    List<Dependency> findByToTaskId(UUID id);

    @Query("select d from Dependency d where d.fromTaskId=:fromTaskId and d.toTaskId=:toTaskId and d.dependencyType=:type")
    Optional<Dependency> doesExist(@Param("fromTaskId") UUID id1, @Param("toTaskId") UUID id2, @Param("type") DependencyType dependencyType);
    @Modifying
    @Transactional
    @Query("delete from Dependency where fromTaskId=:fromTaskId")
    void deleteByFromTaskId(@Param("fromTaskId") UUID id);
}
