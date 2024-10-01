package com.example.server.service;

import com.example.server.entities.ProjectRole;
import com.example.server.entities.Role;
import com.example.server.entities.User;
import com.example.server.exception.AccountConflictException;
import com.example.server.repositories.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {
    private final UserRepository userRepository;
    private static final Logger logger= LoggerFactory.getLogger(CustomOAuth2UserService.class);
    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        logger.info("entered in loadUser");
        OAuth2User oauth2User = super.loadUser(userRequest);

        String oauth2ClientName = userRequest.getClientRegistration().getRegistrationId();
        String email = extractEmail(oauth2User, oauth2ClientName);
        String oauth2Id = oauth2User.getAttribute("sub"); // or "id" for GitHub
        if (email == null || oauth2Id == null) {
            throw new OAuth2AuthenticationException("Unable to extract email or OAuth ID");
        }

        // Call your method to process the login
        processOAuthPostLogin(email, oauth2ClientName, oauth2Id,oauth2User);
        return oauth2User;
    }
    private String extractEmail(OAuth2User oauth2User, String oauth2ClientName) {
        if ("google".equals(oauth2ClientName)) {
            return oauth2User.getAttribute("email");
        } else if ("github".equals(oauth2ClientName)) {
            return oauth2User.getAttribute("email");
        }
        // Add more providers as needed
        return null;
    }
    public void processOAuthPostLogin(String email, String oauth2ClientName, String oauth2Id, OAuth2User oAuth2User) {
        logger.info("entered in processOAuthPostLogin");
        Optional<User> optionalUserByOAuth = userRepository.findByOauthIdentity(oauth2ClientName, oauth2Id);

        Optional<User>  optionalUserByEmail=userRepository.findByEmail(email);

        if(optionalUserByOAuth.isPresent()){
            User userByOAuth=optionalUserByOAuth.get();
            if (optionalUserByEmail.isPresent() && !optionalUserByEmail.get().getId().equals(userByOAuth.getId())) {
                throw new AccountConflictException("This OAuth account is linked to a different email. Please log in with your original account or contact support.");
            }
            if (!userByOAuth.getEmails().contains(email)) {
                userByOAuth.getEmails().add(email);
                userRepository.save(userByOAuth);
            }
        }
        else if (optionalUserByEmail.isPresent()) {
            User userByEmail=optionalUserByEmail.get();
            userByEmail.getOauthIdentities().put(oauth2ClientName, oauth2Id);
            userRepository.save(userByEmail);
        }
        else {
            // new user
            logger.info("no existing user found, creating new user");
            User user = new User();
            String[] data = oAuth2User.getName().split(" ");
            String username=data[0]+(data.length>1?"_"+data[1]:"_")+(int)(Math.random() * 9000 +1000) ;
            user.setFirstName(data[0]);
            user.setLastName(data.length == 1 ? null : data[1]);
            user.setUsername(username);
            user.getEmails().add(email);
            user.setRole(Role.USER);
            user.setProjectRole(ProjectRole.DEFAULT_TEAM_MEMBER);
            userRepository.save(user);
            logger.info("user created : {}",user.getUsername());
        }
    }

}
