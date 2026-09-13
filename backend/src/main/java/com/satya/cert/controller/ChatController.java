package com.satya.cert.controller;

import com.satya.cert.dto.ChatRequest;
import com.satya.cert.dto.ChatResponse;
import com.satya.cert.service.GeminiService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = {"http://localhost:5173", "https://satyaacademy.tech", "https://www.satyaacademy.tech", "https://satya-tech-academy.vercel.app", "https://satya-academy-frontend.onrender.com"}) // Allow frontend domains
public class ChatController {

    private final GeminiService geminiService;

    public ChatController(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    @PostMapping
    public ResponseEntity<ChatResponse> chat(@RequestBody ChatRequest request) {
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            return ResponseEntity.badRequest().body(new ChatResponse("Message cannot be empty", request.getConversationId()));
        }
        
        String conversationId = request.getConversationId();
        if (conversationId == null || conversationId.trim().isEmpty()) {
            conversationId = java.util.UUID.randomUUID().toString();
        }

        String reply = geminiService.getChatbotResponse(request.getMessage(), conversationId);
        
        return ResponseEntity.ok(new ChatResponse(reply, conversationId));
    }
}
