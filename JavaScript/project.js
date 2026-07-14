const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.project-card').forEach(card => {
    observer.observe(card);
});

// Modal functionality
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        const projectId = card.getAttribute('data-project');
        const modal = document.getElementById(`${projectId}-modal`);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

document.querySelectorAll('.modal-close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
        const modal = closeBtn.closest('.modal');
        modal.classList.remove('active');
        document.body.style.overflow = '';
    });
});

// Close modal when clicking outside
document.querySelectorAll('.modal').forEach(modal => {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});

// Close modal with Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal.active').forEach(modal => {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
});

// Gallery functionality
function initGallery(gallery) {
    if (gallery.dataset.init) return;
    gallery.dataset.init = '1';
    const container = gallery.querySelector('.gallery-container');
    const slides = gallery.querySelectorAll('.gallery-slide');
    const prevBtn = gallery.querySelector('.gallery-prev');
    const nextBtn = gallery.querySelector('.gallery-next');
    const dotsContainer = gallery.querySelector('.gallery-dots');

    let currentSlide = 0;
    const slideCount = slides.length;

    // Create dots
    slides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('gallery-dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = dotsContainer.querySelectorAll('.gallery-dot');

    function updateGallery() {
        container.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }

    function goToSlide(index) {
        currentSlide = index;
        updateGallery();
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % slideCount;
        updateGallery();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + slideCount) % slideCount;
        updateGallery();
    }

    // Event listeners
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Touch events for swipe
    let touchStartX = 0;
    let touchEndX = 0;

    gallery.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    });

    gallery.addEventListener('touchend', e => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    }

    // Keyboard navigation
    gallery.addEventListener('keydown', e => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });
}

// Initialize galleries when modals are opened
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        const projectId = card.getAttribute('data-project');
        const modal = document.getElementById(`${projectId}-modal`);
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Initialize gallery after modal is opened
        const gallery = modal.querySelector('.modal-gallery');
        initGallery(gallery);
    });
});

// ---------- Fullscreen image lightbox (open + swipe) ----------
(function () {
    const lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.innerHTML =
        '<button class="lightbox-close" aria-label="Close">&times;</button>' +
        '<button class="lightbox-arrow lightbox-prev" aria-label="Previous">&#8249;</button>' +
        '<button class="lightbox-arrow lightbox-next" aria-label="Next">&#8250;</button>' +
        '<div class="lightbox-viewport"><div class="lightbox-track"></div></div>' +
        '<div class="lightbox-counter"></div>';
    document.body.appendChild(lb);

    const viewport = lb.querySelector('.lightbox-viewport');
    const track = lb.querySelector('.lightbox-track');
    const counter = lb.querySelector('.lightbox-counter');
    const prevBtn = lb.querySelector('.lightbox-prev');
    const nextBtn = lb.querySelector('.lightbox-next');
    const closeBtn = lb.querySelector('.lightbox-close');

    let imgs = [];
    let index = 0;

    function update(animate) {
        track.style.transition = animate ? 'transform 0.35s cubic-bezier(0.16,1,0.3,1)' : 'none';
        track.style.transform = 'translateX(-' + (index * 100) + '%)';
        counter.textContent = (index + 1) + ' / ' + imgs.length;
    }

    function go(i) {
        index = (i + imgs.length) % imgs.length;
        update(true);
    }

    function open(list, start) {
        imgs = list;
        index = start;
        track.innerHTML = '';
        imgs.forEach(function (src) {
            const cell = document.createElement('div');
            cell.className = 'lightbox-cell';
            const im = document.createElement('img');
            im.src = src;
            im.draggable = false;
            cell.appendChild(im);
            track.appendChild(cell);
        });
        const multi = imgs.length > 1;
        prevBtn.style.display = multi ? '' : 'none';
        nextBtn.style.display = multi ? '' : 'none';
        counter.style.display = multi ? '' : 'none';
        update(false);
        lb.classList.add('active');
        document.body.classList.add('lightbox-open');
    }

    function close() {
        lb.classList.remove('active');
        document.body.classList.remove('lightbox-open');
    }

    prevBtn.addEventListener('click', function (e) { e.stopPropagation(); go(index - 1); });
    nextBtn.addEventListener('click', function (e) { e.stopPropagation(); go(index + 1); });
    closeBtn.addEventListener('click', close);

    let moved = false;
    lb.addEventListener('click', function (e) {
        if (moved) { moved = false; return; }
        const t = e.target;
        if (t === lb || t === viewport || t.classList.contains('lightbox-cell') || t.classList.contains('lightbox-track')) close();
    });

    document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('active')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowLeft') go(index - 1);
        else if (e.key === 'ArrowRight') go(index + 1);
    });

    // drag / swipe
    let startX = 0, dx = 0, dragging = false, w = 0;
    function down(x) { dragging = true; moved = false; startX = x; dx = 0; w = viewport.clientWidth; track.style.transition = 'none'; }
    function move(x) {
        if (!dragging) return;
        dx = x - startX;
        if (Math.abs(dx) > 6) moved = true;
        track.style.transform = 'translateX(calc(-' + (index * 100) + '% + ' + dx + 'px))';
    }
    function up() {
        if (!dragging) return;
        dragging = false;
        const threshold = Math.min(80, w * 0.18);
        if (imgs.length > 1 && dx < -threshold) go(index + 1);
        else if (imgs.length > 1 && dx > threshold) go(index - 1);
        else update(true);
    }
    viewport.addEventListener('touchstart', function (e) { down(e.touches[0].clientX); }, { passive: true });
    viewport.addEventListener('touchmove', function (e) { move(e.touches[0].clientX); }, { passive: true });
    viewport.addEventListener('touchend', up);
    viewport.addEventListener('mousedown', function (e) { e.preventDefault(); down(e.clientX); });
    window.addEventListener('mousemove', function (e) { move(e.clientX); });
    window.addEventListener('mouseup', up);

    // wire clickable image groups
    function wireGroup(nodeList) {
        const list = Array.prototype.slice.call(nodeList);
        if (!list.length) return;
        list.forEach(function (im, i) {
            im.classList.add('zoomable');
            im.addEventListener('click', function (e) {
                e.stopPropagation();
                const srcs = list.map(function (n) { return n.currentSrc || n.src; });
                open(srcs, i);
            });
        });
    }

    document.querySelectorAll('.modal .gallery-container').forEach(function (c) {
        wireGroup(c.querySelectorAll('.gallery-slide img'));
    });
    document.querySelectorAll('.app-screenshots').forEach(function (c) {
        wireGroup(c.querySelectorAll('.app-screenshot'));
    });
})();