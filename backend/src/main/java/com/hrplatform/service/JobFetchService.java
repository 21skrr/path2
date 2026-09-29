/** @author SERRAFI */
package com.hrplatform.service;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.hrplatform.model.JobListing;
import com.hrplatform.repository.JobListingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

/**
 * Service that fetches job listings from the RapidAPI endpoint every 24 hours,
 * parses the JSON payload, and persists new records while skipping duplicates.
 *
 * Uses a local ObjectMapper (not the Spring-managed bean) to avoid overriding
 * Spring Boot's auto-configured Jackson serializer which handles LocalDateTime.
 *
 * @author SERRAFI
 */
@Service
public class JobFetchService {

    private static final Logger log = LoggerFactory.getLogger(JobFetchService.class);
    private static final String DEFAULT_SOURCE_TYPE = "API_RAPID";

    // Local ObjectMapper used only for parsing API responses — NOT registered as a bean
    // so it does not interfere with Spring Boot's auto-configured serialization.
    private final ObjectMapper apiParser = new ObjectMapper()
            .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

    private final JobListingRepository jobListingRepository;
    private final RestTemplate restTemplate;

    @Value("${rapidapi.jobs.url}")
    private String apiUrl;

    @Value("${rapidapi.jobs.key}")
    private String apiKey;

    @Value("${rapidapi.jobs.host}")
    private String apiHost;

    public JobFetchService(JobListingRepository jobListingRepository,
                           RestTemplate restTemplate) {
        this.jobListingRepository = jobListingRepository;
        this.restTemplate         = restTemplate;
    }

    /**
     * Runs 30 seconds after startup, then every 24 hours.
     */
    @Scheduled(fixedDelay = 86_400_000, initialDelay = 30_000)
    @Transactional
    public void scheduledFetch() {
        log.info("[JobFetchService] Scheduled fetch triggered.");
        fetchAndSaveJobs();
    }

    /**
     * Fetches jobs from the RapidAPI endpoint and saves new ones to the database.
     * Skips any job whose externalId already exists (duplicate prevention).
     */
    @Transactional
    public void fetchAndSaveJobs() {
        log.info("[JobFetchService] Fetching jobs from: {}", apiUrl);
        try {
            // 1. Build request
            HttpHeaders headers = new HttpHeaders();
            headers.set("x-rapidapi-key",  apiKey);
            headers.set("x-rapidapi-host", apiHost);
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            // 2. Call API
            ResponseEntity<String> response =
                    restTemplate.exchange(apiUrl, HttpMethod.GET, entity, String.class);

            if (response.getBody() == null) {
                log.warn("[JobFetchService] Empty response body.");
                return;
            }

            // 3. Parse JSON — handles both top-level array and {"data": [...]}
            JsonNode root = apiParser.readTree(response.getBody());
            JsonNode jobsArray = root.isArray() ? root : root.path("data");

            if (!jobsArray.isArray()) {
                log.warn("[JobFetchService] Unexpected JSON structure; root={}", root.getNodeType());
                return;
            }

            // 4. Map & deduplicate
            List<JobListing> toSave = new ArrayList<>();
            for (JsonNode node : jobsArray) {
                String externalId = node.path("id").asText(null);
                if (externalId == null || externalId.isBlank()) continue;

                // Duplicate check — skip if already persisted
                if (jobListingRepository.existsByExternalId(externalId)) {
                    log.debug("[JobFetchService] Duplicate skipped: {}", externalId);
                    continue;
                }

                String title      = node.path("title").asText("N/A");
                String company    = node.path("organization").asText("N/A");
                if (company.isBlank()) company = "N/A";

                String applyUrl   = node.path("url").asText(null);
                String sourceType = node.path("source_type").asText(DEFAULT_SOURCE_TYPE);
                if (sourceType.isBlank()) sourceType = DEFAULT_SOURCE_TYPE;

                // First element of locations_derived array
                String location = null;
                JsonNode locNode = node.path("locations_derived");
                if (locNode.isArray() && locNode.size() > 0) {
                    location = locNode.get(0).asText(null);
                }

                toSave.add(new JobListing(externalId, title, company, location, applyUrl, sourceType));
            }

            // 5. Batch save
            if (!toSave.isEmpty()) {
                jobListingRepository.saveAll(toSave);
                log.info("[JobFetchService] Saved {} new job listing(s).", toSave.size());
            } else {
                log.info("[JobFetchService] No new jobs to save.");
            }

        } catch (Exception ex) {
            log.error("[JobFetchService] Error during fetch: {}", ex.getMessage(), ex);
        }
    }

    /**
     * Returns all persisted job listings (used by the REST controller).
     */
    @Transactional(readOnly = true)
    public List<JobListing> getAllJobListings() {
        return jobListingRepository.findAll();
    }
}