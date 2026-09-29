/** @author SERRAFI */
package com.hrplatform.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

/**
 * Central application configuration.
 * - Enables scheduling support for @Scheduled methods
 * - Registers a shared RestTemplate for outbound HTTP calls
 *
 * NOTE: ObjectMapper is intentionally NOT redefined here.
 *       Spring Boot auto-configures one with JavaTimeModule + proper settings.
 *       Redefining it would break LocalDateTime serialization on all endpoints.
 *
 * NOTE: CORS is handled by CorsConfig.java
 *
 * @author SERRAFI
 */
@Configuration
@EnableScheduling
public class AppConfig {

    /**
     * Shared RestTemplate for outbound HTTP calls (e.g. RapidAPI fetch).
     */
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}