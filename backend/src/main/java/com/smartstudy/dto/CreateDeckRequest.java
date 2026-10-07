package com.smartstudy.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public record CreateDeckRequest(
        @NotBlank String title,
        String topic,
        String sourceNotes,
        List<ManualCardRequest> cards
) {}
