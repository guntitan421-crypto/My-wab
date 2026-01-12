import { questions } from './questions.js';

export let userAnswers = {};
export let currentQuestion = 0;

export function setAnswer(qId, value) {
    userAnswers[qId] = Number(value);
}

export function getAnswer(qId) {
    return userAnswers[qId] || null;
}

export function nextQuestion() {
    if (currentQuestion < questions.length - 1) currentQuestion++;
}

export function prevQuestion() {
    if (currentQuestion > 0) currentQuestion--;
}

export function reset() {
    userAnswers = {};
    currentQuestion = 0;
}

export function getScores() {
    const scores = {
        math_com: 0,
        sci_math: 0,
        engineer: 0,
        art: 0,
        chinese: 0,
        social: 0
    };

    questions.forEach(q => {
        const a = userAnswers[q.id] || 0;
        Object.entries(q.weights).forEach(([t, w]) => {
            scores[t] += a * w;
        });
    });

    return scores;
}


