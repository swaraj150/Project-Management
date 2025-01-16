package com.example.server.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WsChatRequest {
    private UUID taskId;
    private String content;
    private UUID senderId;
    private UUID roomId;

}
