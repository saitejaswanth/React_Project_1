package com.smartstudy.service;

import org.springframework.stereotype.Service;

import java.util.*;
import java.util.regex.Pattern;

@Service
public class SmartGeneratorService {

    private static final Pattern SENTENCE_SPLIT =
            Pattern.compile("(?<=[.!?])\\s+|\\n+");

    public List<CardDraft> generate(String topic, String notes) {
        String cleaned = notes == null ? "" : notes.trim();
        List<String> sentences = Arrays.stream(SENTENCE_SPLIT.split(cleaned))
                .map(String::trim)
                .filter(s -> s.length() > 20)
                .limit(12)
                .toList();

        List<CardDraft> result = new ArrayList<>();

        for (int i = 0; i < sentences.size(); i++) {
            String sentence = sentences.get(i);
            String answer = sentence.replaceAll("\\s+", " ").trim();

            String question = buildQuestion(topic, answer, i + 1);
            result.add(new CardDraft(question, answer));
        }

        if (result.isEmpty()) {
            result.add(new CardDraft(
                    "What is the main idea of these notes?",
                    cleaned.isBlank() ? "Add notes to generate a useful answer." : cleaned
            ));
        }

        return result;
    }

    private String buildQuestion(String topic, String sentence, int index) {
        String lower = sentence.toLowerCase(Locale.ROOT);

        if (lower.contains(" is ")) {
            int pos = lower.indexOf(" is ");
            String subject = sentence.substring(0, pos).trim();
            if (!subject.isBlank() && subject.length() < 80) {
                return "What is " + subject + "?";
            }
        }

        if (lower.contains(" are ")) {
            int pos = lower.indexOf(" are ");
            String subject = sentence.substring(0, pos).trim();
            if (!subject.isBlank() && subject.length() < 80) {
                return "What are " + subject + "?";
            }
        }

        if (lower.contains(" means ")) {
            int pos = lower.indexOf(" means ");
            String subject = sentence.substring(0, pos).trim();
            return "What does " + subject + " mean?";
        }

        String topicText = topic == null || topic.isBlank() ? "this topic" : topic;
        return "What should you remember about " + topicText + " — point " + index + "?";
    }

    public record CardDraft(String question, String answer) {}
}
