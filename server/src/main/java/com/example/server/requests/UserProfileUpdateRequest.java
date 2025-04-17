package com.example.server.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfileUpdateRequest {
    private String firstName;
    private String lastName;
    private String gender;
    private String dob;
    private String url;
    private String phone;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String code;
    private String country;
    private String state;


}
