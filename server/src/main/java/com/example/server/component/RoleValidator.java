package com.example.server.component;

import com.example.server.entities.ProjectRole;
import com.example.server.entities.User;
import com.example.server.exception.IllegalRoleException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class RoleValidator {
    public void validaterRole(ProjectRole role, User user){
        if(user.getProjectRole()!=role){
            throw new IllegalRoleException("Role does not match");
        }
    }
}
