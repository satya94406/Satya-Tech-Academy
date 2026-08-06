package com.satya.cert.config;

import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RazorpayConfig {

    @Value("${RAZORPAY_KEY_ID:}")
    private String keyId;

    @Value("${RAZORPAY_KEY_SECRET:}")
    private String keySecret;

    @Bean
    public RazorpayClient razorpayClient() throws RazorpayException {
        if (keyId.isEmpty() || keySecret.isEmpty()) {
            // Optional: you can log a warning if keys are missing in lower environments
            // But if it's required for the app to function, let it throw or initialize with dummy values for now
        }
        return new RazorpayClient(keyId, keySecret);
    }
}
