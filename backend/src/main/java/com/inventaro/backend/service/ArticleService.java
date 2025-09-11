package com.inventaro.backend.service;

import com.inventaro.backend.dto.CreateArticleRequest;
import com.inventaro.backend.dto.UpdateArticleRequest;
import com.inventaro.backend.model.Article;

import java.util.List;
import java.util.UUID;

public interface ArticleService {
    Article createArticle(CreateArticleRequest request);
    List<Article> getAllArticles();
    Article getArticleById(UUID id);
    void deleteArticle(UUID id);
    Article updateArticleMetadata(UUID id, UpdateArticleRequest request);
}
