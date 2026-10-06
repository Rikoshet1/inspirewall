package com.inspirewall.backend.repository;

import com.inspirewall.backend.model.InspirationItem;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InspirationItemRepository extends MongoRepository<InspirationItem, String> {
}
