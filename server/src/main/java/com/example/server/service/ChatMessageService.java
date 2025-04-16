package com.example.server.service;

import com.example.server.entities.*;
import com.example.server.enums.ResponseType;
import com.example.server.repositories.ChatMessageRepository;
import com.example.server.requests.WsChatRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class ChatMessageService {
    private final ChatMessageRepository chatMessageRepository;
    private final ChatRoomService chatRoomService;
    private final UserService userService;
    private final OrganizationService organizationService;
    private final ProjectService projectService;
    private final TaskService taskService;
    private final SimpMessagingTemplate messagingTemplate;
    public ChatMessage createChatMessage(WsChatRequest request,UUID roomId){
        User user=userService.loadAuthenticatedUser();
        String room;
        if(organizationService.exists(roomId)){
            room="Organization";
        }
        else if(taskService.exists(roomId)){
            room="Task";
        }
        else if(projectService.exists(roomId)){
            room="Project";
        }
        else{
            throw new EntityNotFoundException("Room not found");
        }
        ChatMessage chatMessage=ChatMessage.builder()
                .content(request.getContent())
                .roomId(roomId)
                .timestamp(LocalDateTime.now())
                .senderId(user.getId())
                .taskId(UUID.randomUUID())
                .build();

        chatMessageRepository.save(chatMessage);
        messagingTemplate.convertAndSend(
                "/topic/chat."+roomId,
                Map.of("notification","New message in your "+room+" group","dataType", ResponseType.CHAT.name(),"data",chatMessage)
        );
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
        Map<UUID,List<ChatMessage>> chats=new HashMap<>();
        if(user.getProjectId()==null){
            return chats;
        }
        Project project=projectService.loadProject(user.getProjectId());
        List<UUID> tasks=taskService.getAllTaskIdsByUser(user.getId(),project.getId());
        for(UUID taskId:tasks){
            chats.put(taskId, loadChats(taskId));
        }
        return chats;
    }
    public Map<UUID,List<ChatMessage>> loadTaskChatsByProject(){
        User user=userService.loadAuthenticatedUser();
        Map<UUID,List<ChatMessage>> chats=new HashMap<>();
        if(user.getProjectId()==null){
            return chats;
        }
        Project project=projectService.loadProject(user.getProjectId());
        List<UUID> tasks=project.getTasks();
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
