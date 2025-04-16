package com.example.server.requests;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.lang.Nullable;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CreateProjectRequest {
    @Nullable
    private UUID id;
    private String title;
    private String description;
    private LocalDate estimatedEndDate;
    private BigDecimal budget;
    private UUID projectManagerId;

    @Nullable
    private List<String> technologies;
}
