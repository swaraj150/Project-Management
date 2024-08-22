package com.example.server.repositories;

import com.example.server.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface TaskRepository extends JpaRepository<Task, UUID> {
    // Custom query methods can be added here
}