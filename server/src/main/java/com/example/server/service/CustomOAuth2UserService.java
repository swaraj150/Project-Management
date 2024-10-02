package com.example.server.service;

import com.example.server.entities.ProjectRole;
import com.example.server.entities.Role;
import com.example.server.entities.User;
import com.example.server.exception.AccountConflictException;
import com.example.server.pojo.GoogleUserInfo;
import com.example.server.repositories.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService{
    private final UserRepository userRepository;

    private static final Logger logger= LoggerFactory.getLogger(CustomOAuth2UserService.class);
    @Transactional
    public User processOAuthPostLogin(String email, String oauth2ClientName, String oauth2Id,String name) {
        logger.info("Processing OAuth post login for email: {}", email);

        Optional<User> optionalUserByOAuth = userRepository.findByOauthIdentity(oauth2ClientName, oauth2Id);
        Optional<User> optionalUserByEmail = userRepository.findByEmail(email);

        if (optionalUserByOAuth.isPresent()) {
            return handleExistingOAuthUser(optionalUserByOAuth.get(), optionalUserByEmail, email);
        } else if (optionalUserByEmail.isPresent()) {
            return handleExistingEmailUser(optionalUserByEmail.get(), oauth2ClientName, oauth2Id);
        } else {
            return createNewUser(email, oauth2ClientName, oauth2Id, name);
        }
    }

    @Transactional
    private User handleExistingOAuthUser(User userByOAuth, Optional<User> optionalUserByEmail, String email) {
        if (optionalUserByEmail.isPresent() && !optionalUserByEmail.get().getId().equals(userByOAuth.getId())) {
            throw new AccountConflictException("This OAuth account is linked to a different email. Please log in with your original account or contact support.");
        }
        if (!userByOAuth.getEmails().contains(email)) {
            userByOAuth.getEmails().add(email);
            userRepository.save(userByOAuth);
        }
        return userByOAuth;
    }

    @Transactional
    private User handleExistingEmailUser(User userByEmail, String oauth2ClientName, String oauth2Id) {
        userByEmail.getOauthIdentities().put(oauth2ClientName, oauth2Id);
        return userRepository.save(userByEmail);
    }

    @Transactional
    private User createNewUser(String email, String oauth2ClientName, String oauth2Id, String name) {
        logger.info("Creating new user for email: {}", email);

//        String name = oAuth2User.getAttribute("name");
        if (name == null) {
            throw new OAuth2AuthenticationException("Name attribute is missing");
        }

        String[] data = name.split(" ", 2);
        String username=data[0]+(data.length>1?"_"+data[1]:"_")+(int)(Math.random() * 9000 +1000) ;

        User user = new User();
        user.setFirstName(data[0]);
        user.setLastName(data.length > 1 ? data[1] : null);
        user.setUsername(username);
        user.getEmails().add(email);
        user.setRole(Role.USER);
        user.setProjectRole(ProjectRole.DEFAULT_TEAM_MEMBER);
        user.getOauthIdentities().put(oauth2ClientName, oauth2Id);

        return userRepository.save(user);
    }
    public String extractEmail(GoogleUserInfo userInfo) {
        return userInfo.getEmailAddresses().stream()
                .filter(email -> email.getMetadata().isPrimary())
                .findFirst()
                .map(GoogleUserInfo.EmailAddress::getValue)
                .orElseThrow(() -> new OAuth2AuthenticationException("Primary email not found"));
    }

    public String extractOAuth2Id(GoogleUserInfo userInfo) {
        return userInfo.getResourceName();
    }

    public String extractName(GoogleUserInfo userInfo) {
        return userInfo.getNames().stream()
                .filter(name -> name.getMetadata().isPrimary())
                .findFirst()
                .map(GoogleUserInfo.Name::getDisplayName)
                .orElseThrow(() -> new OAuth2AuthenticationException("Primary name not found"));
    }

}
