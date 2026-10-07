package com.smartstudy.repository;

import com.smartstudy.model.QuizScore;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuizScoreRepository extends JpaRepository<QuizScore, Long> {
    List<QuizScore> findByDeckIdOrderByCompletedAtDesc(Long deckId);
}
