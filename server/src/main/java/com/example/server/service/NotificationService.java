package com.example.server.service;

import com.example.server.component.NotificationEvent;
import com.example.server.entities.Notification;
import com.example.server.repositories.NotificationRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import org.springframework.kafka.core.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {
    private final NotificationRepository notificationRepository;
    private final SimpMessageSendingOperations messagingTemplate;


    public void createNotification(@NonNull NotificationEvent event) {
        log.info("Received notification event: {}", event);
        Notification notification = Notification.builder()
                .userIds(event.getUserId())
                .actorId(event.getActorId())
                .notificationType(event.getType())
                .text(event.getMessage())
                .isRead(false)
                .createdAt(LocalDateTime.now())
                .build();

        notificationRepository.save(notification);

        // Send to WebSocket
        event.getUserId().forEach(userId -> {
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(userId),
                    "/topic/notifications",
                    notification.getText()
            );
        });

    }

    public void markAsRead(@NonNull UUID notificationId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new EntityNotFoundException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }
    public List<Notification> getUserNotifications(UUID userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(UUID userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }
}
