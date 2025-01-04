package com.example.server.service;

//import com.example.server.entities.Milestone;
import com.example.server.entities.Task;
import com.example.server.entities.User;
import com.example.server.enums.CompletionStatus;
import com.example.server.enums.Level;
import com.example.server.enums.WsPublishType;
//import com.example.server.repositories.MilestoneRepository;
import com.example.server.repositories.TaskRepository;
import com.example.server.requests.WsTaskRequest;
import com.example.server.response.MilestoneResponse;
import com.example.server.response.TaskResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
//import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
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
    private final SimpMessageSendingOperations messagingTemplate;
    private final Map<String, UUID> clientIdMap = new ConcurrentHashMap<>();
    private final TaskRepository taskRepository;
    private final TaskService taskService;
    private final UserService userService;
//    private final MilestoneService milestoneService;
//    private final MilestoneRepository milestoneRepository;
    private final int BATCH_SIZE = 2;


    public void consumeAndBuffer(WsTaskRequest taskRequest) {
        synchronized (taskBuffer) {
            if (taskRequest == null) {
                log.warn("Received null task request");
                return;
            }
            String clientTaskId = taskRequest.getClientTaskId();
            log.info("received taskRequest : {}", clientTaskId);
            taskBuffer.add(taskRequest);
            log.info("Added task to buffer: {}", clientTaskId);
            log.info("Buffer size: {}", taskBuffer.size());
            if (taskBuffer.size() >= BATCH_SIZE) {
                log.info("processing batch");
                processBatch();
            }

        }
    }

    @Scheduled(fixedRate = 5000)
    @Transactional
    public void processBatch() {
        List<WsTaskRequest> batchToProcess = new ArrayList<>();
        Map<String, WsTaskRequest> uniqueTasks = new HashMap<>();
        try {


            taskBuffer.drainTo(batchToProcess);
            if (batchToProcess.isEmpty()) {
                return;
            }
            log.debug("Processing batch of {} tasks", batchToProcess.size());


            Map<Task,String> tasksToSave = new LinkedHashMap<>();
//            Map<Milestone,String> milestonesToSave = new LinkedHashMap<>();
            for (WsTaskRequest request : batchToProcess) {
                String clientId = request.getClientTaskId();
                if (uniqueTasks.containsKey(request.getClientTaskId())) {
                    WsTaskRequest oldRequest = uniqueTasks.get(clientId);
                    updateToLatestRequest(oldRequest, request);
                    uniqueTasks.put(clientId,request);
                } else {
                    uniqueTasks.put(clientId, request);
                }
            }
            batchToProcess.clear();
            batchToProcess.addAll(uniqueTasks.values());
            batchToProcess.sort(Comparator.comparing(WsTaskRequest::getTimestamp));

            for (WsTaskRequest request : batchToProcess) {
                try {
                    Task task = processTaskRequest(request);
                    if (task != null) {
                        tasksToSave.put(task,request.getClientTaskId());
                    }
//                    if(!request.isMilestone()){
//                    }else{
//                        Milestone milestone=processMilestoneRequest(request);
//                        if(milestone!=null){
//                            milestonesToSave.put(milestone,request.getClientTaskId());
//                        }
//                    }
                } catch (Exception e) {
                    log.error("Error processing task request: {}", request, e);
                }
            }

            if (!tasksToSave.isEmpty()) {
                taskRepository.saveAll(tasksToSave.keySet());
                List<TaskResponse> taskResponses=new ArrayList<>();
                // send whole parent task for now
                for(Map.Entry<Task,String> t:tasksToSave.entrySet()){
                    // order mismatch
                    taskResponses.add(taskService.loadTaskResponse(t.getKey().getId(),t.getValue()));
                }

                log.info("Successfully saved batch of {} tasks", tasksToSave.size());

                messagingTemplate.convertAndSend(

                        "/topic/tasks",
                        taskResponses

                );
            }

//            if (!milestonesToSave.isEmpty()) {
//                milestoneRepository.saveAll(milestonesToSave.keySet());
//                List<MilestoneResponse> milestoneResponses=new ArrayList<>();
//                // send whole parent task for now
//                for(Map.Entry<Milestone,String> t:milestonesToSave.entrySet()){
//                    MilestoneResponse response=milestoneService.loadResponse(t.getKey());
//                    response.setClientTaskId(t.getValue());
//                    milestoneResponses.add(response);
//                }
//
//                log.info("Successfully saved batch of {} tasks", tasksToSave.size());
//
//                messagingTemplate.convertAndSend(
//
//                        "/topic/milestone",
//                        milestoneResponses
//
//                );
//            }


        } catch (Exception e) {
            log.error("Error processing batch", e);
        }
    }
// clientId MAP and pretty much every data structure used here should be persistent
// since if we restart the application we wont be able to get clientIds and other stuffs
    private Task processTaskRequest(WsTaskRequest request) {
        if (request.getTaskId()==null) {
            if(request.getParentTaskId()!=null){
                request.setParentTaskId(clientIdMap.get(request.getParentTaskId()).toString());
            }
            Task task = taskService.createTask(request);
            clientIdMap.put(request.getClientTaskId(), task.getId());
            return task;
        }
        else{
            clientIdMap.put(request.getClientTaskId(),request.getTaskId());
            UUID taskId = clientIdMap.get(request.getClientTaskId());
            if (taskId == null) {
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
    }
//    private Milestone processMilestoneRequest(WsTaskRequest request) {
//        if (request.getMilestoneId()==null) {
//
//            Milestone milestone = milestoneService.create(request);
//            clientIdMap.put(request.getClientTaskId(), milestone.getId());
//            return milestone;
//        }
//        else{
//            clientIdMap.put(request.getClientTaskId(),request.getTaskId());
//            UUID milestoneId = request.getMilestoneId();
//            if (milestoneId == null) {
//                throw new EntityNotFoundException("task does not exist");
//            }
//            Milestone milestone = milestoneService.load(milestoneId);
//            if (milestone == null) {
//                log.warn("milestone not found with ID: {}", request.getMilestoneId());
//                return null;
//            }
//            updateMilestoneFromRequest(milestone, request);
//            return milestone;
//        }
//    }

    private void updateTaskFromRequest(Task task, WsTaskRequest request) {
        Optional.ofNullable(request.getTitle()).ifPresent(task::setTitle);

        Optional.ofNullable(request.getParentTaskId())
                .map(clientIdMap::get)
                .ifPresent(task::setParentTaskId);
        Optional.ofNullable(request.getPriority()).ifPresent(task::setPriority);
        Optional.ofNullable(request.getEstimatedHours())
                .map(Integer::valueOf)
                .ifPresent(task::setEstimatedHours);
        Optional.ofNullable(request.getLevel())
                .map(Level::valueOf)
                .ifPresent(task::setLevel);
        Optional.ofNullable(request.getAssignedTo())
                .map(assignedTo -> assignedTo.stream().map(userService::loadUser).map(User::getId).collect(Collectors.toSet()))
                .ifPresent(task::setAssignedTo);
        Optional.ofNullable(request.getStatus())
                .map(CompletionStatus::valueOf)
                .ifPresent(task::setCompletionStatus);
        Optional.ofNullable(request.getStartDate()).ifPresent(task::setStartDate);
        Optional.ofNullable(request.getEndDate()).ifPresent(task::setEndDate);

    }
//    private void updateMilestoneFromRequest(Milestone milestone, WsTaskRequest request) {
//        Optional.ofNullable(request.getTitle()).ifPresent(milestone::setTitle);
//        Optional.ofNullable(request.getDate()).ifPresent(milestone::setDate);
//        Optional.ofNullable(request.getAchievedAt()).ifPresent(milestone::setAchievedAt);
//        Optional.ofNullable(request.getStatus())
//                .map(CompletionStatus::valueOf)
//                .ifPresent(milestone::setCompletionStatus);
//
//    }

    private void updateToLatestRequest(WsTaskRequest oldRequest, WsTaskRequest newRequest) {

        newRequest.setTaskType(newRequest.getTaskType() == null ? oldRequest.getTaskType() : newRequest.getTaskType());
        newRequest.setLevel(newRequest.getLevel() == null ? oldRequest.getLevel() : newRequest.getLevel());
        newRequest.setPriority(newRequest.getPriority() == null ? oldRequest.getPriority() : newRequest.getPriority());
        newRequest.setParentTaskId(newRequest.getParentTaskId() == null ? oldRequest.getParentTaskId() : newRequest.getParentTaskId());
        newRequest.setEstimatedHours(newRequest.getEstimatedHours() == null ? oldRequest.getEstimatedHours() : newRequest.getEstimatedHours());
        newRequest.setStatus(newRequest.getStatus() == null ? oldRequest.getStatus() : newRequest.getStatus());
        newRequest.setTitle(newRequest.getTitle() == null ? oldRequest.getTitle() : newRequest.getTitle());
        newRequest.setPublishType(oldRequest.getPublishType() == WsPublishType.CREATE_TASK ? WsPublishType.CREATE_TASK : newRequest.getPublishType());
        newRequest.setStartDate(newRequest.getStartDate()==null?oldRequest.getStartDate():newRequest.getStartDate());
        newRequest.setEndDate(newRequest.getEndDate()==null?oldRequest.getEndDate():newRequest.getEndDate());
        newRequest.setDate(newRequest.getDate()==null?oldRequest.getDate():newRequest.getDate());
        newRequest.setAchievedAt(newRequest.getAchievedAt()==null?oldRequest.getAchievedAt():newRequest.getAchievedAt());
        newRequest.setTaskId(newRequest.getTaskId()==null?oldRequest.getTaskId():newRequest.getTaskId());
    }


    public int getBufferSize() {
        return taskBuffer.size();
//        return taskBuffer.size() + latestTaskMap.size();
    }

    @Scheduled(fixedRate = 60000)
    public void monitorBufferSize() {
        int currentSize = getBufferSize();
        if (currentSize > BATCH_SIZE * 2) {
            log.warn("Task buffer size is high: {}", currentSize);
        }
    }

    public void consumeClientIdMap(Map<UUID,String> m){
        for(Map.Entry<UUID,String> e:m.entrySet()){
            if(clientIdMap.containsKey(e.getValue())) continue;
            clientIdMap.put(e.getValue(), e.getKey());
        }
    }
}