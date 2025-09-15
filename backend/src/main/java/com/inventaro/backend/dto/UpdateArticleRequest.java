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

    /*
     * NOTE:
     * This request updates the article's essential attributes:
     * - name
     * - unit
     * - lowStockThreshold
     *
     * The quantity (current stock level) is considered a temporary/variable attribute
     * and must be updated separately via UpdateQuantityRequest (PATCH).
     */

}
