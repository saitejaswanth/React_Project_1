package com.smartstudy.controller;

import com.smartstudy.dto.*;
import com.smartstudy.model.Deck;
import com.smartstudy.model.QuizScore;
import com.smartstudy.service.DeckService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/decks")
public class DeckController {

    private final DeckService service;

    public DeckController(DeckService service) {
        this.service = service;
    }

    @GetMapping
    public List<Deck> all() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Deck one(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public ResponseEntity<Deck> create(@Valid @RequestBody CreateDeckRequest request) {
        return ResponseEntity.ok(service.create(request));
    }

    @PostMapping("/generate")
    public ResponseEntity<Deck> generate(@Valid @RequestBody GenerateDeckRequest request) {
        return ResponseEntity.ok(service.generate(request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}/quiz")
    public List<QuizQuestion> quiz(@PathVariable Long id) {
        return service.makeQuiz(id);
    }

    @GetMapping("/{id}/scores")
    public List<QuizScore> scores(@PathVariable Long id) {
        return service.scores(id);
    }

    @PostMapping("/{id}/scores")
    public ResponseEntity<QuizScore> saveScore(
            @PathVariable Long id,
            @Valid @RequestBody ScoreRequest request) {
        return ResponseEntity.ok(service.saveScore(id, request));
    }
}
