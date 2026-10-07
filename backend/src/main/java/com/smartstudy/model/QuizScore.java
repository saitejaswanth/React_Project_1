package com.smartstudy.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;
import java.time.LocalDateTime;

@Entity
@Table(name = "quiz_scores")
public class QuizScore {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false)
    private Integer total;

    @Column(nullable = false)
    private LocalDateTime completedAt = LocalDateTime.now();

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deck_id", nullable = false)
    private Deck deck;

    public QuizScore() {}

    public QuizScore(Integer score, Integer total, Deck deck) {
        this.score = score;
        this.total = total;
        this.deck = deck;
    }

    public Long getId() { return id; }
    public Integer getScore() { return score; }
    public Integer getTotal() { return total; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public Deck getDeck() { return deck; }
}
