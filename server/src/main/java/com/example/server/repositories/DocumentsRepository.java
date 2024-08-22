package com.example.server.repositories;

import com.example.server.entities.Documents;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DocumentsRepository extends JpaRepository<Documents, UUID> {
}
