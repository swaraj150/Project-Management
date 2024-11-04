package com.example.server.controller;

import com.example.server.entities.ChatMessage;
import com.example.server.service.ChatMessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;

import java.util.Map;
import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class ChatMessageController {
    private final SimpMessagingTemplate messagingTemplate;
    private final ChatMessageService chatMessageService;
    @MessageMapping("/chat.sendMessage/{roomId}")
    public void sendMessage(@DestinationVariable UUID roomId, String chat) {
        ChatMessage chatMessage=chatMessageService.createChatMessage(chat,roomId);
        messagingTemplate.convertAndSend("/topic/room/" + roomId, chatMessage.getContent());

    }
}
