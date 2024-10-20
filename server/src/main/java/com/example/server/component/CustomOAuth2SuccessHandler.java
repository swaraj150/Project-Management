package com.example.server.component;

import com.example.server.enums.ProjectRole;
import com.example.server.enums.Role;
import com.example.server.entities.User;
import com.example.server.exception.AccountConflictException;
import com.example.server.repositories.UserRepository;
import com.example.server.service.JwtService;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.client.authentication.OAuth2AuthenticationToken;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Optional;

@Component
@RequiredArgsConstructor
public class CustomOAuth2SuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private static final Logger logger= LoggerFactory.getLogger(CustomOAuth2SuccessHandler.class);

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        logger.info("auth success");
        if (authentication instanceof OAuth2AuthenticationToken oauthToken) {
            OAuth2User oauth2User = oauthToken.getPrincipal();

            String email = oauth2User.getAttribute("email");
            String oauth2ClientName = oauthToken.getAuthorizedClientRegistrationId();
            String oauth2Id = oauth2User.getAttribute("sub");

            User user=processOAuthPostLogin(email, oauth2ClientName, oauth2Id, oauth2User);
            String token = jwtService.generateToken(user);
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }
            response.addHeader("Authorization", "Bearer " + token);
            Cookie jwtCookie =createSecureCookie("jwt_token",token,request.isSecure());
            response.addCookie(jwtCookie);
            getRedirectStrategy().sendRedirect(request, response, "http://localhost:5173");
            super.onAuthenticationSuccess(request, response, authentication);
        }
        else {
            throw new OAuth2AuthenticationException("Unexpected authentication type");
        }
    }

    @Transactional
    public User processOAuthPostLogin(String email, String oauth2ClientName, String oauth2Id, OAuth2User oAuth2User) {
        logger.info("Processing OAuth post login for email: {}", email);

        Optional<User> optionalUserByOAuth = userRepository.findByOauthIdentity(oauth2ClientName, oauth2Id);
        Optional<User> optionalUserByEmail = userRepository.findByEmail(email);

        if (optionalUserByOAuth.isPresent()) {
            return handleExistingOAuthUser(optionalUserByOAuth.get(), optionalUserByEmail, email);
        } else if (optionalUserByEmail.isPresent()) {
            return handleExistingEmailUser(optionalUserByEmail.get(), oauth2ClientName, oauth2Id);
        } else {
            return createNewUser(email, oauth2ClientName, oauth2Id, oAuth2User);
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
    private User createNewUser(String email, String oauth2ClientName, String oauth2Id, OAuth2User oAuth2User) {
        logger.info("Creating new user for email: {}", email);

        String name = oAuth2User.getAttribute("name");
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

    private Cookie createSecureCookie(String name, String value, boolean isSecure) {
        Cookie cookie = new Cookie(name, value);
        cookie.setHttpOnly(true);
        cookie.setSecure(isSecure);
        cookie.setPath("/");
        cookie.setMaxAge(-1); // Session cookie
        return cookie;
    }
}
