/** @author SERRAFI */
package com.hrplatform.controller;

import com.hrplatform.model.JobListing;
import com.hrplatform.service.JobLocalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Public REST Controller serving job listings from the local PostgreSQL database.
 * 
 * Endpoint: GET /api/local-jobs
 *
 * @author SERRAFI
 */
@RestController
@RequestMapping("/api/local-jobs")
public class JobLocalController {

    private final JobLocalService jobLocalService;

    public JobLocalController(JobLocalService jobLocalService) {
        this.jobLocalService = jobLocalService;
    }

    /**
     * Returns local jobs, optionally filtered by a search query.
     */
    @GetMapping
    public ResponseEntity<List<JobListing>> getLocalJobs(
            @RequestParam(required = false) String q
    ) {
        List<JobListing> results = jobLocalService.findLocal(q);
        return ResponseEntity.ok(results);
    }
}