package com.inspirewall.backend.controller;

import com.inspirewall.backend.model.InspirationItem;
import com.inspirewall.backend.service.InspirationService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/inspirations")
public class InspirationItemController {

    private final InspirationService inspirationService;

    public InspirationItemController(InspirationService inspirationService) {
        this.inspirationService = inspirationService;
    }

    @GetMapping
    public List<InspirationItem> getAllInspirations() {
        return inspirationService.getAll();
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public InspirationItem create(@Valid @RequestBody InspirationItem item) {
        return inspirationService.create(item);
    }

    @GetMapping("/{id}")
    public ResponseEntity<InspirationItem> getById(@PathVariable String id) {
        return ResponseEntity.ok(inspirationService.getById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<InspirationItem> update(@PathVariable String id,
            @Valid @RequestBody InspirationItem updated) {
        return ResponseEntity.ok(inspirationService.update(id, updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        inspirationService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
