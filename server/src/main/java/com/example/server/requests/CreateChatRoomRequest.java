package com.example.server.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateChatRoomRequest {
    private String name;
    private UUID projectId;
    private UUID teamId;
    private List<UUID> teams;
    private UUID taskId;

}
