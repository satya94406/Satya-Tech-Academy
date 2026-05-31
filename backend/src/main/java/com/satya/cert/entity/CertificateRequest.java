package com.satya.cert.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
public class CertificateRequest {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String studentName;
  private String studentEmail;
  private String courseName;
  private String instructorName;
  private String duration;
  private String issueDate;

  @Column(unique = true)
  private String serialNo;

  @Enumerated(EnumType.STRING)
  private RequestStatus status = RequestStatus.PENDING;

  @Column(length = 1000)
  private String adminRemark;

  private Integer downloadCount = 0;
  private LocalDateTime createdAt = LocalDateTime.now();
  private LocalDateTime approvedAt;

  @ManyToOne
  private AppUser user;

  public CertificateRequest() {}

  public Long getId() { return id; }
  public void setId(Long id) { this.id = id; }

  public String getStudentName() { return studentName; }
  public void setStudentName(String studentName) { this.studentName = studentName; }

  public String getStudentEmail() { return studentEmail; }
  public void setStudentEmail(String studentEmail) { this.studentEmail = studentEmail; }

  public String getCourseName() { return courseName; }
  public void setCourseName(String courseName) { this.courseName = courseName; }

  public String getInstructorName() { return instructorName; }
  public void setInstructorName(String instructorName) { this.instructorName = instructorName; }

  public String getDuration() { return duration; }
  public void setDuration(String duration) { this.duration = duration; }

  public String getIssueDate() { return issueDate; }
  public void setIssueDate(String issueDate) { this.issueDate = issueDate; }

  public String getSerialNo() { return serialNo; }
  public void setSerialNo(String serialNo) { this.serialNo = serialNo; }

  public RequestStatus getStatus() { return status; }
  public void setStatus(RequestStatus status) { this.status = status; }

  public String getAdminRemark() { return adminRemark; }
  public void setAdminRemark(String adminRemark) { this.adminRemark = adminRemark; }

  public Integer getDownloadCount() { return downloadCount; }
  public void setDownloadCount(Integer downloadCount) { this.downloadCount = downloadCount; }

  public LocalDateTime getCreatedAt() { return createdAt; }
  public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

  public LocalDateTime getApprovedAt() { return approvedAt; }
  public void setApprovedAt(LocalDateTime approvedAt) { this.approvedAt = approvedAt; }

  public AppUser getUser() { return user; }
  public void setUser(AppUser user) { this.user = user; }
}
