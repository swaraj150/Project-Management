package com.example.server.repositories;

import com.example.server.entities.TimeLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TimeLogRepository extends JpaRepository<TimeLog, UUID> {
    List<TimeLog> findByTaskId(UUID id);

    @Query("SELECT SUM(t.hours) + (SUM(t.minutes) / 60.0) FROM TimeLog t WHERE t.projectId = :projectId")
    Double getTimeLogCountWithinProject(@Param("projectId") UUID id);

    @Query("SELECT SUM(t.hours) + (SUM(t.minutes) / 60.0) FROM TimeLog t JOIN User u on t.user_id = u.id WHERE u.organizationId = :organizationId")
    Double getTimeLogCount(@Param("organizationId") UUID id);
}
