package com.satya.cert.controller;

import com.satya.cert.dto.PaymentDtos.PaymentOrderRequest;
import com.satya.cert.dto.PaymentDtos.PaymentOrderResponse;
import com.satya.cert.dto.PaymentDtos.PaymentVerifyRequest;
import com.satya.cert.entity.AppUser;
import com.satya.cert.service.CurrentUserService;
import com.satya.cert.service.PaymentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    private final PaymentService paymentService;
    private final CurrentUserService currentUserService;

    public PaymentController(PaymentService paymentService, CurrentUserService currentUserService) {
        this.paymentService = paymentService;
        this.currentUserService = currentUserService;
    }

    @PostMapping("/create-order")
    public ResponseEntity<PaymentOrderResponse> createOrder(@RequestBody PaymentOrderRequest request) {
        try {
            AppUser currentUser = currentUserService.user();
            PaymentOrderResponse response = paymentService.createOrder(request, currentUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentVerifyRequest request) {
        try {
            AppUser currentUser = currentUserService.user();
            boolean isSuccess = paymentService.verifyPayment(request, currentUser);
            if (isSuccess) {
                return ResponseEntity.ok().body("{\"status\": \"SUCCESS\"}");
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("{\"status\": \"FAILED\"}");
            }
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
