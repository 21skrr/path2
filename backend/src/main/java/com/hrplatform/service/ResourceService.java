package com.hrplatform.service;

import com.hrplatform.model.Resource;
import com.hrplatform.repository.ResourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ResourceService {
    private final ResourceRepository resourceRepository;

    public List<Resource> getAllResources(boolean isPremium) {
        return resourceRepository.findAccessibleResources(isPremium);
    }

    public List<Resource> getResourcesByCategory(Resource.ResourceCategory category) {
        return resourceRepository.findByCategory(category);
    }

    public Resource getResourceById(Long id) {
        return resourceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Resource not found"));
    }

    @Transactional
    public Resource createResource(Resource resource) {
        return resourceRepository.save(resource);
    }

    @Transactional
    public Resource updateResource(Long id, Resource updated) {
        Resource resource = getResourceById(id);
        resource.setTitle(updated.getTitle());
        resource.setFileUrl(updated.getFileUrl());
        resource.setCategory(updated.getCategory());
        resource.setIsPremium(updated.getIsPremium());
        return resourceRepository.save(resource);
    }

    @Transactional
    public void deleteResource(Long id) {
        resourceRepository.deleteById(id);
    }
}
