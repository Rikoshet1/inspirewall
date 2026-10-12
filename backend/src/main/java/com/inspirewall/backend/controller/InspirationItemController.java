package com.inspirewall.backend.controller;

import com.inspirewall.backend.model.InspirationItem;
import com.inspirewall.backend.repository.InspirationItemRepository;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

@RestController
@RequestMapping("/api/inspirations")
public class InspirationItemController {

    private final InspirationItemRepository inspirationItemRepository;

    public InspirationItemController(InspirationItemRepository inspirationItemRepository) {
        this.inspirationItemRepository = inspirationItemRepository;
    }

    @GetMapping
    public List<InspirationItem> getAllInspirations() {
        return inspirationItemRepository.findAll();
    }

    @PostMapping
    public InspirationItem create(@Valid @RequestBody InspirationItem item) {
        return inspirationItemRepository.save(item);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InspirationItem> getById(@PathVariable String id) {
        return inspirationItemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    public ResponseEntity<InspirationItem> update(@PathVariable String id,
            @Valid @RequestBody InspirationItem updated) {
        return inspirationItemRepository.findById(id)
                .map(existing -> {
                    existing.setContent(updated.getContent());
                    existing.setAuthor(updated.getAuthor());
                    existing.setTags(updated.getTags());
                    existing.setBgImageUrl(updated.getBgImageUrl());
                    return ResponseEntity.ok(inspirationItemRepository.save(existing));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        if (!inspirationItemRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        inspirationItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
