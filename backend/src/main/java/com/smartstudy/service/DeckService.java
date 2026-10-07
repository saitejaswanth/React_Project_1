package com.smartstudy.service;

import com.smartstudy.dto.*;
import com.smartstudy.model.Card;
import com.smartstudy.model.Deck;
import com.smartstudy.model.QuizScore;
import com.smartstudy.repository.DeckRepository;
import com.smartstudy.repository.QuizScoreRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class DeckService {

    private final DeckRepository deckRepository;
    private final QuizScoreRepository scoreRepository;
    private final SmartGeneratorService generator;

    public DeckService(DeckRepository deckRepository,
                       QuizScoreRepository scoreRepository,
                       SmartGeneratorService generator) {
        this.deckRepository = deckRepository;
        this.scoreRepository = scoreRepository;
        this.generator = generator;
    }

    public List<Deck> findAll() {
        return deckRepository.findAll().stream()
                .sorted(Comparator.comparing(Deck::getCreatedAt).reversed())
                .toList();
    }

    @Transactional(readOnly = true)
    public Deck findById(Long id) {
        Deck deck = deckRepository.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Deck not found"));
        deck.getCards().size();
        return deck;
    }

    @Transactional
    public Deck create(CreateDeckRequest request) {
        Deck deck = new Deck();
        deck.setTitle(request.title());
        deck.setTopic(request.topic());
        deck.setSourceNotes(request.sourceNotes());

        List<ManualCardRequest> cards =
                request.cards() == null ? List.of() : request.cards();

        int position = 1;
        for (ManualCardRequest draft : cards) {
            if (draft.question() != null && !draft.question().isBlank()
                    && draft.answer() != null && !draft.answer().isBlank()) {
                deck.addCard(new Card(draft.question().trim(), draft.answer().trim(), position++));
            }
        }

        return deckRepository.save(deck);
    }

    @Transactional
    public Deck generate(GenerateDeckRequest request) {
        Deck deck = new Deck();
        deck.setTitle(request.title());
        deck.setTopic(request.topic());
        deck.setSourceNotes(request.notes());

        int position = 1;
        for (SmartGeneratorService.CardDraft draft :
                generator.generate(request.topic(), request.notes())) {
            deck.addCard(new Card(draft.question(), draft.answer(), position++));
        }

        return deckRepository.save(deck);
    }

    @Transactional
    public void delete(Long id) {
        if (!deckRepository.existsById(id)) {
            throw new NoSuchElementException("Deck not found");
        }
        deckRepository.deleteById(id);
    }

    @Transactional
    public QuizScore saveScore(Long deckId, ScoreRequest request) {
        Deck deck = findById(deckId);
        QuizScore score = new QuizScore(request.score(), request.total(), deck);
        return scoreRepository.save(score);
    }

    @Transactional(readOnly = true)
    public List<QuizScore> scores(Long deckId) {
        return scoreRepository.findByDeckIdOrderByCompletedAtDesc(deckId);
    }

    public List<QuizQuestion> makeQuiz(Long deckId) {
        Deck deck = findById(deckId);
        List<Card> cards = new ArrayList<>(deck.getCards());
        Collections.shuffle(cards);

        List<String> answers = cards.stream()
                .map(Card::getAnswer)
                .filter(Objects::nonNull)
                .toList();

        return cards.stream().limit(Math.min(10, cards.size())).map(card -> {
            List<String> options = new ArrayList<>();
            options.add(card.getAnswer());

            List<String> distractors = new ArrayList<>(answers);
            Collections.shuffle(distractors);

            for (String d : distractors) {
                if (!d.equals(card.getAnswer()) && !options.contains(d)) {
                    options.add(d);
                }
                if (options.size() == Math.min(4, answers.size())) break;
            }

            Collections.shuffle(options);
            return new QuizQuestion(
                    card.getId(),
                    card.getQuestion(),
                    card.getAnswer(),
                    options
            );
        }).toList();
    }
}
