// This file contains JavaScript code to handle interactivity on the clothing website.

// Function to validate email format
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

// Function to show loading state
function showLoading(button, text = 'Loading...') {
    button.disabled = true;
    button.textContent = text;
}

// Function to hide loading state
function hideLoading(button, originalText) {
    button.disabled = false;
    button.textContent = originalText;
}

// Function to show error message
function showError(message) {
    // Create or update error message element
    let errorDiv = document.querySelector('.auth-error');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'auth-error';
        errorDiv.style.cssText = `
            background: #fee2e2;
            color: #dc2626;
            padding: 0.75rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            border: 1px solid #fecaca;
            font-size: 0.9rem;
        `;
        const form = document.querySelector('.auth-form');
        if (form) {
            form.insertBefore(errorDiv, form.firstChild);
        }
    }
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

// Function to hide error message
function hideError() {
    const errorDiv = document.querySelector('.auth-error');
    if (errorDiv) {
        errorDiv.style.display = 'none';
    }
}

// Function to show success message
function showSuccess(message) {
    let successDiv = document.querySelector('.auth-success');
    if (!successDiv) {
        successDiv = document.createElement('div');
        successDiv.className = 'auth-success';
        successDiv.style.cssText = `
            background: #dcfce7;
            color: #16a34a;
            padding: 0.75rem;
            border-radius: 8px;
            margin-bottom: 1rem;
            border: 1px solid #bbf7d0;
            font-size: 0.9rem;
        `;
        const form = document.querySelector('.auth-form');
        if (form) {
            form.insertBefore(successDiv, form.firstChild);
        }
    }
    successDiv.textContent = message;
    successDiv.style.display = 'block';
}

// Wait for auth service to be available and then set up event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for authService to initialize
    setTimeout(() => {
        setupAuthEventListeners();
        setupModalBehavior();
        setupSmoothScrolling();
        setupActiveNavigation();
    }, 100);
});

function setupAuthEventListeners() {
    // Handle sign-in form submission
    const signinForm = document.getElementById('signin-form');
    if (signinForm) {
        signinForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            hideError();

            const email = document.getElementById('signin-email').value;
            const password = document.getElementById('signin-password').value;
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            if (!validateEmail(email)) {
                showError('Please enter a valid email address.');
                return;
            }

            if (!password) {
                showError('Please enter your password.');
                return;
            }

            showLoading(submitBtn, 'Signing In...');

            try {
                const result = await window.authService.signIn(email, password);

                if (result.success) {
                    showSuccess('Sign in successful! Redirecting...');
                    setTimeout(() => {
                        window.location.href = 'index.html';
                    }, 1500);
                } else {
                    showError(result.error || 'Sign in failed. Please try again.');
                }
            } catch (error) {
                showError('An unexpected error occurred. Please try again.');
            } finally {
                hideLoading(submitBtn, originalText);
            }
        });
    }

    // Handle sign-up form submission
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            hideError();

            const name = document.getElementById('signup-name').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;
            const confirmPassword = document.getElementById('signup-confirm-password').value;
            const submitBtn = this.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            if (!name.trim()) {
                showError('Please enter your full name.');
                return;
            }

            if (!validateEmail(email)) {
                showError('Please enter a valid email address.');
                return;
            }

            if (password.length < 6) {
                showError('Password must be at least 6 characters long.');
                return;
            }

            if (password !== confirmPassword) {
                showError('Passwords do not match.');
                return;
            }

            showLoading(submitBtn, 'Creating Account...');

            try {
                const result = await window.authService.signUp(email, password, name);

                if (result.success) {
                    showSuccess('Account created successfully! Please check your email to verify your account.');
                    // Clear form
                    this.reset();
                } else {
                    showError(result.error || 'Sign up failed. Please try again.');
                }
            } catch (error) {
                showError('An unexpected error occurred. Please try again.');
            } finally {
                hideLoading(submitBtn, originalText);
            }
        });
    }
}

function setupModalBehavior() {
    // Modal functionality removed
}

// Setup active navigation state management with scroll detection
function setupActiveNavigation() {
    const navLinks = document.querySelectorAll('nav a:not([href*="signin"]):not([href*="signup"])');
    const sections = document.querySelectorAll('section, main > section, #contact');

    // Function to update active navigation based on scroll position
    function updateActiveNav() {
        const scrollPosition = window.scrollY;
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;

        // Check if we're at the very top (home section)
        if (scrollPosition < 200) {
            setActiveNav('home');
            return;
        }

        // Check if we're near the bottom (contact section)
        if (scrollPosition + windowHeight >= documentHeight - 100) {
            setActiveNav('contact');
            return;
        }

        // Find which section is currently most visible in the viewport
        let currentSection = 'home';
        let maxVisibleArea = 0;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionBottom = sectionTop + sectionHeight;
            const sectionId = section.id;

            // Calculate how much of the section is visible in the viewport
            const viewportTop = scrollPosition + 100; // Header offset
            const viewportBottom = scrollPosition + windowHeight - 100;

            const visibleTop = Math.max(viewportTop, sectionTop);
            const visibleBottom = Math.min(viewportBottom, sectionBottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);

            // Calculate the percentage of the section that's visible
            const visibilityRatio = visibleHeight / Math.min(sectionHeight, windowHeight - 200);

            if (visibilityRatio > maxVisibleArea && visibilityRatio > 0.3) {
                maxVisibleArea = visibilityRatio;

                if (sectionId === 'contact') {
                    currentSection = 'contact';
                } else if (section.classList.contains('featured-categories') || sectionId === 'collections') {
                    currentSection = 'collections';
                } else if (section.classList.contains('bestsellers') || sectionId === 'bestsellers') {
                    currentSection = 'bestsellers';
                } else if (section.classList.contains('about-us') || sectionId === 'about') {
                    currentSection = 'about';
                } else if (section.classList.contains('hero')) {
                    currentSection = 'home';
                }
            }
        });

        setActiveNav(currentSection);
    }

    // Function to set active navigation item
    function setActiveNav(section) {
        navLinks.forEach(link => {
            link.classList.remove('active');

            const href = link.getAttribute('href');
            if (
                (section === 'home' && (href === '#' || link.textContent.trim() === 'Home')) ||
                (section === 'collections' && href === '#collections') ||
                (section === 'bestsellers' && href === '#bestsellers') ||
                (section === 'about' && href === '#about') ||
                (section === 'contact' && href === '#contact')
            ) {
                link.classList.add('active');
            }
        });
    }

    // Handle click events (still needed for immediate feedback)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remove active class from all navigation links
            navLinks.forEach(navLink => {
                navLink.classList.remove('active');
            });

            // Add active class to clicked link
            this.classList.add('active');
        });
    });

    // Add scroll event listener with optimized throttling
    let scrollTimeout;
    let isScrolling = false;

    window.addEventListener('scroll', function() {
        if (!isScrolling) {
            window.requestAnimationFrame(function() {
                updateActiveNav();
                isScrolling = false;
            });
            isScrolling = true;
        }
    });

    // Also add resize listener to recalculate on window resize
    window.addEventListener('resize', function() {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(updateActiveNav, 100);
    });

    // Initial call to set correct active state on page load
    updateActiveNav();
}

// Setup smooth scrolling for navigation links
function setupSmoothScrolling() {
    // Handle all anchor links that start with #
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href !== '#') {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    // Add some offset to account for header
                    const headerHeight = 100;
                    const elementPosition = targetElement.offsetTop - headerHeight;

                    window.scrollTo({
                        top: elementPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}