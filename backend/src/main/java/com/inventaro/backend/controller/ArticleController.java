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
import java.util.List;
import java.util.UUID;

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

    @GetMapping
    public ResponseEntity<List<Article>> getAll() {
        return ResponseEntity.ok(articleService.getAllArticles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getById(@PathVariable UUID id) {
        Article article = articleService.getArticleById(id);
        return ResponseEntity.ok(article);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        articleService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }

    // Handles validation errors for endpoints that use @Valid request bodies.
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

    // Handles "not found" cases for all endpoints when an article with the given ID does not exist.
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleNotFound(IllegalArgumentException ex) {
        return ResponseEntity.status(404).body(ex.getMessage());
    }

}
