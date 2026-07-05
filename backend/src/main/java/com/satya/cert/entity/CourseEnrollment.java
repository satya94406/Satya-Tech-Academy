package com.satya.cert.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class CourseEnrollment {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String studentName;
  private String studentEmail;
  private String phone;
  private String courseName;
  private Double amount;
  private String paymentMethod;
  private String transactionId;

  @Lob
  @Column(columnDefinition = "TEXT")
  private String paymentScreenshotUrl;

  @Enumerated(EnumType.STRING)
  private PaymentStatus paymentStatus = PaymentStatus.PAYMENT_PENDING;

  @Column(length = 1000)
  private String message;

  @Column(length = 1000)
  private String adminRemark;

  private LocalDateTime createdAt = LocalDateTime.now();
  private LocalDateTime paymentApprovedAt;

  @ManyToOne
  private AppUser user;

  public CourseEnrollment() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getStudentName() { return studentName; }
  public void setStudentName(String studentName) { this.studentName = studentName; }

  public String getStudentEmail() { return studentEmail; }
  public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

  public String getPhone() { return phone; }
  public void setPhone(String phone) { this.phone = phone; }

  public String getCourseName() { return courseName; }
  public void setCourseName(String courseName) { this.courseName = courseName; }

  public Double getAmount() { return amount; }
  public void setAmount(Double amount) { this.amount = amount; }

  public String getPaymentMethod() { return paymentMethod; }
  public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

  public String getTransactionId() { return transactionId; }
  public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

  public String getPaymentScreenshotUrl() { return paymentScreenshotUrl; }
  public void setPaymentScreenshotUrl(String paymentScreenshotUrl) { this.paymentScreenshotUrl = paymentScreenshotUrl; }

  public PaymentStatus getPaymentStatus() { return paymentStatus; }
  public void setPaymentStatus(PaymentStatus paymentStatus) { this.paymentStatus = paymentStatus; }

  public String getMessage() { return message; }
  public void setMessage(String message) { this.message = message; }

  public String getAdminRemark() { return adminRemark; }
  public void setAdminRemark(String adminRemark) { this.adminRemark = adminRemark; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

  public LocalDateTime getPaymentApprovedAt() { return paymentApprovedAt; }
  public void setPaymentApprovedAt(LocalDateTime paymentApprovedAt) { this.paymentApprovedAt = paymentApprovedAt; }

  public AppUser getUser() { return user; }
  public void setUser(AppUser user) { this.user = user; }
}
