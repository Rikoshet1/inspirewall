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
}
