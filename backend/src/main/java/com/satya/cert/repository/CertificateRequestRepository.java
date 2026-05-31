package com.satya.cert.repository;

import com.satya.cert.entity.AppUser;
import com.satya.cert.entity.CertificateRequest;
import com.satya.cert.entity.RequestStatus;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CertificateRequestRepository extends JpaRepository<CertificateRequest, Long> {
  List<CertificateRequest> findByStatusOrderByCreatedAtDesc(RequestStatus status);

  List<CertificateRequest> findByUserOrderByCreatedAtDesc(AppUser user);

  Optional<CertificateRequest> findBySerialNo(String serialNo);
}
