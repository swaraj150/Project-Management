package com.example.server.service;

import com.example.server.entities.Task;
import com.example.server.entities.User;
import com.example.server.enums.CompletionStatus;
import com.example.server.enums.Level;
import com.example.server.enums.WsPublishType;
import com.example.server.repositories.TaskRepository;
import com.example.server.requests.WsTaskRequest;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
//import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.concurrent.BlockingQueue;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.LinkedBlockingQueue;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class TaskConsumerService {
    private final BlockingQueue<WsTaskRequest> taskBuffer = new LinkedBlockingQueue<>();
    private final Map<String, WsTaskRequest> latestTaskMap = new ConcurrentHashMap<>();
    private final Map<String, UUID> clientIdMap = new ConcurrentHashMap<>();
    private final TaskRepository taskRepository;
    private final TaskService taskService;
    private final UserService userService;
    private final int BATCH_SIZE = 2;



    // problem is
    // payload for new task t1 (no id)
    // payload for task t1 (no id)
    // t1 persisted in db
    // how to know that second payload belong to t1
//    @KafkaListener(topics = {"CREATE_TASK","UPDATE_TASK","CREATE_SUBTASK","ASSIGN_MEMBERS","UPDATE_STATUS"},groupId = "task-consumers")
    public void consumeAndBuffer(WsTaskRequest taskRequest) {
        synchronized (taskBuffer) {
            if (taskRequest == null) {
                log.warn("Received null task request");
                return;
            }
//            UUID taskId = taskRequest.getTaskId();
            String clientTaskId = taskRequest.getClientTaskId();
            log.info("received taskRequest : {}",clientTaskId);

            if(taskRequest.getPublishType()==WsPublishType.CREATE_TASK){
                taskBuffer.add(taskRequest);
                log.info("Added task to buffer: {}", clientTaskId);
            }
            else{
                latestTaskMap.compute(clientTaskId, (key, existingRequest) -> {
                    if (existingRequest == null ||
                            taskRequest.getTimestamp().isAfter(existingRequest.getTimestamp())) {
                        log.info("Updated latestTaskMap with task: {}", clientTaskId);
                        return taskRequest;
                    }
                    return existingRequest;
                });

            }
            log.info("Buffer size: {}, Map size: {}", taskBuffer.size(), latestTaskMap.size());

            if (taskBuffer.size() + latestTaskMap.size() >= BATCH_SIZE) {
                log.info("processing batch");
                processBatch();
            }
        }
    }
    @Scheduled(fixedRate = 5000)
    @Transactional
    public void processBatch() {
        List<WsTaskRequest> batchToProcess = new ArrayList<>();
        try {
            taskBuffer.drainTo(batchToProcess);
            batchToProcess.addAll(latestTaskMap.values());
            latestTaskMap.clear();

            if (batchToProcess.isEmpty()) {
                return;
            }
            log.debug("Processing batch of {} tasks", batchToProcess.size());

            List<Task> tasksToSave = new ArrayList<>();

            for (WsTaskRequest request : batchToProcess) {
                try {
                    Task task = processTaskRequest(request);
                    if (task != null) {
                        tasksToSave.add(task);
                    }
                } catch (Exception e) {
                    log.error("Error processing task request: {}", request, e);
                }
            }

            if (!tasksToSave.isEmpty()) {
                taskRepository.saveAll(tasksToSave);
                log.info("Successfully saved batch of {} tasks", tasksToSave.size());
            }

        } catch (Exception e) {
            log.error("Error processing batch", e);
        }
    }

    private Task processTaskRequest(WsTaskRequest request) {
        if (request.getPublishType() == WsPublishType.CREATE_TASK) {
            Task task= taskService.createTask(request);
            clientIdMap.put(request.getClientTaskId(),task.getId());
        }
        UUID taskId=clientIdMap.get(request.getClientTaskId());
        if(taskId==null){
           throw new EntityNotFoundException("task does not exist");
        }
        Task task = taskService.loadTask(taskId);
        if (task == null) {
            log.warn("Task not found with ID: {}", request.getTaskId());
            return null;
        }
        updateTaskFromRequest(task, request);
        return task;
    }
    private void updateTaskFromRequest(Task task, WsTaskRequest request) {
        Optional.ofNullable(request.getTitle()).ifPresent(task::setTitle);
        Optional.ofNullable(request.getParentTaskId()).ifPresent(task::setParentTaskId);
        Optional.ofNullable(request.getPriority()).ifPresent(task::setPriority);
        Optional.ofNullable(request.getEstimatedHours()).ifPresent(task::setEstimatedHours);
        Optional.ofNullable(request.getLevel())
                .map(Level::valueOf)
                .ifPresent(task::setLevel);
        Optional.ofNullable(request.getAssignedTo())
                .map(assignedTo->assignedTo.stream().map(userService::loadUser).map(User::getId).collect(Collectors.toSet()))
                .ifPresent(task::setAssignedTo);
        Optional.ofNullable(request.getStatus())
                .map(CompletionStatus::valueOf)
                .ifPresent(task::setCompletionStatus);

    }


    public int getBufferSize() {
        return taskBuffer.size() + latestTaskMap.size();
    }

    @Scheduled(fixedRate = 60000)
    public void monitorBufferSize() {
        int currentSize = getBufferSize();
        if (currentSize > BATCH_SIZE * 2) {
            log.warn("Task buffer size is high: {}", currentSize);
        }
    }
}