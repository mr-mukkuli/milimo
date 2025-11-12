// ==================== CURSOR TORCH EFFECT ====================
class TorchEffect {
    constructor() {
        this.canvas = document.getElementById('torchCanvas');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.mouse = { x: 0, y: 0 };
        this.smoothMouse = { x: 0, y: 0 };
        this.hiddenObjects = document.querySelectorAll('.hidden-object');
        
        this.init();
    }
    
    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        document.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });
        
        this.animate();
    }
    
    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    
    animate() {
        this.smoothMouse.x += (this.mouse.x - this.smoothMouse.x) * 0.1;
        this.smoothMouse.y += (this.mouse.y - this.smoothMouse.y) * 0.1;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const flicker = 1 + Math.sin(Date.now() * 0.003) * 0.03;
        const torchRadius = 350 * flicker;
        
        const gradient = this.ctx.createRadialGradient(
            this.smoothMouse.x, this.smoothMouse.y, 0,
            this.smoothMouse.x, this.smoothMouse.y, torchRadius
        );
        
        gradient.addColorStop(0, 'rgba(255, 180, 100, 0.15)');
        gradient.addColorStop(0.3, 'rgba(255, 150, 80, 0.08)');
        gradient.addColorStop(0.6, 'rgba(200, 120, 60, 0.03)');
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.revealObjects();
        
        requestAnimationFrame(() => this.animate());
    }
    
    revealObjects() {
        this.hiddenObjects.forEach(obj => {
            const rect = obj.getBoundingClientRect();
            const objX = rect.left + rect.width / 2;
            const objY = rect.top + rect.height / 2;
            
            const dx = this.smoothMouse.x - objX;
            const dy = this.smoothMouse.y - objY;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            const maxDistance = 400;
            if (distance < maxDistance) {
                const opacity = 0.05 + (1 - distance / maxDistance) * 0.35;
                obj.style.opacity = opacity;
            } else {
                obj.style.opacity = 0.05;
            }
        });
    }
}

if (window.innerWidth > 768) {
    new TorchEffect();
}

// ==================== SMOOTH SCROLL ====================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== SNAP SCROLL WITH FADE IN/OUT ====================
const sections = document.querySelectorAll('.section');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        } else {
            entry.target.classList.remove('visible');
        }
    });
}, {
    threshold: 0.3,
    rootMargin: '-10% 0px -10% 0px'
});

sections.forEach(section => {
    sectionObserver.observe(section);
});

if (sections.length > 0) {
    sections[0].classList.add('visible');
}

// ==================== FIXED CONTACT SECTION FADE OUT ON CONTACT SECTION ====================
const fixedContact = document.getElementById('fixedContact');
const contactSection = document.getElementById('contact');

if (fixedContact && contactSection) {
    const contactObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                fixedContact.classList.add('hidden');
            } else {
                fixedContact.classList.remove('hidden');
            }
        });
    }, {
        threshold: 0.3
    });
    
    contactObserver.observe(contactSection);
}

// ==================== PROJECT CARDS ANIMATION ====================
const projectObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, {
    threshold: 0.1
});

document.querySelectorAll('.project-item').forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateY(40px)';
    item.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    projectObserver.observe(item);
});

// ==================== SCROLL INDICATOR ====================
const scrollIndicator = document.querySelector('.scroll-indicator');
if (scrollIndicator) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            scrollIndicator.style.opacity = '0';
        } else {
            scrollIndicator.style.opacity = '1';
        }
    });
}

// ==================== LOADING ANIMATION ====================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

console.log('Portfolio initialized ✨');
