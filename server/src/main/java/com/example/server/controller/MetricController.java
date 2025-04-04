package com.example.server.controller;

import com.example.server.enums.CompletionStatus;
import com.example.server.service.TaskService;
import com.example.server.service.TimeLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
public class MetricController {
    private final TaskService taskService;
    private final TimeLogService timeLogService;


    @GetMapping("/metric")
    ResponseEntity<?> loadMetrics(@RequestParam UUID projectId){
        // task status pie chart
        Map<String,Double> metric=new HashMap<>();
        metric.put("pendingTasks",(taskService.getTaskPercentage(CompletionStatus.PENDING,projectId)));
        metric.put("in_progressTasks",(taskService.getTaskPercentage(CompletionStatus.IN_PROGRESS,projectId)));
        metric.put("completedTasks",(taskService.getTaskPercentage(CompletionStatus.COMPLETED,projectId)));

        // timeLogs vs Estimated time

        metric.put("timeLogs", timeLogService.countTimeLogs(projectId));
        metric.put("estimatedTime",taskService.getTotalEstimatedTime(projectId).doubleValue());
        return ResponseEntity.ok(metric);
    }



}
