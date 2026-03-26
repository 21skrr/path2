package com.hrplatform.repository;

import com.hrplatform.model.Resource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResourceRepository extends JpaRepository<Resource, Long> {
    List<Resource> findByCategory(Resource.ResourceCategory category);
    
    @Query("SELECT r FROM Resource r WHERE r.isPremium = false OR ?1 = true ORDER BY r.id DESC")
    List<Resource> findAccessibleResources(boolean isPremium);
}
