package com.smartstudy.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public record ScoreRequest(
        @NotNull @Min(0) Integer score,
        @NotNull @Min(1) Integer total
) {}
