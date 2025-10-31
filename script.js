// Mobile menu functionality
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            hamburger.classList.toggle('active');
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-menu a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        });
    });
    
    // Smooth scrolling for anchor links
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
    
    // Add scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.about-content, .contact-content, .simulator-container');
    animateElements.forEach(el => {
        observer.observe(el);
    });
    
    // Hero slider logic
    const slider = document.querySelector('.hero-slider');
    if (slider) {
        const slides = Array.from(slider.querySelectorAll('.hero-slide'));
        const prevBtn = slider.querySelector('.hero-nav.prev');
        const nextBtn = slider.querySelector('.hero-nav.next');
        const dotsWrap = slider.parentElement.querySelector('.hero-dots');
        let index = 0;
        let autoplayTimer = null;

        function renderDots() {
            dotsWrap.innerHTML = '';
            slides.forEach((_, i) => {
                const b = document.createElement('button');
                b.setAttribute('aria-label', `Go to slide ${i+1}`);
                if (i === index) b.classList.add('active');
                b.addEventListener('click', () => { goTo(i); resetAutoplay(); });
                dotsWrap.appendChild(b);
            });
        }

        function goTo(i) {
            slides[index].classList.remove('active');
            index = (i + slides.length) % slides.length;
            slides[index].classList.add('active');
            renderDots();
        }

        function next() { goTo(index + 1); }
        function prev() { goTo(index - 1); }

        function resetAutoplay() {
            if (autoplayTimer) clearInterval(autoplayTimer);
            autoplayTimer = setInterval(next, 4000);
        }

        prevBtn.addEventListener('click', () => { prev(); resetAutoplay(); });
        nextBtn.addEventListener('click', () => { next(); resetAutoplay(); });

        renderDots();
        resetAutoplay();
    }

    // Header scroll effect
    const header = document.querySelector('.header');
    let lastScrollTop = 0;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.98)';
            header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
            header.style.boxShadow = 'none';
        }
        
        lastScrollTop = scrollTop;
    });
    
    // Add hover effects to app cards
    const appCards = document.querySelectorAll('.app-card');
    appCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Phone mockup hover effects
    const phoneScreen = document.querySelector('.phone-screen');
    if (phoneScreen) {
        phoneScreen.addEventListener('mouseenter', function() {
            this.style.transform = 'rotateY(-10deg) rotateX(2deg) scale(1.05)';
        });
        
        phoneScreen.addEventListener('mouseleave', function() {
            this.style.transform = 'rotateY(-15deg) rotateX(5deg) scale(1)';
        });
    }
    
    // Progress bar animation
    const progressFill = document.querySelector('.progress-fill');
    if (progressFill) {
        setTimeout(() => {
            progressFill.style.width = '65%';
        }, 1000);
    }
    
    // Pause button interaction
    const pauseBtn = document.querySelector('.pause-btn');
    if (pauseBtn) {
        pauseBtn.addEventListener('click', function() {
            if (this.textContent.includes('Pause')) {
                this.textContent = '▶️ Resume';
                this.style.background = '#4CAF50';
            } else {
                this.textContent = '⏸️ Pause';
                this.style.background = '#FF9800';
            }
        });
    }
    
    // Form validation (if you add forms later)
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            // Add your form submission logic here
            console.log('Form submitted');
        });
    });
});

// Tab switching functionality for simulator
function switchTab(tabName) {
    // Remove active class from all tabs and content
    const tabs = document.querySelectorAll('.tab');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabs.forEach(tab => tab.classList.remove('active'));
    tabContents.forEach(content => content.classList.remove('active'));
    
    // Add active class to clicked tab and corresponding content
    const activeTab = document.querySelector(`[onclick="switchTab('${tabName}')"]`);
    const activeContent = document.getElementById(`${tabName}-tab`);
    
    if (activeTab && activeContent) {
        activeTab.classList.add('active');
        activeContent.classList.add('active');
        
        // Add animation effect
        activeContent.style.opacity = '0';
        setTimeout(() => {
            activeContent.style.opacity = '1';
        }, 50);
    }
}

// Add CSS for mobile menu
const style = document.createElement('style');
style.textContent = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            left: -100%;
            top: 70px;
            flex-direction: column;
            background-color: rgba(255, 255, 255, 0.98);
            width: 100%;
            text-align: center;
            transition: 0.3s;
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
            padding: 2rem 0;
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-menu li {
            margin: 1rem 0;
        }
        
        .hamburger.active span:nth-child(1) {
            transform: rotate(-45deg) translate(-5px, 6px);
        }
        
        .hamburger.active span:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active span:nth-child(3) {
            transform: rotate(45deg) translate(-5px, -6px);
        }
    }
    
    .tab-content {
        transition: opacity 0.3s ease;
    }
    
    .phone-screen {
        transition: transform 0.3s ease;
    }
    
    .progress-fill {
        transition: width 1s ease-in-out;
    }
`;
document.head.appendChild(style); 