package com.inventaro.backend.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.*;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
public class CreateArticleRequest {

    @NotBlank(message = "name must not be empty")
    private String name;

    // NOTE:
    // Using Integer (instead of primitive int) here allows validation to catch missing fields
    // as null values. With int, a missing field would default to 0 and might incorrectly pass
    // @Min(0). This way we ensure proper 400 responses when required fields are absent.
    @NotNull(message = "quantity is required")
    @Min(value = 0, message = "quantity must be ≥ 0")
    private Integer quantity;

    @NotBlank(message = "unit must not be empty")
    private String unit;

    // Same reasoning as for quantity: Integer + @NotNull ensures that
    // the field cannot be omitted in the request body without triggering a validation error.
    @NotNull(message = "lowStockThreshold is required")
    @Min(value = 0, message = "lowStockThreshold must be ≥ 0")
    private Integer lowStockThreshold;
}
