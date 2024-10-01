package com.example.server.repositories;

import com.example.server.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
//    @Query("select t.id from Task t join t.assignedTo u where u.user_id=:id")// wrong since a user can be assigned to multiple tasks
//    UUID getTaskIdByUser(@Param("id") UUID id);

}