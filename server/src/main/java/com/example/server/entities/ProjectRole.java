package com.example.server.entities;

import java.util.Arrays;
import java.util.EnumSet;
import java.util.Set;

public enum ProjectRole {

    PROJECT_MANAGER(EnumSet.of(
            ProjectAuthority.VIEW_PROJECT,
            ProjectAuthority.EDIT_PROJECT,
            ProjectAuthority.DELETE_PROJECT,
            ProjectAuthority.ASSIGN_TASKS,
            ProjectAuthority.EDIT_TASKS,
            ProjectAuthority.VIEW_REPORTS
    )),
    PRODUCT_OWNER(EnumSet.of(
            ProjectAuthority.CREATE_ORGANIZATION,
            ProjectAuthority.VIEW_PROJECT,
            ProjectAuthority.EDIT_PROJECT,
            ProjectAuthority.ASSIGN_TASKS,
            ProjectAuthority.VIEW_REPORTS
    )),
    DEVELOPER(EnumSet.of(
            ProjectAuthority.VIEW_PROJECT,
            ProjectAuthority.EDIT_TASKS
    )),
    TEAM_LEAD(EnumSet.of(
            ProjectAuthority.VIEW_PROJECT,
            ProjectAuthority.EDIT_TASKS
    )),
    QA(EnumSet.of(
            ProjectAuthority.VIEW_PROJECT,
            ProjectAuthority.EDIT_TASKS
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

    public Set<ProjectAuthority> getAuthorities() {
        return authorities;
    }

    public boolean hasAuthority(ProjectAuthority authority) {
        return authorities.contains(authority);
    }

}
