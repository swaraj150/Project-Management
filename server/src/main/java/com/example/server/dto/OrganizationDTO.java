package com.example.server.dto;

import com.example.server.entities.Organization;
import com.example.server.entities.User;
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
public class OrganizationDTO {
    private UUID id;
    private String name;
    private UUID productOwnerId;
//    private UUID projectManagerId;
    private Set<UUID> teamIds;
    private Set<UUID> stakeholderIds;
    private String code;
    private Set<UUID> joinRequestIds;
    private Set<UUID> memberIds;
    private Set<UUID> projects;



    public static OrganizationDTO fromOrganization(Organization organization) {
        OrganizationDTO dto = new OrganizationDTO();
        dto.setId(organization.getId());
        dto.setName(organization.getName());
        dto.setProductOwnerId(organization.getProductOwnerId());
//        dto.setProjectManagerId(organization.getProjectManagerId());
        dto.setCode(organization.getCode());
        // Note: You'll need to fetch and set the related entity IDs separately
        return dto;
    }

    public Organization toOrganization() {
        Organization organization = new Organization();
        organization.setId(this.id);
        organization.setName(this.name);
        organization.setProductOwnerId(this.productOwnerId);
//        organization.setProjectManagerId(this.projectManagerId);
        organization.setCode(this.code);
        return organization;
    }
}
