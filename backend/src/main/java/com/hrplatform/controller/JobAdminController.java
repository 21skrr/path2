/** @author SERRAFI */
package com.hrplatform.controller;

import com.hrplatform.service.JobSyncService;
import com.hrplatform.service.JobSyncService.SyncResult;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Secured REST Controller for Admin job operations.
 * 
 * Endpoint: POST /api/admin/sync-jobs
 *
 * @author SERRAFI
 */
@RestController
@RequestMapping("/api/admin")
public class JobAdminController {

    private final JobSyncService jobSyncService;

    public JobAdminController(JobSyncService jobSyncService) {
        this.jobSyncService = jobSyncService;
    }

    /**
     * Manually triggers an immediate fetch from RapidAPI and saves to PostgreSQL.
     */
    @PostMapping("/sync-jobs")
    public ResponseEntity<SyncResult> syncJobs() {
        SyncResult result = jobSyncService.syncJobs();
        return ResponseEntity.ok(result);
    }
}