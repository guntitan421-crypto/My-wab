console.log("Hello JavaScript");
const canvas = document.getElementById('spaceCanvas');
const ctx = canvas.getContext('2d');
        
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
        
window.addEventListener('resize', () => {
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
initStars();
});
        
const stars = [];
const shootingStars = [];
const numStars = 300;
        
class Star {
constructor() {
  this.x = Math.random() * canvas.width;
  this.y = Math.random() * canvas.height;
  this.size = Math.random() * 2;
  this.brightness = Math.random();
  this.twinkleSpeed = Math.random() * 0.02;
  this.color = Math.random() > 0.7 ? '#64b5f6' : '#ffffff';
}
            
update() {
  this.brightness += this.twinkleSpeed;
  if (this.brightness > 1 || this.brightness < 0) {
  this.twinkleSpeed = -this.twinkleSpeed;
  }
}
            
draw() {
  ctx.fillStyle = this.color === '#64b5f6' 
    ? `rgba(100, 181, 246, ${this.brightness})` 
    : `rgba(255, 255, 255, ${this.brightness})`;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.fill();
  }
}
        
class ShootingStar {
constructor() {
  this.x = Math.random() * canvas.width;
  this.y = Math.random() * canvas.height / 2;
  this.length = Math.random() * 100 + 30;
  this.speed = Math.random() * 12 + 6;
  this.angle = Math.PI / 4;
  this.opacity = 1;
}
            
update() {
  this.x += Math.cos(this.angle) * this.speed;
  this.y += Math.sin(this.angle) * this.speed;
  this.opacity -= 0.015;
}
            
draw() {
  const gradient = ctx.createLinearGradient(
    this.x, this.y,
    this.x - Math.cos(this.angle) * this.length,
    this.y - Math.sin(this.angle) * this.length
  );
  gradient.addColorStop(0, `rgba(100, 181, 246, ${this.opacity})`);
  gradient.addColorStop(1, 'rgba(100, 181, 246, 0)');
  ctx.strokeStyle = gradient;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(this.x, this.y);
  ctx.lineTo(
  this.x - Math.cos(this.angle) * this.length,
  this.y - Math.sin(this.angle) * this.length
  );
  ctx.stroke();
}
            
isOffScreen() {
  return this.x > canvas.width || this.y > canvas.height || this.opacity <= 0;
}
}
        
class KnowledgeOrb {
constructor() {
  this.x = Math.random() * canvas.width;
  this.y = Math.random() * canvas.height;
  this.radius = Math.random() * 3 + 2;
  this.vx = (Math.random() - 0.5) * 0.5;
  this.vy = (Math.random() - 0.5) * 0.5;
  this.hue = Math.random() * 60 + 180;
}
            
update() {
  this.x += this.vx;
  this.y += this.vy;
                
  if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
  if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
}
            
draw() {
  const gradient = ctx.createRadialGradient(
  this.x, this.y, 0,
  this.x, this.y, this.radius
  );
  gradient.addColorStop(0, `hsla(${this.hue}, 80%, 60%, 0.8)`);
  gradient.addColorStop(1, `hsla(${this.hue}, 80%, 60%, 0)`);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
  ctx.fill();
}
}
        
const knowledgeOrbs = [];
for (let i = 0; i < 20; i++) {
  knowledgeOrbs.push(new KnowledgeOrb());
}
        
function initStars() {
  stars.length = 0;
  for (let i = 0; i < numStars; i++) {
  stars.push(new Star());
}
}
        
function createShootingStar() {
  if (Math.random() < 0.008 && shootingStars.length < 2) {
  shootingStars.push(new ShootingStar());
}
}
        
function animate() {
  ctx.fillStyle = 'rgba(15, 12, 41, 0.15)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
            
  stars.forEach(star => {
    star.update();
    star.draw();
});
            
  knowledgeOrbs.forEach(orb => {
    orb.update();
    orb.draw();
  });
            
createShootingStar();
            
  shootingStars.forEach((star, index) => {
    star.update();
    star.draw();
                
  if (star.isOffScreen()) {
    shootingStars.splice(index, 1);
}
});
            
requestAnimationFrame(animate);  
}
initStars();
animate();

let currentIndex = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const dotsContainer = document.getElementById('dots');
        
// สร้าง dots
for (let i = 0; i < totalSlides; i++) {
  const dot = document.createElement('div');
  dot.className = 'dot';
  if (i === 0) dot.classList.add('active');
  dot.onclick = () => goToSlide(i);
  dotsContainer.appendChild(dot);
}
        
  function updateSlides() {
  slides.forEach((slide, index) => {
  slide.className = 'slide';
                
if (index === currentIndex) {
  slide.classList.add('active');
} else if (index === (currentIndex - 1 + totalSlides) % totalSlides) {
  slide.classList.add('prev');
} else if (index === (currentIndex + 1) % totalSlides) {
  slide.classList.add('next');
} else {
  slide.classList.add('hidden');
}
});
            
// อัพเดท dots
document.querySelectorAll('.dot').forEach((dot, index) => {
  dot.classList.toggle('active', index === currentIndex);
});
}
        
function nextSlide() {
  currentIndex = (currentIndex + 1) % totalSlides;
  updateSlides();
}
        
function prevSlide() {
  currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
  updateSlides();
}
        
function goToSlide(index) {
  currentIndex = index;
  updateSlides();
}
        
// เพิ่มการควบคุมด้วยคีย์บอร์ด
  document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowLeft') prevSlide();
  if (e.key === 'ArrowRight') nextSlide();
});
        
// เพิ่มการ swipe บนมือถือ
let touchStartX = 0;
let touchEndX = 0;
        
document.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
});
        
document.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  if (touchStartX - touchEndX > 50) nextSlide();
  if (touchEndX - touchStartX > 50) prevSlide();
});
        
// Auto play (optional)
let autoPlayInterval = setInterval(nextSlide, 4000);
// หยุด auto play เมื่อ hover
document.querySelector('.carousel-container').addEventListener('mouseenter', () => {
  clearInterval(autoPlayInterval);
});
document.querySelector('.carousel-container').addEventListener('mouseleave', () => {
  autoPlayInterval = setInterval(nextSlide, 4000);
});
        
// เริ่มต้น
updateSlides();
