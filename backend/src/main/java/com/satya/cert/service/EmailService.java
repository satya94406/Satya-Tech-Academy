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

    String body = "<div style=\"font-family: sans-serif; color: #333;\">"
        + "<p>Hello Admin,</p>"
        + "<p>A new certificate request has been submitted and is waiting for your review.</p>"
        + "<h3 style=\"margin-top: 24px;\">Request Details</h3>"
        + "<ul style=\"list-style: none; padding-left: 0;\">"
        + "<li style=\"margin-bottom: 8px;\"><strong>Student Name:</strong> " + request.getStudentName() + "</li>"
        + "<li style=\"margin-bottom: 8px;\"><strong>Student Email:</strong> " + request.getStudentEmail() + "</li>"
        + "<li style=\"margin-bottom: 8px;\"><strong>Course Name:</strong> " + request.getCourseName() + "</li>"
        + "<li style=\"margin-bottom: 8px;\"><strong>Request ID:</strong> " + request.getId() + "</li>"
        + "<li style=\"margin-bottom: 8px;\"><strong>Requested On:</strong> " + requestedOn + "</li>"
        + "</ul>"
        + "<p style=\"margin-top: 24px;\">Please sign in to the Admin Dashboard to review and approve or reject this request.</p>"
        + "<p style=\"margin: 24px 0;\">"
        + "  <a href=\"" + loginLink + "\""
        + "     style=\"display:inline-block; padding:12px 24px; background-color:#2563eb; color:#ffffff; text-decoration:none; border-radius:6px; font-weight:600;\">"
        + "    Review Request"
        + "  </a>"
        + "</p>"
        + "<p>Thank you,<br>Satya Tech Academy System</p>"
        + "</div>";

    logger.info("Sending admin notification email for request ID: {}", request.getId());
    send(adminEmail, "📥 New Certificate Request Received – Satya Tech Academy", body, true);
  }

  public void sendStudentApproved(CertificateRequest request) {
    String loginLink = frontendUrl + "/login?redirect=/student/certificates";

    String body = "<div style=\"font-family: sans-serif; color: #333;\">"
        + "<p>Hello " + request.getStudentName() + ",</p>"
        + "<p>Congratulations!</p>"
        + "<p>Your certificate request has been reviewed and approved.</p>"
        + "<h3 style=\"margin-top: 24px;\">Certificate Details</h3>"
        + "<ul style=\"list-style: none; padding-left: 0;\">"
        + "<li style=\"margin-bottom: 8px;\"><strong>Course Name:</strong> " + request.getCourseName() + "</li>"
        + "<li style=\"margin-bottom: 8px;\"><strong>Certificate ID:</strong> " + request.getSerialNo() + "</li>"
        + "<li style=\"margin-bottom: 8px;\"><strong>Issue Date:</strong> " + request.getIssueDate() + "</li>"
        + "</ul>"
        + "<p style=\"margin-top: 24px;\">For security reasons, certificates can only be accessed after signing in to your account.</p>"
        + "<p style=\"margin: 24px 0;\">"
        + "  <a href=\"" + loginLink + "\""
        + "     style=\"display:inline-block; padding:12px 24px; background-color:#2563eb; color:#ffffff; text-decoration:none; border-radius:6px; font-weight:600;\">"
        + "    View Certificate"
        + "  </a>"
        + "</p>"
        + "<p>Regards,<br>Satya Tech Academy</p>"
        + "</div>";

    logger.info("Sending user response email for request ID: {} to {}", request.getId(), request.getStudentEmail());
    send(request.getStudentEmail(), "🎉 Your Certificate Has Been Approved – Satya Tech Academy", body, true);
  }

  public void sendStudentRejected(CertificateRequest request) {
    String reason = request.getAdminRemark() == null ? "Contact admin" : request.getAdminRemark();
    String loginLink = frontendUrl + "/login?redirect=/student/certificates";

    String body = "<div style=\"font-family: sans-serif; color: #333;\">"
        + "<p>Dear " + request.getStudentName() + ",</p>"
        + "<p>We are writing to inform you that your certificate request was <strong>not approved</strong>.</p>"
        + "<h3 style=\"margin-top: 24px;\">Request Details</h3>"
        + "<ul style=\"list-style: none; padding-left: 0;\">"
        + "<li style=\"margin-bottom: 8px;\"><strong>Course Name:</strong> " + request.getCourseName() + "</li>"
        + "<li style=\"margin-bottom: 8px;\"><strong>Reason:</strong> " + reason + "</li>"
        + "</ul>"
        + "<p style=\"margin-top: 24px;\">If you believe this is a mistake or need more details, please visit your student dashboard to review your status or contact support.</p>"
        + "<p style=\"margin: 24px 0;\">"
        + "  <a href=\"" + loginLink + "\""
        + "     style=\"display:inline-block; padding:12px 24px; background-color:#2563eb; color:#ffffff; text-decoration:none; border-radius:6px; font-weight:600;\">"
        + "    View Request"
        + "  </a>"
        + "</p>"
        + "<p>Regards,<br>Satya Tech Academy</p>"
        + "</div>";

    logger.info("Student email sending started for certificate rejection of request ID: {}", request.getId());
    send(request.getStudentEmail(), "Certificate Request Update", body, true);
  }

  private void send(String to, String subject, String body) {
    send(to, subject, body, false);
  }

  private void send(String to, String subject, String body, boolean isHtml) {
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
      helper.setText(body, isHtml);
      
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
