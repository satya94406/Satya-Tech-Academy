package com.satya.cert.dto;

public class RequestDtos {
  public record EnrollmentRequest(
      String studentName,
      String studentEmail,
      String phone,
      String courseName,
      Double amount,
      String paymentMethod,
      String transactionId,
      String paymentScreenshotUrl,
      String message) {}

  public record CertificateRequestDto(
      String studentName,
      String studentEmail,
      String courseName,
      String instructorName,
      String duration,
      String issueDate) {}

  public record RejectRequest(String remark) {}
}
