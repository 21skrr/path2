/** @author SERRAFI */
package com.hrplatform.repository;

import com.hrplatform.model.JobListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA Repository for {@link JobListing} entities.
 *
 * Provides:
 *  - Standard CRUD via JpaRepository
 *  - Duplicate-prevention check (existsByExternalId)
 *  - Full-text search across title, company, and location (search)
 *
 * @author SERRAFI
 */
@Repository
public interface JobListingRepository extends JpaRepository<JobListing, String> {

    /**
     * Duplicate prevention check used by the sync service.
     *
     * @param externalId the API-provided job id
     * @return true if already persisted
     */
    boolean existsByExternalId(String externalId);

    /**
     * Case-insensitive full-text search across title, company and location.
     * Returns all records when {@code q} is blank or null (handled in service).
     *
     * @param q search keyword
     * @return matching job listings
     */
    @Query("SELECT j FROM JobListing j WHERE " +
           "LOWER(j.title)    LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(j.company)  LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(j.location) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<JobListing> search(@Param("q") String q);
}