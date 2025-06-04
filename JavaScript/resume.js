document.addEventListener('DOMContentLoaded', () => {
    const overlay = document.createElement('div');
    overlay.className = 'preview-overlay';
    document.body.appendChild(overlay);

    const previewImage = document.createElement('img');
    previewImage.className = 'preview-image';
    overlay.appendChild(previewImage);

    const controls = document.createElement('div');
    controls.className = 'preview-controls';
    overlay.appendChild(controls);

    const closeButton = document.createElement('button');
    closeButton.className = 'preview-button';
    closeButton.innerHTML = '×';
    controls.appendChild(closeButton);

    const downloadButton = document.createElement('button');
    downloadButton.className = 'preview-button';
    downloadButton.innerHTML = `
        <svg viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
            <polyline points="7 10 12 15 17 10"></polyline>
            <line x1="12" y1="15" x2="12" y2="3"></line>
        </svg>
    `;
    controls.appendChild(downloadButton);

    function openPreview(imageSrc, pdfPath) {
        previewImage.src = imageSrc;
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        downloadButton.onclick = () => {
            const link = document.createElement('a');
            link.href = pdfPath;
            link.download = '';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        };
    }

    function closePreview() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.querySelectorAll('.resume-image-container').forEach(container => {
        container.addEventListener('click', () => {
            const image = container.querySelector('.resume-image');
            const pdfPath = container.parentElement.querySelector('.cta-button').href;
            openPreview(image.src, pdfPath);
        });
    });

    closeButton.addEventListener('click', closePreview);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closePreview();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closePreview();
        }
    });

    // Scroll Animation
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

    // Observe all career steps and the moving dot
    document.querySelectorAll('.career-step-content, .moving-dot').forEach(element => {
        observer.observe(element);
    });

    // Add RGB values for primary color for pulse animation
    const style = document.documentElement.style;
    const primaryColor = getComputedStyle(document.documentElement).getPropertyValue('--clr-primary').trim();
    const rgb = hexToRgb(primaryColor);
    if (rgb) {
        style.setProperty('--clr-primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
    }
});

// Helper function to convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}