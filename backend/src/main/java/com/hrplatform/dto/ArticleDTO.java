package com.hrplatform.dto;

public class ArticleDTO {
    private Long id;
    private String title;
    private String content;
    private String category;
    private String imageUrl;
    private Boolean isPremium;
    private String publishedAt;
    private String placement;
    private String subCategory;

    public ArticleDTO() {}

    public ArticleDTO(Long id, String title, String content, String category,
                      String imageUrl, Boolean isPremium, String publishedAt, String placement, String subCategory) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.category = category;
        this.imageUrl = imageUrl;
        this.isPremium = isPremium;
        this.publishedAt = publishedAt;
        this.placement = placement;
        this.subCategory = subCategory;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getSubCategory() { return subCategory; }
    public void setSubCategory(String subCategory) { this.subCategory = subCategory; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public Boolean getIsPremium() { return isPremium; }
    public void setIsPremium(Boolean isPremium) { this.isPremium = isPremium; }

    public String getPublishedAt() { return publishedAt; }
    public void setPublishedAt(String publishedAt) { this.publishedAt = publishedAt; }

    public String getPlacement() { return placement; }
    public void setPlacement(String placement) { this.placement = placement; }
}
