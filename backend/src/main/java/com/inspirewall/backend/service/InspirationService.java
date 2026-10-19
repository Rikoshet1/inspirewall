package com.inspirewall.backend.service;

import com.inspirewall.backend.exception.InspirationNotFoundException;
import com.inspirewall.backend.model.InspirationItem;
import com.inspirewall.backend.repository.InspirationItemRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class InspirationService {

    private final InspirationItemRepository repository;
    private final AiTaggingService aiTaggingService;

    public InspirationService(InspirationItemRepository repository, AiTaggingService aiTaggingService) {
        this.repository = repository;
        this.aiTaggingService = aiTaggingService;
    }

    public List<InspirationItem> getAll() {
        return repository.findAll();
    }

    public InspirationItem getById(String id) {
        return repository.findById(id)
                .orElseThrow(() -> new InspirationNotFoundException(id));
    }

    public InspirationItem create(InspirationItem item) {
        item.setId(null);
        item.setCreatedAt(LocalDateTime.now());
        if (item.getTags() == null || item.getTags().isEmpty()) {
            item.setTags(aiTaggingService.generateTags(item.getContent()));
        }
        return repository.save(item);
    }

    public InspirationItem update(String id, InspirationItem updated) {
        InspirationItem existing = getById(id);

        existing.setContent(updated.getContent());
        existing.setAuthor(updated.getAuthor());
        existing.setTags(updated.getTags());
        existing.setBgImageUrl(updated.getBgImageUrl());

        return repository.save(existing);
    }

    public void delete(String id) {
        InspirationItem existing = getById(id);
        repository.delete(existing);
    }
}
