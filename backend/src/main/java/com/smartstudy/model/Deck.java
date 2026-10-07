package com.smartstudy.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "decks")
public class Deck {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    private String topic;

    @Column(columnDefinition = "TEXT")
    private String sourceNotes;

    private LocalDateTime createdAt = LocalDateTime.now();

    @OneToMany(mappedBy = "deck", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Card> cards = new ArrayList<>();

    @OneToMany(mappedBy = "deck", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuizScore> scores = new ArrayList<>();

    public Deck() {}

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getTopic() { return topic; }
    public String getSourceNotes() { return sourceNotes; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public List<Card> getCards() { return cards; }
    public List<QuizScore> getScores() { return scores; }

    public void setId(Long id) { this.id = id; }
    public void setTitle(String title) { this.title = title; }
    public void setTopic(String topic) { this.topic = topic; }
    public void setSourceNotes(String sourceNotes) { this.sourceNotes = sourceNotes; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public void setCards(List<Card> cards) { this.cards = cards; }
    public void setScores(List<QuizScore> scores) { this.scores = scores; }

    public void addCard(Card card) {
        cards.add(card);
        card.setDeck(this);
    }
}
