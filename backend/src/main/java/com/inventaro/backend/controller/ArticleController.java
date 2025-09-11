package com.inventaro.backend.controller;

import com.inventaro.backend.dto.CreateArticleRequest;
import com.inventaro.backend.model.Article;
import com.inventaro.backend.service.ArticleService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
@RequiredArgsConstructor
@RequestMapping("/articles")
public class ArticleController {

    private final ArticleService articleService;

    @PostMapping
    public ResponseEntity<Article> create(@Valid @RequestBody CreateArticleRequest request) {
        Article created = articleService.createArticle(request);

        return ResponseEntity
                .created(URI.create("/articles/" + created.getId()))
                .body(created);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<String> handleValidationError(MethodArgumentNotValidException ex) {
        // NOTE:
        // I only return the first validation error here to keep error handling simple.
        // This is sufficient for a demo project, but in a larger application I would typically
        // aggregate all validation errors into a list and return them together in the response.
        String errorMessage = ex.getBindingResult()
                .getAllErrors()
                .get(0)
                .getDefaultMessage();
        return ResponseEntity.badRequest().body(errorMessage);
    }
}
