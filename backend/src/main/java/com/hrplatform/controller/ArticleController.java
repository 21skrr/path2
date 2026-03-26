package com.hrplatform.controller;

import com.hrplatform.model.Article;
import com.hrplatform.service.ArticleService;
import com.hrplatform.dto.ArticleDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ArticleController {
    private final ArticleService articleService;

    @GetMapping
    public ResponseEntity<List<ArticleDTO>> getAllArticles(
            @RequestParam(defaultValue = "false") boolean isPremium) {
        List<ArticleDTO> articles = articleService.getAllArticles(isPremium)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ArticleDTO>> getByCategory(@PathVariable String category) {
        Article.ArticleCategory cat = Article.ArticleCategory.valueOf(category.toUpperCase());
        List<ArticleDTO> articles = articleService.getArticlesByCategory(cat)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(articles);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticleDTO> getArticle(@PathVariable Long id) {
        Article article = articleService.getArticleById(id);
        return ResponseEntity.ok(convertToDTO(article));
    }

    @PostMapping
    public ResponseEntity<ArticleDTO> createArticle(@RequestBody Article article) {
        Article created = articleService.createArticle(article);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArticleDTO> updateArticle(@PathVariable Long id, @RequestBody Article article) {
        Article updated = articleService.updateArticle(id, article);
        return ResponseEntity.ok(convertToDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArticle(@PathVariable Long id) {
        articleService.deleteArticle(id);
        return ResponseEntity.noContent().build();
    }

    private ArticleDTO convertToDTO(Article article) {
        return new ArticleDTO(
                article.getId(),
                article.getTitle(),
                article.getContent(),
                article.getCategory().toString(),
                article.getImageUrl(),
                article.getIsPremium(),
                article.getPublishedAt() != null ? article.getPublishedAt().toString() : null
        );
    }
}
