package com.example.server.dto;
import com.example.server.entities.JoinRequest;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class JoinRequestDTO {
    private UUID id;
    private String username;
    private String organization;
    private String projectRole;
    private String profilePageUrl;
    private Set<String> emails;
}
