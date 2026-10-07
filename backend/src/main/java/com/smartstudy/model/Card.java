package com.smartstudy.model;

import jakarta.persistence.*;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "cards")
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String question;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String answer;

    @Column(nullable = false)
    private Integer positionIndex;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "deck_id", nullable = false)
    private Deck deck;

    public Card() {}

    public Card(String question, String answer, Integer positionIndex) {
        this.question = question;
        this.answer = answer;
        this.positionIndex = positionIndex;
    }

    public Long getId() { return id; }
    public String getQuestion() { return question; }
    public String getAnswer() { return answer; }
    public Integer getPositionIndex() { return positionIndex; }
    public Deck getDeck() { return deck; }

    public void setId(Long id) { this.id = id; }
    public void setQuestion(String question) { this.question = question; }
    public void setAnswer(String answer) { this.answer = answer; }
    public void setPositionIndex(Integer positionIndex) { this.positionIndex = positionIndex; }
    public void setDeck(Deck deck) { this.deck = deck; }
}
