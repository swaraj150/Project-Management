package com.example.server.service;

import com.example.server.entities.*;
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
    private final OrganizationService organizationService;
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

    public List<ChatMessage> loadChats(@NonNull UUID roomId){
        return chatMessageRepository.findByRoomId(roomId).orElseThrow(()->new EntityNotFoundException("no comments found"));
    }



    public Map<UUID,List<ChatMessage>> loadChatsByUser(){
        User user=userService.loadAuthenticatedUser();
        Project project=projectService.loadProject(user.getProjectId());
        Map<UUID,List<ChatMessage>> chats=new HashMap<>();
        List<UUID> tasks=taskService.getAllTaskIdsByUser(user.getId(),project.getId());
        for(UUID taskId:tasks){
            chats.put(taskId, loadChats(taskId));
        }
        return chats;
    }
    public Map<UUID,List<ChatMessage>> loadChatsByOrganization(){
        User user=userService.loadAuthenticatedUser();
        Organization organization=organizationService.loadOrganization(user.getOrganizationId());
        Map<UUID,List<ChatMessage>> chats=new HashMap<>();
        for(UUID roomId:organization.getProjects()){
            chats.put(roomId, loadChats(roomId));
        }
        return chats;
    }




}
