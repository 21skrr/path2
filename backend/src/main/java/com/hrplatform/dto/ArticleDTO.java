package com.hrplatform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArticleDTO {
    private Long id;
    private String title;
    private String content;
    private String category;
    private String imageUrl;
    private Boolean isPremium;
    private String publishedAt;
}
