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
import lombok.NonNull;
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
    public ResponseEntity<?> createChatRoom(@RequestBody @NonNull CreateChatRoomRequest createChatRoomRequest) {
        chatRoomService.createChatRoom(createChatRoomRequest);
        return ResponseEntity.ok("Room created successfully");
    }

    @PutMapping("/join")
    public ResponseEntity<?> joinRoom(@RequestParam UUID roomId) {
        User user=userService.loadAuthenticatedUser();
        chatRoomService.joinRoom(roomId, user.getId());
        return ResponseEntity.ok("User joined room successfully");
    }
    @GetMapping("/{roomId}")
    public ResponseEntity<?> getRoom(@PathVariable UUID roomId) {

        return ResponseEntity.ok(chatRoomService.findChatRoomByRoomId(roomId));
    }
}
