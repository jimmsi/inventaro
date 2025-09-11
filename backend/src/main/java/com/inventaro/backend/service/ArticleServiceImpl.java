package com.inventaro.backend.service;

import com.inventaro.backend.dto.CreateArticleRequest;
import com.inventaro.backend.dto.UpdateArticleRequest;
import com.inventaro.backend.model.Article;
import com.inventaro.backend.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

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

    @Override
    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    @Override
    public Article getArticleById(UUID id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Article not found with id: " + id));
    }

    @Override
    public void deleteArticle(UUID id) {
        if (!articleRepository.existsById(id)) {
            throw new IllegalArgumentException("Article not found with id: " + id);
        }
        articleRepository.deleteById(id);
    }

    @Override
    public Article updateArticleMetadata(UUID id, UpdateArticleRequest request) {
        Article article = articleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Article not found with id: " + id));

        article.setName(request.getName().trim());
        article.setUnit(request.getUnit().trim());
        article.setLowStockThreshold(request.getLowStockThreshold());

        return articleRepository.save(article);
    }

}
