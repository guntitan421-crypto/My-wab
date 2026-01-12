import { questions, trackNames } from './questions.js';
import * as state from './state.js';
import { renderResult } from './result.js';

const quizContainer = document.getElementById('quizContainer');
let currentQuestion = 0;

function createQuestionPage(q, index) {
    const page = document.createElement('div');
    page.className = 'question-page';
    if (index === 0) page.classList.add('active');
    
    page.innerHTML = `
        <div class="question-header">
            <div class="question-number">คำถามที่ ${index + 1} จาก ${questions.length}</div>
            <div class="question-icon">${q.icon}</div>
            <div class="question-text">${q.text}</div>
        </div>
        <div class="options">
            ${[1,2,3,4,5].map(val => `
                <div class="option" data-value="${val}">
                    <input type="radio" name="q${q.id}" value="${val}" id="q${q.id}_${val}">
                    <label for="q${q.id}_${val}">${val} - ${['ไม่จริงเลย','ค่อนข้างไม่จริง','ปานกลาง','ค่อนข้างจริง','จริงมาก'][val-1]}</label>
                </div>
            `).join('')}
        </div>
        <div class="nav-buttons">
            ${index > 0 ? '<button class="btn btn-prev" data-action="prev">ย้อนกลับ</button>' : '<div></div>'}
            ${index < questions.length - 1 ? 
                '<button class="btn btn-next" data-action="next" disabled>ถัดไป</button>' : 
                '<button class="btn btn-submit" data-action="submit" disabled>ดูผลลัพธ์</button>'
            }
        </div>
    `;

    page.querySelectorAll('.option').forEach(opt => {
        opt.addEventListener('click', function() {
            const value = this.dataset.value;
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;
            
            page.querySelectorAll('.option').forEach(o => o.classList.remove('selected'));
            this.classList.add('selected');
            
            state.setAnswer(q.id, parseInt(value));
            
            const nextBtn = page.querySelector('.btn-next, .btn-submit');
            if (nextBtn) nextBtn.disabled = false;
        });
    });

    page.addEventListener('click', (e) => {
        const action = e.target.closest('button') ? e.target.closest('button').dataset.action : null;
        if (!action) return;
        if (action === 'next') navigate(index + 1);
        if (action === 'prev') navigate(index - 1);
        if (action === 'submit') showResult();
    });

    return page;
}

export function initQuiz() {
    quizContainer.innerHTML = '';
    currentQuestion = 0;
    questions.forEach((q, i) => quizContainer.appendChild(createQuestionPage(q, i)));
}

function navigate(idx) {
    const pages = document.querySelectorAll('.question-page');
    pages[currentQuestion].classList.remove('active');
    currentQuestion = idx;
    pages[currentQuestion].classList.add('active');
}

function showResult() {
    const scores = state.getScores();
    const result = Object.entries(scores).sort((a,b) => b[1] - a[1]);

    document.querySelectorAll('.question-page')[currentQuestion].classList.remove('active');

    renderResult(result, trackNames, quizContainer, () => {
        state.reset();
        // restart via initQuiz so behavior is consistent
        initQuiz();
    });
}
