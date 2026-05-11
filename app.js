document.addEventListener('DOMContentLoaded', () => {

    // ── Theme Toggle ──
    const html = document.documentElement;
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        html.setAttribute('data-theme', 'dark');
        themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
    themeToggle?.addEventListener('click', () => {
        const isDark = html.getAttribute('data-theme') === 'dark';
        html.setAttribute('data-theme', isDark ? 'light' : 'dark');
        localStorage.setItem('theme', isDark ? 'light' : 'dark');
        themeIcon.classList.toggle('fa-moon', !isDark);
        themeIcon.classList.toggle('fa-sun', isDark);
    });

    // ── Mobile Menu ──
    const menuToggle = document.getElementById('menuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('menuOverlay');
    const menuIcon = menuToggle?.querySelector('i');

    const openMenu = () => {
        mobileMenu?.classList.add('active');
        overlay?.classList.add('active');
        if (menuIcon) { menuIcon.classList.replace('fa-bars', 'fa-times'); }
    };
    const closeMenu = () => {
        mobileMenu?.classList.remove('active');
        overlay?.classList.remove('active');
        if (menuIcon) { menuIcon.classList.replace('fa-times', 'fa-bars'); }
    };
    menuToggle?.addEventListener('click', (e) => {
        e.stopPropagation();
        mobileMenu?.classList.contains('active') ? closeMenu() : openMenu();
    });
    overlay?.addEventListener('click', closeMenu);
    mobileMenu?.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));

    // ── Smooth Scroll ──
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#' || !targetId) return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ── Scroll Reveal ──
    const revealElements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => observer.observe(el));

    // ── Particle Background ──
    const particleCanvas = document.createElement('canvas');
    particleCanvas.style.position = 'fixed';
    particleCanvas.style.top = '0';
    particleCanvas.style.left = '0';
    particleCanvas.style.width = '100%';
    particleCanvas.style.height = '100%';
    particleCanvas.style.pointerEvents = 'none';
    particleCanvas.style.zIndex = '0';
    particleCanvas.style.opacity = '0.15';
    document.body.prepend(particleCanvas);
    const ctx = particleCanvas.getContext('2d');

    let particles = [];
    const resizeCanvas = () => {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * particleCanvas.width;
            this.y = Math.random() * particleCanvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x < 0 || this.x > particleCanvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > particleCanvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            const theme = document.documentElement.getAttribute('data-theme');
            ctx.fillStyle = theme === 'dark' ? 'rgba(255,255,255,0.4)' : 'rgba(0,0,0,0.15)';
            ctx.fill();
        }
    }

    const initParticles = () => {
        particles = [];
        const count = Math.min(40, Math.floor((particleCanvas.width * particleCanvas.height) / 15000));
        for (let i = 0; i < count; i++) particles.push(new Particle());
    };

    const animateParticles = () => {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        requestAnimationFrame(animateParticles);
    };

    initParticles();
    animateParticles();

    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            resizeCanvas();
            initParticles();
        }, 300);
    });

});
