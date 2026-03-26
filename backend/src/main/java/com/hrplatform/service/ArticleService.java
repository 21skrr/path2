package com.hrplatform.service;

import com.hrplatform.model.Article;
import com.hrplatform.repository.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ArticleService {
    private final ArticleRepository articleRepository;

    public List<Article> getAllArticles(boolean isPremium) {
        return articleRepository.findAccessibleArticles(isPremium);
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
        return articleRepository.save(article);
    }

    @Transactional
    public void deleteArticle(Long id) {
        articleRepository.deleteById(id);
    }
}
