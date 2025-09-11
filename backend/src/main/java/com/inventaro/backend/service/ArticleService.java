package com.inventaro.backend.service;

import com.inventaro.backend.dto.CreateArticleRequest;
import com.inventaro.backend.model.Article;

public interface ArticleService {
    Article createArticle(CreateArticleRequest request);
}
