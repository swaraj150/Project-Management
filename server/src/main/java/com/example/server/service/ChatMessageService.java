package com.example.server.service;

import com.example.server.component.NotificationEvent;
import com.example.server.component.SecurityUtils;
import com.example.server.entities.ChatMessage;
import com.example.server.entities.ChatRoom;
import com.example.server.entities.User;
import com.example.server.enums.NotificationType;
import com.example.server.repositories.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomService chatRoomService;
    private final UserService userService;
    private final SecurityUtils securityUtils;
    private final NotificationService notificationService;
    public ChatMessage createChatMessage(String content, UUID room){
        User user=userService.loadUser(securityUtils.getCurrentUsername());
        ChatRoom chatRoom=chatRoomService.findChatRoomByRoomId(room);
        ChatMessage chatMessage=ChatMessage.builder()
                .content(content)
                .roomId(room)
                .timestamp(LocalDateTime.now())
                .senderId(user.getId())
                .sender(user.getFirstName()+((user.getLastName()==null)?"":" ")+(user.getLastName()==null?"":user.getLastName()))
                .build();

        chatMessageRepository.save(chatMessage);
        notificationService.createNotification(NotificationEvent.builder()
                .message(content)
                .actorId(user.getId())
                .type(NotificationType.COMMENT_ADDED)
                .userId(chatRoom.getMembers())
                .build());
        return chatMessage;
    }




}
