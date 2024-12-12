package com.example.server.repositories;

import com.example.server.enums.CompletionStatus;
import com.example.server.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
//    @Query("select t.id from Task t join t.assignedTo u where u.user_id=:id")// wrong since a user can be assigned to multiple tasks
//    UUID getTaskIdByUser(@Param("id") UUID id);
    @Query("select t from Task t where t.createdBy=:userId")
    Optional<Task> findByCreatedBy(@Param("userId") UUID id);

    @Query("SELECT t FROM Task t WHERE :userId MEMBER OF t.assignedTo")
    List<Task> findByAssignedTo(@Param("userId") UUID userId);

    @Query("SELECT t FROM Task t WHERE t.completionStatus = :status AND :userId MEMBER OF t.assignedTo")
    List<Task> findTasksByStatusAndAssignedTo(@Param("status") CompletionStatus status, @Param("userId") UUID userId);

    @Query("select t.id from Task t where t.parentTaskId=:id")
    List<UUID> findByParentId(@Param("id") UUID id);

}