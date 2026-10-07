package com.smartstudy.repository;

import com.smartstudy.model.Deck;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DeckRepository extends JpaRepository<Deck, Long> {
}
