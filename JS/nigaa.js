// Sivu's Pawfect Retreat - Interactive JavaScript Features
// This file adds all the interactive elements required by the assignment

document.addEventListener('DOMContentLoaded', function() {
    
    //         
    // 1. SMOOTH SCROLLING FOR NAVIGATION
    //         
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

    //         
    // 2. INTERACTIVE FAQ ACCORDION
    //         
    function createFAQAccordion() {
        const faqContainer = document.querySelector('.testimonials-table, table[border="2"]');
        if (!faqContainer) return;

        // Find all FAQ cells
        const faqCells = faqContainer.querySelectorAll('td.testimonial-cell');
        
        faqCells.forEach((cell, index) => {
            // Check if this is an FAQ item (contains Q: and A:)
            const content = cell.innerHTML;
            if (content.includes('<b>Q:') || content.includes('Q:')) {
                // Make it interactive
                cell.style.cursor = 'pointer';
                cell.style.transition = 'all 0.3s ease';
                
                // Extract question and answer
                const parts = content.split('<br>');
                const question = parts[0];
                const answer = parts.slice(1).join('<br>');
                
                // Create collapsible structure
                const questionDiv = document.createElement('div');
                questionDiv.innerHTML = question;
                questionDiv.style.fontWeight = 'bold';
                questionDiv.style.padding = '10px';
                
                const answerDiv = document.createElement('div');
                answerDiv.innerHTML = answer;
                answerDiv.style.padding = '10px';
                answerDiv.style.maxHeight = '0';
                answerDiv.style.overflow = 'hidden';
                answerDiv.style.transition = 'max-height 0.5s ease';
                answerDiv.classList.add('faq-answer');
                
                // Add expand/collapse icon
                const icon = document.createElement('span');
                icon.innerHTML = ' ▼';
                icon.style.float = 'right';
                icon.style.transition = 'transform 0.3s ease';
                questionDiv.appendChild(icon);
                
                // Clear and rebuild cell
                cell.innerHTML = '';
                cell.appendChild(questionDiv);
                cell.appendChild(answerDiv);
                
                // Add click handler
                cell.addEventListener('click', function() {
                    const isOpen = answerDiv.style.maxHeight !== '0px' && answerDiv.style.maxHeight !== '';
                    
                    if (isOpen) {
                        answerDiv.style.maxHeight = '0';
                        icon.style.transform = 'rotate(0deg)';
                        cell.style.backgroundColor = '';
                    } else {
                        answerDiv.style.maxHeight = answerDiv.scrollHeight + 'px';
                        icon.style.transform = 'rotate(180deg)';
                        cell.style.backgroundColor = 'rgba(173, 216, 230, 0.3)';
                    }
                });
                
                // Add hover effect
                cell.addEventListener('mouseenter', function() {
                    cell.style.transform = 'translateY(-5px)';
                    cell.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
                });
                
                cell.addEventListener('mouseleave', function() {
                    cell.style.transform = 'translateY(0)';
                    cell.style.boxShadow = '';
                });
            }
        });
    }

    //         
    // 3. FORM VALIDATION
    //         
    function setupFormValidation() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            // Create error message container
            const errorContainer = document.createElement('div');
            errorContainer.style.cssText = `
                color: red;
                background-color: rgba(255, 0, 0, 0.1);
                border: 2px solid red;
                padding: 10px;
                margin: 10px 0;
                border-radius: 5px;
                display: none;
            `;
            errorContainer.className = 'error-container';
            form.insertBefore(errorContainer, form.firstChild);
            
            // Create success message container
            const successContainer = document.createElement('div');
            successContainer.style.cssText = `
                color: green;
                background-color: rgba(0, 255, 0, 0.1);
                border: 2px solid green;
                padding: 10px;
                margin: 10px 0;
                border-radius: 5px;
                display: none;
            `;
            successContainer.className = 'success-container';
            form.insertBefore(successContainer, form.firstChild);
            
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                
                const errors = [];
                errorContainer.style.display = 'none';
                successContainer.style.display = 'none';
                
                // Validate text inputs
                const textInputs = form.querySelectorAll('input[type="text"], textarea');
                textInputs.forEach(input => {
                    if (input.hasAttribute('required') && input.value.trim().length < 2) {
                        errors.push(`${getFieldLabel(input)} must be at least 2 characters`);
                        input.style.border = '2px solid red';
                    } else {
                        input.style.border = '';
                    }
                });
                
                // Validate email
                const emailInputs = form.querySelectorAll('input[type="email"]');
                emailInputs.forEach(input => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (input.hasAttribute('required') && !emailRegex.test(input.value)) {
                        errors.push('Please enter a valid email address');
                        input.style.border = '2px solid red';
                    } else {
                        input.style.border = '';
                    }
                });
                
                // Validate phone
                const phoneInputs = form.querySelectorAll('input[type="tel"]');
                phoneInputs.forEach(input => {
                    const phoneRegex = /^[0-9]{10,}$/;
                    const cleanPhone = input.value.replace(/[\s\-\(\)]/g, '');
                    if (input.hasAttribute('required') && !phoneRegex.test(cleanPhone)) {
                        errors.push('Phone number must be at least 10 digits');
                        input.style.border = '2px solid red';
                    } else {
                        input.style.border = '';
                    }
                });
                
                // Validate select
                const selectInputs = form.querySelectorAll('select');
                selectInputs.forEach(input => {
                    if (input.hasAttribute('required') && !input.value) {
                        errors.push(`Please select a ${getFieldLabel(input)}`);
                        input.style.border = '2px solid red';
                    } else {
                        input.style.border = '';
                    }
                });
                
                // Show errors or success
                if (errors.length > 0) {
                    errorContainer.innerHTML = '<strong>⚠️ Please fix the following errors:</strong><ul>' + 
                        errors.map(err => `<li>${err}</li>`).join('') + '</ul>';
                    errorContainer.style.display = 'block';
                    errorContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                } else {
                    // Show success message
                    successContainer.innerHTML = '<strong>✅ Success!</strong> Your form has been submitted. We will contact you within 24 hours.';
                    successContainer.style.display = 'block';
                    successContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    
                    // Show loading animation
                    const submitBtn = form.querySelector('input[type="submit"]');
                    if (submitBtn) {
                        const originalValue = submitBtn.value;
                        submitBtn.value = '⏳ Sending...';
                        submitBtn.disabled = true;
                        
                        // Simulate form submission
                        setTimeout(() => {
                            submitBtn.value = '✓ Sent!';
                            setTimeout(() => {
                                submitBtn.value = originalValue;
                                submitBtn.disabled = false;
                                form.reset();
                            }, 2000);
                        }, 1500);
                    }
                }
            });
            
            // Real-time validation feedback
            const inputs = form.querySelectorAll('input, textarea, select');
            inputs.forEach(input => {
                input.addEventListener('blur', function() {
                    validateField(this);
                });
                
                input.addEventListener('input', function() {
                    if (this.style.border === '2px solid red') {
                        validateField(this);
                    }
                });
            });
        });
    }
    
    function validateField(field) {
        let isValid = true;
        
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = emailRegex.test(field.value);
        } else if (field.type === 'tel') {
            const phoneRegex = /^[0-9]{10,}$/;
            const cleanPhone = field.value.replace(/[\s\-\(\)]/g, '');
            isValid = phoneRegex.test(cleanPhone);
        } else if (field.tagName === 'SELECT') {
            isValid = field.value !== '';
        } else {
            isValid = field.value.trim().length >= 2;
        }
        
        if (field.hasAttribute('required')) {
            field.style.border = isValid ? '2px solid green' : '2px solid red';
        }
    }
    
    function getFieldLabel(input) {
        const td = input.closest('td');
        if (td) {
            const prevTd = td.previousElementSibling;
            if (prevTd) {
                return prevTd.textContent.replace(':', '').trim();
            }
        }
        return 'Field';
    }

    //         
    // 4. IMAGE GALLERY LIGHTBOX
    //         
    function createLightbox() {
        // Create lightbox overlay
        const lightbox = document.createElement('div');
        lightbox.id = 'lightbox';
        lightbox.style.cssText = `
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.9);
            justify-content: center;
            align-items: center;
            animation: fadeIn 0.3s;
        `;
        
        const lightboxContent = document.createElement('div');
        lightboxContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 15px;
            max-width: 90%;
            max-height: 90%;
            overflow: auto;
            position: relative;
            animation: slideIn 0.3s;
        `;
        
        const closeBtn = document.createElement('span');
        closeBtn.innerHTML = '×';
        closeBtn.style.cssText = `
            position: absolute;
            top: 10px;
            right: 20px;
            font-size: 40px;
            color: #333;
            cursor: pointer;
            font-weight: bold;
        `;
        closeBtn.addEventListener('click', () => lightbox.style.display = 'none');
        
        const lightboxImage = document.createElement('div');
        lightboxImage.id = 'lightbox-image';
        lightboxImage.style.cssText = `
            text-align: center;
            font-size: 100px;
            margin: 20px 0;
        `;
        
        const lightboxTitle = document.createElement('h2');
        lightboxTitle.id = 'lightbox-title';
        lightboxTitle.style.textAlign = 'center';
        
        lightboxContent.appendChild(closeBtn);
        lightboxContent.appendChild(lightboxImage);
        lightboxContent.appendChild(lightboxTitle);
        lightbox.appendChild(lightboxContent);
        document.body.appendChild(lightbox);
        
        // Close on outside click
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                lightbox.style.display = 'none';
            }
        });
        
        // Add animations
        const style = document.createElement('style');
        style.textContent = `
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes slideIn {
                from { transform: translateY(-50px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    function openLightbox(emoji, title) {
        const lightbox = document.getElementById('lightbox');
        const lightboxImage = document.getElementById('lightbox-image');
        const lightboxTitle = document.getElementById('lightbox-title');
        
        lightboxImage.textContent = emoji;
        lightboxTitle.textContent = title;
        lightbox.style.display = 'flex';
    }

    //         
    // 5. SEARCH FUNCTIONALITY
    //         
    function addSearchFeature() {
        // Check if we're on the services page
        const servicesBox = document.querySelector('.services-box');
        if (!servicesBox) return;
        
        // Create search box
        const searchContainer = document.createElement('div');
        searchContainer.style.cssText = `
            background: white;
            padding: 20px;
            margin: 20px auto;
            border-radius: 15px;
            border: 3px solid #4CAF50;
            max-width: 600px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        `;
        
        const searchLabel = document.createElement('label');
        searchLabel.textContent = '🔍 Search Services:';
        searchLabel.style.cssText = `
            font-weight: bold;
            color: #2d5a2d;
            display: block;
            margin-bottom: 10px;
            font-size: 18px;
        `;
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Type to search services...';
        searchInput.style.cssText = `
            width: 100%;
            padding: 12px;
            font-size: 16px;
            border: 2px solid #ddd;
            border-radius: 8px;
            box-sizing: border-box;
        `;
        
        searchContainer.appendChild(searchLabel);
        searchContainer.appendChild(searchInput);
        
        // Insert after first heading
        const firstH2 = document.querySelector('h2');
        if (firstH2 && firstH2.parentNode) {
            firstH2.parentNode.insertBefore(searchContainer, firstH2.nextSibling);
        }
        
        // Search functionality
        searchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            const serviceBoxes = document.querySelectorAll('.services-box');
            
            serviceBoxes.forEach(box => {
                const text = box.textContent.toLowerCase();
                if (text.includes(searchTerm)) {
                    box.style.display = '';
                    box.style.animation = 'fadeIn 0.5s';
                } else {
                    box.style.display = 'none';
                }
            });
        });
    }

    //         
    // 6. INTERACTIVE MAP
    //         
    function enhanceMap() {
        // This would be where you'd integrate Google Maps or Leaflet
        // For now, we'll add interactive elements to any map placeholders
        const mapContainers = document.querySelectorAll('[class*="map"], #map');
        
        mapContainers.forEach(container => {
            container.style.cursor = 'pointer';
            container.style.transition = 'transform 0.3s ease';
            
            container.addEventListener('click', function() {
                alert('🗺️ Opening directions in Google Maps...\n\n123 Pet Paradise Lane\nSunny Meadows District\nJohannesburg, Gauteng 2000');
            });
            
            container.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.02)';
            });
            
            container.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
        });
    }

    //         
    // 7. ANIMATED TESTIMONIALS
    //         
    function animateTestimonials() {
        const testimonialCells = document.querySelectorAll('.testimonial-cell');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 200);
                }
            });
        }, { threshold: 0.1 });
        
        testimonialCells.forEach(cell => {
            cell.style.opacity = '0';
            cell.style.transform = 'translateY(30px)';
            cell.style.transition = 'all 0.6s ease';
            observer.observe(cell);
        });
    }

    //         
    // 8. LOADING ANIMATION
    //         
    function addLoadingAnimation() {
        // Create loading overlay
        const loader = document.createElement('div');
        loader.id = 'page-loader';
        loader.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            transition: opacity 0.5s;
        `;
        
        loader.innerHTML = `
            <div style="text-align: center; color: white;">
                <div style="font-size: 60px; margin-bottom: 20px; animation: bounce 1s infinite;">🐾</div>
                <h2 style="font-size: 24px;">Loading Pawfect Retreat...</h2>
                <div style="margin-top: 20px;">
                    <div style="width: 200px; height: 4px; background: rgba(255,255,255,0.3); border-radius: 2px; overflow: hidden;">
                        <div style="width: 100%; height: 100%; background: white; animation: loading 1.5s ease-in-out infinite;"></div>
                    </div>
                </div>
            </div>
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes bounce {
                0%, 100% { transform: translateY(0); }
                50% { transform: translateY(-20px); }
            }
            @keyframes loading {
                0% { transform: translateX(-100%); }
                100% { transform: translateX(100%); }
            }
        `;
        document.head.appendChild(style);
        document.body.insertBefore(loader, document.body.firstChild);
        
        // Hide loader after page loads
        window.addEventListener('load', function() {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.remove(), 500);
            }, 500);
        });
    }

    //         
    // 9. FLOATING ACTION BUTTON
    //         
    function addFloatingButton() {
        const fab = document.createElement('div');
        fab.innerHTML = '📞';
        fab.style.cssText = `
            position: fixed;
            bottom: 30px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 30px;
            cursor: pointer;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        
        fab.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.1)';
            this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.4)';
        });
        
        fab.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.3)';
        });
        
        fab.addEventListener('click', function() {
            window.location.href = 'Contact.html';
        });
        
        document.body.appendChild(fab);
    }

   
    // 10. SCROLL TO TOP BUTTON
    
    function addScrollToTop() {
        const scrollBtn = document.createElement('div');
        scrollBtn.innerHTML = '↑';
        scrollBtn.style.cssText = `
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 50px;
            height: 50px;
            background: #4CAF50;
            color: white;
            border-radius: 50%;
            display: none;
            justify-content: center;
            align-items: center;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0,0,0,0.3);
            z-index: 1000;
            transition: all 0.3s ease;
        `;
        
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                scrollBtn.style.display = 'flex';
            } else {
                scrollBtn.style.display = 'none';
            }
        });
        
        scrollBtn.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
        
        document.body.appendChild(scrollBtn);
    }

    // INITIALIZE ALL FEATURES
    
    addLoadingAnimation();
    createFAQAccordion();
    setupFormValidation();
    createLightbox();
    addSearchFeature();
    enhanceMap();
    animateTestimonials();
    addFloatingButton();
    addScrollToTop();
    
    console.log('🐾 Sivu\'s Pawfect Retreat - All interactive features loaded!');
});


// UTILITY FUNCTIONS


// Show notification toast
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#4CAF50' : '#f44336'};
        color: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.3);
        z-index: 10000;
        animation: slideInRight 0.5s ease;
        max-width: 300px;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.5s ease';
        setTimeout(() => notification.remove(), 500);
    }, 3000);
}

// Add required animations
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(animationStyles);