package com.example.server.controller;

import com.example.server.entities.User;
import com.example.server.requests.CreateProjectRequest;
import com.example.server.requests.CreateTaskRequest;
import com.example.server.response.MilestoneResponse;
import com.example.server.response.ProjectResponse;
import com.example.server.response.TaskResponse;
import com.example.server.service.MilestoneService;
import com.example.server.service.TaskService;
import com.example.server.service.UserService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService taskService;
    private final MilestoneService milestoneService;

    @GetMapping("/")
    public ResponseEntity<?> loadTasks(){
        return ResponseEntity.ok(taskService.getActiveTasksByUser());
    }
    @PostMapping("/create")
    public ResponseEntity<?> create(@RequestBody @NonNull CreateTaskRequest request){
        TaskResponse taskResponse=taskService.createTask(request);
        HashMap<String,Object> h=new HashMap<>();
        h.put("task",taskResponse);
        return ResponseEntity.ok(h);
    }
//    @PutMapping("/change-status")
//    public ResponseEntity<?> changeStatus(@RequestParam @NonNull UUID id, @RequestParam @NonNull String status){
//        TaskResponse taskResponse=taskService.changeStatus(status,id);
//        HashMap<String,Object> h=new HashMap<>();
//        h.put("task",taskResponse);
//        return ResponseEntity.ok(h);
//    }

    @GetMapping("/fetch")
    public ResponseEntity<?> fetch(){
        List<TaskResponse> taskResponses=taskService.getTasksByOrganization();

        HashMap<String,Object> h=new HashMap<>();
        h.put("tasks",taskResponses);
        return ResponseEntity.ok(h);
    }
    @GetMapping("/project")
    public ResponseEntity<?> fetchByProject(@RequestParam @NonNull UUID projectId){
        List<TaskResponse> taskResponses=taskService.getTasksByProject(projectId);
        List<MilestoneResponse> milestoneResponses=milestoneService.loadByProject(projectId);
        HashMap<String,Object> h=new HashMap<>();
        h.put("tasks",taskResponses);
        return ResponseEntity.ok(h);
    }







}
