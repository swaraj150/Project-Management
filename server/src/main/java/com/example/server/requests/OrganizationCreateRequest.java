package com.example.server.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class OrganizationCreateRequest {
    private String name;
    private String projectManager;
    private List<String> stakeholders;
}
