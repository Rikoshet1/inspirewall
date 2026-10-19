package com.inspirewall.backend.service;

import com.inspirewall.backend.config.GeminiProperties;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class AiTaggingService {

    private static final Logger log = LoggerFactory.getLogger(AiTaggingService.class);

    private final RestClient restClient;
    private final GeminiProperties props;
    private final ObjectMapper objectMapper;

    public AiTaggingService(GeminiProperties props, RestClient.Builder builder, ObjectMapper objectMapper) {
        this.props = props;
        this.objectMapper = objectMapper;
        log.info("Gemini API key configured: {}", props.apiKey() != null && !props.apiKey().isBlank());
        this.restClient = builder
                .baseUrl("https://generativelanguage.googleapis.com")
                .defaultHeader("x-goog-api-key", props.apiKey())
                .build();
    }

    public List<String> generateTags(String content) {
        String prompt = """
                Generate between 4 and 6 short tags (one or two words each) \
                for the following inspirational text. \
                Write the tags in the same language as the text. \
                Do not use the word "inspiration" or any direct translation of it as a tag. \
                Respond ONLY with a JSON array of strings, nothing else.

                Text: %s
                """.formatted(content);

        Map<String, Object> body = Map.of(
                "contents", List.of(Map.of("parts", List.of(Map.of("text", prompt)))),
                "generationConfig", Map.of("responseMimeType", "application/json")
        );

        try {
            String response = restClient.post()
                    .uri("/v1beta/models/{model}:generateContent", props.model())
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(String.class);
            return parseTags(response);
        } catch (Exception e) {
            String message = e.getMessage();
            if (props.apiKey() != null && !props.apiKey().isEmpty() && message != null) {
                message = message.replace(props.apiKey(), "[REDACTED]");
            }
            log.warn("AI tagging failed: {}", message == null ? e.getClass().getSimpleName() : message);
            return List.of();
        }
    }

    private List<String> parseTags(String response) throws Exception {
        JsonNode root = objectMapper.readTree(response);
        String text = root.path("candidates").path(0)
                .path("content").path("parts").path(0)
                .path("text").asText();
        text = text.replaceAll("```json|```", "").trim();

        List<String> tags = new ArrayList<>();
        for (JsonNode node : objectMapper.readTree(text)) {
            tags.add(node.asText().trim().toLowerCase());
        }
        return tags;
    }
}
