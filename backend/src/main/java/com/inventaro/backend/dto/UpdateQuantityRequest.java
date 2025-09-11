package com.inventaro.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class UpdateQuantityRequest {

    @NotNull(message = "quantity is required")
    @Min(value = 0, message = "quantity must be ≥ 0")
    private Integer quantity;

    // NOTE:
    // Using Integer + @NotNull ensures we catch missing fields.
    // The @Min annotation prevents negative stock values.
}
