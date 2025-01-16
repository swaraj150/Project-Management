package com.example.server.controller;

import com.example.server.entities.ChatMessage;
import com.example.server.requests.WsChatRequest;
import com.example.server.service.ChatMessageService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;


@Controller
@RequiredArgsConstructor
public class ChatMessageController {
    private final ChatMessageService chatMessageService;
    @MessageMapping("/chat.sendMessage")
    public void sendMessage(@NonNull WsChatRequest request) {
        ChatMessage chatMessage=chatMessageService.createChatMessage(request);


    }
}
