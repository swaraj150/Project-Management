package com.example.server.entities;

import lombok.Getter;

import java.util.Arrays;
import java.util.EnumSet;
import java.util.Set;

@Getter
public enum ProjectRole {

    PROJECT_MANAGER(EnumSet.of(
            ProjectAuthority.VIEW_PROJECT,
            ProjectAuthority.EDIT_PROJECT,
            ProjectAuthority.DELETE_PROJECT,
            ProjectAuthority.ASSIGN_TASKS,
            ProjectAuthority.EDIT_TASKS,
            ProjectAuthority.VIEW_REPORTS,
            ProjectAuthority.ACCEPT_MEMBERS,
            ProjectAuthority.VIEW_TEAM,
            ProjectAuthority.CREATE_PROJECT,
            ProjectAuthority.CREATE_TASKS,
            ProjectAuthority.CREATE_TEAM,
            ProjectAuthority.VIEW_TASKS


    )),
    PRODUCT_OWNER(EnumSet.of(
            ProjectAuthority.CREATE_ORGANIZATION,
            ProjectAuthority.VIEW_PROJECT,
            ProjectAuthority.EDIT_PROJECT,
            ProjectAuthority.ASSIGN_TASKS,
            ProjectAuthority.VIEW_REPORTS,
            ProjectAuthority.ACCEPT_MEMBERS,
            ProjectAuthority.VIEW_TEAM,
            ProjectAuthority.CREATE_PROJECT,
            ProjectAuthority.CREATE_TASKS,
            ProjectAuthority.CREATE_TEAM,
            ProjectAuthority.VIEW_TASKS


    )),
    DEVELOPER(EnumSet.of(
            ProjectAuthority.VIEW_PROJECT,
            ProjectAuthority.EDIT_TASKS,
            ProjectAuthority.VIEW_TEAM,
            ProjectAuthority.VIEW_TASKS

    )),
    TEAM_LEAD(EnumSet.of(
            ProjectAuthority.VIEW_PROJECT,
            ProjectAuthority.EDIT_TASKS,
            ProjectAuthority.VIEW_TEAM,
            ProjectAuthority.VIEW_TASKS,
            ProjectAuthority.CREATE_TASKS

    )),
    QA(EnumSet.of(
            ProjectAuthority.VIEW_PROJECT,
            ProjectAuthority.EDIT_TASKS,
            ProjectAuthority.VIEW_TEAM,
            ProjectAuthority.VIEW_TASKS
    )),
    STAKEHOLDER(EnumSet.of(
            ProjectAuthority.VIEW_PROJECT,
            ProjectAuthority.VIEW_REPORTS
    )),
    DEFAULT_TEAM_MEMBER(EnumSet.of(
            ProjectAuthority.VIEW_PROJECT
    ));
    private final Set<ProjectAuthority> authorities;

    ProjectRole(Set<ProjectAuthority> authorities) {
        this.authorities = authorities;
    }

    public boolean hasAuthority(ProjectAuthority authority) {
        return authorities.contains(authority);
    }

}
