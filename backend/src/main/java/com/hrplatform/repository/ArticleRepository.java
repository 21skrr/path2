package com.hrplatform.repository;

import com.hrplatform.model.Article;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArticleRepository extends JpaRepository<Article, Long> {
    List<Article> findByCategory(Article.ArticleCategory category);
    
    @Query("SELECT a FROM Article a WHERE a.isPremium = false OR ?1 = true ORDER BY a.publishedAt DESC")
    List<Article> findAccessibleArticles(boolean isPremium);
}
