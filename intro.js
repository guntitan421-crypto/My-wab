import { initQuiz } from './quiz.js';

// Hand-drawn SVG intro: rocket draws the title while emitting smoke. After animation, show Start button.
const DURATION = 1800; // drawing duration
const SMOKE_COUNT = 10;

function makeSmoke(svg, x, y) {
  const ns = 'http://www.w3.org/2000/svg';
  const c = document.createElementNS(ns, 'circle');
  const r = 6 + Math.random() * 10;
  c.setAttribute('cx', x + (Math.random() - 0.5) * 12);
  c.setAttribute('cy', y + (Math.random() - 0.5) * 12);
  c.setAttribute('r', r);
  c.setAttribute('class', 'smoke');
  c.style.opacity = '0';
  svg.appendChild(c);

  const dur = 900 + Math.random() * 700;
  c.animate([
    { transform: 'translateY(0) scale(0.8)', opacity: 0 },
    { transform: `translateY(-40px) scale(1.2)`, opacity: 0.35 },
    { transform: `translateY(-70px) scale(1.6)`, opacity: 0 }
  ], { duration: dur, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });

  setTimeout(() => c.remove(), dur + 50);
  return c;
}

export function bootIntro() {
  const overlay = document.getElementById('introOverlay');
  if (!overlay) return;

  // replace simple text with SVG for stroke animation
  const card = overlay.querySelector('.intro-card');
  const title = overlay.querySelector('.intro-title');
  title.style.display = 'none';

  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', '0 0 800 160');
  svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
  svg.classList.add('intro-svg');

  // nicer title (hand-drawn feel) using stroke + small wobble
  const defs = document.createElementNS(ns, 'defs');
  defs.innerHTML = `
    <linearGradient id="gradText" x1="0" x2="1">
      <stop offset="0%" stop-color="#fff" stop-opacity=".98" />
      <stop offset="100%" stop-color="#d6b3ff" stop-opacity=".98" />
    </linearGradient>
    <linearGradient id="gradFlame" x1="0" x2="0" y1="0" y2="1">
      <stop offset="0%" stop-color="#ffd166" />
      <stop offset="60%" stop-color="#ff7ae0" />
      <stop offset="100%" stop-color="#a855f7" />
    </linearGradient>
  `;
  svg.appendChild(defs);

  const text = document.createElementNS(ns, 'text');
  text.setAttribute('x', '50%');
  text.setAttribute('y', '62');
  text.setAttribute('text-anchor', 'middle');
  text.setAttribute('class', 'stroke-text wobble');
  text.setAttribute('font-size', '46');
  text.setAttribute('font-family', "'Segoe UI', 'Comic Sans MS', 'Brush Script MT', cursive");
  text.textContent = 'STUDY PLAN GUIDE';
  svg.appendChild(text);

  // detailed rocket group (body, fins, window, flame)
  const rocketGroup = document.createElementNS(ns, 'g');
  rocketGroup.setAttribute('id', 'rocketNode');

  // body
  const body = document.createElementNS(ns, 'path');
  body.setAttribute('d', 'M0,-22 C10,-18 16,-6 14,6 C12,20 6,28 0,28 C-6,28 -12,20 -14,6 C-16,-6 -10,-18 0,-22 Z');
  body.setAttribute('fill', '#fff');
  body.setAttribute('stroke', 'rgba(168,85,247,0.14)');
  body.setAttribute('stroke-width', '1');
  body.setAttribute('class', 'rocket-body');
  rocketGroup.appendChild(body);

  // window
  const windowCircle = document.createElementNS(ns, 'circle');
  windowCircle.setAttribute('cx', '0');
  windowCircle.setAttribute('cy', '2');
  windowCircle.setAttribute('r', '6');
  windowCircle.setAttribute('fill', '#eef6ff');
  windowCircle.setAttribute('stroke', 'rgba(0,0,0,0.06)');
  windowCircle.setAttribute('stroke-width', '0.7');
  windowCircle.setAttribute('class', 'rocket-window');
  rocketGroup.appendChild(windowCircle);

  // left fin
  const finL = document.createElementNS(ns, 'path');
  finL.setAttribute('d', 'M-8,10 L-22,18 L-8,18 Z');
  finL.setAttribute('fill', '#b87ef0');
  finL.setAttribute('class', 'rocket-fin');
  rocketGroup.appendChild(finL);

  // right fin
  const finR = document.createElementNS(ns, 'path');
  finR.setAttribute('d', 'M8,10 L22,18 L8,18 Z');
  finR.setAttribute('fill', '#b87ef0');
  finR.setAttribute('class', 'rocket-fin');
  rocketGroup.appendChild(finR);

  // flame (under the rocket)
  const flame = document.createElementNS(ns, 'path');
  flame.setAttribute('d', 'M-6,28 C-2,34 2,34 6,28 C2,40 -2,40 -6,28 Z');
  flame.setAttribute('fill', 'url(#gradFlame)');
  flame.setAttribute('class', 'rocket-flame');
  rocketGroup.appendChild(flame);
  // gentle flicker for flame
  flame.animate([
    { transform: 'scaleY(0.92)', opacity: 0.95 },
    { transform: 'scaleY(1.08)', opacity: 1 },
    { transform: 'scaleY(0.96)', opacity: 0.95 }
  ], { duration: 360 + Math.random() * 120, iterations: Infinity, easing: 'ease-in-out' });

  // group position
  rocketGroup.setAttribute('transform', 'translate(0,40)');
  svg.appendChild(rocketGroup);

  // attach svg above subtitle
  card.insertBefore(svg, card.querySelector('.intro-sub'));

  // make rocketNode var (compat with original animation code)
  const rocketNode = rocketGroup;

  // measure text length and set stroke dash
  const len = text.getComputedTextLength();
  text.style.stroke = 'url(#gradText)';
  text.style.strokeWidth = '2.2px';
  text.style.fill = 'transparent';
  text.style.strokeLinecap = 'round';
  text.style.strokeLinejoin = 'round';
  text.style.strokeDasharray = len;
  text.style.strokeDashoffset = len;

  // animate drawing while rocket moves across
  // rocket movement path: from left (10%) to right (90%) of svg width
  const svgRect = svg.viewBox.baseVal;
  const startX = svgRect.width * 0.06;
  const endX = svgRect.width * 0.94;
  const rocketY = 40;

  // place rocket initially left
  rocketNode.setAttribute('transform', `translate(${startX - 16}, ${rocketY})`);

  // create smoke timed during animation
  const smokeInterval = DURATION / SMOKE_COUNT;

  // start animations
  const startTime = performance.now();

  // rocket animation (translate across) — face right and tilt slightly up while flying
  rocketNode.animate([
    { transform: `translate(${startX - 16}px, ${rocketY}px) rotate(6deg) scale(1)` },
    { transform: `translate(${endX - 16}px, ${rocketY - 18}px) rotate(12deg) scale(1.06)` }
  ], { duration: DURATION, easing: 'cubic-bezier(.25,.9,.2,1)', fill: 'forwards' });

  // primary smoke trail while the rocket moves
  for (let i = 0; i < SMOKE_COUNT; i++) {
    setTimeout(() => {
      const tProgress = i / SMOKE_COUNT;
      const x = startX + (endX - startX) * tProgress + (Math.random() - 0.5) * 8;
      const y = rocketY + (Math.random() - 0.3) * 8;
      makeSmoke(svg, x, y);
    }, i * smokeInterval);
  }

  // start stroke (letters) after rocket has led the way, and add trailing smoke puffs along the text path
  const STROKE_DELAY = Math.round(DURATION * 0.28);
  const STROKE_DURATION = Math.max(900, Math.round(DURATION * 0.95));

  setTimeout(() => {
    const strokeAnim = text.animate([
      { strokeDashoffset: len },
      { strokeDashoffset: 0 }
    ], { duration: STROKE_DURATION, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });

    // spawn smoke puffs following the baseline of the text to give the impression the rocket 'drew' the letters
    const bbox = text.getBBox();
    const puffs = Math.max(10, Math.floor(bbox.width / 40));
    for (let j = 0; j < puffs; j++) {
      const px = bbox.x + (j / Math.max(1, (puffs - 1))) * bbox.width + (Math.random() - 0.5) * 6;
      const py = bbox.y + bbox.height * 0.6 + (Math.random() - 0.4) * 6;
      const delay = Math.round((j / puffs) * STROKE_DURATION) + Math.round(Math.random() * 120);
      setTimeout(() => makeSmoke(svg, px, py), delay);
    }

    // when stroke finishes, fill letters and show Start button with pop
    strokeAnim.onfinish = () => {
      text.style.fill = '#fff';
      text.style.transition = 'fill 320ms ease-in-out';

      // remove wobble (finish hand-drawn effect)
      text.classList.remove('wobble');

      const startBtn = document.getElementById('startBtn');
      startBtn.classList.remove('hidden');
      startBtn.classList.add('visible');

      // subtle title pop
      text.animate([
        { transform: 'scale(0.98)', opacity: 0.95 },
        { transform: 'scale(1.02)', opacity: 1 },
        { transform: 'scale(1)', opacity: 1 }
      ], { duration: 260, easing: 'cubic-bezier(.2,.8,.2,1)' });

      // small rocket burst and fade
      rocketNode.animate([
        { transform: `translate(${endX - 16}px, ${rocketY - 18}px) scale(1)` },
        { transform: `translate(${endX - 16}px, ${rocketY - 40}px) scale(0.88)`, opacity: 0 }
      ], { duration: 520, easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
    };

  }, STROKE_DELAY);

  // clicking start will remove overlay and init quiz
  document.getElementById('startBtn').addEventListener('click', (e) => {
    overlay.classList.add('intro-hide');
    setTimeout(() => { overlay.remove(); initQuiz(); }, 420);
  });

  // allow skipping by clicking overlay
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      overlay.classList.add('intro-hide');
      setTimeout(() => { overlay.remove(); initQuiz(); }, 320);
    }
  });
}

// auto boot for accessibility
window.addEventListener('DOMContentLoaded', () => {
  // expose boot to global for manual triggers
  window.bootIntro = bootIntro;
  // small delay for polish, then boot
  setTimeout(() => bootIntro(), 220);
});
