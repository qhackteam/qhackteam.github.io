// script.js

document.addEventListener('DOMContentLoaded', () => {
    // --- Smooth scrolling for anchor links ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // --- Mobile Navigation Toggle (Close on link click) ---
    const navToggle = document.getElementById('nav-toggle');
    const navLinks = document.querySelector('.quack-nav-links'); // Updated class name

    if (navLinks && navToggle) {
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                // Only untick if the toggle is checked (menu is open)
                if (navToggle.checked) {
                    navToggle.checked = false;
                }
            });
        });
    }

    // --- Header Scroll Effect ---
    const mainHeader = document.querySelector('.main-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) { // Add 'scrolled' class after 50px scroll
            mainHeader.classList.add('scrolled');
        } else {
            mainHeader.classList.remove('scrolled');
        }
    });

    // --- Theme Switcher ---
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;
    // Check if the browser or OS prefers a dark color scheme
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

    // Function to set the theme
    const setTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            body.classList.remove('light-mode');
            themeSwitcher.innerHTML = '<i class="fas fa-sun"></i>'; // Sun icon for dark mode (click to go to light)
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            themeSwitcher.innerHTML = '<i class="fas fa-moon"></i>'; // Moon icon for light mode (click to go to dark)
            localStorage.setItem('theme', 'light');
        }
    };

    // Load saved theme or detect OS preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersDarkScheme.matches) {
        setTheme('dark'); // Default to dark if OS prefers it
    } else {
        setTheme('light'); // Default to light if no preference
    }

    // Listen for OS theme changes (dynamic)
    prefersDarkScheme.addEventListener('change', (event) => {
        setTheme(event.matches ? 'dark' : 'light');
    });

    // Toggle theme on click
    themeSwitcher.addEventListener('click', () => {
        if (body.classList.contains('dark-mode')) {
            setTheme('light');
        } else {
            setTheme('dark');
        }
    });


    // --- Typewriter Effect ---
    const typewriterElement = document.getElementById('typewriter-text');

    // Only run if the typewriter element exists (and thus JS is enabled)
    if (typewriterElement) {
        const words = JSON.parse(typewriterElement.dataset.words);
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 150; // Milliseconds per character
        let deletingSpeed = 70; // Milliseconds per character
        let delayBetweenWords = 1500; // Delay before starting next word or deleting

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                // Deleting
                typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = deletingSpeed;
            } else {
                // Typing
                typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 150; // Reset typing speed
            }

            // Check if typing/deleting is complete for current word
            if (!isDeleting && charIndex === currentWord.length) {
                // Word finished typing, start deleting after a delay
                typingSpeed = delayBetweenWords;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                // Word finished deleting, move to next word
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length; // Loop back to the start of the words array
                typingSpeed = 150; // Reset typing speed before next word
            }

            setTimeout(type, typingSpeed);
        }

        // Start the typewriter effect
        type();
    }

    // --- "Bruteforce" Reveal Effect ---
    const teamNameInteractive = document.querySelector('.team-name-interactive');

    if (teamNameInteractive) {
        const originalText = teamNameInteractive.dataset.originalText;
        const charSet = teamNameInteractive.dataset.charSet || '0123456789ABCDEF'; // Default to hex chars
        let revealIntervals = []; // To store intervals for each character
        let hoverTimeout; // To manage hover restart delay

        const getRandomChar = (charset) => charset.charAt(Math.floor(Math.random() * charset.length));

        const startBruteforce = () => {
            // Clear any existing intervals
            revealIntervals.forEach(clearInterval);
            revealIntervals = [];

            let currentText = '';
            for (let i = 0; i < originalText.length; i++) {
                currentText += getRandomChar(charSet); // Initialize with random chars
            }
            teamNameInteractive.textContent = currentText;

            for (let i = 0; i < originalText.length; i++) {
                let charIndex = 0;
                let found = false;
                const interval = setInterval(() => {
                    if (!found) {
                        const randomChar = getRandomChar(charSet);
                        const updatedText = Array.from(teamNameInteractive.textContent);
                        updatedText[i] = randomChar;
                        teamNameInteractive.textContent = updatedText.join('');

                        charIndex++;
                        // If it's the correct character, or we've iterated enough times
                        if (randomChar === originalText[i] || charIndex > 15) { // Arbitrary limit to ensure it eventually "finds" it
                            updatedText[i] = originalText[i]; // Force correct char
                            teamNameInteractive.textContent = updatedText.join('');
                            found = true;
                            clearInterval(interval); // Stop this character's bruteforce
                        }
                    }
                }, 70 + Math.random() * 50); // Slightly varied speed
                revealIntervals.push(interval);
            }
        };

        const resetAndStartBruteforce = () => {
            clearTimeout(hoverTimeout); // Clear any pending reset
            startBruteforce(); // Immediately restart
        };

        // Start effect on page load
        startBruteforce();

        // Restart effect on hover
        teamNameInteractive.addEventListener('mouseenter', () => {
            clearTimeout(hoverTimeout); // Clear any existing timeout
            startBruteforce();
        });

        // Add a slight delay before resetting after mouse leaves, in case of accidental brush
        teamNameInteractive.addEventListener('mouseleave', () => {
            clearTimeout(hoverTimeout); // Clear any existing timeout
            hoverTimeout = setTimeout(() => {
                // Ensure all bruteforce intervals are cleared before resetting
                revealIntervals.forEach(clearInterval);
                teamNameInteractive.textContent = originalText; // Revert to original
            }, 500); // Wait 0.5 seconds before resetting
        });
    }
});