package com.example.server.repositories;

import com.example.server.enums.CompletionStatus;
import com.example.server.entities.Task;
import org.hibernate.annotations.Parent;
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

    @Query("select count(t) from Task t join Project p on t.projectId = p.id where t.completionStatus=:status and AND p.organizationId = :organizationId")
    Integer getTaskCountByStatus(@Param(("status")) CompletionStatus status,@Param("organizationId") UUID id);
    @Query("select count(t) from Task t where t.projectId = :projectId ")
    Integer getTaskCountWithinProject(@Param("projectId") UUID id);

    @Query("select sum(t.estimatedHours) from Task t join Project p on t.projectId = p.id where p.organizationId = :organizationId")
    Integer getEstimatedHours(@Param("organizationId") UUID id);

    @Query("select sum(t.estimatedHours) from Task t where t.completionStatus=:status and t.projectId=:projectId")
    Integer getEstimatedHoursWithinProject(@Param("projectId") UUID id);

    @Query("select count(t) from Task t where t.completionStatus=:status and t.projectId=:projectId")
    Integer getTaskCountByStatusWithinProject(@Param(("status")) CompletionStatus status, @Param("projectId") UUID id);


}