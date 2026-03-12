// ============================================
// ALTYNAI — Website JavaScript
// Scroll animations, particles, navigation
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Navigation Toggle ---
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // --- Navbar scroll effect ---
    const navbar = document.getElementById('navbar');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        lastScroll = currentScroll;
    }, { passive: true });

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // --- Counter Animation ---
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.stat-number');
                counters.forEach(counter => {
                    const target = parseInt(counter.getAttribute('data-count'));
                    const duration = 2000;
                    const increment = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.textContent = target;
                        }
                    };

                    updateCounter();
                });
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.hero-stats');
    if (statsSection) {
        counterObserver.observe(statsSection);
    }

    // --- Floating Particles ---
    const particlesContainer = document.getElementById('particles');
    const colors = [
        'rgba(236, 72, 153, 0.4)',
        'rgba(168, 85, 247, 0.4)',
        'rgba(217, 70, 239, 0.3)',
        'rgba(251, 191, 36, 0.3)',
        'rgba(244, 114, 182, 0.3)',
        'rgba(192, 132, 252, 0.3)',
        'rgba(251, 113, 133, 0.3)'
    ];

    function createParticle() {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        const size = Math.random() * 12 + 4;
        const color = colors[Math.floor(Math.random() * colors.length)];
        const left = Math.random() * 100;
        const duration = Math.random() * 15 + 10;
        const delay = Math.random() * 5;

        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.background = color;
        particle.style.left = left + '%';
        particle.style.animationDuration = duration + 's';
        particle.style.animationDelay = delay + 's';

        particlesContainer.appendChild(particle);

        // Remove and recreate after animation
        setTimeout(() => {
            particle.remove();
            createParticle();
        }, (duration + delay) * 1000);
    }

    // Create initial set of particles
    const particleCount = window.innerWidth < 768 ? 8 : 15;
    for (let i = 0; i < particleCount; i++) {
        setTimeout(() => createParticle(), i * 300);
    }

    // --- Smooth scroll for anchor links ---
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

    // --- Parallax effect on hero shapes ---
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                const scrolled = window.pageYOffset;
                const shapes = document.querySelectorAll('.shape');
                shapes.forEach((shape, index) => {
                    const speed = 0.1 + (index * 0.05);
                    shape.style.transform = `translateY(${scrolled * speed}px)`;
                });
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // --- Video gallery: play/pause on click + sound toggle + progress bar ---
    document.querySelectorAll('.gallery-item.video-item').forEach(item => {
        const video = item.querySelector('video');
        const overlay = item.querySelector('.gallery-overlay');
        const soundBtn = item.querySelector('.sound-btn');
        const progressBar = item.querySelector('.video-progress');
        const progressFill = item.querySelector('.video-progress-fill');

        // Play/pause on overlay click
        overlay.addEventListener('click', () => {
            if (video.paused) {
                // Pause all other videos first
                document.querySelectorAll('.gallery-item.video-item video').forEach(v => {
                    if (v !== video) {
                        v.pause();
                        v.muted = true;
                        const otherItem = v.closest('.gallery-item');
                        otherItem.classList.remove('playing');
                        updateSoundIcon(otherItem, true);
                    }
                });
                video.play();
                item.classList.add('playing');
            } else {
                video.pause();
                item.classList.remove('playing');
            }
        });

        // Sound toggle button
        if (soundBtn) {
            soundBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                video.muted = !video.muted;
                updateSoundIcon(item, video.muted);
            });
        }

        // Progress bar update
        video.addEventListener('timeupdate', () => {
            if (video.duration) {
                const percent = (video.currentTime / video.duration) * 100;
                progressFill.style.width = percent + '%';
            }
        });

        // Seek on progress bar click/drag
        if (progressBar) {
            let isSeeking = false;

            const seekTo = (e) => {
                const rect = progressBar.getBoundingClientRect();
                const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
                const percent = x / rect.width;
                if (video.duration) {
                    video.currentTime = percent * video.duration;
                }
            };

            progressBar.addEventListener('click', (e) => {
                e.stopPropagation();
                seekTo(e);
            });

            progressBar.addEventListener('mousedown', (e) => {
                e.stopPropagation();
                isSeeking = true;
                seekTo(e);
            });

            document.addEventListener('mousemove', (e) => {
                if (isSeeking) seekTo(e);
            });

            document.addEventListener('mouseup', () => {
                isSeeking = false;
            });

            // Touch support
            progressBar.addEventListener('touchstart', (e) => {
                e.stopPropagation();
                isSeeking = true;
                seekTo(e.touches[0]);
            }, { passive: true });

            progressBar.addEventListener('touchmove', (e) => {
                if (isSeeking) seekTo(e.touches[0]);
            }, { passive: true });

            progressBar.addEventListener('touchend', () => {
                isSeeking = false;
            });
        }
    });

    function updateSoundIcon(item, isMuted) {
        const mutedIcon = item.querySelector('.icon-muted');
        const unmutedIcon = item.querySelector('.icon-unmuted');
        if (mutedIcon && unmutedIcon) {
            mutedIcon.style.display = isMuted ? 'block' : 'none';
            unmutedIcon.style.display = isMuted ? 'none' : 'block';
        }
    }

    // --- Pricing card hover glow ---
    document.querySelectorAll('.pricing-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });

});
