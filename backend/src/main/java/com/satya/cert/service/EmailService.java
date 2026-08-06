package com.satya.cert.service;

import com.satya.cert.entity.CertificateRequest;
import com.satya.cert.entity.CourseEnrollment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Async;

@Service
@Async
public class EmailService {
  private static final Logger logger = LoggerFactory.getLogger(EmailService.class);

  private final JavaMailSender mailSender;

  @Value("${app.admin-email}")
  private String adminEmail;

  @Value("${app.frontend-url}")
  private String frontendUrl;

  @Value("${spring.mail.username:}")
  private String mailUsername;

  @Value("${app.backend-url}")
  private String backendUrl;

  public EmailService(JavaMailSender mailSender) {
    this.mailSender = mailSender;
  }

  public void sendAdminEnrollment(CourseEnrollment enrollment) {
    String screenshotUrl = enrollment.getPaymentScreenshotUrl();
    if (screenshotUrl != null && screenshotUrl.startsWith("/uploads")) {
      screenshotUrl = backendUrl + screenshotUrl;
    }

    String body = "New course enrollment received\n\n"
        + "Name: " + enrollment.getStudentName() + "\n"
        + "Email: " + enrollment.getStudentEmail() + "\n"
        + "Phone: " + enrollment.getPhone() + "\n"
        + "Course: " + enrollment.getCourseName() + "\n"
        + "Amount: ₹" + enrollment.getAmount() + "\n"
        + "Payment Method: " + enrollment.getPaymentMethod() + "\n"
        + "Transaction ID: " + enrollment.getTransactionId() + "\n"
        + "Payment Screenshot/Link: " + screenshotUrl + "\n"
        + "Status: PAYMENT_PENDING\n\n"
        + "Open Admin Dashboard: " + frontendUrl + "/admin" + "\n\n"
        + "Message: " + enrollment.getMessage();

    logger.info("Admin email sending started for enrollment ID: {}", enrollment.getId());
    send(adminEmail, "New Course Enrollment Request", body);
  }



  public void sendStudentPaymentApproved(CourseEnrollment enrollment) {
    String body = "Dear " + enrollment.getStudentName() + ",\n\n"
        + "Your payment has been verified and your course enrollment is approved.\n\n"
        + "Course: " + enrollment.getCourseName() + "\n"
        + "Amount: ₹" + enrollment.getAmount() + "\n\n"
        + "You can now continue from your student dashboard.\n\n"
        + "Regards,\n"
        + "Satya Tech Academy";

    logger.info("Student email sending started for payment approval of enrollment ID: {}", enrollment.getId());
    send(enrollment.getStudentEmail(), "Enrollment Approved - Satya Tech Academy", body);
  }

  public void sendStudentPaymentRejected(CourseEnrollment enrollment) {
    String reason = enrollment.getAdminRemark() == null ? "Please contact admin" : enrollment.getAdminRemark();

    String body = "Dear " + enrollment.getStudentName() + ",\n\n"
        + "Your payment verification was rejected.\n"
        + "Course: " + enrollment.getCourseName() + "\n"
        + "Reason: " + reason + "\n\n"
        + "Please submit correct payment details or contact admin.\n\n"
        + "Regards,\n"
        + "Satya Tech Academy";

    logger.info("Student email sending started for payment rejection of enrollment ID: {}", enrollment.getId());
    send(enrollment.getStudentEmail(), "Payment Verification Update", body);
  }

  public void sendAdminCertificateRequest(CertificateRequest request) {
    String body = "New certificate request received\n\n"
        + "Student: " + request.getStudentName() + "\n"
        + "Email: " + request.getStudentEmail() + "\n"
        + "Course: " + request.getCourseName() + "\n"
        + "Status: PENDING\n\n"
        + "Open Admin Dashboard: " + frontendUrl + "/admin";

    logger.info("Admin email sending started for certificate request ID: {}", request.getId());
    send(adminEmail, "New Certificate Request - Pending Approval", body);
  }

  public void sendStudentApproved(CertificateRequest request) {
    String certificateLink = frontendUrl + "/certificate/" + request.getSerialNo();

    String body = "Dear " + request.getStudentName() + ",\n\n"
        + "Congratulations! Your certificate has been approved.\n\n"
        + "Certificate Number: " + request.getSerialNo() + "\n"
        + "View and Download: " + certificateLink + "\n\n"
        + "Regards,\n"
        + "Satya Tech Academy";

    logger.info("Student email sending started for certificate approval of request ID: {}", request.getId());
    send(request.getStudentEmail(), "Your Certificate is Ready", body);
  }

  public void sendStudentRejected(CertificateRequest request) {
    String reason = request.getAdminRemark() == null ? "Contact admin" : request.getAdminRemark();

    String body = "Dear " + request.getStudentName() + ",\n\n"
        + "Your certificate request was not approved.\n"
        + "Reason: " + reason + "\n\n"
        + "Regards,\n"
        + "Satya Tech Academy";

    logger.info("Student email sending started for certificate rejection of request ID: {}", request.getId());
    send(request.getStudentEmail(), "Certificate Request Update", body);
  }

  private void send(String to, String subject, String body) {
    if (mailUsername == null || mailUsername.isBlank()) {
      logger.info("\n--- EMAIL MOCK ---");
      logger.info("To: {}", to);
      logger.info("Subject: {}", subject);
      logger.info("Body:\n{}", body);
      logger.info("--- END EMAIL MOCK ---\n");
      return;
    }

    try {
      SimpleMailMessage message = new SimpleMailMessage();
      message.setFrom(mailUsername);
      message.setTo(to);
      message.setSubject(subject);
      message.setText(body);
      mailSender.send(message);
      logger.info("Email sent successfully to {}", to);
    } catch (Exception exception) {
      logger.error("Email failed to send to {}", to, exception);
    }
  }
}
