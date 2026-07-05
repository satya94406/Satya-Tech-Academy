package com.satya.cert.security;

import com.satya.cert.entity.AppUser;
import com.satya.cert.entity.Role;
import com.satya.cert.repository.UserRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

  private final UserRepository userRepository;
  private final JwtService jwtService;

  @Value("${app.frontend-url}")
  private String frontendUrl;

  public OAuth2LoginSuccessHandler(UserRepository userRepository, JwtService jwtService) {
    this.userRepository = userRepository;
    this.jwtService = jwtService;
  }

  @Override
  public void onAuthenticationSuccess(
      HttpServletRequest request, HttpServletResponse response, Authentication authentication)
      throws IOException, ServletException {
    
    OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();
    
    String email = oAuth2User.getAttribute("email");
    String name = oAuth2User.getAttribute("name");
    
    if (email == null) {
      String id = oAuth2User.getName();
      if (id != null && !id.isEmpty()) {
        email = id + "@oauth-user.com";
      } else {
        response.sendRedirect(frontendUrl + "/login?error=email_not_found");
        return;
      }
    }

    final String finalEmail = email;
    AppUser user = userRepository.findByEmail(finalEmail).orElseGet(() -> {
      AppUser newUser = new AppUser();
      newUser.setEmail(finalEmail);
      newUser.setName(name != null ? name : "User");
      newUser.setRole(Role.STUDENT);
      newUser.setPassword(""); 
      return userRepository.save(newUser);
    });

    String jwt = jwtService.generate(user);
    response.sendRedirect(frontendUrl + "/oauth2/redirect?token=" + jwt);
  }
}
