package com.satya.cert;

import com.satya.cert.entity.AppUser;
import com.satya.cert.entity.Role;
import com.satya.cert.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class CertificateSystemApplication {
  public static void main(String[] args) { SpringApplication.run(CertificateSystemApplication.class, args); }

  @Bean
  CommandLineRunner createDefaultAdmin(UserRepository repo, PasswordEncoder encoder,
      @Value("${app.admin-email}") String adminEmail,
      @Value("${app.admin-default-password}") String adminPassword) {
    return args -> repo.findByEmail(adminEmail).orElseGet(() -> {
      AppUser admin = new AppUser();
      admin.setName("Admin"); admin.setEmail(adminEmail);
      admin.setPassword(encoder.encode(adminPassword)); admin.setRole(Role.ADMIN);
      return repo.save(admin);
    });
  }
}
