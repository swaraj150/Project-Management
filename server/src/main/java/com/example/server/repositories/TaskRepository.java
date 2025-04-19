package com.example.server.repositories;

import com.example.server.enums.CompletionStatus;
import com.example.server.entities.Task;
import com.example.server.enums.Priority;
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

    @Query("SELECT t FROM Task t WHERE t.projectId=:projectId AND :userId MEMBER OF t.assignedTo")
    List<Task> findByAssignedTo(@Param("userId") UUID userId,@Param("projectId") UUID projectId);

    @Query("SELECT t FROM Task t WHERE t.projectId=:projectId AND t.completionStatus = :status AND :userId MEMBER OF t.assignedTo")
    List<Task> findTasksByStatusAndAssignedTo(@Param("status") CompletionStatus status, @Param("userId") UUID userId,@Param("projectId") UUID projectId);

    @Query("SELECT t FROM Task t WHERE t.projectId=:projectId AND :userId MEMBER OF t.assignedTo AND (t.completionStatus = PENDING OR t.completionStatus=IN_PROGRESS) ")
    List<Task> findCurrentTasksByAssignedTo(@Param("userId") UUID userId,@Param("projectId") UUID projectId);

    @Query("SELECT t.id FROM Task t WHERE t.projectId=:projectId AND t.completionStatus = :status AND :userId MEMBER OF t.assignedTo")
    List<UUID> findTaskIdsByStatusAndAssignedTo(@Param("status") CompletionStatus status, @Param("userId") UUID userId,@Param("projectId") UUID projectId);

    @Query("SELECT t.id FROM Task t WHERE t.projectId=:projectId AND :userId MEMBER OF t.assignedTo")
    List<UUID> findTaskIdsByAssignedTo(@Param("userId") UUID userId,@Param("projectId") UUID projectId);

    @Query("select t.id from Task t where t.parentTaskId=:id")
    List<UUID> findByParentId(@Param("id") UUID id);

    @Query("select t.completionStatus from Task t where t.id=:taskId")
    CompletionStatus getCompletionStatus(@Param("taskId") UUID id);

    @Query("select count(t) from Task t join Project p on t.projectId = p.id where t.completionStatus=:status and p.organizationId = :organizationId")
    Integer getTaskCountByStatus(@Param(("status")) CompletionStatus status,@Param("organizationId") UUID id);

    @Query("select count(t) from Task t where t.projectId = :projectId ")
    Integer getTaskCountWithinProject(@Param("projectId") UUID id);

    @Query("select sum(t.estimatedDays) from Task t join Project p on t.projectId = p.id where p.organizationId = :organizationId")
    Integer getEstimatedHours(@Param("organizationId") UUID id);

    @Query("select sum(t.estimatedDays) from Task t where t.completionStatus=:status and t.projectId=:projectId")
    Integer getEstimatedHoursWithinProject(@Param("projectId") UUID id);

    @Query("select count(t) from Task t where t.completionStatus=:status and t.projectId=:projectId")
    Integer getTaskCountByStatusWithinProject(@Param(("status")) CompletionStatus status, @Param("projectId") UUID id);

    @Query("select count(t) from Task t where t.priority=:priority and t.projectId=:projectId")
    Integer getTaskCountByPriorityWithinProject(@Param(("priority")) Priority priority, @Param("projectId") UUID id);

    List<Task> findByParentTaskId(UUID id);
}