package com.example.server.controller;

import com.example.server.component.SecurityUtils;
import com.example.server.dto.OrganizationDTO;
import com.example.server.entities.Team;
import com.example.server.entities.User;
import com.example.server.requests.CreateChatRoomRequest;
import com.example.server.service.ChatRoomService;
import com.example.server.service.OrganizationService;
import com.example.server.service.TeamService;
import com.example.server.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/chatrooms")
@RequiredArgsConstructor
public class ChatRoomController {
    private final ChatRoomService chatRoomService;
    private final TeamService teamService;
    private final OrganizationService organizationService;
    private final UserService userService;
    private final SecurityUtils securityUtils;
    @PostMapping("/create")
    public ResponseEntity<?> createChatRoom(@RequestBody CreateChatRoomRequest createChatRoomRequest) {
        List<UUID> members;
        User user=userService.loadUser(securityUtils.getCurrentUsername());
        if(createChatRoomRequest.getOrganizationId()==null){
            Team team=teamService.loadTeam(createChatRoomRequest.getTeamId());
            members=new ArrayList<>(team.getMemberIds());
        }
        else {
            OrganizationDTO organizationDTO=organizationService.createOrganizationDTO(createChatRoomRequest.getOrganizationId());
            members=new ArrayList<>(organizationDTO.getMemberIds());
        }
        chatRoomService.createChatRoom(createChatRoomRequest.getName(),user.getId(), members);
        return ResponseEntity.ok("Room created successfully");
    }

    @PostMapping("/{roomId}/join")
    public ResponseEntity<?> joinRoom(@PathVariable UUID roomId) {
        User user=userService.loadUser(securityUtils.getCurrentUsername());
        chatRoomService.joinRoom(roomId, user.getId());
        return ResponseEntity.ok("User joined room successfully");
    }
    @GetMapping("/{roomId}")
    public ResponseEntity<?> getRoom(@PathVariable UUID roomId) {

        return ResponseEntity.ok(chatRoomService.findChatRoomByRoomId(roomId));
    }
}
