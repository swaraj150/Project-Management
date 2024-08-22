package com.example.server.repositories;

import com.example.server.entities.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface TimeLogRepository extends JpaRepository<Task, UUID> {

}
