package com.example.server.service;

import com.example.server.entities.*;
import com.example.server.repositories.ChatRoomRepository;
import com.example.server.requests.CreateChatRoomRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ChatRoomService {
    private final ChatRoomRepository chatRoomRepository;
    private final TeamService teamService;
    private final ProjectService projectService;
    private final UserService userService;


    public void createChatRoom(String name, UUID creator,UUID taskId, List<UUID> members) {
        ChatRoom chatRoom = new ChatRoom();
        chatRoom.setName(name);
        chatRoom.setCreatedBy(creator);
        chatRoom.setMembers(members);
        chatRoom.setTaskId(taskId);
        chatRoomRepository.save(chatRoom);
    }
    public void createChatRoom(CreateChatRoomRequest request) {
        User user=userService.loadAuthenticatedUser();

        ChatRoom chatRoom = new ChatRoom();
        Optional.ofNullable(request.getName())
                        .ifPresent(chatRoom::setName);
        chatRoom.setCreatedBy(user.getId());
        List<UUID> members;

        if(request.getProjectId()!=null){
            members=Optional.of(request.getProjectId())
                    .map(projectService::loadProject)
                    .map(Project::getTeams)
                    .stream()
                    .flatMap(Collection::stream)
                    .map(teamService::loadTeam)
                    .flatMap(team -> team.getMemberIds().stream())
                    .collect(Collectors.toSet())
                    .stream().toList();
        }
        else if(request.getTeams()!=null){
            members=Optional.of(request.getTeams())
                    .stream()
                    .flatMap(Collection::stream)
                    .map(teamService::loadTeam)
                    .flatMap(team -> team.getMemberIds().stream())
                    .collect(Collectors.toSet())
                    .stream().toList();
        }
        else if(request.getTeamId()!=null){
            members=Optional.of(request.getTeamId())
                    .map(teamService::loadTeam)
                    .map(Team::getMemberIds)
                    .orElse(Collections.emptySet())
                    .stream()
                    .toList();
        }
        else{
            members=new ArrayList<>();
        }


        chatRoom.setMembers(members);
        chatRoom.setTaskId(request.getTaskId());
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


    public ChatRoom findChatRoomByTaskId(UUID taskId) {
        return chatRoomRepository.findByTaskId(taskId).orElseThrow(()->new EntityNotFoundException("Chatroom not found"));
    }
}

