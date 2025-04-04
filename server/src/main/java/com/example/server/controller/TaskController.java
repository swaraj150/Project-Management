package com.example.server.controller;

import com.example.server.entities.User;
import com.example.server.requests.CreateProjectRequest;
import com.example.server.requests.CreateTaskRequest;
import com.example.server.response.ProjectResponse;
import com.example.server.response.TaskResponse;
//import com.example.server.service.MilestoneService;
import com.example.server.service.ChatMessageService;
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
    private final ChatMessageService chatMessageService;
//    private final MilestoneService milestoneService;

//    @GetMapping("/")
//    public ResponseEntity<?> loadTasks(){
//        return ResponseEntity.ok(taskService.getActiveTasksByUser());
//    }
    @PostMapping("")
    public ResponseEntity<?> create(@RequestBody @NonNull CreateTaskRequest request){
        TaskResponse taskResponse=taskService.createTask(request);
        HashMap<String,Object> h=new HashMap<>();
        h.put("task",taskResponse);
        return ResponseEntity.ok(h);
    }
    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable @NonNull UUID id,@RequestBody @NonNull CreateTaskRequest request){
        TaskResponse taskResponse=taskService.createTask(request);
        HashMap<String,Object> h=new HashMap<>();
        h.put("message","Task updated successfully");
        return ResponseEntity.ok(h);
    }
//    @PutMapping("/change-status")
//    public ResponseEntity<?> changeStatus(@RequestParam @NonNull UUID id, @RequestParam @NonNull String status){
//        TaskResponse taskResponse=taskService.changeStatus(status,id);
//        HashMap<String,Object> h=new HashMap<>();
//        h.put("task",taskResponse);
//        return ResponseEntity.ok(h);
//    }

    @GetMapping("")
    public ResponseEntity<?> fetch(){
        List<TaskResponse> taskResponses=taskService.getTasksByOrganization();

        HashMap<String,Object> h=new HashMap<>();
        h.put("tasks",taskResponses);
        return ResponseEntity.ok(h);
    }
    @GetMapping("/project/{id}")
    public ResponseEntity<?> fetchByProject(@PathVariable @NonNull UUID projectId){
        List<TaskResponse> taskResponses=taskService.getTasksByProject(projectId);
        HashMap<String,Object> h=new HashMap<>();
        h.put("tasks",taskResponses);
        return ResponseEntity.ok(h);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable @NonNull UUID taskId){ //jugaad for now
        taskService.deleteTask(taskId);
        return ResponseEntity.ok("Deleted successfully");
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> loadTask(@PathVariable @NonNull UUID taskId){
        TaskResponse taskResponse=taskService.loadNestedTasks(taskId);
        HashMap<String,Object> h=new HashMap<>();
        h.put("task",taskResponse);
        return ResponseEntity.ok(h);
    }

    @GetMapping("/loadComments")
    public ResponseEntity<?> loadTaskComments(@RequestParam @NonNull UUID taskId){
        HashMap<String,Object> h=new HashMap<>();
        h.put("comments",chatMessageService.loadComments(taskId));
        return ResponseEntity.ok(h);
    }








}
