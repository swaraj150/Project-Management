package com.example.backend.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.Date;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="Task")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name="task_id")
    private Integer id;
    private String title;
    private String description;
    private Integer priority;

    @ManyToOne
    // a user can create many tasks
    @JoinColumn(name="user_id")
    private User createdBy;

    @ManyToMany
    // many users may belong to one task and one task may be assigned to one user
    @JoinTable(
            name="task_assigned_users",
            joinColumns=@JoinColumn(name="task_id"),
            inverseJoinColumns = @JoinColumn(name="user_id")

    )
    private List<User> assignedTo;

    private Date createdAt;
    private Integer estimatedHours;
    private Date completedAt;
    @Enumerated(EnumType.STRING)
    private CompletionStatus completionStatus;


    @OneToMany(mappedBy = "parentTask")
    private List<Task> subTasks;
    //one Task (parent task) can have many subTasks.
    //The mappedBy = "parentTask" part refers to the field in the Task entity that owns the relationship (the other side of the relationship).


    @ManyToOne
    //many subtasks can be associated with one parent task.
    @JoinColumn(name = "parent_task_id")
    private Task parentTask;

    @ManyToOne
    //bidirectional mapping between tasks and a project
    @JoinColumn(name="project_id")
    private Project project;

}
