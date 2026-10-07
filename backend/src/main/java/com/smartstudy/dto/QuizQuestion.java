package com.smartstudy.dto;

import java.util.List;

public record QuizQuestion(
        Long cardId,
        String question,
        String correctAnswer,
        List<String> options
) {}
