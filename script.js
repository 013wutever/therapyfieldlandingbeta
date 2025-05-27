document.addEventListener('DOMContentLoaded', function() {
    const video = document.getElementById('heroVideo');
    const videoSources = [
        'Landing Page Media/1.mp4',
        'Landing Page Media/2.mp4',
        'Landing Page Media/3.mp4',
        'Landing Page Media/4.mp4'
    ];
    const videoLabels = [
        'Δια ζώσης Θεραπεία',
        'Online Θεραπεία',
        'Ψυχομετρική Αξιολόγηση',
        'Συμβουλευτική Γονέων'
    ];
    const videoLabelElement = document.getElementById('videoLabel');
    let currentVideoIndex = 0;

    if (video) {
        // Ensure video is muted (required for autoplay)
        video.muted = true;

        // Function to play the next video in sequence
        const playNextVideo = () => {
            currentVideoIndex = (currentVideoIndex + 1) % videoSources.length;
            video.src = videoSources[currentVideoIndex];
            if (videoLabelElement) {
                videoLabelElement.textContent = videoLabels[currentVideoIndex];
            }
            video.play().catch(error => {
                console.log('Video playback error:', error);
            });
        };

        // Play first video
        video.src = videoSources[0];
        if (videoLabelElement) {
            videoLabelElement.textContent = videoLabels[0];
        }
        video.play().catch(error => {
            console.log('Initial video playback error:', error);
        });

        // When current video ends, play the next one
        video.addEventListener('ended', playNextVideo);

        // If video stops unexpectedly, try to resume
        video.addEventListener('pause', () => {
            if (!video.ended) {
                video.play().catch(error => {
                    console.log('Video resume error:', error);
                });
            }
        });
    } else {
        console.error('Video element not found');
    }

    // Hamburger menu toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    let scrollPosition = 0; // Store scroll position
    
    if (hamburger && navLinks) {
        // Ensure menu is closed by default
        navLinks.classList.remove('active');
        hamburger.classList.remove('active');
        
        // Toggle menu only when hamburger is clicked
        hamburger.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event from bubbling up
            
            if (!navLinks.classList.contains('active')) {
                // When opening menu - save current scroll position
                scrollPosition = window.pageYOffset;
                hamburger.classList.add('active');
                navLinks.classList.add('active');
                document.body.classList.add('menu-open');
                
                // Prevent page from jumping
                document.body.style.top = `-${scrollPosition}px`;
            } else {
                // When closing menu
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
                
                // Restore scroll position
                document.body.style.top = '';
                window.scrollTo(0, scrollPosition);
            }
        });
        
        // Close menu when clicking on a link
        const navLinkElements = document.querySelectorAll('.nav-links a');
        navLinkElements.forEach(link => {
            link.addEventListener('click', function(e) {
                // Only do this for local links to prevent default behavior
                if (this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                }
                
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
                
                // Restore scroll position
                document.body.style.top = '';
                window.scrollTo(0, scrollPosition);
                
                // If it's a local link, handle the navigation after scroll restoration
                if (this.getAttribute('href').startsWith('#')) {
                    const targetId = this.getAttribute('href');
                    setTimeout(() => {
                        const targetElement = document.querySelector(targetId);
                        if (targetElement) {
                            targetElement.scrollIntoView({behavior: 'smooth'});
                        }
                    }, 10);
                }
            });
        });
        
        // Close menu when clicking anywhere on the overlay
        navLinks.addEventListener('click', function(e) {
            // Only close if clicking the overlay itself, not the links
            if (e.target === navLinks) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
                
                // Restore scroll position
                document.body.style.top = '';
                window.scrollTo(0, scrollPosition);
            }
        });
        
        // Close menu with ESC key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && navLinks.classList.contains('active')) {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.classList.remove('menu-open');
                
                // Restore scroll position
                document.body.style.top = '';
                window.scrollTo(0, scrollPosition);
            }
        });
    }
}); 