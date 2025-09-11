package com.inventaro.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class UpdateArticleRequest {

    @NotBlank(message = "name must not be empty")
    private String name;

    @NotBlank(message = "unit must not be empty")
    private String unit;

    @NotNull(message = "lowStockThreshold is required")
    @Min(value = 0, message = "lowStockThreshold must be ≥ 0")
    private Integer lowStockThreshold;

    // NOTE:
    // Using Integer + @NotNull ensures we catch missing fields.
    // The @Min annotation prevents negative stock values.
}
