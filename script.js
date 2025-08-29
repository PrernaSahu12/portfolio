// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Get all navigation links
    const navLinks = document.querySelectorAll('.nav-links a');
    const hamburger = document.querySelector('.hamburger');
    const navLinksContainer = document.querySelector('.nav-links');
    const navbar = document.getElementById('navbar');

    // Smooth scroll for navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                // Close mobile menu if open
                navLinksContainer.classList.remove('active');
                hamburger.classList.remove('active');
            }
        });
    });

    // Mobile hamburger menu
    hamburger.addEventListener('click', function() {
        navLinksContainer.classList.toggle('active');
        hamburger.classList.toggle('active');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navLinksContainer.contains(e.target)) {
            navLinksContainer.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });

    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active navigation link highlighting
    window.addEventListener('scroll', function() {
        let current = '';
        const sections = document.querySelectorAll('section');
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe elements for animations
    const animateElements = document.querySelectorAll('.skill-category, .project-card, .about-content, .contact-content');
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16); // 60fps
        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                start = target;
                clearInterval(timer);
            }
            element.textContent = Math.floor(start) + '+';
        }, 16);
    }

    // Trigger counter animations when stats section is visible
    const statsObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumbers = entry.target.querySelectorAll('.stat-item h3');
                statNumbers.forEach(stat => {
                    const text = stat.textContent.trim();
                    const match = text.match(/(\d+)/);
                    // Only animate if a numeric value is present
                    if (!match) return;
                    const target = parseInt(match[1], 10);
                    if (isNaN(target)) return;
                    stat.textContent = '0+';
                    animateCounter(stat, target);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // Typing effect for hero subtitle
    function typeWriter(element, text, speed = 100) {
        let i = 0;
        element.textContent = '';
        
        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // Start typing effect after page load
    setTimeout(() => {
        const subtitle = document.querySelector('.hero .subtitle');
        if (subtitle) {
            const originalText = subtitle.textContent;
            typeWriter(subtitle, originalText, 100);
        }
    }, 1500);

    // Button click handlers
    const ctaButtons = document.querySelectorAll('.cta-buttons .btn');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            if (this.textContent.includes('Projects')) {
                e.preventDefault();
                const projectsSection = document.querySelector('#projects');
                if (projectsSection) {
                    const offsetTop = projectsSection.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            } else if (this.textContent.includes('CV')) {
                // Add your CV download logic here
                showNotification('CV download feature will be implemented soon!');
            }
        });
    });

    // Contact form handling
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const name = this.querySelector('input[type="text"]').value;
            const email = this.querySelector('input[type="email"]').value;
            const subject = this.querySelector('input[type="text"]:nth-of-type(2)').value;
            const message = this.querySelector('textarea').value;

            if (name && email && subject && message) {
                showNotification('Thank you for your message! I\'ll get back to you soon.');
                this.reset();
            } else {
                showNotification('Please fill in all fields.', 'error');
            }
        });
    }

    // Project card interactions
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Skill item hover effects
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(0, 212, 255, 0.3)';
        });

        item.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(0, 212, 255, 0.1)';
        });
    });

    // Notification system
    function showNotification(message, type = 'success', timeout = 3500) {
        // Remove existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
                <span>${message}</span>
            </div>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#4ecdc4' : '#ff6b6b'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            z-index: 10000;
            display: flex;
            align-items: center;
            gap: 0.5rem;`;

        document.body.appendChild(notification);

        // Auto-remove after timeout
        setTimeout(() => {
            if (notification && notification.parentNode) {
                notification.classList.add('hide');
                // small fade-out
                notification.style.transition = 'opacity 0.4s ease';
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 400);
            }
        }, timeout);
    }

    // End of DOMContentLoaded
});