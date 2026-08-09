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
import com.satya.cert.service.FileStorageService;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.http.MediaType;

@RestController
@RequestMapping("/api/student")
public class StudentController {
  private static final Logger logger = LoggerFactory.getLogger(StudentController.class);

  private final CourseEnrollmentRepository courseEnrollmentRepository;
  private final CertificateRequestRepository certificateRequestRepository;
  private final CurrentUserService currentUserService;
  private final EmailService emailService;
  private final FileStorageService fileStorageService;

  public StudentController(
      CourseEnrollmentRepository courseEnrollmentRepository,
      CertificateRequestRepository certificateRequestRepository,
      CurrentUserService currentUserService,
      EmailService emailService,
      FileStorageService fileStorageService) {
    this.courseEnrollmentRepository = courseEnrollmentRepository;
    this.certificateRequestRepository = certificateRequestRepository;
    this.currentUserService = currentUserService;
    this.emailService = emailService;
    this.fileStorageService = fileStorageService;
  }

  @PostMapping(value = "/enroll", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public CourseEnrollment enroll(
      @RequestPart("request") EnrollmentRequest request,
      @RequestPart(value = "screenshot", required = false) MultipartFile screenshot) {
    AppUser currentUser = currentUserService.user();
    logger.info("Enrollment received from student: {}", currentUser.getEmail());

    CourseEnrollment enrollment = new CourseEnrollment();
    enrollment.setStudentName(request.studentName());
    enrollment.setStudentEmail(currentUser.getEmail());
    enrollment.setPhone(request.phone());
    enrollment.setCourseName(request.courseName());
    enrollment.setAmount(request.amount());
    enrollment.setPaymentMethod(request.paymentMethod());
    enrollment.setTransactionId(request.transactionId());
    
    if (screenshot != null && !screenshot.isEmpty()) {
      String fileUrl = fileStorageService.storeFile(screenshot);
      enrollment.setPaymentScreenshotUrl(fileUrl);
    } else {
      enrollment.setPaymentScreenshotUrl(request.paymentScreenshotUrl());
    }

    enrollment.setPaymentStatus(PaymentStatus.PAYMENT_PENDING);
    enrollment.setMessage(request.message());
    enrollment.setUser(currentUser);

    CourseEnrollment savedEnrollment = courseEnrollmentRepository.save(enrollment);
    logger.info("Enrollment saved successfully with ID: {}", savedEnrollment.getId());
    
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
    logger.info("Certificate request received for student: {}", currentUser.getEmail());

    CertificateRequest certificateRequest = new CertificateRequest();
    certificateRequest.setStudentName(request.studentName());
    certificateRequest.setStudentEmail(currentUser.getEmail());
    certificateRequest.setCourseName(request.courseName());
    certificateRequest.setInstructorName(resolveInstructorName(request.instructorName()));
    certificateRequest.setDuration(request.duration());
    certificateRequest.setIssueDate(request.issueDate());
    certificateRequest.setStatus(RequestStatus.PENDING);
    certificateRequest.setUser(currentUser);

    CertificateRequest savedRequest = certificateRequestRepository.save(certificateRequest);
    logger.info("Certificate request created with ID: {}", savedRequest.getId());
    logger.info("Triggering admin notification email...");
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
