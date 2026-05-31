package com.satya.cert.repository;

import com.satya.cert.entity.AppUser;
import com.satya.cert.entity.CourseEnrollment;
import com.satya.cert.entity.PaymentStatus;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long> {
  List<CourseEnrollment> findByUserOrderByCreatedAtDesc(AppUser user);
  List<CourseEnrollment> findByPaymentStatusOrderByCreatedAtDesc(PaymentStatus paymentStatus);
}
