package com.satya.cert.controller;

import com.satya.cert.dto.RequestDtos.CertificateRequestDto;
import com.satya.cert.dto.RequestDtos.EnrollmentRequest;
import com.satya.cert.entity.AppUser;
import com.satya.cert.entity.CertificateRequest;
import com.satya.cert.entity.CourseEnrollment;
import com.satya.cert.entity.RequestStatus;
import com.satya.cert.entity.PaymentStatus;
import com.satya.cert.repository.CertificateRequestRepository;
import com.satya.cert.repository.CourseEnrollmentRepository;
import com.satya.cert.service.CurrentUserService;
import com.satya.cert.service.EmailService;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/student")
public class StudentController {
  private final CourseEnrollmentRepository courseEnrollmentRepository;
  private final CertificateRequestRepository certificateRequestRepository;
  private final CurrentUserService currentUserService;
  private final EmailService emailService;

  public StudentController(
      CourseEnrollmentRepository courseEnrollmentRepository,
      CertificateRequestRepository certificateRequestRepository,
      CurrentUserService currentUserService,
      EmailService emailService) {
    this.courseEnrollmentRepository = courseEnrollmentRepository;
    this.certificateRequestRepository = certificateRequestRepository;
    this.currentUserService = currentUserService;
    this.emailService = emailService;
  }

  @PostMapping("/enroll")
  public CourseEnrollment enroll(@RequestBody EnrollmentRequest request) {
    AppUser currentUser = currentUserService.user();

    CourseEnrollment enrollment = new CourseEnrollment();
    enrollment.setStudentName(request.studentName());
    enrollment.setStudentEmail(request.studentEmail());
    enrollment.setPhone(request.phone());
    enrollment.setCourseName(request.courseName());
    enrollment.setAmount(request.amount());
    enrollment.setPaymentMethod(request.paymentMethod());
    enrollment.setTransactionId(request.transactionId());
    enrollment.setPaymentScreenshotUrl(request.paymentScreenshotUrl());
    enrollment.setPaymentStatus(PaymentStatus.PAYMENT_PENDING);
    enrollment.setMessage(request.message());
    enrollment.setUser(currentUser);

    CourseEnrollment savedEnrollment = courseEnrollmentRepository.save(enrollment);
    emailService.sendAdminEnrollment(savedEnrollment);

    return savedEnrollment;
  }

  @GetMapping("/enrollments")
  public List<CourseEnrollment> myEnrollments() {
    return courseEnrollmentRepository.findByUserOrderByCreatedAtDesc(currentUserService.user());
  }

  @PostMapping("/certificates/request")
  public CertificateRequest requestCertificate(@RequestBody CertificateRequestDto request) {
    AppUser currentUser = currentUserService.user();

    CertificateRequest certificateRequest = new CertificateRequest();
    certificateRequest.setStudentName(request.studentName());
    certificateRequest.setStudentEmail(request.studentEmail());
    certificateRequest.setCourseName(request.courseName());
    certificateRequest.setInstructorName(resolveInstructorName(request.instructorName()));
    certificateRequest.setDuration(request.duration());
    certificateRequest.setIssueDate(request.issueDate());
    certificateRequest.setStatus(RequestStatus.PENDING);
    certificateRequest.setUser(currentUser);

    CertificateRequest savedRequest = certificateRequestRepository.save(certificateRequest);
    emailService.sendAdminCertificateRequest(savedRequest);

    return savedRequest;
  }

  @GetMapping("/certificates/my")
  public List<CertificateRequest> myCertificates() {
    return certificateRequestRepository.findByUserOrderByCreatedAtDesc(currentUserService.user());
  }

  private String resolveInstructorName(String instructorName) {
    if (instructorName == null || instructorName.isBlank()) {
      return "Satya Prakash";
    }

    return instructorName;
  }
}
