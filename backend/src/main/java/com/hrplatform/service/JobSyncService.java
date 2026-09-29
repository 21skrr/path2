/** @author SERRAFI */
package com.hrplatform.service;

import com.hrplatform.model.JobListing;
import com.hrplatform.repository.JobListingRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Admin-only service implementing the "Database Cache Pattern" (Sync and Serve).
 *
 * Responsibility split:
 *   - JobSyncService  : admin ingestion  — fetches from RapidAPI → saves to PostgreSQL
 *   - JobLocalService : user serving     — reads from PostgreSQL only (no API calls)
 *
 * This strict separation guarantees that normal users never trigger third-party API calls.
 *
 * @author SERRAFI
 */
@Service
public class JobSyncService {

    private static final Logger log = LoggerFactory.getLogger(JobSyncService.class);

    private final JobFetchService jobFetchService;
    private final JobListingRepository jobListingRepository;

    public JobSyncService(JobFetchService jobFetchService,
                          JobListingRepository jobListingRepository) {
        this.jobFetchService       = jobFetchService;
        this.jobListingRepository  = jobListingRepository;
    }

    /**
     * Triggers a full RapidAPI fetch, saves new job listings to PostgreSQL,
     * and returns a summary of the operation.
     *
     * Called exclusively by admins via POST /api/admin/sync-jobs.
     *
     * @return sync result summary
     */
    @Transactional
    public SyncResult syncJobs() {
        long before = jobListingRepository.count();
        log.info("[JobSyncService] Admin sync triggered. Jobs before: {}", before);

        jobFetchService.fetchAndSaveJobs();

        long after = jobListingRepository.count();
        int added  = (int) Math.max(0, after - before);

        log.info("[JobSyncService] Sync complete. New jobs added: {}. Total in DB: {}", added, after);
        return new SyncResult(added, (int) after, "Sync completed successfully.");
    }

    /**
     * Lightweight DTO returned to the admin after a sync operation.
     *
     * @author SERRAFI
     */
    public record SyncResult(int newJobsAdded, int totalInDatabase, String message) {}
}