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
 * User-facing read-only service implementing the "Serve" half of the
 * Database Cache Pattern.
 *
 * IMPORTANT: This service ONLY reads from the local PostgreSQL database.
 *            It never makes any external HTTP calls. Users are completely
 *            isolated from the third-party RapidAPI.
 *
 * @author SERRAFI
 */
@Service
@Transactional(readOnly = true)
public class JobLocalService {

    private static final Logger log = LoggerFactory.getLogger(JobLocalService.class);

    private final JobListingRepository jobListingRepository;

    public JobLocalService(JobListingRepository jobListingRepository) {
        this.jobListingRepository = jobListingRepository;
    }

    /**
     * Returns job listings from local PostgreSQL.
     *
     * If {@code q} is provided and non-blank, performs a case-insensitive
     * full-text search across title, company, and location columns.
     * Otherwise returns all persisted jobs.
     *
     * No external API call is made under any circumstances.
     *
     * @param q optional search keyword (title / company / location)
     * @return list of matching local job listings
     */
    public List<JobListing> findLocal(String q) {
        if (q == null || q.isBlank()) {
            log.debug("[JobLocalService] Returning all {} local jobs.", jobListingRepository.count());
            return jobListingRepository.findAll();
        }
        List<JobListing> results = jobListingRepository.search(q.trim());
        log.debug("[JobLocalService] Search '{}' returned {} results.", q, results.size());
        return results;
    }

    /**
     * Returns the total count of job listings in the local database.
     *
     * @return total persisted job count
     */
    public long countLocal() {
        return jobListingRepository.count();
    }
}