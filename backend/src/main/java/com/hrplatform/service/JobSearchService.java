/** @author SERRAFI */
package com.hrplatform.service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;

/**
 * Service that dynamically queries the RapidAPI LinkedIn Job Search endpoint
 * based on user-provided filters (location, hasSalary, timeFrame).
 *
 * The RapidAPI URL is constructed at runtime using {@link UriComponentsBuilder}
 * so no string concatenation is used and all parameters are properly encoded.
 *
 * @author SERRAFI
 */
@Service
public class JobSearchService {

    private static final Logger log = LoggerFactory.getLogger(JobSearchService.class);

    private final ObjectMapper apiParser = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    private final RestTemplate restTemplate;

    @Value("${rapidapi.jobs.key}")
    private String apiKey;

    @Value("${rapidapi.jobs.host}")
    private String apiHost;

    // Base URL of the search endpoint (without query params)
    private static final String SEARCH_BASE_URL =
            "https://linkedin-job-search-api.p.rapidapi.com/active-jb";

    public JobSearchService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Dynamically builds the RapidAPI request URL from the given filters,
     * calls the API, and returns a simplified list of job objects.
     *
     * @param location  job location to filter by (e.g. "Morocco"). Defaults to "Morocco" if blank.
     * @param hasSalary if true, only jobs with salary information are returned
     * @param timeFrame posting recency filter: "24h", "1w", "1m", "6m" (default: "1m")
     * @param offset    pagination offset — skip this many records (default: 0)
     * @param limit     max results per page — capped at 100 by the API (default: 100)
     * @return parsed list of job DTOs, or empty list on error
     */
    public List<JobDTO> search(String location, boolean hasSalary, String timeFrame, int offset, int limit) {

        // ── 1. Normalise defaults ─────────────────────────────────────────────
        if (location == null || location.isBlank()) location = "Morocco";
        if (timeFrame == null || timeFrame.isBlank()) timeFrame = "1m";

        // ── 2. Build URL with UriComponentsBuilder ────────────────────────────
        if (limit <= 0 || limit > 100) limit = 100;  // API hard cap
        if (offset < 0) offset = 0;

        String url = UriComponentsBuilder
                .fromHttpUrl(SEARCH_BASE_URL)
                .queryParam("description_format", "text")
                .queryParam("location", location)
                .queryParam("has_salary", hasSalary)
                .queryParam("time_frame", timeFrame)
                .queryParam("offset", offset)
                .queryParam("limit", limit)
                .build()
                .toUriString();

        log.info("[JobSearchService] Searching: {}", url);

        // ── 3. Call API ───────────────────────────────────────────────────────
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-rapidapi-key",  apiKey);
        headers.set("x-rapidapi-host", apiHost);
        HttpEntity<Void> entity = new HttpEntity<>(headers);

        try {
            ResponseEntity<String> response =
                    restTemplate.exchange(url, HttpMethod.GET, entity, String.class);

            if (response.getBody() == null) {
                log.warn("[JobSearchService] Empty response.");
                return List.of();
            }

            // ── 4. Parse and map to DTOs ──────────────────────────────────────
            JsonNode root = apiParser.readTree(response.getBody());
            JsonNode jobsArray = root.isArray() ? root : root.path("data");

            if (!jobsArray.isArray()) {
                log.warn("[JobSearchService] Unexpected structure: {}", root.getNodeType());
                return List.of();
            }

            List<JobDTO> results = new ArrayList<>();
            for (JsonNode node : jobsArray) {
                String id         = node.path("id").asText("");
                String title      = node.path("title").asText("N/A");
                String company    = node.path("organization").asText("N/A");
                String applyUrl   = node.path("url").asText(null);
                String sourceType = node.path("source_type").asText("API_RAPID");
                String salary     = node.path("salary_raw").asText(null);

                // First location from array
                String loc = null;
                JsonNode locNode = node.path("locations_derived");
                if (locNode.isArray() && locNode.size() > 0) {
                    loc = locNode.get(0).asText(null);
                }

                // Date posted
                String datePosted = node.path("date_posted").asText(null);

                results.add(new JobDTO(id, title, company, loc, applyUrl, sourceType, salary, datePosted));
            }

            log.info("[JobSearchService] Returning {} results.", results.size());
            return results;

        } catch (Exception ex) {
            log.error("[JobSearchService] Error: {}", ex.getMessage(), ex);
            return List.of();
        }
    }

    // ── DTO ───────────────────────────────────────────────────────────────────

    /**
     * Lightweight read-only DTO representing a job returned by the search API.
     *
     * @author SERRAFI
     */
    public record JobDTO(
            String id,
            String title,
            String company,
            String location,
            String applyUrl,
            String sourceType,
            String salary,
            String datePosted
    ) {}
}