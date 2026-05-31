package com.satya.cert.service;
import com.satya.cert.entity.AppUser; import com.satya.cert.repository.UserRepository; import org.springframework.security.core.context.SecurityContextHolder; import org.springframework.stereotype.Service;
@Service
public class CurrentUserService{
  private final UserRepository repo; public CurrentUserService(UserRepository repo){this.repo=repo;}
  public AppUser user(){ String email=SecurityContextHolder.getContext().getAuthentication().getName(); return repo.findByEmail(email).orElseThrow(); }
}
