package com.example.server.requests;

import com.example.server.entities.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.NonNull;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TeamCreateRequest {
    @NonNull
    private UUID id;

    private String name;
    private List<UUID> developers;
    private List<UUID> testers;
    private UUID teamLead;

}
