package com.example.server.repositories;

import com.example.server.entities.ChatMessage;
import com.example.server.entities.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ChatMessageRepository extends JpaRepository<ChatMessage, UUID> {
    Optional<List<ChatMessage>> findByTaskId(UUID taskId);
}
