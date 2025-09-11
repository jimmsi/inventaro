package com.inventaro.backend.service;

import com.inventaro.backend.dto.CreateArticleRequest;
import com.inventaro.backend.model.Article;
import com.inventaro.backend.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {

    private final ArticleRepository articleRepository;

    @Override
    public Article createArticle(CreateArticleRequest request) {
        Article article = new Article();
        article.setName(request.getName().trim());
        article.setQuantity(request.getQuantity());
        article.setUnit(request.getUnit().trim());
        article.setLowStockThreshold(request.getLowStockThreshold());
        return articleRepository.save(article);
    }
}
