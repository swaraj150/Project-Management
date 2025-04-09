package com.example.server.service;

import com.example.server.component.NotificationEvent;
import com.example.server.component.SecurityUtils;
import com.example.server.entities.ChatMessage;
import com.example.server.entities.ChatRoom;
import com.example.server.entities.Project;
import com.example.server.entities.User;
import com.example.server.enums.NotificationType;
import com.example.server.repositories.ChatMessageRepository;
import com.example.server.requests.WsChatRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomService chatRoomService;
    private final UserService userService;
    private final ProjectService projectService;
    private final TaskService taskService;
    private final NotificationService notificationService;
    private final SimpMessagingTemplate messagingTemplate;
    public ChatMessage createChatMessage(WsChatRequest request){
        User user=userService.loadAuthenticatedUser();
        ChatRoom chatRoom=chatRoomService.findChatRoomByTaskId(request.getTaskId());
        ChatMessage chatMessage=ChatMessage.builder()
                .content(request.getContent())
                .roomId(chatRoom.getId())
                .timestamp(LocalDateTime.now())
                .taskId(request.getTaskId())
                .senderId(user.getId())
                .sender(user.getFirstName()+((user.getLastName()==null)?"":" ")+(user.getLastName()==null?"":user.getLastName()))
                .build();

        chatMessageRepository.save(chatMessage);
        chatRoom.getMembers().forEach(userId-> messagingTemplate.convertAndSendToUser(
                String.valueOf(userId),
                "/topic/chat/"+chatMessage.getTaskId(),
                chatMessage
        ));
//        notificationService.createNotification(NotificationEvent.builder()
//                .message(content)
//                .actorId(user.getId())
//                .type(NotificationType.COMMENT_ADDED)
//                .userId(chatRoom.getMembers())
//                .build());
        return chatMessage;
    }

    public List<ChatMessage> loadComments(@NonNull UUID taskId){
        return chatMessageRepository.findByTaskId(taskId).orElseThrow(()->new EntityNotFoundException("no comments found"));
    }

    public Map<UUID,List<ChatMessage>>  loadChatsByUser(){
        User user=userService.loadAuthenticatedUser();
        Project project=projectService.loadProject(user.getProjectId());
        Map<UUID,List<ChatMessage>> chats=new HashMap<>();
        List<UUID> tasks=taskService.getActiveTaskIdsByUser(user.getId(),project.getId());
        for(UUID taskId:tasks){
            chats.put(taskId,loadComments(taskId));
        }
        return chats;
    }




}
