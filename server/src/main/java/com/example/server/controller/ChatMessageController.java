package com.example.server.controller;

import com.example.server.entities.ChatMessage;
import com.example.server.entities.User;
import com.example.server.enums.ProjectAuthority;
import com.example.server.enums.ProjectRole;
import com.example.server.exception.UnauthorizedAccessException;
import com.example.server.requests.WsChatRequest;
import com.example.server.service.ChatMessageService;
import com.example.server.service.UserService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/chats")
public class ChatMessageController {
    private final ChatMessageService chatMessageService;
    private final UserService userService;
    @GetMapping("")
    public ResponseEntity<?> loadChats(){

        User user=userService.loadAuthenticatedUser();
        HashMap<String,Object> h=new HashMap<>();
        Map<UUID, List<ChatMessage>> chats=new HashMap<>();
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.VIEW_TEAM)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        };
        if(user.getProjectRole()==ProjectRole.PRODUCT_OWNER){
            chats.putAll(chatMessageService.loadChatsByOrganization());
        }
        else{
            chats.putAll(chatMessageService.loadTaskChatsByProject());
            if (user.getProjectId() != null) {
                chats.put(user.getProjectId(),chatMessageService.loadChats(user.getProjectId()));
            }
        }
        chats.put(user.getOrganizationId(),chatMessageService.loadChats(user.getOrganizationId()));
        h.put("chats",chats);
        return ResponseEntity.ok(h);
    }

}
