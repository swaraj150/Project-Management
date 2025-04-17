package com.example.server.dto;

import com.example.server.enums.ProjectRole;
import com.example.server.enums.Role;
import com.example.server.entities.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserDTO {
    private UUID userId;
    private String name;
    private String username;
    private Set<String> emails;
//    private String password;
    private Role role;
    private ProjectRole projectRole;
    private String gender;
    private String dob;
    private String profilePageUrl;
    private String phoneNumber;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String code;
    private String country;
    private String state;
    private Set<String> skills;


    public static UserDTO mapToUserDTO(User user) {
        return UserDTO.builder()
                .userId(user.getId())
                .name(user.getFirstName() + (user.getLastName()==null?"":" "+user.getLastName()))
                .username(user.getUsername())
                .emails(user.getEmails())
                .role(user.getRole())
                .projectRole(user.getProjectRole())
                .profilePageUrl(user.getProfilePageUrl())
                .phoneNumber(user.getPhoneNumber())
                .gender(user.getGender())
                .dob(user.getDob()!=null?user.getDob().format(DateTimeFormatter.ISO_DATE):null) // parse to LocalDate if needed
                .addressLine1(user.getAddressLine1())
                .addressLine2(user.getAddressLine2())
                .city(user.getCity())
                .code(user.getCode())
                .country(user.getCountry())
                .state(user.getState())
                .skills(user.getSkills())
                .build();
    }
}
