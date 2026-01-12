export function renderResult(resultList, trackNames, container, onRestart) {
    const maxScore = resultList[0][1] || 1;
    const bestKey = resultList[0][0];
    const bestName = trackNames[bestKey] || bestKey;

    const displayList = resultList.slice(0, 4).reverse(); // reverse so highest is at right for visual balance

    // build modal
    const modal = document.createElement('div');
    modal.className = 'result-modal';
    modal.innerHTML = `
        <div class="result-overlay"></div>
        <div class="result-card">
            <div class="result-header">
                <div class="result-title">ผลลัพธ์แบบทดสอบ</div>
                <div class="result-track">${bestName}</div>
            </div>
            <div class="vchart">
                ${displayList.map(([track, score]) => `
                    <div class="vcol" data-track="${track}" data-score="${score}">
                        <div class="vbar"><div class="vfill" style="height:0%"></div></div>
                        <div class="vvalue">0.0</div>
                        <div class="vlabel">${trackNames[track]}</div>
                    </div>
                `).join('')}
            </div>
            <div class="final-reco hidden">คุณเหมาะกับสายการเรียน: <span class="reco-name">${bestName}</span></div>
            <div class="result-footer"><button class="btn btn-submit" id="restartBtn">ทำแบบทดสอบอีกครั้ง</button></div>
            <div class="result-footer"><a href="index.html.html"><button class="btn btn-submit" id="backBtn">กลับสู่หน้าหลัก</button></a></div>
        </div>
    `;

    document.body.appendChild(modal);

    // animate vertical fills left-to-right with stagger; reveal numbers as they grow
    const cols = Array.from(modal.querySelectorAll('.vcol'));
    cols.forEach((col, i) => {
        const fill = col.querySelector('.vfill');
        const val = col.querySelector('.vvalue');
        const score = Number(col.dataset.score) || 0;
        const pct = Math.round((score / maxScore) * 100);
        const delay = i * 160;

        setTimeout(() => {
            fill.style.height = pct + '%';
            // animate number upward in sync with bar (duration ~900ms)
            const duration = 900;
            const start = performance.now();
            function step(now) {
                const t = Math.min(1, (now - start) / duration);
                const cur = t * score;
                val.textContent = cur.toFixed(1);
                if (t < 1) requestAnimationFrame(step);
            }
            requestAnimationFrame(step);
        }, delay);
    });

    // reveal recommendation after all animations finish
    const totalDelay = Math.max(0, (cols.length - 1) * 160) + 900 + 80;
    setTimeout(() => {
        const reco = modal.querySelector('.final-reco');
        if (reco) {
            reco.classList.remove('hidden');
            requestAnimationFrame(() => reco.classList.add('visible'));
            const nameEl = reco.querySelector('.reco-name');
            if (nameEl) {
                nameEl.style.transform = 'scale(1.02)';
                setTimeout(() => nameEl.style.transform = 'scale(1)', 260);
            }
        }
    }, totalDelay);

    const restartBtn = modal.querySelector('#restartBtn');
    restartBtn.addEventListener('click', () => {
        modal.remove();
        if (typeof onRestart === 'function') onRestart();
    });

    // close when overlay clicked (optional)
    modal.querySelector('.result-overlay').addEventListener('click', () => {
        // keep it explicit: restart to clear modal and reset quiz
        modal.remove();
        if (typeof onRestart === 'function') onRestart();
    });
}
