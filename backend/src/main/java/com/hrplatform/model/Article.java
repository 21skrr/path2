package com.hrplatform.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "articles")
@NoArgsConstructor
@AllArgsConstructor
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 500)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ArticleCategory category;

    @Column(name = "image_url", length = 500)
    private String imageUrl;

    @Column(name = "is_premium", nullable = false)
    private Boolean isPremium = false;

    @Column(name = "published_at")
    private LocalDateTime publishedAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "placement")
    private ArticlePlacement placement = ArticlePlacement.STANDARD;

    @Column(name = "sub_category")
    private String subCategory;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public ArticleCategory getCategory() { return category; }
    public void setCategory(ArticleCategory category) { this.category = category; }

    public String getSubCategory() { return subCategory; }
    public void setSubCategory(String subCategory) { this.subCategory = subCategory; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsPremium() { return isPremium; }
    public void setIsPremium(Boolean isPremium) { this.isPremium = isPremium; }

    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public ArticlePlacement getPlacement() { return placement; }
    public void setPlacement(ArticlePlacement placement) { this.placement = placement; }

    public enum ArticleCategory {
        ACTUALITE, INTERVIEW, ETUDE, NOMINATION, ANNUAIRE, OFFRE_EMPLOI, TEXTE_LOI, ARTICLE
    }

    public enum ArticlePlacement {
        SLIDER, FEATURED_MAIN, FEATURED_SECONDARY, TRENDING, STANDARD
    }
}
