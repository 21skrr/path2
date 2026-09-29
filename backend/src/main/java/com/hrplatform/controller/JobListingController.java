/** @author SERRAFI */
package com.hrplatform.controller;

import com.hrplatform.model.JobListing;
import com.hrplatform.service.JobFetchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller exposing the API-fetched job listings.
 * Base path: /api/job-listings
 * CORS is handled globally by CorsConfig.java
 *
 * @author SERRAFI
 */
@RestController
@RequestMapping("/api/job-listings")
public class JobListingController {

    private final JobFetchService jobFetchService;

    public JobListingController(JobFetchService jobFetchService) {
        this.jobFetchService = jobFetchService;
    }

    /**
     * Returns all job listings fetched from RapidAPI.
     */
    @GetMapping
    public List<JobListing> getAllJobListings() {
        return jobFetchService.getAllJobListings();
    }

    /**
     * Manually triggers an immediate fetch from RapidAPI (useful for testing).
     */
    @PostMapping("/fetch")
    public ResponseEntity<String> triggerFetch() {
        jobFetchService.fetchAndSaveJobs();
        return ResponseEntity.ok("Fetch triggered successfully.");
    }
}