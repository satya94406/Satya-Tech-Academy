package com.satya.cert.ratelimit;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class RateLimitingService {

    @Value("${app.ratelimit.login:5}")
    private int loginLimit;

    @Value("${app.ratelimit.signup:5}")
    private int signupLimit;

    @Value("${app.ratelimit.forgot-password:3}")
    private int forgotPasswordLimit;

    @Value("${app.ratelimit.chat:10}")
    private int chatLimit;

    @Value("${app.ratelimit.courses:60}")
    private int coursesLimit;

    @Value("${app.ratelimit.certificates:20}")
    private int certificatesLimit;

    @Value("${app.ratelimit.payment:10}")
    private int paymentLimit;

    @Value("${app.ratelimit.general:100}")
    private int generalLimit;

    // Cache of buckets: Cache key is "identifier:apiType" (e.g., "192.168.1.1:LOGIN" or "user@gmail.com:CHAT")
    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    public Bucket resolveBucket(String identifier, String apiType) {
        String cacheKey = identifier + ":" + apiType;
        return cache.computeIfAbsent(cacheKey, k -> createNewBucket(apiType));
    }

    private Bucket createNewBucket(String apiType) {
        int limit = switch (apiType) {
            case "LOGIN" -> loginLimit;
            case "SIGNUP" -> signupLimit;
            case "FORGOT_PASSWORD" -> forgotPasswordLimit;
            case "CHAT" -> chatLimit;
            case "COURSES" -> coursesLimit;
            case "CERTIFICATES" -> certificatesLimit;
            case "PAYMENT" -> paymentLimit;
            default -> generalLimit; // "GENERAL"
        };

        // Refill greedily over 10 seconds.
        Bandwidth limitRule = Bandwidth.builder()
                .capacity(limit)
                .refillGreedy(limit, Duration.ofSeconds(10))
                .build();

        return Bucket.builder()
                .addLimit(limitRule)
                .build();
    }
}
