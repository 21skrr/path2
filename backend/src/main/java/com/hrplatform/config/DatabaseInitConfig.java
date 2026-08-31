package com.hrplatform.config;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

@Configuration
public class DatabaseInitConfig {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @PostConstruct
    public void initDatabase() {
        try {
            jdbcTemplate.execute("ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'ACTUALITE'");
            jdbcTemplate.execute("ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'INTERVIEW'");
            jdbcTemplate.execute("ALTER TYPE article_category ADD VALUE IF NOT EXISTS 'ETUDE'");
            jdbcTemplate.execute("UPDATE articles SET category = 'ACTUALITE' WHERE category = 'NEWS'");
            jdbcTemplate.execute("UPDATE articles SET category = 'ETUDE' WHERE category = 'ARTICLE'");
            System.out.println("Database enums updated successfully.");
        } catch (Exception e) {
            System.out.println("Database enums update skipped or failed: " + e.getMessage());
        }
    }
}
