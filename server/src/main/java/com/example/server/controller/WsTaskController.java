package com.example.server.controller;

import com.example.server.entities.ChatMessage;
import com.example.server.enums.WsPublishType;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
@RequiredArgsConstructor

public class WsTaskController {
    private final SimpMessagingTemplate messagingTemplate;
    @MessageMapping("/tasks")
    public void handleTasks(@NonNull WsPublishType type,UUID taskId){

    }

}
