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

import java.security.Principal;
import java.util.UUID;


@Controller
@RequiredArgsConstructor
@Slf4j
public class ChatMessageWsController {
    private final ChatMessageService chatMessageService;
    @MessageMapping("/chat.{roomId}")
    public void handleChats(@DestinationVariable UUID roomId,  WsChatRequest request, Principal principal) {
//        log.info("message sent by {}",principal.getName());

        ChatMessage chatMessage=chatMessageService.createChatMessage(request,roomId,principal);
    }
}
