package com.example.server.requests;

import com.example.server.entities.User;
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
public class TeamCreateRequest {
    private UUID organizationId;
    private String name;
    private List<String> dev;
    private List<String> qa;
    private String teamLead;

}