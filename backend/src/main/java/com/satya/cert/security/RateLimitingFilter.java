package com.satya.cert.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.satya.cert.ratelimit.RateLimitingService;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.ConsumptionProbe;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Component
public class RateLimitingFilter extends OncePerRequestFilter {

    private final RateLimitingService rateLimitingService;
    private final ObjectMapper objectMapper;

    public RateLimitingFilter(RateLimitingService rateLimitingService, ObjectMapper objectMapper) {
        this.rateLimitingService = rateLimitingService;
        this.objectMapper = objectMapper;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String uri = request.getRequestURI();

        // Skip static resources or anything outside /api
        if (!uri.startsWith("/api/")) {
            filterChain.doFilter(request, response);
            return;
        }

        String apiType = determineApiType(uri);
        String identifier = determineIdentifier(request);

        Bucket bucket = rateLimitingService.resolveBucket(identifier, apiType);
        ConsumptionProbe probe = bucket.tryConsumeAndReturnRemaining(1);

        if (probe.isConsumed()) {
            // Set X-Rate-Limit-Remaining header
            response.setHeader("X-Rate-Limit-Remaining", String.valueOf(probe.getRemainingTokens()));
            filterChain.doFilter(request, response);
        } else {
            // Rate limit exceeded
            long waitForRefill = probe.getNanosToWaitForRefill();
            long retryAfterSeconds = TimeUnit.NANOSECONDS.toSeconds(waitForRefill) + 1; // Round up

            response.setHeader("X-Rate-Limit-Retry-After-Seconds", String.valueOf(retryAfterSeconds));
            response.setHeader("Retry-After", String.valueOf(retryAfterSeconds));
            response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value());
            response.setContentType("application/json");

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("status", 429);
            errorResponse.put("message", "Too many requests. Please try again later.");
            
            // System.out.println("Rate limit exceeded for identifier: " + identifier + " on API: " + apiType);

            objectMapper.writeValue(response.getWriter(), errorResponse);
        }
    }

    private String determineApiType(String uri) {
        if (uri.startsWith("/api/auth/login")) return "LOGIN";
        if (uri.startsWith("/api/auth/register") || uri.startsWith("/api/auth/signup")) return "SIGNUP";
        if (uri.startsWith("/api/auth/forgot-password")) return "FORGOT_PASSWORD";
        if (uri.startsWith("/api/chat")) return "CHAT";
        if (uri.startsWith("/api/courses") || uri.startsWith("/api/public/courses")) return "COURSES";
        if (uri.startsWith("/api/student/certificates")) return "CERTIFICATES";
        if (uri.startsWith("/api/payment")) return "PAYMENT";
        return "GENERAL";
    }

    private String determineIdentifier(HttpServletRequest request) {
        // Try to get authenticated user (via JWT or Session)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !authentication.getName().equals("anonymousUser")) {
            return authentication.getName(); // Usually email or user ID
        }

        // Fallback to IP address for unauthenticated requests
        String clientIp = request.getHeader("X-Forwarded-For");
        if (clientIp == null || clientIp.isEmpty() || "unknown".equalsIgnoreCase(clientIp)) {
            clientIp = request.getRemoteAddr();
        } else {
            // X-Forwarded-For can contain multiple IPs, get the first one
            clientIp = clientIp.split(",")[0].trim();
        }
        return clientIp;
    }
}
