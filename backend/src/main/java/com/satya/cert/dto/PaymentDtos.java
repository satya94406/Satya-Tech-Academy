package com.satya.cert.dto;

public class PaymentDtos {

    public record PaymentOrderRequest(
        Long courseId,
        String studentName,
        String studentEmail,
        String phone,
        String message
    ) {}

    public record PaymentOrderResponse(
        String orderId,
        Double amount,
        String currency,
        String razorpayKey,
        String courseName,
        Long courseId
    ) {}

    public record PaymentVerifyRequest(
        String razorpayPaymentId,
        String razorpayOrderId,
        String razorpaySignature,
        Long courseId,
        String studentName,
        String studentEmail,
        String phone,
        String message
    ) {}
}
