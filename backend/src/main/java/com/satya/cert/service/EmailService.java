package com.satya.cert.service;

import com.satya.cert.entity.CertificateRequest;
import com.satya.cert.entity.CourseEnrollment;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.mail.MailException;
import org.springframework.mail.MailAuthenticationException;
import org.springframework.mail.MailSendException;
import jakarta.mail.internet.MimeMessage;
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

  @Value("${app.mail-from:Satya Tech Academy}")
  private String mailFrom;

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
    String loginLink = frontendUrl + "/admin/login?redirect=/admin/certificate-requests";
    String requestedOn = request.getCreatedAt() != null ? request.getCreatedAt().format(java.time.format.DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")) : "N/A";

    String body = "Hello Admin,\n\n"
        + "A new certificate request has been submitted and is waiting for your review.\n\n"
        + "Request Details\n\n"
        + "Student Name: " + request.getStudentName() + "\n"
        + "Student Email: " + request.getStudentEmail() + "\n"
        + "Course Name: " + request.getCourseName() + "\n"
        + "Request ID: " + request.getId() + "\n"
        + "Requested On: " + requestedOn + "\n\n"
        + "Please sign in to the Admin Dashboard to review and approve or reject this request.\n\n"
        + "[Review Certificate Request]\n"
        + loginLink + "\n\n"
        + "Thank you,\n"
        + "Satya Tech Academy System";

    logger.info("Sending admin notification email for request ID: {}", request.getId());
    send(adminEmail, "📥 New Certificate Request Received – Satya Tech Academy", body);
  }

  public void sendStudentApproved(CertificateRequest request) {
    String loginLink = frontendUrl + "/login?redirect=/student/certificates";

    String body = "Hello " + request.getStudentName() + ",\n\n"
        + "Congratulations!\n\n"
        + "Your certificate request has been reviewed and approved.\n\n"
        + "Certificate Details\n\n"
        + "Course Name: " + request.getCourseName() + "\n"
        + "Certificate ID: " + request.getSerialNo() + "\n"
        + "Issue Date: " + request.getIssueDate() + "\n\n"
        + "For security reasons, certificates can only be accessed after signing in to your account.\n\n"
        + "[View Certificate]\n"
        + loginLink;

    logger.info("Sending user response email for request ID: {} to {}", request.getId(), request.getStudentEmail());
    send(request.getStudentEmail(), "🎉 Your Certificate Has Been Approved – Satya Tech Academy", body);
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
      logger.warn("SMTP Configuration Missing: MAIL_USERNAME is not set. Falling back to MOCK email.");
      logger.info("\n--- EMAIL MOCK ---");
      logger.info("To: {}", to);
      logger.info("Subject: {}", subject);
      logger.info("Body:\n{}", body);
      logger.info("--- END EMAIL MOCK ---\n");
      return;
    }

    try {
      MimeMessage message = mailSender.createMimeMessage();
      MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
      
      helper.setFrom(mailFrom);
      helper.setTo(to);
      helper.setSubject(subject);
      helper.setText(body);
      
      mailSender.send(message);
      logger.info("Email sent successfully to {} with subject: {}", to, subject);
    } catch (MailAuthenticationException exception) {
      logger.error("SMTP AUTHENTICATION ERROR: Failed to authenticate. Verify your MAIL_USERNAME and MAIL_PASSWORD environment variables are correct.");
    } catch (MailSendException exception) {
      logger.error("SMTP SEND ERROR: Failed to deliver email to {}. The recipient address might be invalid or rejected by the server.", to);
    } catch (MailException exception) {
      logger.error("SMTP CONNECTION/GENERAL ERROR: Failed to connect to SMTP server. Ensure the port (e.g., 2525) is not blocked. Error: {}", exception.getMessage());
    } catch (Exception exception) {
      logger.error("CRITICAL SMTP ERROR: An unexpected error occurred while sending email to {}. Error: {}", to, exception.getMessage());
    }
  }
}
