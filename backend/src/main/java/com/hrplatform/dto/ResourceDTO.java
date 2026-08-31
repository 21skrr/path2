package com.hrplatform.dto;

public class ResourceDTO {
    private Long id;
    private String title;
    private String fileUrl;
    private String category;
    private Boolean isPremium;

    public ResourceDTO() {}

    public ResourceDTO(Long id, String title, String fileUrl, String category, Boolean isPremium) {
        this.id = id;
        this.title = title;
        this.fileUrl = fileUrl;
        this.category = category;
        this.isPremium = isPremium;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getFileUrl() { return fileUrl; }
    public void setFileUrl(String fileUrl) { this.fileUrl = fileUrl; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public Boolean getIsPremium() { return isPremium; }
    public void setIsPremium(Boolean isPremium) { this.isPremium = isPremium; }
}
