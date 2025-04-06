package com.example.server.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MetricRequest {
    private UUID projectId;
    private UUID teamId;
    private UUID userId;
    private UUID organizationId;
}
