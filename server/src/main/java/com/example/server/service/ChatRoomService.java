package com.example.server.service;

import com.example.server.entities.ChatRoom;
import com.example.server.entities.Organization;
import com.example.server.repositories.ChatRoomRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    private final OrganizationService organizationService;
    private final TeamService TeamService;

    public void createChatRoom(String name, UUID creator, List<UUID> members) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setName(name);
        chatRoom.setCreatedBy(creator);
        chatRoom.setMembers(members);
        chatRoomRepository.save(chatRoom);
    }

    public void joinRoom(UUID roomId,UUID user){
        ChatRoom chatRoom=findChatRoomByRoomId(roomId);
        if(chatRoom.getMembers().contains(user)){
            throw new RuntimeException("user is already a member of the room");
        }
        chatRoom.getMembers().add(user);
        chatRoomRepository.save(chatRoom);
    }

    public ChatRoom findChatRoomByRoomId(UUID roomId) {
        return chatRoomRepository.findById(roomId).orElseThrow(()->new EntityNotFoundException("Chatroom not found"));
    }
}

