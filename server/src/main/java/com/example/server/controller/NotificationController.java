package com.example.server.controller;

import com.example.server.component.SecurityUtils;
import com.example.server.entities.Notification;
import com.example.server.service.NotificationService;
import com.example.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;
    private final SecurityUtils securityUtils;
    private final UserService userService;
    @GetMapping("/")
    public ResponseEntity<?> getUserNotifications() {
        UUID userID=userService.loadUser(securityUtils.getCurrentUsername()).getId();
        return ResponseEntity.ok(notificationService.getUserNotifications(userID));
    }
}
