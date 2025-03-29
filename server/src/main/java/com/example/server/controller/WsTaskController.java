package com.example.server.controller;

import com.example.server.entities.User;
import com.example.server.enums.ProjectAuthority;
import com.example.server.requests.WsTaskRequest;
import com.example.server.service.TaskConsumerService;
import com.example.server.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.UUID;


@Controller
@RequiredArgsConstructor
@Slf4j
public class WsTaskController {
    private final TaskConsumerService taskConsumerService;
    private final UserService userService;
    @MessageMapping("/task.handle")
    public void handleTasks(WsTaskRequest taskRequest){
        User user=userService.loadAuthenticatedUser();
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.CREATE_TASKS)) return;
        taskRequest.setTimestamp(LocalDateTime.now());
        taskRequest.setSatisfied(false);
        taskConsumerService.consumeAndBuffer(taskRequest);
    }

    @MessageMapping("/update-clientMap")
    public void updateClientMap(Map<UUID,String> clientMap){
        taskConsumerService.consumeClientIdMap(clientMap);
    }

}
