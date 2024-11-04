package com.example.server.controller;

import com.example.server.entities.Notification;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class WebSocketController {
    @MessageMapping("/notifications")
    @SendTo("/topic/notifications")
    public String handleNotification(String message) {
        // Process the message and return a response
        return "Notification received: " + message;
    }
}
