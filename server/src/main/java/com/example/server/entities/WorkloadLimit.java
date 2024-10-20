package com.example.server.entities;

import com.example.server.enums.WorkloadLimitType;
import jakarta.persistence.Column;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class WorkloadLimit {
    @Column(name = "workload_limit")
    private Integer limit;
    @Enumerated(EnumType.STRING)
    private WorkloadLimitType limitType;
}
