package com.example.server.response;

import com.example.server.dto.UserDTO;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TimeLogResponse {
    private UUID id;
    private LocalDate date;
    private Integer hours;
    private Integer minutes;
    private UserDTO user;
    private String description;

//    private TaskResponse task;
}
