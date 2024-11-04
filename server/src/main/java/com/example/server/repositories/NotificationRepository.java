package com.example.server.repositories;

import com.example.server.entities.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification,UUID> {
    @Query(value = "select n.id, n.text, n.user_ids, n.actor_id, n.notification_type, n.is_read, n.created_at from Notification n where :userId = ANY(n.user_ids) order by n.created_at desc",nativeQuery = true)
    List<Notification> findByUserIdOrderByCreatedAtDesc(@Param("userId") UUID userId);
    @Query(value = "select count(n) from Notification n where :userId = ANY(n.user_ids) and n.is_read=false",nativeQuery = true)
    long countByUserIdAndReadFalse(@Param("userId") UUID userId);
}
