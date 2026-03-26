package com.hrplatform.controller;

import com.hrplatform.model.Resource;
import com.hrplatform.service.ResourceService;
import com.hrplatform.dto.ResourceDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/resources")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ResourceController {
    private final ResourceService resourceService;

    @GetMapping
    public ResponseEntity<List<ResourceDTO>> getAllResources(
            @RequestParam(defaultValue = "false") boolean isPremium) {
        List<ResourceDTO> resources = resourceService.getAllResources(isPremium)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<ResourceDTO>> getByCategory(@PathVariable String category) {
        Resource.ResourceCategory cat = Resource.ResourceCategory.valueOf(category.toUpperCase());
        List<ResourceDTO> resources = resourceService.getResourcesByCategory(cat)
                .stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
        return ResponseEntity.ok(resources);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResourceDTO> getResource(@PathVariable Long id) {
        Resource resource = resourceService.getResourceById(id);
        return ResponseEntity.ok(convertToDTO(resource));
    }

    @PostMapping
    public ResponseEntity<ResourceDTO> createResource(@RequestBody Resource resource) {
        Resource created = resourceService.createResource(resource);
        return ResponseEntity.status(HttpStatus.CREATED).body(convertToDTO(created));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ResourceDTO> updateResource(@PathVariable Long id, @RequestBody Resource resource) {
        Resource updated = resourceService.updateResource(id, resource);
        return ResponseEntity.ok(convertToDTO(updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteResource(@PathVariable Long id) {
        resourceService.deleteResource(id);
        return ResponseEntity.noContent().build();
    }

    private ResourceDTO convertToDTO(Resource resource) {
        return new ResourceDTO(
                resource.getId(),
                resource.getTitle(),
                resource.getFileUrl(),
                resource.getCategory().toString(),
                resource.getIsPremium()
        );
    }
}
