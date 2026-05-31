package com.satya.cert.controller;

import com.satya.cert.dto.RequestDtos.RejectRequest;
import com.satya.cert.entity.CertificateRequest;
import com.satya.cert.entity.CourseEnrollment;
import com.satya.cert.entity.RequestStatus;
import com.satya.cert.entity.PaymentStatus;
import com.satya.cert.repository.CertificateRequestRepository;
import com.satya.cert.repository.CourseEnrollmentRepository;
import com.satya.cert.service.EmailService;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin")
public class AdminController {
  private final CourseEnrollmentRepository courseEnrollmentRepository;
  private final CertificateRequestRepository certificateRequestRepository;
  private final EmailService emailService;

  public AdminController(
      CourseEnrollmentRepository courseEnrollmentRepository,
      CertificateRequestRepository certificateRequestRepository,
      EmailService emailService) {
    this.courseEnrollmentRepository = courseEnrollmentRepository;
    this.certificateRequestRepository = certificateRequestRepository;
    this.emailService = emailService;
  }

  @GetMapping("/enrollments")
  public List<CourseEnrollment> enrollments() {
    return courseEnrollmentRepository.findAll().stream()
        .sorted(Comparator.comparing(CourseEnrollment::getCreatedAt).reversed())
        .toList();
  }



  @PutMapping("/enrollments/{id}/approve-payment")
  public CourseEnrollment approvePayment(@PathVariable Long id) {
    CourseEnrollment enrollment = courseEnrollmentRepository.findById(id).orElseThrow();
    enrollment.setPaymentStatus(PaymentStatus.PAYMENT_APPROVED);
    enrollment.setPaymentApprovedAt(LocalDateTime.now());

    CourseEnrollment savedEnrollment = courseEnrollmentRepository.save(enrollment);
    emailService.sendStudentPaymentApproved(savedEnrollment);

    return savedEnrollment;
  }

  @PutMapping("/enrollments/{id}/reject-payment")
  public CourseEnrollment rejectPayment(
      @PathVariable Long id,
      @RequestBody(required = false) RejectRequest rejectRequest) {
    CourseEnrollment enrollment = courseEnrollmentRepository.findById(id).orElseThrow();
    enrollment.setPaymentStatus(PaymentStatus.PAYMENT_REJECTED);
    enrollment.setAdminRemark(resolveRejectRemark(rejectRequest));

    CourseEnrollment savedEnrollment = courseEnrollmentRepository.save(enrollment);
    emailService.sendStudentPaymentRejected(savedEnrollment);

    return savedEnrollment;
  }

  @GetMapping("/certificates")
  public List<CertificateRequest> certificates(@RequestParam(required = false) RequestStatus status) {
    if (status != null) {
      return certificateRequestRepository.findByStatusOrderByCreatedAtDesc(status);
    }

    return certificateRequestRepository.findAll().stream()
        .sorted(Comparator.comparing(CertificateRequest::getCreatedAt).reversed())
        .toList();
  }

  @PutMapping("/certificates/{id}/approve")
  public CertificateRequest approve(@PathVariable Long id) {
    CertificateRequest request = certificateRequestRepository.findById(id).orElseThrow();

    request.setStatus(RequestStatus.APPROVED);
    request.setApprovedAt(LocalDateTime.now());

    if (request.getSerialNo() == null || request.getSerialNo().isBlank()) {
      request.setSerialNo(generateSerialNumber(request.getId()));
    }

    CertificateRequest savedRequest = certificateRequestRepository.save(request);
    emailService.sendStudentApproved(savedRequest);

    return savedRequest;
  }

  @PutMapping("/certificates/{id}/reject")
  public CertificateRequest reject(
      @PathVariable Long id,
      @RequestBody(required = false) RejectRequest rejectRequest) {
    CertificateRequest request = certificateRequestRepository.findById(id).orElseThrow();

    request.setStatus(RequestStatus.REJECTED);
    request.setAdminRemark(resolveRejectRemark(rejectRequest));

    CertificateRequest savedRequest = certificateRequestRepository.save(request);
    emailService.sendStudentRejected(savedRequest);

    return savedRequest;
  }

  private String generateSerialNumber(Long id) {
    return "STA-" + LocalDateTime.now().getYear() + "-" + String.format("%06d", id);
  }

  private String resolveRejectRemark(RejectRequest rejectRequest) {
    if (rejectRequest == null || rejectRequest.remark() == null || rejectRequest.remark().isBlank()) {
      return "Not approved by admin";
    }

    return rejectRequest.remark();
  }
}
