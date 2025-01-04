package com.example.server.service;

import com.example.server.component.SecurityUtils;
import com.example.server.dto.UserDTO;
import com.example.server.entities.TimeLog;
import com.example.server.entities.User;
import com.example.server.enums.ProjectAuthority;
import com.example.server.exception.UnauthorizedAccessException;
import com.example.server.repositories.TimeLogRepository;
import com.example.server.requests.TimeLogRequest;
import com.example.server.response.TimeLogResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TimeLogService {
    private final TimeLogRepository timeLogRepository;
    private final UserService userService;
    public void LogTime(TimeLogRequest request){
        User user=userService.loadAuthenticatedUser();
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.EDIT_TASKS)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        TimeLog timeLog=new TimeLog();
        timeLog.setDate(request.getDate());
        timeLog.setHours(request.getHours());
        timeLog.setMinutes(request.getMinutes());
        timeLog.setUserId(user.getId());
        timeLog.setTaskId(request.getTaskId());
        timeLog.setProjectId(request.getProjectId());
        Optional.ofNullable(request.getDescription())
                .ifPresent(timeLog::setDescription);

        timeLogRepository.save(timeLog);
    }

    public TimeLog load(@NonNull UUID id){
        return timeLogRepository.findById(id).orElseThrow(()->new EntityNotFoundException("TimeLog not found"));
    }

    public TimeLogResponse loadTimeLogResponse(@NonNull UUID id){
        TimeLog timeLog=load(id);
        User user=userService.loadUser(timeLog.getUserId());
        return TimeLogResponse.builder()
                .date(timeLog.getDate())
                .hours(timeLog.getHours())
                .minutes(timeLog.getMinutes())
                .user(UserDTO.mapToUserDTO(user))
                .description(timeLog.getDescription())
                .build();
    }

    public List<TimeLogResponse> getTimeLogs(@NonNull UUID taskId){
        List<TimeLog> timeLogs=timeLogRepository.findByTaskId(taskId);
        List<TimeLogResponse> timeLogResponses=new ArrayList<>();
        for(TimeLog t:timeLogs){
            timeLogResponses.add(loadTimeLogResponse(t.getId()));
        }
        return timeLogResponses;
    }

    public Double countTimeLogs(@NonNull UUID projectId){
        return timeLogRepository.getTimeLogCountWithinProject(projectId);
    }

    public Double countTimeLogs(){
        User user=userService.loadAuthenticatedUser();
        return timeLogRepository.getTimeLogCount(user.getOrganizationId());
    }


}
