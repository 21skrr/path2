package com.hrplatform.service;

import com.hrplatform.model.Article;
import com.hrplatform.repository.ArticleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ArticleService {
    private final ArticleRepository articleRepository;

    @Autowired
    public ArticleService(ArticleRepository articleRepository) {
        this.articleRepository = articleRepository;
    }

    public List<Article> getAllArticles(boolean premium) {
        return articleRepository.findAccessibleArticles(premium);
    }

    public List<Article> getArticlesByCategory(Article.ArticleCategory category) {
        return articleRepository.findByCategory(category);
    }

    public Article getArticleById(Long id) {
        return articleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Article not found"));
    }

    @Transactional
    public Article createArticle(Article article) {
        return articleRepository.save(article);
    }

    @Transactional
    public Article updateArticle(Long id, Article updated) {
        Article article = getArticleById(id);
        article.setTitle(updated.getTitle());
        article.setContent(updated.getContent());
        article.setCategory(updated.getCategory());
        article.setImageUrl(updated.getImageUrl());
        article.setIsPremium(updated.getIsPremium());
        article.setPublishedAt(updated.getPublishedAt());
        article.setPlacement(updated.getPlacement());
        article.setSubCategory(updated.getSubCategory());
        return articleRepository.save(article);
    }

    @Transactional
    public void deleteArticle(Long id) {
        articleRepository.deleteById(id);
    }
}
