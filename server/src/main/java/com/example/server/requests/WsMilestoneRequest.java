package com.example.server.requests;

import com.example.server.enums.WsPublishType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class WsMilestoneRequest {
    private UUID milestoneId;
    private String clientId;
    private String description;
    private WsPublishType publishType;
    private String title;
    private LocalDateTime date;
    private String projectId;
    private LocalDateTime achievedAt;
    private LocalDateTime timestamp;
}
