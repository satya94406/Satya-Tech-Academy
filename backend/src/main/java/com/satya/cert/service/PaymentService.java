package com.satya.cert.service;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import com.razorpay.Utils;
import com.satya.cert.dto.PaymentDtos.PaymentOrderRequest;
import com.satya.cert.dto.PaymentDtos.PaymentOrderResponse;
import com.satya.cert.dto.PaymentDtos.PaymentVerifyRequest;
import com.satya.cert.entity.AppUser;
import com.satya.cert.entity.Course;
import com.satya.cert.entity.CourseEnrollment;
import com.satya.cert.entity.Payment;
import com.satya.cert.entity.PaymentStatus;
import com.satya.cert.repository.CourseEnrollmentRepository;
import com.satya.cert.repository.CourseRepository;
import com.satya.cert.repository.PaymentRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class PaymentService {

    private final RazorpayClient razorpayClient;
    private final CourseRepository courseRepository;
    private final PaymentRepository paymentRepository;
    private final CourseEnrollmentRepository enrollmentRepository;
    private final EmailService emailService;

    @Value("${RAZORPAY_KEY_ID:}")
    private String keyId;

    @Value("${RAZORPAY_KEY_SECRET:}")
    private String keySecret;

    public PaymentService(RazorpayClient razorpayClient, CourseRepository courseRepository,
                          PaymentRepository paymentRepository, CourseEnrollmentRepository enrollmentRepository,
                          EmailService emailService) {
        this.razorpayClient = razorpayClient;
        this.courseRepository = courseRepository;
        this.paymentRepository = paymentRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.emailService = emailService;
    }

    @Transactional
    public PaymentOrderResponse createOrder(PaymentOrderRequest request, AppUser user) throws Exception {
        Course course = courseRepository.findById(request.courseId())
                .orElseThrow(() -> new RuntimeException("Course not found"));

        double amount = course.getPrice();
        int amountInPaise = (int) (amount * 100);

        JSONObject orderRequest = new JSONObject();
        orderRequest.put("amount", amountInPaise);
        orderRequest.put("currency", "INR");
        orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

        Order razorpayOrder = razorpayClient.orders.create(orderRequest);
        String orderId = razorpayOrder.get("id");

        Payment payment = new Payment();
        payment.setRazorpayOrderId(orderId);
        payment.setAmount(amount);
        payment.setCurrency("INR");
        payment.setCourse(course);
        payment.setUser(user);
        payment.setPaymentStatus(PaymentStatus.PAYMENT_PENDING);
        paymentRepository.save(payment);

        return new PaymentOrderResponse(
                orderId,
                amount,
                "INR",
                keyId,
                course.getName(),
                course.getId()
        );
    }

    @Transactional
    public boolean verifyPayment(PaymentVerifyRequest request, AppUser user) {
        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", request.razorpayOrderId());
            options.put("razorpay_payment_id", request.razorpayPaymentId());
            options.put("razorpay_signature", request.razorpaySignature());

            boolean isValid = Utils.verifyPaymentSignature(options, keySecret);
            if (!isValid) {
                return false;
            }

            Payment payment = paymentRepository.findByRazorpayOrderId(request.razorpayOrderId())
                    .orElseThrow(() -> new RuntimeException("Payment record not found"));

            payment.setRazorpayPaymentId(request.razorpayPaymentId());
            payment.setRazorpaySignature(request.razorpaySignature());
            payment.setPaymentStatus(PaymentStatus.PAYMENT_APPROVED);
            paymentRepository.save(payment);

            Course course = courseRepository.findById(request.courseId())
                    .orElseThrow(() -> new RuntimeException("Course not found"));

            CourseEnrollment enrollment = new CourseEnrollment();
            enrollment.setStudentName(request.studentName());
            enrollment.setStudentEmail(request.studentEmail());
            enrollment.setPhone(request.phone());
            enrollment.setCourseName(course.getName());
            enrollment.setAmount(course.getPrice());
            enrollment.setPaymentMethod("Razorpay");
            enrollment.setTransactionId(request.razorpayPaymentId());
            enrollment.setPaymentStatus(PaymentStatus.PAYMENT_APPROVED);
            enrollment.setPaymentApprovedAt(LocalDateTime.now());
            enrollment.setMessage(request.message());
            enrollment.setUser(user);

            enrollmentRepository.save(enrollment);

            emailService.sendStudentPaymentApproved(enrollment);
            emailService.sendAdminEnrollment(enrollment);

            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
