package com.satya.cert.controller;

import com.satya.cert.dto.AuthDtos.AuthResponse;
import com.satya.cert.dto.AuthDtos.LoginRequest;
import com.satya.cert.dto.AuthDtos.RegisterRequest;
import com.satya.cert.entity.AppUser;
import com.satya.cert.entity.Role;
import com.satya.cert.repository.UserRepository;
import com.satya.cert.security.JwtService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;

  public AuthController(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      AuthenticationManager authenticationManager,
      JwtService jwtService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
  }

  @PostMapping("/register")
  public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
    if (userRepository.existsByEmail(request.email())) {
      return ResponseEntity.badRequest().body("Email already registered");
    }

    AppUser user = new AppUser();
    user.setName(request.name());
    user.setEmail(request.email());
    user.setPassword(passwordEncoder.encode(request.password()));
    user.setRole(Role.STUDENT);

    userRepository.save(user);

    return ResponseEntity.ok(
        new AuthResponse(
            jwtService.generate(user),
            user.getRole().name(),
            user.getName(),
            user.getEmail()));
  }

  @PostMapping("/login")
  public AuthResponse login(@RequestBody LoginRequest request) {
    authenticationManager.authenticate(
        new UsernamePasswordAuthenticationToken(request.email(), request.password()));

    AppUser user = userRepository.findByEmail(request.email()).orElseThrow();

    return new AuthResponse(
        jwtService.generate(user),
        user.getRole().name(),
        user.getName(),
        user.getEmail());
  }
}
