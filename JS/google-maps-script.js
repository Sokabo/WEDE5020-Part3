// Google Maps Integration Script
// Sivu's Pawfect Retreat - Contact Page

/**
 * Main initialization function
 */
function initializeContactPage() {
    console.log('🗺️ Initializing Google Maps contact page...');
    
    // Add smooth scroll behavior
    addSmoothScrolling();
    
    // Add animations to cards on scroll
    animateOnScroll();
    
    // Add map button analytics
    trackMapInteractions();
    
    console.log('✅ Contact page initialized successfully!');
}

/**
 * Add smooth scrolling to anchor links
 */
function addSmoothScrolling() {
    const links = document.querySelectorAll('a[href^="#"]');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
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
}

/**
 * Animate elements when they come into view
 */
function animateOnScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    // Observe all cards
    const cards = document.querySelectorAll('.info-card, .direction-card');
    cards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Observe map container
    const mapContainer = document.querySelector('.map-container');
    if (mapContainer) {
        mapContainer.style.opacity = '0';
        mapContainer.style.transform = 'scale(0.95)';
        mapContainer.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        observer.observe(mapContainer);
    }
}

/**
 * Track map button interactions for analytics
 */
function trackMapInteractions() {
    const mapButtons = document.querySelectorAll('.map-btn');
    
    mapButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const buttonText = this.textContent.trim();
            console.log(`📊 User clicked: ${buttonText}`);
            
            // You can integrate with Google Analytics here
            // Example: gtag('event', 'click', { 'event_category': 'Map', 'event_label': buttonText });
            
            // Add visual feedback
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 150);
        });
    });
}

/**
 * Get current location and show distance to business
 * This is optional and requires user permission
 */
function showDistanceFromCurrentLocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                const userLat = position.coords.latitude;
                const userLng = position.coords.longitude;
                
                // Business location (Sandton City)
                const businessLat = -26.1076512;
                const businessLng = 28.0545635;
                
                // Calculate distance using Haversine formula
                const distance = calculateDistance(userLat, userLng, businessLat, businessLng);
                
                console.log(`📍 You are approximately ${distance.toFixed(1)} km away`);
                
                // You could display this information to the user
                displayDistanceInfo(distance);
            },
            function(error) {
                console.log('Unable to get location:', error.message);
            }
        );
    } else {
        console.log('Geolocation not supported by this browser');
    }
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - First latitude
 * @param {number} lon1 - First longitude
 * @param {number} lat2 - Second latitude
 * @param {number} lon2 - Second longitude
 * @returns {number} Distance in kilometers
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    
    return distance;
}

/**
 * Convert degrees to radians
 * @param {number} degrees 
 * @returns {number} Radians
 */
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

/**
 * Display distance information to user
 * @param {number} distance - Distance in kilometers
 */
function displayDistanceInfo(distance) {
    const mapSection = document.querySelector('.map-section h2');
    
    if (mapSection && distance < 50) { // Only show if within 50km
        const distanceInfo = document.createElement('p');
        distanceInfo.style.cssText = `
            text-align: center;
            color: #4CAF50;
            font-size: 1.2rem;
            margin-top: 10px;
            font-weight: bold;
        `;
        distanceInfo.textContent = `📍 You are approximately ${distance.toFixed(1)} km away`;
        mapSection.insertAdjacentElement('afterend', distanceInfo);
    }
}

/**
 * Open Google Maps app if on mobile device
 */
function openInMapsApp() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const address = 'Sandton City, 83 Rivonia Rd, Sandhurst, Sandton, 2196';
    
    // Check if mobile device
    if (/android/i.test(userAgent)) {
        window.location.href = `geo:0,0?q=${encodeURIComponent(address)}`;
    } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        window.location.href = `maps://maps.google.com/maps?daddr=${encodeURIComponent(address)}`;
    } else {
        // Desktop - open in browser
        window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}`, '_blank');
    }
}

/**
 * Add copy address to clipboard functionality
 */
function addCopyAddressFeature() {
    const infoCards = document.querySelectorAll('.info-card');
    
    infoCards.forEach(card => {
        if (card.textContent.includes('Our Location')) {
            const copyBtn = document.createElement('button');
            copyBtn.textContent = '📋 Copy Address';
            copyBtn.style.cssText = `
                margin-top: 15px;
                padding: 10px 20px;
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 20px;
                cursor: pointer;
                font-weight: bold;
                transition: all 0.3s ease;
            `;
            
            copyBtn.addEventListener('click', function() {
                const address = 'Sandton City Office Tower, 83 Rivonia Road, Sandton, Johannesburg 2196, South Africa';
                
                navigator.clipboard.writeText(address).then(() => {
                    this.textContent = '✅ Copied!';
                    setTimeout(() => {
                        this.textContent = '📋 Copy Address';
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy:', err);
                });
            });
            
            copyBtn.addEventListener('mouseenter', function() {
                this.style.background = '#45a049';
                this.style.transform = 'scale(1.05)';
            });
            
            copyBtn.addEventListener('mouseleave', function() {
                this.style.background = '#4CAF50';
                this.style.transform = 'scale(1)';
            });
            
            card.querySelector('p').appendChild(copyBtn);
        }
    });
}

/**
 * Enhance map with loading state
 */
function addMapLoadingState() {
    const iframe = document.querySelector('.map-container iframe');
    
    if (iframe) {
        const loader = document.createElement('div');
        loader.style.cssText = `
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            font-size: 2rem;
            color: #4CAF50;
            z-index: 10;
        `;
        loader.textContent = '🗺️ Loading map...';
        
        iframe.parentElement.appendChild(loader);
        
        iframe.addEventListener('load', function() {
            loader.style.display = 'none';
        });
    }
}

/**
 * Add keyboard navigation for accessibility
 */
function enhanceAccessibility() {
    const buttons = document.querySelectorAll('.map-btn');
    
    buttons.forEach((button, index) => {
        button.setAttribute('tabindex', index + 1);
        
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
}

// Initialize everything when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        initializeContactPage();
        addCopyAddressFeature();
        addMapLoadingState();
        enhanceAccessibility();
        
        // Optional: Uncomment to enable distance calculation
        // showDistanceFromCurrentLocation();
    });
} else {
    // DOM is already loaded
    initializeContactPage();
    addCopyAddressFeature();
    addMapLoadingState();
    enhanceAccessibility();
    
    // Optional: Uncomment to enable distance calculation
    // showDistanceFromCurrentLocation();
}

// Export functions for potential external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        openInMapsApp,
        calculateDistance,
        showDistanceFromCurrentLocation
    };
}