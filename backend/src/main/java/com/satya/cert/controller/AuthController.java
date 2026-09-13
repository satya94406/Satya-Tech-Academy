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
import org.springframework.beans.factory.annotation.Value;
import jakarta.transaction.Transactional;

import com.satya.cert.dto.AuthDtos.ForgotPasswordRequest;
import com.satya.cert.dto.AuthDtos.ResetPasswordRequest;
import com.satya.cert.entity.PasswordResetToken;
import com.satya.cert.repository.PasswordResetTokenRepository;
import com.satya.cert.service.EmailService;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;
  private final AuthenticationManager authenticationManager;
  private final JwtService jwtService;
  private final PasswordResetTokenRepository tokenRepository;
  private final EmailService emailService;

  @Value("${app.frontend-url}")
  private String frontendUrl;

  public AuthController(
      UserRepository userRepository,
      PasswordEncoder passwordEncoder,
      AuthenticationManager authenticationManager,
      JwtService jwtService,
      PasswordResetTokenRepository tokenRepository,
      EmailService emailService) {
    this.userRepository = userRepository;
    this.passwordEncoder = passwordEncoder;
    this.authenticationManager = authenticationManager;
    this.jwtService = jwtService;
    this.tokenRepository = tokenRepository;
    this.emailService = emailService;
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

  @PostMapping("/forgot-password")
  @Transactional
  public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
    Optional<AppUser> userOpt = userRepository.findByEmail(request.email());
    if (userOpt.isEmpty()) {
      // Return ok to prevent email enumeration
      return ResponseEntity.ok().build();
    }

    AppUser user = userOpt.get();

    // Delete existing tokens for this user
    tokenRepository.deleteByUserId(user.getId());

    // Generate new token
    String token = UUID.randomUUID().toString();
    PasswordResetToken resetToken = new PasswordResetToken(
        token,
        user,
        LocalDateTime.now().plusHours(1)
    );
    tokenRepository.save(resetToken);

    // Send email
    String resetLink = frontendUrl + "/reset-password?token=" + token;
    emailService.sendPasswordResetEmail(user.getEmail(), resetLink);

    return ResponseEntity.ok().build();
  }

  @PostMapping("/reset-password")
  @Transactional
  public ResponseEntity<?> resetPassword(@RequestBody ResetPasswordRequest request) {
    Optional<PasswordResetToken> tokenOpt = tokenRepository.findByToken(request.token());
    if (tokenOpt.isEmpty() || tokenOpt.get().getExpiryDate().isBefore(LocalDateTime.now())) {
      return ResponseEntity.badRequest().body("Invalid or expired reset token");
    }

    AppUser user = tokenOpt.get().getUser();
    user.setPassword(passwordEncoder.encode(request.newPassword()));
    userRepository.save(user);

    // Delete token after successful use
    tokenRepository.deleteByUserId(user.getId());

    return ResponseEntity.ok("Password reset successfully");
  }
}


