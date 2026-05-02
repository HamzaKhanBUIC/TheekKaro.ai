document.addEventListener('DOMContentLoaded', () => {
    // Add scroll reveal animation for the about section
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const aboutCols = document.querySelectorAll('.about-col');
    aboutCols.forEach(col => {
        col.style.opacity = '0';
        col.style.transform = 'translateY(30px)';
        col.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(col);
    });

    // Header Scroll Effect
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.style.background = 'rgba(10, 12, 16, 0.7)';
            header.style.backdropFilter = 'blur(16px)';
            header.style.borderBottom = '1px solid rgba(255, 255, 255, 0.05)';
            header.style.padding = '1.2rem 5%';
        } else {
            header.style.background = 'transparent';
            header.style.backdropFilter = 'none';
            header.style.borderBottom = 'none';
            header.style.padding = '2rem 5%';
        }
    });

    // Add CSS class for reveal
    const style = document.createElement('style');
    style.innerHTML = `
        .reveal {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);

    // Button click interaction (placeholder)
    const launchBtn = document.querySelector('.primary-btn');
    launchBtn.addEventListener('click', () => {
        // Since we are building a landing page for the existing app, 
        // we can point this to the streamlit app if it runs on a port.
        // For now, just a nice ripple or alert.
        console.log('Launching TheekKaro.ai...');
    });
});
