package com.example.server.component;

import com.example.server.enums.ProjectRole;
import com.example.server.entities.User;
import com.example.server.exception.IllegalRoleException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleValidator {
    public void validateRole(ProjectRole role, User user){
        if(user.getProjectRole()!=role){
            throw new IllegalRoleException("Roles do not match");
        }
    }
}
