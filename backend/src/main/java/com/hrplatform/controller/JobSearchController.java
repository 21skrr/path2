/** @author SERRAFI */
package com.hrplatform.controller;

import com.hrplatform.service.JobSearchService;
import com.hrplatform.service.JobSearchService.JobDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * REST Controller for real-time dynamic job search.
 * Delegates filter logic and RapidAPI calls to {@link JobSearchService}.
 *
 * Endpoint: GET /api/search
 *
 * Query parameters (all optional):
 * - location   : job location (default: "Morocco")
 * - hasSalary  : filter to jobs with salary info (default: false)
 * - timeFrame  : posting recency — "24h" | "1w" | "1m" | "6m" (default: "month")
 *
 * @author SERRAFI
 */
@RestController
@RequestMapping("/api/search")
public class JobSearchController {

    private final JobSearchService jobSearchService;

    public JobSearchController(JobSearchService jobSearchService) {
        this.jobSearchService = jobSearchService;
    }

    /**
     * Searches jobs in real-time via the RapidAPI LinkedIn Job Search endpoint.
     *
     * @param location  location filter (e.g. "Morocco", "France")
     * @param hasSalary if true, only jobs with salary data are returned
     * @param timeFrame posting recency — one of: "24h", "1w", "1m", "6m"
     * @return HTTP 200 with a JSON array of matching job objects
     */
    @GetMapping
    public ResponseEntity<List<JobDTO>> search(
            @RequestParam(required = false, defaultValue = "Morocco") String location,
            @RequestParam(required = false, defaultValue = "false")   boolean hasSalary,
            @RequestParam(required = false, defaultValue = "1m")      String timeFrame,
            @RequestParam(required = false, defaultValue = "0")       int offset,
            @RequestParam(required = false, defaultValue = "100")     int limit
    ) {
        List<JobDTO> results = jobSearchService.search(location, hasSalary, timeFrame, offset, limit);
        return ResponseEntity.ok(results);
    }
}