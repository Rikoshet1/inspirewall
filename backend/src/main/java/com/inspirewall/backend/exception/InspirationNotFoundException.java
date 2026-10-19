package com.inspirewall.backend.exception;

public class InspirationNotFoundException extends RuntimeException {

    public InspirationNotFoundException(String id) {
        super("Inspiration item not found with id: " + id);
    }
}
