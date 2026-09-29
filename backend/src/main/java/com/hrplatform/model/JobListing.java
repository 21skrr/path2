/** @author SERRAFI */
package com.hrplatform.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * JPA Entity representing a job listing fetched from the RapidAPI jobs endpoint.
 * The primary key {@code externalId} is taken directly from the API "id" field.
 *
 * @author SERRAFI
 */
@Entity
@Table(name = "job_listings")
public class JobListing {

    @Id
    @Column(name = "external_id", nullable = false, updatable = false, length = 128)
    private String externalId;

    @Column(nullable = false, length = 512)
    private String title;

    @Column(nullable = false, length = 255)
    private String company;

    @Column(length = 255)
    private String location;

    @Column(name = "apply_url", length = 1024)
    private String applyUrl;

    @Column(name = "source_type", length = 64)
    private String sourceType;

    @Column(name = "fetched_at", nullable = false, updatable = false)
    private LocalDateTime fetchedAt = LocalDateTime.now();

    public JobListing() {}

    public JobListing(String externalId, String title, String company,
                      String location, String applyUrl, String sourceType) {
        this.externalId = externalId;
        this.title      = title;
        this.company    = company;
        this.location   = location;
        this.applyUrl   = applyUrl;
        this.sourceType = sourceType;
        this.fetchedAt  = LocalDateTime.now();
    }

    public String getExternalId()                      { return externalId; }
    public void   setExternalId(String externalId)     { this.externalId = externalId; }
    public String getTitle()                           { return title; }
    public void   setTitle(String title)               { this.title = title; }
    public String getCompany()                         { return company; }
    public void   setCompany(String company)           { this.company = company; }
    public String getLocation()                        { return location; }
    public void   setLocation(String location)         { this.location = location; }
    public String getApplyUrl()                        { return applyUrl; }
    public void   setApplyUrl(String applyUrl)         { this.applyUrl = applyUrl; }
    public String getSourceType()                      { return sourceType; }
    public void   setSourceType(String sourceType)     { this.sourceType = sourceType; }
    public LocalDateTime getFetchedAt()                { return fetchedAt; }
    public void          setFetchedAt(LocalDateTime t) { this.fetchedAt = t; }
}