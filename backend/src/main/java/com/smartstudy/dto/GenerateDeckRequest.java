package com.smartstudy.dto;

import jakarta.validation.constraints.NotBlank;

public record GenerateDeckRequest(
        @NotBlank String title,
        String topic,
        @NotBlank String notes
) {}
