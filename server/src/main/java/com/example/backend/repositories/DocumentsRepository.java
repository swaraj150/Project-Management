package com.example.backend.repositories;

import com.example.backend.entities.Documents;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface DocumentsRepository extends JpaRepository<Documents, UUID> {
}
