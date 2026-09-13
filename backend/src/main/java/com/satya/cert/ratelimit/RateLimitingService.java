package com.satya.cert.ratelimit;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.BucketConfiguration;
import io.github.bucket4j.distributed.ExpirationAfterWriteStrategy;
import io.github.bucket4j.distributed.proxy.ProxyManager;
import io.github.bucket4j.redis.lettuce.cas.LettuceBasedProxyManager;
import io.lettuce.core.RedisClient;
import io.lettuce.core.RedisURI;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.time.Duration;

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
    
    @Value("${spring.data.redis.host:localhost}")
    private String redisHost;

    @Value("${spring.data.redis.port:6379}")
    private int redisPort;

    @Value("${spring.data.redis.password:}")
    private String redisPassword;

    private ProxyManager<byte[]> proxyManager;

    @PostConstruct
    public void init() {
        RedisURI.Builder uriBuilder = RedisURI.builder()
                .withHost(redisHost)
                .withPort(redisPort);
        
        if (redisPassword != null && !redisPassword.isEmpty()) {
            uriBuilder.withPassword(redisPassword.toCharArray());
        }
        
        RedisClient redisClient = RedisClient.create(uriBuilder.build());
        
        this.proxyManager = LettuceBasedProxyManager.builderFor(redisClient)
                .withExpirationStrategy(ExpirationAfterWriteStrategy.basedOnTimeForRefillingBucketUpToMax(Duration.ofSeconds(10)))
                .build();
    }

    public Bucket resolveBucket(String identifier, String apiType) {
        String cacheKey = identifier + ":" + apiType;
        BucketConfiguration configuration = createBucketConfiguration(apiType);
        return proxyManager.builder().build(cacheKey.getBytes(StandardCharsets.UTF_8), configuration);
    }

    private BucketConfiguration createBucketConfiguration(String apiType) {
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

        return BucketConfiguration.builder()
                .addLimit(limitRule)
                .build();
    }
}

