package com.example.server.controller;

import com.example.server.entities.ChatMessage;
import com.example.server.requests.WsChatRequest;
import com.example.server.service.ChatMessageService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.util.UUID;


@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatMessageWsController {
    private final ChatMessageService chatMessageService;
    @MessageMapping("/chat.{roomId}")
    public void handleChats(@DestinationVariable UUID roomId, @NonNull WsChatRequest request) {
        log.info("chat request");
        ChatMessage chatMessage=chatMessageService.createChatMessage(request,roomId);
    }
}
