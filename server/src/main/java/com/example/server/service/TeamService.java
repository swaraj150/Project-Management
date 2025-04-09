package com.example.server.service;

import com.example.server.component.SecurityUtils;
import com.example.server.dto.TeamDTO;
import com.example.server.entities.*;
import com.example.server.enums.Level;
import com.example.server.enums.ProjectAuthority;
import com.example.server.enums.ProjectRole;
import com.example.server.exception.UnauthorizedAccessException;
import com.example.server.repositories.*;
import com.example.server.requests.TeamCreateRequest;
import com.example.server.response.TeamResponse;
import jakarta.persistence.EntityNotFoundException;
import lombok.NonNull;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class TeamService {
    private final TeamRepository teamRepository;
    private final UserService userService;
    private final UserRepository userRepository;
    private final OrganizationService organizationService;
    private final SecurityUtils securityUtils;
    private final TaskService taskService;
    private final UserExpertiseService userExpertiseService;
    private final UserExpertiseRepository userExpertiseRepository;
    private final OrganizationRepository organizationRepository;
    private final ProjectRepository projectRepository;
    private static final double EXPERTISE_WEIGHT = 0.4;
    private static final double WORKLOAD_WEIGHT = 0.6;
    private static final Map<Level, Double> LEVEL_SCORES = Map.of(
            Level.BEGINNER, 0.3,
            Level.INTERMEDIATE, 0.6,
            Level.EXPERT, 1.0
    );

    public TeamDTO createTeamDto(UUID id){
        Team team=teamRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Team not found"));
        return TeamDTO.builder()
                .id(id)
                .name(team.getName())
                .organizationId(team.getOrganizationId())
                .teamLeadId(team.getTeamLeadId())
                .developerIds(teamRepository.findDevsById(team.getId()))
                .qaIds(teamRepository.findQAsById(team.getId()))
                .build();

    }

    public TeamResponse createTeam(@NonNull TeamCreateRequest request){
        User user1=userService.loadUser(securityUtils.getCurrentUsername());
        if(!user1.getProjectRole().hasAuthority(ProjectAuthority.CREATE_TEAM)){
            throw new UnauthorizedAccessException("User does not have the required authority");
        }
        UUID orgId=user1.getOrganizationId();
        Organization organization=organizationService.loadOrganization(orgId);
        User teamLead=userService.loadUser(request.getTeamLead());
        userService.updateProjectRole(ProjectRole.TEAM_LEAD,teamLead);
        Set<UUID> members=new HashSet<>();
        members.add(teamLead.getId());
        members.add(organization.getProductOwnerId());
        for(UUID user: request.getDevelopers()){
            User dev=userService.loadUser(user);
            userService.updateProjectRole(ProjectRole.DEVELOPER,dev);
            members.add(dev.getId());
            userRepository.save(dev);
        }
        for(UUID user: request.getTesters()){
            User qa=userService.loadUser(user);
            userService.updateProjectRole(ProjectRole.QA,qa);
            members.add(qa.getId());
            userRepository.save(qa);
        }
        Team team = new Team();
        team.setName(request.getName());
        team.setTeamLeadId(teamLead.getId());
        team.setOrganizationId(user1.getOrganizationId());
        team.setMemberIds(members);
        teamRepository.save(team);
        organization.getTeams().add(team.getId());
        organizationRepository.save(organization);
        return loadTeamResponse(team.getId());
    }

    public TeamResponse loadTeamResponse(@NonNull UUID id){
        TeamDTO teamDTO=createTeamDto(id);

        return TeamResponse.builder()
                .id(teamDTO.getId())
                .name(teamDTO.getName())
                .teamLead(teamDTO.getTeamLeadId())
                .developers(new HashSet<>(teamDTO.getDeveloperIds()))
                .testers(new HashSet<>(teamDTO.getQaIds()))
                .build();
    }


    public Team loadTeam(@NonNull UUID id){
        return teamRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Team not found"));
    }


    public Set<TeamResponse> loadAllTeamResponses(){
        User user=userService.loadUser(securityUtils.getCurrentUsername());
        Organization organization=organizationService.loadOrganization(user.getOrganizationId());
        Set<TeamResponse> teamResponses=new HashSet<>();
        for(UUID teamId:organization.getTeams()){
            teamResponses.add(loadTeamResponse(teamId));
        }
        return teamResponses;
    }
    public Set<TeamResponse> loadTeamResponsesByUser(){
        User user=userService.loadAuthenticatedUser();
        Set<TeamResponse> teamResponses=new HashSet<>();
        Project project=projectRepository.findById(user.getProjectId()).orElseThrow(()->new EntityNotFoundException("Project not found"));
        for(UUID teamId:project.getTeams()){
            teamResponses.add(loadTeamResponse(teamId));
        }
        return teamResponses;
    }

    public Set<TeamResponse> searchByName(@NonNull String prefix) {
        List<Team> teams = teamRepository.findAll();
        Set<TeamResponse> suggestions = new HashSet<>();
        String escapedPrefix = prefix.replaceAll("([\\\\^$.|?*+()\\[\\]{}])", "\\\\$1").toLowerCase();
        Pattern pattern = Pattern.compile("^" + escapedPrefix, Pattern.CASE_INSENSITIVE);

        for (Team team : teams) {
            if (pattern.matcher(team.getName()).find()) {
                suggestions.add(loadTeamResponse(team.getId()));
            }
        }
        return suggestions;
    }


    // calculates the number of members above limit
    private Integer calculateAboveLimitTeamMembers(@NonNull UUID teamId,@NonNull Integer limit){
        Team team=teamRepository.findById(teamId).orElseThrow(()->new EntityNotFoundException("Team not found"));
        int res=0;
        for(UUID id:team.getMemberIds()){
//            User user=userService.loadUser(id);
            int total=0;
            List<Task> taskList=taskService.getActiveTasksByUser(id);
            for(Task t:taskList){
                total+=t.getEstimatedDays();
            }
            res+=total>limit?1:0;
        }
        return res;
    }
    // calculate total workload per team
    public Long calculateTotalTeamWorkload(@NonNull UUID teamId,@NonNull UUID projectId){
        // currently calculating every individual's workload without considering collective effort.
        Team team=teamRepository.findById(teamId).orElseThrow(()->new EntityNotFoundException("Team not found"));
        long res=0;
        for(UUID id:team.getMemberIds()){
            List<Task> taskList=taskService.getActiveTasksByUser(id,projectId);
            for(Task t:taskList){
                res+=t.getEstimatedDays();
            }
        }
        return res;
    }
    // get team expertise
    public Level calculateAverageTeamExpertise(@NonNull UUID teamId, @NonNull UUID projectId){
        Team team=teamRepository.findById(teamId).orElseThrow(()->new EntityNotFoundException("Team not found"));
        int beginners=0,intermediates=0,experts=0;
        int total=0;
        for(UUID id:team.getMemberIds()){
            User user=userService.loadUser(id);
            if(user.getProjectRole()==ProjectRole.PROJECT_MANAGER ||
                    user.getProjectRole()==ProjectRole.PRODUCT_OWNER || user.getProjectRole()==ProjectRole.TEAM_LEAD
            ) continue;
            Optional<Level> optionalLevel=userExpertiseRepository.findExpertise(id,projectId);
            if(optionalLevel.isEmpty()) continue;
            Level level=optionalLevel.get();
//            userExpertiseService.findExpertise(id,projectId);
            beginners+=level==Level.BEGINNER?1:0;
            intermediates+=level==Level.INTERMEDIATE?1:0;
            experts+=level==Level.EXPERT?1:0;
            total++;
        }
        if(total==0) return null;
        double avg=(double) (beginners+2*intermediates+3*experts)/total;
        if(avg>=1.0 && avg<=1.5){
            return Level.BEGINNER;
        }
        if(avg>=1.6 && avg<=2.5){
            return Level.INTERMEDIATE;
        }
        return Level.EXPERT;
    }
    public Map<String,Double> calculateTeamExpertise(@NonNull UUID teamId, @NonNull UUID projectId){
        Team team=teamRepository.findById(teamId).orElseThrow(()->new EntityNotFoundException("Team not found"));
        int beginners=0,intermediates=0,experts=0,total=0;
        for(UUID id:team.getMemberIds()){
            User user=userService.loadUser(id);
            if(user.getProjectRole()==ProjectRole.PROJECT_MANAGER ||
                    user.getProjectRole()==ProjectRole.PRODUCT_OWNER || user.getProjectRole()==ProjectRole.TEAM_LEAD
            ) continue;
            Optional<Level> optionalLevel=userExpertiseRepository.findExpertise(id,projectId);
            if(optionalLevel.isEmpty()) continue;
            Level level=optionalLevel.get();
//            userExpertiseService.findExpertise(id,projectId);
            beginners+=level==Level.BEGINNER?1:0;
            intermediates+=level==Level.INTERMEDIATE?1:0;
            experts+=level==Level.EXPERT?1:0;
            total++;
        }
        return Map.of("Beginner",((double)beginners/total)*100,"Intermediate",((double)intermediates/total)*100,"Expert",((double)experts/total)*100);
    }

    public double calculateWorkloads(@NonNull UUID teamId,@NonNull Integer limit,@NonNull UUID projectId){
        Team team=teamRepository.findById(teamId).orElseThrow(()->new EntityNotFoundException("Team not found"));
        int membersWithinLimit=team.getMemberIds().size()-calculateAboveLimitTeamMembers(teamId,limit);
        double percent_available= (double) membersWithinLimit /team.getMemberIds().size();
        double averageWorkload= (double) calculateTotalTeamWorkload(teamId,projectId) /team.getMemberIds().size();
        return percent_available*0.6 + ((limit-averageWorkload)/limit*0.4);
    }
    public double calculateTeamScore(@NonNull UUID teamId, @NonNull UUID projectId, @NonNull Integer workloadLimit) {
        Level expertiseLevel = calculateAverageTeamExpertise(teamId, projectId);
        double expertiseScore = expertiseLevel==null?0:LEVEL_SCORES.get(expertiseLevel);
        double workloadScore = calculateWorkloads(teamId, workloadLimit,projectId);
        return (expertiseScore * EXPERTISE_WEIGHT) + (workloadScore * WORKLOAD_WEIGHT);
    }


    public List<Map<String,Object>> suggestTeams(@NonNull UUID projectId, @NonNull Set<UUID> teams){
        User user=userService.loadUser(securityUtils.getCurrentUsername());
        Organization organization=organizationService.loadOrganization(user.getOrganizationId());
        List<Map<String,Object>> teamScores=new ArrayList<>();
        for(UUID teamId:teams){
            Map<String,Object> m=new HashMap<>();
            m.put("team", loadTeamResponse(teamId));
            m.put("score",calculateTeamScore(teamId,projectId,organization.getWorkloadLimit().getLimit()));
            teamScores.add(m);
        }
        return teamScores;
    }

    public void deleteTeam(@NonNull UUID teamId){
        User user=userService.loadAuthenticatedUser();
        if(!user.getProjectRole().hasAuthority(ProjectAuthority.DELETE_TEAM)){
            throw new UnauthorizedAccessException("User doesn't have required authority");
        }
        Organization organization=organizationService.loadOrganization(user.getOrganizationId());
        for(UUID id:organization.getProjects()){
            Project project=projectRepository.findById(id).orElseThrow(()->new EntityNotFoundException("Project not found"));
            project.getTeams().remove(teamId);
            projectRepository.save(project);
        }
        organization.getTeams().remove(teamId);
        organizationRepository.save(organization);
        Team team=loadTeam(teamId);
        team.getMemberIds().clear();
        teamRepository.save(team);
        teamRepository.delete(team);
    }




    
    

}
