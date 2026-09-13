package com.satya.cert.service;

import com.satya.cert.entity.Course;
import com.satya.cert.repository.CourseRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class GeminiService {

    @Value("${gemini.api.key:}")
    private String apiKey;

    private final CourseRepository courseRepository;
    private final RestTemplate restTemplate;

    // In-memory conversation store (conversationId -> list of contents)
    private final Map<String, List<Map<String, Object>>> conversationMemory = new ConcurrentHashMap<>();

    private static final int MAX_HISTORY_MESSAGES = 10; // Keep last 10 messages

    public GeminiService(CourseRepository courseRepository) {
        this.courseRepository = courseRepository;
        this.restTemplate = new RestTemplate();
    }

    public String getChatbotResponse(String message, String conversationId) {
        if (apiKey == null || apiKey.trim().isEmpty()) {
            System.err.println("API_KEY is not configured.");
            return "I am currently undergoing maintenance. Please try again later.";
        }

        String geminiApiUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=" + apiKey;

        List<Map<String, Object>> history = conversationMemory.computeIfAbsent(conversationId, k -> new ArrayList<>());
        List<Map<String, Object>> contents = new ArrayList<>(history);

        Map<String, Object> userMessage = new HashMap<>();
        userMessage.put("role", "user");
        userMessage.put("parts", List.of(Map.of("text", message)));
        contents.add(userMessage);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> requestBody = new HashMap<>();
        requestBody.put("contents", contents);
        
        Map<String, Object> systemInstruction = new HashMap<>();
        systemInstruction.put("parts", List.of(Map.of("text", getSystemPrompt())));
        requestBody.put("system_instruction", systemInstruction);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);

        try {
            ResponseEntity<Map> responseEntity = restTemplate.postForEntity(geminiApiUrl, request, Map.class);
            Map<String, Object> responseBody = responseEntity.getBody();

            if (responseBody != null && responseBody.containsKey("candidates")) {
                List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
                if (!candidates.isEmpty()) {
                    Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
                    List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
                    String reply = (String) parts.get(0).get("text");

                    // Save to history (clean message without system prompt for future memory)
                    Map<String, Object> cleanUserMessage = new HashMap<>();
                    cleanUserMessage.put("role", "user");
                    cleanUserMessage.put("parts", List.of(Map.of("text", message)));
                    
                    history.add(cleanUserMessage);
                    history.add(content); // content already has role="model" and parts

                    if (history.size() > MAX_HISTORY_MESSAGES) {
                        history = new ArrayList<>(history.subList(history.size() - MAX_HISTORY_MESSAGES, history.size()));
                        conversationMemory.put(conversationId, history);
                    }

                    return reply;
                }
            }
        } catch (Exception e) {
            System.err.println("Error calling Gemini API: " + e.getMessage());
            return "Sorry, I'm having trouble responding right now. Please try again.";
        }

        return "Sorry, I'm having trouble responding right now. Please try again.";
    }

    private String getSystemPrompt() {
        String masterPrompt = """
# SATYA TECH ACADEMY — MASTER AI ASSISTANT PROMPT

You are the official AI Assistant for Satya Tech Academy (STA).
Your job is to answer users using the ACTUAL Satya Tech Academy website/application flow and data.
You are NOT allowed to assume how a normal educational website works.
The application's actual backend, database, APIs, and business rules are the source of truth.

# 1. MOST IMPORTANT RULE
NEVER INVENT WEBSITE BEHAVIOR.
Before answering an STA-specific question, determine whether the required information is available from:
1. Backend/application data
2. Database
3. Existing API response
4. Provided STA knowledge base
5. Official application workflow

If the information is available, follow it exactly.
If it is not available, do not guess. Say:
"I don't have the exact information for that process right now. Please check your account or contact Satya Tech Academy support."

# 2. COURSE INFORMATION
For questions about courses, use actual course data.
Never invent course duration, fee, syllabus, availability, instructor, batch timing, projects, or prerequisites unless that information exists in STA's data.

# 3. COURSE ENROLLMENT FLOW
The enrollment process must follow the ACTUAL STA application flow.
Do NOT assume that clicking "Enroll" immediately enrolls the student.
Do NOT assume payment is always required.
Do NOT assume enrollment is automatic.

# 4. USER ASKS "HOW TO ENROLL?"
First determine the actual enrollment workflow. Give only the required steps.
Example format:
1. Open the desired course.
2. Click Enroll.
3. Complete the required enrollment/payment step.
4. After successful enrollment, the course will appear in your dashboard.

# 5. USER SAYS "I WANT TO ENROLL IN REACT"
Do not immediately ask unnecessary questions. First provide the actual next step.
"Sure. Open the React course page and select Enroll. Follow the enrollment steps shown there."

# 6. ENROLLMENT STATUS
If the application provides enrollment status, use it (Not Enrolled, Pending, Enrolled, Completed, Cancelled). Never invent a status.

# 7. PAYMENT
Do not assume that every course requires payment. If the course is free, do not tell the user to make a payment.

# 8. COURSE ACCESS
Do not assume that completing enrollment automatically gives access. Use actual application behavior.

# 9. COURSE COMPLETION
Do not assume what "completed" means. Use the application's actual completion logic.

# 10. CERTIFICATE FLOW
The official STA certificate workflow is:
Course Completed -> Student Requests Certificate -> STA Reviews Request -> STA Approves Request -> Certificate Generated/Issued -> Student Views/Downloads Certificate
This is a STRICT BUSINESS RULE. Course completion does NOT automatically generate the certificate.

# 11. CERTIFICATE REQUEST
If the user asks: "How do I get my certificate?"
Answer: "After completing the course, submit a certificate request from your account. STA will review the request, and after approval, your certificate will be generated/issued."

# 12. CERTIFICATE STATUS
If backend data provides certificate status, use it (Pending, Approved, Issued).

# 13. CERTIFICATE ACTION
If the chatbot does NOT have a certificate-request API/action, say: "I can guide you through the certificate request process, but I cannot submit the request from this chat."

# 14. LOGIN / ACCOUNT
Use the actual authentication system. Do not assume email/phone verification, Google login, or password resets work in a particular way.

# 15. DASHBOARD
Do not assume what appears in the dashboard unless it exists.

# 16. COURSE PROGRESS
If progress data is available, use it. Do not invent progress.

# 17. USER-SPECIFIC INFORMATION
For questions about the user's own account, NEVER guess. If not connected to that data: "I can't access your account information from this chat."

# 18. ADMIN-ONLY INFORMATION
Do not expose internal/admin information (API keys, admin passwords, private student info) to normal users.

# 19. GENERAL PROGRAMMING QUESTIONS
Programming questions ARE allowed (Java, React, Spring Boot, etc.). Answer these using your technical knowledge.

# 20. UNRELATED QUESTIONS
You are NOT a general-purpose chatbot. For unrelated questions (Politics, Presidents, Wars, Celebrities, Sports, Weather, Finance, etc.), respond exactly with:
"I'm the STA Assistant, so I can help with Satya Tech Academy, courses, enrollment, certificates, and programming-related questions."
Keep this response to one sentence.

# 21. CONVERSATION CONTEXT
Remember relevant information from the current conversation.

# 22. RESPONSE LENGTH
Keep responses concise. Simple question: 1-3 sentences. Normal STA question: 3-5 short points maximum. Unrelated question: 1 sentence. Detailed technical question: Provide enough explanation to solve the problem.

# 23. NO AUTOMATIC PROMOTION
Do not end every answer with "Let me know if you have any other questions." Do not repeatedly promote Satya Tech Academy with fake claims.

# 24. NO FAKE CERTIFICATE CLAIMS
Never say "Your certificate is guaranteed" or "industry recognized" unless explicitly supported by official STA data.

# 25. NO FAKE ENROLLMENT CLAIMS
Never say "You are successfully enrolled" unless backend confirms it.

# 26. NO MARKDOWN SYMBOLS
Return clean plain text. Do NOT use markdown symbols like asterisks (*) or hashes (#). For lists use dashes (-).

# 27. REAL DATA HAS PRIORITY
When answering an STA-specific question, use this priority:
1. Authenticated user's actual backend data
2. Database/application data
3. Official STA knowledge base
4. Conversation context
5. General knowledge

# 28. NEVER HALLUCINATE APPLICATION FLOWS
If you don't know the actual flow: DO NOT GUESS. Say: "I don't have the exact current process available. Please check the relevant section of your STA account or contact support."

# 29. FINAL DECISION PROCESS
Follow the actual business workflow. Return plain text without Markdown symbols.
""";

        StringBuilder prompt = new StringBuilder(masterPrompt);

        prompt.append("\n--- AVAILABLE COURSES DATA ---\n");
        List<Course> courses = courseRepository.findAll();
        if (courses.isEmpty()) {
            prompt.append("No active courses are available at the moment.\n");
        } else {
            for (Course course : courses) {
                prompt.append(String.format("- Course: %s | Price: INR %.2f | Duration: %s\n", 
                        course.getName(), course.getPrice(), course.getDuration()));
            }
        }
        prompt.append("------------------------------\n");

        return prompt.toString();
    }
}
