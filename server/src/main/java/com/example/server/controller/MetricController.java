package com.example.server.controller;

import com.example.server.requests.MetricRequest;
import com.example.server.service.MetricsService;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/")
public class MetricController {
    private final MetricsService metricsService;


//    @GetMapping("/metric")
//    ResponseEntity<?> loadMetrics(@RequestParam UUID projectId){
//        // task status pie chart
//        Map<String,Double> metric=new HashMap<>();
//        metric.put("pendingTasks",(taskService.getTaskPercentage(CompletionStatus.PENDING,projectId)));
//        metric.put("in_progressTasks",(taskService.getTaskPercentage(CompletionStatus.IN_PROGRESS,projectId)));
//        metric.put("completedTasks",(taskService.getTaskPercentage(CompletionStatus.COMPLETED,projectId)));
//
//        // timeLogs vs Estimated time
//
//        metric.put("timeLogs", timeLogService.countTimeLogs(projectId));
//        metric.put("estimatedTime",taskService.getTotalEstimatedTime(projectId).doubleValue());
//        return ResponseEntity.ok(metric);
//    }

    @GetMapping("/projects/workload")
    ResponseEntity<?> loadProjectWorkload(@RequestParam @NonNull UUID projectId){
        Map<String,Object> h=new HashMap<>();
        var result=metricsService.loadTeamWiseWorkload(projectId);
        h.put("workload",result);
        return ResponseEntity.ok(h);
    }

    @GetMapping("/projects/expertise")
    ResponseEntity<?> loadProjectExpertise(@RequestParam @NonNull UUID projectId){
        Map<String,Object> h=new HashMap<>();
        var result=metricsService.loadTeamWiseExpertise(projectId);
        h.put("expertise",result);
        return ResponseEntity.ok(h);
    }

    @GetMapping("/users/performance")
    ResponseEntity<?> loadEmployeePerformance(@RequestParam @NonNull UUID userId,@RequestParam @NonNull UUID projectId){
        Map<String,Object> h=new HashMap<>();
        var result=metricsService.employeePerformance(userId,projectId);
        h.put("performance",result);
        return ResponseEntity.ok(h);
    }

    @GetMapping("/projects/status")
    ResponseEntity<?> loadProjectTaskStatus(@RequestParam @NonNull UUID projectId){
        Map<String,Object> h=new HashMap<>();
        var result=metricsService.loadProjectCompletionStatuses(projectId);
        h.put("status",result);
        return ResponseEntity.ok(h);
    }

    @GetMapping("/projects/summary")
    ResponseEntity<?> loadProjectPriority(){
        Map<String,Object> h=new HashMap<>();
        var result =metricsService.loadProjectWisePriority();
        h.put("priority", result);
        return ResponseEntity.ok(h);
    }

    @GetMapping("/teams/expertise")
    ResponseEntity<?> loadTeamExpertise(@RequestParam @NonNull UUID projectId,@RequestParam @NonNull UUID teamId){
        Map<String,Object> h=new HashMap<>();
        var result =metricsService.loadTeamExpertise(projectId,teamId);
        h.put("expertise", result);
        return ResponseEntity.ok(h);
    }


}
