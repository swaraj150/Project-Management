package com.example.server.controller;

import com.example.server.entities.ChatMessage;
import com.example.server.requests.WsChatRequest;
import com.example.server.service.ChatMessageService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.util.UUID;


@Controller
@RequiredArgsConstructor
public class ChatMessageWsController {
    private final ChatMessageService chatMessageService;
    @MessageMapping("/chat.task.{roomId}")
    public void handleChats(@DestinationVariable UUID roomId, @NonNull WsChatRequest request) {
        ChatMessage chatMessage=chatMessageService.createChatMessage(request);
    }



}
