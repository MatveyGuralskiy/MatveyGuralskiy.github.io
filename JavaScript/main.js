document.addEventListener('DOMContentLoaded', function () {
    // Get all necessary elements
    const toggleBtn = document.getElementById('toggle');
    const navMenu = document.getElementById('navigation');
    const blurWrapper = document.querySelector('.blur-wrapper');
    const body = document.body;
    const modeSwitch = document.getElementById('modeSwitch');

    // Check if elements exist to prevent errors
    if (!toggleBtn || !navMenu || !blurWrapper || !modeSwitch) {
        console.error('Required navigation elements not found');
        return;
    }

    // Toggle menu function
    function toggleMenu() {
        toggleBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        blurWrapper.classList.toggle('active');
        body.classList.toggle('menu-open');
    }

    // Close menu function
    function closeMenu() {
        toggleBtn.classList.remove('active');
        navMenu.classList.remove('active');
        blurWrapper.classList.remove('active');
        body.classList.remove('menu-open');
    }

    // Toggle menu when clicking the button
    toggleBtn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        toggleMenu();
    });

    // Close menu when clicking links
    const navLinks = navMenu.getElementsByTagName('a');
    Array.from(navLinks).forEach(link => {
        link.addEventListener('click', closeMenu);
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!navMenu.contains(e.target) && !toggleBtn.contains(e.target)) {
            closeMenu();
        }
    });

    // Close menu when clicking blur wrapper
    blurWrapper.addEventListener('click', closeMenu);

    // Theme switcher logic
    const savedMode = localStorage.getItem('mode');
    if (savedMode === 'night') {
        body.classList.add('night-mode');
        modeSwitch.checked = true;
    } else {
        // Always default to day mode
        body.classList.add('day-mode');
        modeSwitch.checked = false;
        localStorage.setItem('mode', 'day'); // Set default in localStorage
    }

    modeSwitch.addEventListener('change', () => {
        body.classList.remove('day-mode', 'night-mode');
        const isNightMode = modeSwitch.checked;
        if (isNightMode) {
            body.classList.add('night-mode');
            localStorage.setItem('mode', 'night');
        } else {
            body.classList.add('day-mode');
            localStorage.setItem('mode', 'day');
        }
    });

    // Profile card flip logic
    const flipCard = document.querySelector('.profile-flip-card');
    if (flipCard) {
        let isFlipped = false;
        let autoFlipInterval;

        function flipImage() {
            isFlipped = !isFlipped;
            flipCard.classList.toggle('flipped');
        }

        function startAutoFlip() {
            autoFlipInterval = setInterval(flipImage, 5000);
        }

        function stopAutoFlip() {
            clearInterval(autoFlipInterval);
        }

        // Initial start of auto-flip
        startAutoFlip();

        // Handle manual flips
        flipCard.addEventListener('click', () => {
            flipImage();
            stopAutoFlip();
            startAutoFlip();
        });

        // Handle page visibility
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                stopAutoFlip();
            } else {
                startAutoFlip();
            }
        });
    }
});