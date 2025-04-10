package com.example.server.service;

import com.example.server.entities.Dependency;
import com.example.server.entities.Task;
import com.example.server.entities.User;
import com.example.server.enums.*;
import com.example.server.exception.InvalidDependencyException;
import com.example.server.repositories.DependencyRepository;
import com.example.server.repositories.TaskRepository;
import com.example.server.requests.WsTaskRequest;
import com.example.server.response.TaskResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
//import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class TaskConsumerService {
    private final BlockingQueue<WsTaskRequest> taskBuffer = new LinkedBlockingQueue<>();
    private final ConcurrentHashMap<WsTaskRequest, Boolean> processedTasks = new ConcurrentHashMap<>();
    private final SimpMessageSendingOperations messagingTemplate;
    private final Map<String, UUID> clientIdMap = new ConcurrentHashMap<>();
    private final TaskRepository taskRepository;
    private final TaskService taskService;
    private final DependencyRepository dependencyRepository;
    private final UserService userService;
    private final ExecutorService executor = Executors.newSingleThreadExecutor(); // For batch processing
    private final int BATCH_SIZE = 1;
    private final ProjectService projectService;
    private final OrganizationService organizationService;


    public void consumeAndBuffer(WsTaskRequest taskRequest) {
        synchronized (taskBuffer) {
            if (taskRequest == null || taskRequest.isSatisfied()) {
                log.warn("Received null task request");
                return;
            }

            if(!validateProjectId(taskRequest.getProjectId())){
                log.warn("Project Id should be valid");
                return;
            }

            String clientTaskId = taskRequest.getClientTaskId();
            if (processedTasks.putIfAbsent(taskRequest, true) != null) {
                log.warn("Duplicate task ignored: {}", clientTaskId);
                return;
            }

            log.info("received taskRequest : {}", clientTaskId);
            taskBuffer.add(taskRequest);
            log.info("Added task to buffer: {}", clientTaskId);
            log.info("Buffer size: {}", taskBuffer.size());
            if (taskBuffer.size() >= BATCH_SIZE) {
                log.info("processing batch");
                executor.submit(this::processBatch);
            }

        }
    }

//    @Scheduled(fixedRate = 5000)
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
                        tasksToSave.put(task,request.getClientTaskId()+"#"+request.getProjectId());
                    }
                    request.setSatisfied(true);
                } catch (Exception e) {
                    log.error("Error processing task request: {}", request, e);
                }
            }

            if (!tasksToSave.isEmpty()) {
                taskRepository.saveAll(tasksToSave.keySet());
//                List<TaskResponse> taskResponses=new ArrayList<>();
                Map<String,List<TaskResponse>> taskResponses=new HashMap<>();
                // send whole parent task for now
                for(Map.Entry<Task,String> t:tasksToSave.entrySet()){
                    // order mismatch
                    String[] ids=t.getValue().split("#");
                    String clientId=ids[0];
                    String projectId=ids[1];
                    taskResponses.get(projectId).add(taskService.loadTaskResponse(t.getKey().getId(),clientId));
                }

                log.info("Successfully saved batch of {} tasks", tasksToSave.size());
                for(Map.Entry<String,List<TaskResponse>> t:taskResponses.entrySet()){
                    messagingTemplate.convertAndSend(
                            "/topic/task.update."+t.getKey(),
                            t.getValue()

                    );
                }
            }

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
//            if(WsPublishType.valueOf(request.getPublishType())==WsPublishType.DELETE_TASK){
//                taskService.deleteTask(request.getTaskId(),request.getProjectId());
//
//                clientIdMap.remove(request.getClientTaskId());
//                return null;
//
//            }
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


    private void updateTaskFromRequest(Task task, WsTaskRequest request) {
        Optional.ofNullable(request.getTitle()).ifPresent(task::setTitle);

        Optional.ofNullable(request.getParentTaskId())
                .map(clientIdMap::get)
                .ifPresent(task::setParentTaskId);
        Optional.ofNullable(request.getPriority())
                .map(Priority::valueOf)
                .ifPresent(task::setPriority);
        Optional.ofNullable(request.getEstimatedDays())
                .map(Integer::valueOf)
                .ifPresent(task::setEstimatedDays);
        Optional.ofNullable(request.getLevel())
                .map(Level::valueOf)
                .ifPresent(task::setLevel);
        Optional.ofNullable(request.getAssignedTo())
                .map(assignedTo -> assignedTo.stream().map(userService::loadUser).map(User::getId).collect(Collectors.toSet()))
                .ifPresent(task::setAssignedTo);
        Optional.ofNullable(request.getProgress())
                .ifPresent(task::setProgress);


        if(request.getStatus()!=null){
            taskService.changeStatus(request.getStatus(),task);
        }
//        Optional.ofNullable(request.getStartDate()).ifPresent(task::setStartDate);
//        Optional.ofNullable(request.getEndDate()).ifPresent(task::setEndDate);
        if(request.getStartDate()!=null){
            ZonedDateTime utcZonedDateTime = ZonedDateTime.parse(request.getStartDate(), DateTimeFormatter.ISO_DATE_TIME);
            LocalDateTime localDateTime = utcZonedDateTime.withZoneSameInstant(ZoneId.systemDefault()).toLocalDateTime();
            task.setStartDate(localDateTime);
        }
        if(request.getEndDate()!=null){

            ZonedDateTime utcZonedDateTime = ZonedDateTime.parse(request.getEndDate(), DateTimeFormatter.ISO_DATE_TIME);
            LocalDateTime localDateTime = utcZonedDateTime.withZoneSameInstant(ZoneId.systemDefault()).toLocalDateTime();
            log.info("request endDate : {}",localDateTime);
            task.setEndDate(localDateTime);
        }
        if (request.getToTaskId() != null && request.getDependencyType() != null) {
//            boolean isValid= taskService.validateDependency(task.getId(),request.getDependentTaskId(),DependencyType.valueOf(request.getDependencyType()));
//            if(!isValid) {
//                log.error("{} dependency between {} and {} is invalid", request.getDependencyType(), task.getId(), request.getDependentTaskId());
//                throw new InvalidDependencyException("Invalid dependency");
//            }
            Dependency dependency= Dependency.builder()
                    .fromTaskId(task.getId())
                    .toTaskId(request.getToTaskId())
                    .lag(request.getLag())
                    .dependencyType(DependencyType.valueOf(request.getDependencyType()))
                    .build();
            dependencyRepository.save(dependency);
            log.info("dependency created!!");

        }
    }

    private void updateToLatestRequest(WsTaskRequest oldRequest, WsTaskRequest newRequest) {

        newRequest.setTaskType(newRequest.getTaskType() == null ? oldRequest.getTaskType() : newRequest.getTaskType());
        newRequest.setLevel(newRequest.getLevel() == null ? oldRequest.getLevel() : newRequest.getLevel());
        newRequest.setPriority(newRequest.getPriority() == null ? oldRequest.getPriority() : newRequest.getPriority());
        newRequest.setParentTaskId(newRequest.getParentTaskId() == null ? oldRequest.getParentTaskId() : newRequest.getParentTaskId());
        newRequest.setEstimatedDays(newRequest.getEstimatedDays() == null ? oldRequest.getEstimatedDays() : newRequest.getEstimatedDays());
        newRequest.setStatus(newRequest.getStatus() == null ? oldRequest.getStatus() : newRequest.getStatus());
        newRequest.setTitle(newRequest.getTitle() == null ? oldRequest.getTitle() : newRequest.getTitle());
        newRequest.setStartDate(newRequest.getStartDate()==null?oldRequest.getStartDate():newRequest.getStartDate());
        newRequest.setEndDate(newRequest.getEndDate()==null?oldRequest.getEndDate():newRequest.getEndDate());
        newRequest.setDate(newRequest.getDate()==null?oldRequest.getDate():newRequest.getDate());
        newRequest.setAchievedAt(newRequest.getAchievedAt()==null?oldRequest.getAchievedAt():newRequest.getAchievedAt());
        newRequest.setTaskId(newRequest.getTaskId()==null?oldRequest.getTaskId():newRequest.getTaskId());
        newRequest.setDependencyType(newRequest.getDependencyType()==null? oldRequest.getDependencyType(): newRequest.getDependencyType());
    }


    public int getBufferSize() {
        return taskBuffer.size();
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

    public void handleDependency(UUID fromTaskId, UUID toTaskId, String dependencyType, Integer lag, LocalDateTime triggerAt){
        Optional<Dependency> optionalDependency=dependencyRepository.doesExist(fromTaskId,toTaskId,DependencyType.valueOf(dependencyType));
        if(optionalDependency.isEmpty()){
            Dependency dependency= Dependency.builder()
                    .fromTaskId(fromTaskId)
                    .toTaskId(toTaskId)
                    .dependencyType(DependencyType.valueOf(dependencyType))
                    .lag(lag)
                    .build();
            dependencyRepository.save(dependency);
            return;
        }

        Dependency dependency=optionalDependency.get();
        if(lag==null || lag==0){
            taskService.triggerStatusUpdates(toTaskId,DependencyType.valueOf(dependencyType));
        }else{
            dependency.setTriggerAt(triggerAt);
        }
    }

    public boolean validateProjectId(UUID projectId){
        User user=userService.loadAuthenticatedUser();
        return projectId!=null && organizationService.getProjectsInOrganization(user.getOrganizationId()).contains(projectId) && projectService.exists(projectId);
    }

}