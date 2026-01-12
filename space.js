// สร้างดาวในพื้นหลัง (เพิ่มความหนาแน่น)
const starsContainer = document.getElementById('starsContainer');

const STAR_COUNT = 220;
for (let i = 0; i < STAR_COUNT; i++) {
    const star = document.createElement('div');
    const isLarge = Math.random() < 0.14; // ~14% larger stars
    star.className = 'star ' + (isLarge ? 'large' : 'small');
    star.style.left = Math.random() * 100 + '%';
    star.style.top = Math.random() * 100 + '%';
    star.style.animationDelay = (Math.random() * 4) + 's';
    // vary twinkle amount
    star.style.setProperty('--move-x', (Math.random() - 0.5) * (isLarge ? 24 : 14) + 'px');
    star.style.setProperty('--move-y', (Math.random() - 0.5) * (isLarge ? 24 : 14) + 'px');
    // occasionally give a brighter glow
    if (Math.random() < 0.06) star.style.boxShadow = '0 0 10px rgba(255,255,255,0.95)';
    starsContainer.appendChild(star);
}

for (let i = 0; i < 2; i++) {
    const comet = document.createElement('div');
    comet.className = 'comet comet-horizontal';
    comet.style.left = Math.random() * 100 + 100 + '%';
    comet.style.top = Math.random() * 30 + '%';
    comet.style.animationDelay = Math.random() * 8 + 's';
    starsContainer.appendChild(comet);
}

for (let i = 0; i < 3; i++) {
    const comet = document.createElement('div');
    comet.className = 'comet comet-vertical';
    comet.style.left = Math.random() * 80 + 10 + '%';
    comet.style.top = '0%';
    comet.style.animationDelay = Math.random() * 6 + 's';
    starsContainer.appendChild(comet);
}

// === หมู่ดาว 12 ราศี ===
const constellations = [
    {name: 'ARIES', stars: [{x: 150, y: 100}, {x: 200, y: 150}, {x: 250, y: 120}, {x: 220, y: 180}], lines: [[0,1], [1,2], [1,3]]},
    {name: 'TAURUS', stars: [{x: 120, y: 150}, {x: 180, y: 140}, {x: 240, y: 130}, {x: 200, y: 200}, {x: 160, y: 210}], lines: [[0,1], [1,2], [1,3], [3,4]]},
    {name: 'GEMINI', stars: [{x: 100, y: 100}, {x: 100, y: 180}, {x: 200, y: 100}, {x: 200, y: 180}, {x: 150, y: 140}], lines: [[0,1], [2,3], [0,4], [2,4]]},
    {name: 'CANCER', stars: [{x: 150, y: 120}, {x: 120, y: 160}, {x: 180, y: 160}, {x: 150, y: 200}, {x: 200, y: 140}], lines: [[0,1], [0,2], [1,3], [2,3], [2,4]]},
    {name: 'LEO', stars: [{x: 100, y: 140}, {x: 140, y: 120}, {x: 180, y: 100}, {x: 220, y: 130}, {x: 200, y: 170}, {x: 160, y: 180}], lines: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,0]]},
    {name: 'VIRGO', stars: [{x: 150, y: 100}, {x: 120, y: 140}, {x: 150, y: 170}, {x: 180, y: 140}, {x: 210, y: 160}, {x: 180, y: 200}], lines: [[0,1], [1,2], [0,3], [3,4], [4,5]]},
    {name: 'LIBRA', stars: [{x: 100, y: 130}, {x: 150, y: 120}, {x: 200, y: 130}, {x: 150, y: 170}, {x: 180, y: 200}], lines: [[0,1], [1,2], [1,3], [3,4]]},
    {name: 'SCORPIO', stars: [{x: 100, y: 120}, {x: 140, y: 140}, {x: 180, y: 150}, {x: 220, y: 140}, {x: 240, y: 170}, {x: 260, y: 200}, {x: 200, y: 180}], lines: [[0,1], [1,2], [2,3], [3,4], [4,5], [3,6]]},
    {name: 'SAGITTARIUS', stars: [{x: 120, y: 180}, {x: 150, y: 150}, {x: 180, y: 120}, {x: 210, y: 140}, {x: 180, y: 170}], lines: [[0,1], [1,2], [2,3], [1,4]]},
    {name: 'CAPRICORN', stars: [{x: 100, y: 150}, {x: 140, y: 130}, {x: 180, y: 140}, {x: 220, y: 160}, {x: 180, y: 180}, {x: 150, y: 200}], lines: [[0,1], [1,2], [2,3], [2,4], [4,5]]},
    {name: 'AQUARIUS', stars: [{x: 120, y: 120}, {x: 160, y: 110}, {x: 200, y: 120}, {x: 150, y: 160}, {x: 190, y: 170}, {x: 170, y: 200}], lines: [[0,1], [1,2], [1,3], [3,4], [4,5]]},
    {name: 'PISCES', stars: [{x: 100, y: 130}, {x: 130, y: 150}, {x: 160, y: 140}, {x: 200, y: 130}, {x: 230, y: 150}, {x: 200, y: 180}, {x: 160, y: 190}], lines: [[0,1], [1,2], [3,4], [4,5], [2,6], [5,6]]}
];

const container = document.getElementById('constellationContainer');
let currentIndex = 0;
let constellationElements = [];

function createConstellation(data) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '600');
    svg.setAttribute('height', '500');
    svg.classList.add('constellation');
    svg.setAttribute('data-name', data.name);

    const scale = 1.6;
    const offsetX = 50;
    const offsetY = 50;

    data.lines.forEach(line => {
        const pathLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        pathLine.setAttribute('x1', data.stars[line[0]].x * scale + offsetX);
        pathLine.setAttribute('y1', data.stars[line[0]].y * scale + offsetY);
        pathLine.setAttribute('x2', data.stars[line[1]].x * scale + offsetX);
        pathLine.setAttribute('y2', data.stars[line[1]].y * scale + offsetY);
        pathLine.setAttribute('stroke', 'rgba(168, 85, 247, 0.4)');
        pathLine.setAttribute('stroke-width', '2');
        svg.appendChild(pathLine);
    });

    data.stars.forEach((star, i) => {
        const scaledX = star.x * scale + offsetX;
        const scaledY = star.y * scale + offsetY;

        const glow = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        glow.setAttribute('cx', scaledX);
        glow.setAttribute('cy', scaledY);
        glow.setAttribute('r', '20');
        glow.setAttribute('fill', 'rgba(168, 85, 247, 0.2)');
        glow.setAttribute('filter', 'blur(10px)');
        
        const animate = document.createElementNS('http://www.w3.org/2000/svg', 'animate');
        animate.setAttribute('attributeName', 'r');
        animate.setAttribute('values', '20;35;20');
        animate.setAttribute('dur', '2s');
        animate.setAttribute('repeatCount', 'indefinite');
        animate.setAttribute('begin', `${i * 0.2}s`);
        glow.appendChild(animate);
        svg.appendChild(glow);

        // vary star size a bit and make it pickable
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        const sizeType = Math.random() < 0.28 ? 'large' : 'small';
        const r = sizeType === 'large' ? 8 : 5;
        circle.setAttribute('cx', scaledX);
        circle.setAttribute('cy', scaledY);
        circle.setAttribute('r', r);
        circle.setAttribute('fill', '#fff');
        circle.setAttribute('filter', 'drop-shadow(0 0 8px rgba(255,255,255,0.8))');
        circle.classList.add('pickable-star', sizeType);
        circle.dataset.size = sizeType;
        circle.style.cursor = 'grab';
        svg.appendChild(circle);
    });

    // label (visible under the constellation) for clarity
    const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    label.setAttribute('x', '50%');
    label.setAttribute('y', '95%');
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('class', 'constellation-label');
    label.textContent = data.name;
    svg.appendChild(label);

    return svg;
}

constellations.forEach(data => {
    const svg = createConstellation(data);
    container.appendChild(svg);
    constellationElements.push(svg);
});

let isDragging = false;
let draggedConstellation = null;
let offsetX = 0;
let offsetY = 0;

// --- enhanced interaction for constellations ---
        let activePointerId = null;
        function createTooltip(text) {
            const el = document.createElement('div');
            el.className = 'constellation-tooltip';
            el.textContent = text;
            document.body.appendChild(el);
            return el;
        }

        function removeTooltip(el) {
            if (el && el.parentNode) el.parentNode.removeChild(el);
        }

        function createParticles(x, y, count = 14, color = '#a855f7') {
            for (let i = 0; i < count; i++) {
                const p = document.createElement('div');
                p.className = 'particle' + (Math.random() < 0.4 ? ' small' : '');
                document.body.appendChild(p);
                const angle = Math.random() * Math.PI * 2;
                const dist = 30 + Math.random() * 60;
                const dx = Math.cos(angle) * dist;
                const dy = Math.sin(angle) * dist - Math.random()*10;
                p.style.left = x + 'px';
                p.style.top = y + 'px';
                p.style.background = `radial-gradient(circle at 30% 30%, #fff 0%, ${color} 50%)`;
                requestAnimationFrame(() => {
                    p.classList.add('fade');
                    p.style.transform = `translate(${dx}px, ${dy}px) scale(0.92)`;
                    p.style.opacity = '0';
                    p.style.transition = 'transform 800ms cubic-bezier(.2,.8,.2,1), opacity 900ms';
                });
                setTimeout(() => p.remove(), 1000 + Math.random()*300);
            }
        }

        constellationElements.forEach(constellation => {
            // make focusable for keyboard control
            constellation.setAttribute('tabindex', '0');

            let tooltip = null;
            let pointerDown = false;
            let startRect = null;

            constellation.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                constellation.setPointerCapture(e.pointerId);
                activePointerId = e.pointerId;
                isDragging = true;
                draggedConstellation = constellation;
                draggedConstellation.classList.add('dragging');
                startRect = draggedConstellation.getBoundingClientRect();
                offsetX = e.clientX - startRect.left;
                offsetY = e.clientY - startRect.top;
                pointerDown = true;
            });

            constellation.addEventListener('pointermove', (e) => {
                if (isDragging && draggedConstellation === constellation && e.pointerId === activePointerId) {
                    const x = e.clientX - offsetX;
                    const y = e.clientY - offsetY;
                    draggedConstellation.style.left = x + 'px';
                    draggedConstellation.style.top = y + 'px';
                }
            });

            constellation.addEventListener('pointerup', (e) => {
                if (pointerDown && e.pointerId === activePointerId) {
                    try { constellation.releasePointerCapture(e.pointerId); } catch (err) {}
                    constellation.classList.remove('dragging');
                    isDragging = false;
                    draggedConstellation = null;
                    pointerDown = false;
                    activePointerId = null;
                }
            });

            // hover tooltip
            constellation.addEventListener('pointerenter', (e) => {
                const name = constellation.getAttribute('data-name') || 'Constellation';
                tooltip = createTooltip(name);
                const r = constellation.getBoundingClientRect();
                tooltip.style.left = (r.left + r.width/2) + 'px';
                tooltip.style.top = (r.top) + 'px';
            });
            constellation.addEventListener('pointerleave', (e) => {
                removeTooltip(tooltip);
                tooltip = null;
            });

            // click for particles (ignore if it was a drag)
            let moved = false;
            constellation.addEventListener('pointermove', () => { moved = true; });
            constellation.addEventListener('click', (e) => {
                if (moved) { moved = false; return; }
                createParticles(e.clientX, e.clientY, 16);
            });

            // double click to center & zoom briefly
            constellation.addEventListener('dblclick', (e) => {
                const parentRect = container.getBoundingClientRect();
                const svgRect = constellation.getBoundingClientRect();
                const centerX = parentRect.left + (parentRect.width - svgRect.width) / 2;
                const centerY = parentRect.top + (parentRect.height - svgRect.height) / 2;
                constellation.style.left = (centerX - parentRect.left) + 'px';
                constellation.style.top = (centerY - parentRect.top) + 'px';
                constellation.classList.add('zoomed');
                setTimeout(() => constellation.classList.remove('zoomed'), 1800);
            });

            // keyboard control
            constellation.addEventListener('keydown', (e) => {
                const step = e.shiftKey ? 12 : 6;
                const left = parseFloat(constellation.style.left || '0');
                const top = parseFloat(constellation.style.top || '0');
                if (e.key === 'ArrowLeft') constellation.style.left = (left - step) + 'px';
                if (e.key === 'ArrowRight') constellation.style.left = (left + step) + 'px';
                if (e.key === 'ArrowUp') constellation.style.top = (top - step) + 'px';
                if (e.key === 'ArrowDown') constellation.style.top = (top + step) + 'px';
                if (e.key === ' ' || e.key === 'Enter') { createParticles(constellation.getBoundingClientRect().left + 20, constellation.getBoundingClientRect().top + 20, 20); }
            });
        });

        // global pointermove/up to handle cases where pointer leaves the svg
        document.addEventListener('pointermove', (e) => {
            if (isDragging && draggedConstellation && e.pointerId === activePointerId) {
                const x = e.clientX - offsetX;
                const y = e.clientY - offsetY;
                draggedConstellation.style.left = x + 'px';
                draggedConstellation.style.top = y + 'px';
            }
        });

        document.addEventListener('pointerup', (e) => {
            if (isDragging && draggedConstellation && e.pointerId === activePointerId) {
                try { draggedConstellation.releasePointerCapture(e.pointerId); } catch (err) {}
                draggedConstellation.classList.remove('dragging');
                isDragging = false;
                draggedConstellation = null;
                activePointerId = null;
    }
});

constellationElements[0].classList.add('active');

// --- More lively motion & per-star tooltips ---
// Give each constellation a small, unique motion profile and make interior stars wobble
const constellationMotion = [];
constellationElements.forEach((svg, sIndex) => {
    const amp = 8 + Math.random() * 14; // translation amplitude
    const freq = 0.35 + Math.random() * 1.0; // speed
    const rotAmp = (Math.random() - 0.5) * 2.4; // rotation amplitude
    const phase = Math.random() * Math.PI * 2;
    constellationMotion.push({ svg, amp, freq, rotAmp, phase });

    // set base positions for internal stars so we can wobble them
    svg.querySelectorAll('circle.pickable-star').forEach((c, i) => {
        c.dataset.base_cx = c.getAttribute('cx');
        c.dataset.base_cy = c.getAttribute('cy');
        c.dataset.wobbleX = (Math.random() * 4) - 2;
        c.dataset.wobbleY = (Math.random() * 4) - 2;
        c.dataset.wobblePhase = Math.random() * Math.PI * 2;
        c.style.transition = 'transform 180ms cubic-bezier(.2,.8,.2,1)';
        c.style.cursor = 'pointer';

        // per-star tooltip showing a name
        c.addEventListener('pointerenter', (ev) => {
            const rect = c.getBoundingClientRect();
            const name = `${svg.getAttribute('data-name') || 'Constellation'} • Star ${i + 1}`;
            const tip = createTooltip(name);
            tip.style.left = (rect.left + rect.width / 2) + 'px';
            tip.style.top = (rect.top - 12) + 'px';
            c._starTooltip = tip;
            // highlight visually (scale via CSS transform)
            c.style.transform = 'scale(1.35)';
        });
        c.addEventListener('pointerleave', () => {
            removeTooltip(c._starTooltip);
            c._starTooltip = null;
            c.style.transform = '';
        });

        // click for micro-particles
        c.addEventListener('click', (ev) => {
            createParticles(ev.clientX, ev.clientY, 10);
        });
    });
});

// animation loop
function animateConstellations() {
    const t = performance.now() / 1000;
    constellationMotion.forEach((m, idx) => {
        const { svg, amp, freq, rotAmp, phase } = m;
        const tx = Math.sin(t * freq + phase) * amp;
        const ty = Math.cos(t * (freq * 0.7) + phase * 0.9) * (amp * 0.45);
        const r = Math.sin(t * (freq * 0.6) + phase * 0.4) * rotAmp;
        svg.style.transform = `translate(${tx}px, ${ty}px) rotate(${r}deg)`;

        // wobble internal stars by adjusting cx/cy based on base positions
        svg.querySelectorAll('circle.pickable-star').forEach((c) => {
            const baseX = parseFloat(c.dataset.base_cx || c.getAttribute('cx'));
            const baseY = parseFloat(c.dataset.base_cy || c.getAttribute('cy'));
            const px = Math.cos(t * 1.6 + parseFloat(c.dataset.wobblePhase || 0)) * (parseFloat(c.dataset.wobbleX) || 2);
            const py = Math.sin((t * 1.2) + parseFloat(c.dataset.wobblePhase || 0)) * (parseFloat(c.dataset.wobbleY) || 2);
            c.setAttribute('cx', (baseX + px).toString());
            c.setAttribute('cy', (baseY + py).toString());
        });
    });
    requestAnimationFrame(animateConstellations);
}

requestAnimationFrame(animateConstellations);

function changeConstellation() {
    constellationElements[currentIndex].classList.remove('active');
    currentIndex = (currentIndex + 1) % constellations.length;
    setTimeout(() => {
        constellationElements[currentIndex].classList.add('active');
    }, 500);
}

setInterval(changeConstellation, 3000);

// --- Floating space cat ---
function createSpaceCat() {
    const el = document.createElement('div');
    el.className = 'space-cat';
    el.innerHTML = `
        <svg viewBox="0 0 160 120" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <g transform="translate(0,6)">
                <!-- tail -->
                <path class="cat-tail" d="M18 74 C 6 62, 4 44, 20 34 C 34 24, 54 30, 62 42" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round" opacity="0.95" />
                <!-- body -->
                <ellipse cx="88" cy="70" rx="42" ry="30" fill="#fff" opacity="0.98" />
                <!-- head -->
                <circle cx="52" cy="46" r="28" fill="#fff" />
                <!-- ears -->
                <polygon points="40,28 28,10 52,24" fill="#fff" />
                <polygon points="64,28 84,10 76,28" fill="#fff" />
                <!-- eyes -->
                <circle class="cat-eye" cx="44" cy="46" r="4.6" fill="#111" />
                <circle class="cat-eye" cx="60" cy="46" r="4.6" fill="#111" />
                <!-- nose -->
                <path d="M52 54 Q56 58 60 54" stroke="#e07" stroke-width="2" fill="none" stroke-linecap="round"/>
                <!-- whiskers -->
                <path d="M36 54 H20" stroke="#ddd" stroke-width="1.4" stroke-linecap="round"/>
                <path d="M68 54 H84" stroke="#ddd" stroke-width="1.4" stroke-linecap="round"/>
                <!-- little sparkle near ear -->
                <circle cx="98" cy="26" r="3" fill="#fff" opacity="0.9" />
            </g>
        </svg>`;

    // initial position
    el.style.left = '12%';
    el.style.top = '18%';
    document.body.appendChild(el);

    // pointer dragging
    let dragging = false; let pointerId = null; let offX = 0; let offY = 0;
    el.addEventListener('pointerdown', (e) => {
        e.preventDefault();
        try { el.setPointerCapture(e.pointerId); } catch (err) {}
        dragging = true; pointerId = e.pointerId;
        el.classList.add('dragging');
        const r = el.getBoundingClientRect();
        offX = e.clientX - r.left; offY = e.clientY - r.top;
    });
    document.addEventListener('pointermove', (e) => {
        if (dragging && e.pointerId === pointerId) {
            el.style.left = (e.clientX - offX) + 'px';
            el.style.top = (e.clientY - offY) + 'px';
        }
    });
    document.addEventListener('pointerup', (e) => {
        if (dragging && e.pointerId === pointerId) {
            try { el.releasePointerCapture(e.pointerId); } catch (err) {}
            dragging = false; pointerId = null; el.classList.remove('dragging');
        }
    });

    // click interaction: particle burst + tiny meow
    el.addEventListener('click', (e) => {
        const rect = el.getBoundingClientRect();
        createParticles(rect.left + rect.width/2, rect.top + rect.height/2, 22, '#fff');
        playMeow();
    });

    // gentle auto-movement path (sine-based) if not dragging
    let baseLeft = parseFloat(el.style.left) || 0;
    let baseTop = parseFloat(el.style.top) || 0;
    let start = performance.now();
    function catLoop(t) {
        if (!document.body.contains(el)) return; // stop if removed
        if (!dragging) {
            const dt = (t - start) / 1000;
            const x = baseLeft + Math.cos(dt * 0.6) * 86;
            const y = baseTop + Math.sin(dt * 0.9 + 0.6) * 28;
            el.style.left = x + 'px';
            el.style.top = y + 'px';
        } else {
            baseLeft = parseFloat(el.style.left) || baseLeft;
            baseTop = parseFloat(el.style.top) || baseTop;
            start = t;
        }
        requestAnimationFrame(catLoop);
    }
    requestAnimationFrame(catLoop);
}

function playMeow(){
    try{
        const ctx = new (window.AudioContext || window.webkitAudioContext)();
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.type = 'sine'; o.frequency.setValueAtTime(520, ctx.currentTime);
        o.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.36);
        g.gain.setValueAtTime(0.0001, ctx.currentTime);
        g.gain.exponentialRampToValueAtTime(0.13, ctx.currentTime + 0.02);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.46);
        o.connect(g); g.connect(ctx.destination); o.start(); o.stop(ctx.currentTime + 0.5);
    } catch (e) { /* ignore on unsupported */ }
}

createSpaceCat();
