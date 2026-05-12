document.addEventListener('DOMContentLoaded', async () => {
    // --- Supabase Connection ---
    const SUPABASE_URL = 'https://pgrtiirtkoaxnpnybmuw.supabase.co';
    const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBncnRpaXJ0a29heG5wbnlibXV3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MjY0ODcsImV4cCI6MjA4NjAwMjQ4N30.uZhiTWtKjCpT8eAaiHuX0f_3S2bD3uQyUc0feINw948';
    const _supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

    // --- Navbar Scroll Effect ---
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.padding = '1rem 0';
            navbar.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.padding = '1.5rem 0';
            navbar.style.boxShadow = 'none';
        }
    });

    // --- Waitlist Form Submission ---
    const waitlistForm = document.getElementById('waitlist-form');
    const formMessage = document.getElementById('form-message');

    if (waitlistForm) {
        waitlistForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;

            // Visual feedback
            const submitBtn = waitlistForm.querySelector('button');
            const originalBtnText = submitBtn.innerText;
            submitBtn.innerText = 'Syncing...';
            submitBtn.disabled = true;

            try {
                // REAL SUPABASE INSERT
                const { error } = await _supabase
                    .from('waitlist')
                    .insert([{ email: email }]);

                if (error) throw error;

                // Success Modal
                showModal(
                    'check-circle',
                    'Welcome to the Brohood.',
                    `We've registered <strong>${email}</strong>. Check your inbox for the Private Beta invite soon.`
                );
                
                waitlistForm.reset();
                localStorage.setItem('brosky_waitlist_joined', 'true');
                updateWaitlistCount(); // Update the counter immediately
            } catch (error) {
                console.error('Waitlist error:', error);
                
                if (error.code === '23505') {
                    showModal(
                        'user-check',
                        'Already Enlisted.',
                        `The email <strong>${email}</strong> is already in the queue, Bro. We'll be in touch soon.`
                    );
                } else {
                    showModal(
                        'alert-circle',
                        'System Glitch.',
                        'Something went wrong on our end. Please try again in a moment.',
                        true
                    );
                }
            } finally {
                submitBtn.innerText = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // --- Modal Logic ---
    const modal = document.getElementById('custom-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalMessage = document.getElementById('modal-message');
    const modalIconContainer = document.getElementById('modal-icon');
    const closeModalBtn = document.getElementById('close-modal');

    function showModal(iconName, title, message, isError = false) {
        modalTitle.innerText = title;
        modalMessage.innerHTML = message;
        
        // Update icon
        modalIconContainer.innerHTML = `<i data-lucide="${iconName}"></i>`;
        if (isError) {
            modalIconContainer.classList.add('error');
        } else {
            modalIconContainer.classList.remove('error');
        }
        
        lucide.createIcons();
        modal.classList.remove('hidden');
    }

    closeModalBtn.addEventListener('click', () => {
        modal.classList.add('hidden');
    });

    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.add('hidden');
    });

    // --- Scroll Reveal Animations ---
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in classes to elements
    const fadeElements = document.querySelectorAll('.feature-card, .mission-content, .waitlist-card');
    fadeElements.forEach(el => {
        el.classList.add('fade-in-hidden');
        observer.observe(el);
    });

    // Add necessary CSS for scroll reveal
    const style = document.createElement('style');
    style.textContent = `
        .fade-in-hidden {
            opacity: 0;
            transform: translateY(30px);
            transition: opacity 0.8s ease-out, transform 0.8s ease-out;
        }
        .fade-in-visible {
            opacity: 1;
            transform: translateY(0);
        }
        .hidden { display: none; }
        .success-message {
            padding: 2rem;
            background: rgba(20, 184, 166, 0.1);
            border-radius: 20px;
            border: 1px solid rgba(20, 184, 166, 0.2);
        }
    `;
    document.head.appendChild(style);

    // --- Smooth Anchor Scrolling ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // --- FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) otherItem.classList.remove('active');
            });
            item.classList.toggle('active');
        });
    });

    // --- Avatar Carousel ---
    const avatarItems = document.querySelectorAll('.avatar-item');
    const displayQuote = document.getElementById('display-quote');
    const displayAuthor = document.getElementById('display-author');
    const displayTitle = document.getElementById('display-title');

    avatarItems.forEach(item => {
        item.addEventListener('click', () => {
            // Remove active class from all
            avatarItems.forEach(ai => ai.classList.remove('active'));
            // Add to clicked
            item.classList.add('active');

            // Update content with fade effect
            const quoteBox = document.querySelector('.quote-box');
            quoteBox.style.opacity = '0';
            
            setTimeout(() => {
                displayQuote.innerText = item.getAttribute('data-quote');
                displayAuthor.innerText = item.getAttribute('data-author');
                displayTitle.innerText = item.getAttribute('data-title');
                quoteBox.style.opacity = '1';
                quoteBox.style.transition = 'opacity 0.5s ease';
            }, 300);
        });
    });
    // --- Scroll Progress Bar ---
    const progressBar = document.getElementById('scroll-progress');
    
    window.addEventListener('scroll', () => {
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollTop = document.documentElement.scrollTop;
        const width = (scrollTop / height) * 100;
        progressBar.style.width = width + '%';
    });

    // --- Live Waitlist Count ---
    const waitlistCountEl = document.getElementById('waitlist-count');
    
    async function updateWaitlistCount() {
        try {
            const { count, error } = await _supabase
                .from('waitlist')
                .select('*', { count: 'exact', head: true });

            if (error) throw error;
            
            const displayCount = count || 0; 
            waitlistCountEl.innerText = `${displayCount.toLocaleString()} BROTHERS IN THE QUEUE`;
        } catch (err) {
            console.error('Error fetching waitlist count:', err);
            waitlistCountEl.innerText = 'JOINING 1,200+ BROTHERS IN THE QUEUE...';
        }
    }

    updateWaitlistCount();
    setInterval(updateWaitlistCount, 30000);
});
