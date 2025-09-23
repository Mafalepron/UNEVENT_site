// Logo Interactive Animations with Anime.js

class LogoAnimations {
    constructor() {
        // Check if Anime.js is loaded
        if (typeof anime === 'undefined') {
            console.error('Anime.js is not loaded!');
            return;
        }
        
        this.logoU = document.getElementById('logoU');
        this.logoN = document.getElementById('logoN');
        this.interactiveLogo = document.getElementById('interactiveLogo');
        this.lightningContainer = document.getElementById('lightningContainer');
        this.eventCardsContainer = document.getElementById('eventCardsContainer');
        this.eventCards = document.querySelectorAll('.event-card');
        this.brightFlash = document.getElementById('lightningBrightFlash');
        this.clickIndicator = document.getElementById('clickIndicator');
        
        this.isAnimating = false;
        this.isPulsing = false;
        this.isLogoExpanded = false;
        this.lastFlashPosition = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.animateArrow();
    }
    
    setupEventListeners() {
        // Click effect for the entire logo
        if (this.interactiveLogo) {
            this.interactiveLogo.addEventListener('click', () => this.onLogoClick());
        }
    }
    
    startPulsing() {
        this.isPulsing = true;
        
        // Add pulsing class to both letters
        this.logoU.classList.add('pulsing');
        this.logoN.classList.add('pulsing');
    }
    
    stopPulsing() {
        this.isPulsing = false;
        
        // Remove pulsing class from both letters
        this.logoU.classList.remove('pulsing');
        this.logoN.classList.remove('pulsing');
    }
    
    expandLogo() {
        // Add expanded class to both letters to keep them scaled up
        this.logoU.classList.add('expanded');
        this.logoN.classList.add('expanded');
    }
    
    collapseLogo() {
        // Remove expanded class from both letters to return to normal size
        this.logoU.classList.remove('expanded');
        this.logoN.classList.remove('expanded');
    }
    
    onLogoClick() {
        if (this.isAnimating) return;
        
        // Hide click indicator on first click
        if (this.clickIndicator) {
            this.clickIndicator.style.display = 'none';
        }
        
        // Toggle logo expansion state
        this.isLogoExpanded = !this.isLogoExpanded;
        
        if (this.isLogoExpanded) {
            // Expand logo and start animation
            this.expandLogo();
            this.isAnimating = true;
            this.stopPulsing();
            
            // Hide UNevent text when starting new animation
            this.hideUneventText();
            
            // Reset all lightnings to hidden state
            this.resetAllLightnings();
            
            // Hide event cards first
            this.hideEventCards();
            
            // Animate lightning effects
            this.animateLightning();
        } else {
            // Collapse logo and hide everything
            this.collapseLogo();
            this.hideUneventText();
            this.resetAllLightnings();
            this.hideEventCards();
        }
    }
    
    animateLightning() {
        const lightnings = this.lightningContainer.querySelectorAll('.lightning');
        
        // Add random lightning flashes for realism
        this.addRandomLightningFlashes();
        
        // Start the sequential animation from the first lightning (index 0)
        this.animateLightningSequence(lightnings, 0);
    }
    
    animateLightningSequence(lightnings, index) {
        if (index >= lightnings.length) {
            // All lightnings completed
            this.isAnimating = false;
            // Start UNevent text animation after all cards appear
            setTimeout(() => {
                this.animateUneventText();
            }, 1000); // Wait 1 second after last card appears
            return;
        }
        
        // Reset all lightnings to hidden state
        lightnings.forEach((lightning) => {
            const path = lightning.querySelector('path');
            const dot = lightning.querySelector('.lightning-dot');
            path.style.strokeDasharray = '0 1000';
            path.style.opacity = '0';
            dot.style.opacity = '0';
        });
        
        const lightning = lightnings[index];
        const path = lightning.querySelector('path');
        const dot = lightning.querySelector('.lightning-dot');
        
        // Debug: log which lightning is being animated
        console.log(`Animating lightning ${index} (${lightning.id})`);
        
        // Start with dot visible at the beginning
        dot.style.opacity = '1';
        
        // Animate the glowing dot moving along the path while drawing the lightning
        this.animateLightningGrowth(dot, path, index, 0, () => {
            // After this lightning completes, start the next one
            setTimeout(() => {
                this.animateLightningSequence(lightnings, index + 1);
            }, 200); // Speed up: Shorter delay for shortened lightnings
        });
    }
    
    addRandomLightningFlashes() {
        // Add 2-3 random lightning flashes during the sequence
        const flashCount = 2 + Math.floor(Math.random() * 2);
        
        for (let i = 0; i < flashCount; i++) {
            setTimeout(() => {
                this.createRandomLightningFlash();
            }, Math.random() * 8000); // Spread over 8 seconds
        }
    }
    
    createRandomLightningFlash() {
        const flash = document.createElement('div');
        flash.className = 'lightning-flash';
        flash.style.left = Math.random() * 100 + '%';
        flash.style.top = Math.random() * 100 + '%';
        flash.style.width = (10 + Math.random() * 20) + 'px';
        flash.style.height = (10 + Math.random() * 20) + 'px';
        this.lightningContainer.appendChild(flash);
        
        anime({
            targets: flash,
            opacity: [0, 0.6, 0],
            scale: [0, 2 + Math.random() * 2, 0],
            duration: 200 + Math.random() * 300,
            easing: 'easeOutQuad',
            complete: () => {
                flash.remove();
            }
        });
    }
    
    getExactEndPoint(path, lightningIndex) {
        // Extract exact end coordinates from SVG path data
        const pathData = path.getAttribute('d');
        const coordinates = pathData.match(/L(\d+),(\d+)/g);
        
        if (coordinates && coordinates.length > 0) {
            // Get the last L command (last line segment)
            const lastCoord = coordinates[coordinates.length - 1];
            const match = lastCoord.match(/L(\d+),(\d+)/);
            if (match) {
                return {
                    x: parseFloat(match[1]),
                    y: parseFloat(match[2])
                };
            }
        }
        
        // Fallback to calculated end point if parsing fails
        const pathLength = path.getTotalLength();
        const point = path.getPointAtLength(pathLength);
        return { x: point.x, y: point.y };
    }
    
    animateLightningGrowth(dot, path, lightningIndex, delay, onComplete) {
        // Get path length for dot animation
        const pathLength = path.getTotalLength();
        const pathPoints = [];
        
        // Create more points for smoother animation with diagonal movement
        for (let i = 0; i <= 80; i++) {
            const point = path.getPointAtLength((pathLength / 80) * i);
            pathPoints.push({ x: point.x, y: point.y });
        }
        
        // Get end point for flash effect - use exact coordinates from SVG path
        const endPoint = this.getExactEndPoint(path, lightningIndex);
        
        // Since SVG has viewBox="0 0 100 100" and preserveAspectRatio="none",
        // the coordinates are already in percentage (0-100)
        // We just need to ensure they're within bounds
        endPoint.x = Math.max(0, Math.min(100, endPoint.x));
        endPoint.y = Math.max(0, Math.min(100, endPoint.y));
        
        // Debug: log the exact end point
        console.log(`Lightning ${lightningIndex} calculated end point:`, endPoint);
        
        // Reset flash trigger flag for this lightning
        this.flashTriggered = false;
        
        // Hide the dot completely
        dot.style.opacity = '0';
        
        // Set up the path for drawing animation - start from 1/3 of the path
        const startOffset = pathLength / 3;
        path.style.strokeDasharray = `${pathLength - startOffset} ${pathLength}`;
        path.style.strokeDashoffset = pathLength - startOffset;
        path.style.opacity = '1';
        
            // Animate lightning path drawing without dot
            anime({
                targets: path,
                duration: 200, // Speed up: 300ms -> 200ms
                easing: 'easeOutQuad',
                delay: delay,
            update: (anim) => {
                const progress = anim.progress / 100;
                
                // Calculate current length from the trimmed start point
                const currentLength = startOffset + (pathLength - startOffset) * progress;
                
                // Draw the path from trimmed start to current position
                path.style.strokeDashoffset = pathLength - currentLength;
                
                // Add subtle lightning shake effect
                const shakeX = (Math.random() - 0.5) * 0.3;
                const shakeY = (Math.random() - 0.5) * 0.3;
                path.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
                
                // Trigger flash when lightning is 80% drawn (from trimmed start)
                if (progress >= 0.8 && !this.flashTriggered) {
                    this.flashTriggered = true;
                    this.createLightningFlash(endPoint, lightningIndex, () => {
                        setTimeout(() => {
                            this.showEventCard(lightningIndex, endPoint);
                        }, 50);
                    });
                }
            },
            complete: () => {
                // Start the trail disappearing effect after a short delay
                setTimeout(() => {
                    this.animateLightningTrailDisappear(path, pathLength, () => {
                        // Flash and card already shown during drawing, just complete
                        if (onComplete) {
                            onComplete();
                        }
                    });
                }, 100); // Speed up: Wait 0.1 second before starting trail disappear
            }
        });
    }
    
    animateLightningTrailDisappear(path, pathLength, onComplete) {
        // Animate the trail disappearing by moving the dash offset
        // Calculate the start offset for the trimmed path
        const startOffset = pathLength / 3;
        anime({
            targets: path,
            strokeDashoffset: pathLength,
            duration: 250, // Speed up: Trail disappears over 0.25 seconds
            easing: 'easeInQuad',
            complete: () => {
                // Reset and hide the path
                path.style.strokeDasharray = '0 1000';
                path.style.opacity = '0';
                path.style.strokeDashoffset = '0';
                
                if (onComplete) {
                    onComplete();
                }
            }
        });
    }
    

    createLightningFlashAtCardPosition(lightningIndex) {
        const eventCard = this.eventCards[lightningIndex];
        if (eventCard) {
            // Get the actual position of the card
            const cardRect = eventCard.getBoundingClientRect();
            const containerRect = this.lightningContainer.getBoundingClientRect();
            
            // Calculate relative position within the container
            const relativeX = ((cardRect.left - containerRect.left) / containerRect.width) * 100;
            const relativeY = ((cardRect.top - containerRect.top) / containerRect.height) * 100;
            
            // Create flash element at card position
            const flash = document.createElement('div');
            flash.className = 'lightning-flash';
            flash.style.position = 'absolute';
            flash.style.left = relativeX + '%';
            flash.style.top = relativeY + '%';
            this.lightningContainer.appendChild(flash);
            
            // Debug: log flash position
            console.log(`Flash ${lightningIndex} position at card:`, relativeX + '%', relativeY + '%');
            
            // Remove flash after animation
            setTimeout(() => {
                if (flash.parentNode) {
                    flash.parentNode.removeChild(flash);
                }
            }, 2000);
        }
    }

    createLightningFlash(endPoint, lightningIndex, onComplete) {
        // Create flash element
        const flash = document.createElement('div');
        flash.className = 'lightning-flash';
        flash.style.position = 'absolute';
        flash.style.left = endPoint.x + '%';
        flash.style.top = endPoint.y + '%';
        this.lightningContainer.appendChild(flash);
        
        // Debug: log flash position
        console.log(`Flash ${lightningIndex} position:`, endPoint.x + '%', endPoint.y + '%');
        
        // Store flash position for event card (convert % to pixels)
        const containerRect = this.lightningContainer.getBoundingClientRect();
        this.lastFlashPosition = { 
            x: (endPoint.x / 100) * containerRect.width + containerRect.left, 
            y: (endPoint.y / 100) * containerRect.height + containerRect.top 
        };
        
        // Animate flash
        anime({
            targets: flash,
            opacity: [0, 1, 0],
            scale: [0, 3, 0],
            duration: 200,
            easing: 'easeOutQuad',
            complete: () => {
                // Remove flash element
                flash.remove();
                
                // Create bright flash effect
                this.createBrightFlash(() => {
                    // Call completion callback after bright flash
                    if (onComplete) {
                        onComplete();
                    }
                });
            }
        });
    }
    
    createBrightFlash(onComplete) {
        if (!this.brightFlash) return;
        
        // Position the flash at the lightning end point
        if (this.lastFlashPosition) {
            this.brightFlash.style.left = (this.lastFlashPosition.x - 200) + 'px'; // Center the 400px flash
            this.brightFlash.style.top = (this.lastFlashPosition.y - 200) + 'px';
        }
        
        // Reset and show bright flash
        this.brightFlash.classList.remove('flash-active');
        this.brightFlash.style.opacity = '0';
        this.brightFlash.style.transform = 'scale(0.8)';
        
        // Trigger the flash animation
        setTimeout(() => {
            this.brightFlash.classList.add('flash-active');
            
            // Remove the class after animation completes
            setTimeout(() => {
                this.brightFlash.classList.remove('flash-active');
                
                if (onComplete) {
                    onComplete();
                }
            }, 200); // Match the CSS animation duration
        }, 50); // Small delay to ensure the class removal is processed
    }
    
    
    showEventCard(lightningIndex, endPoint) {
        const eventCard = this.eventCards[lightningIndex];
        if (eventCard) {
            // Debug: log which card is being positioned
            console.log(`Lightning ${lightningIndex} - Card:`, eventCard.dataset.event);
            
            // Use the exact coordinates where lightning ended
            let finalX = endPoint.x;
            let finalY = endPoint.y;
            
            // Debug: log coordinates
            console.log(`Lightning ${lightningIndex} end point:`, endPoint);
            console.log(`Card position:`, finalX + '%', finalY + '%');
            
            // Only adjust if the card would be too close to the center (logo area)
            const centerX = 50;
            const centerY = 50;
            const distanceFromCenter = Math.sqrt(Math.pow(finalX - centerX, 2) + Math.pow(finalY - centerY, 2));
            
            // If too close to center (logo area), move slightly away
            if (distanceFromCenter < 25) {
                const angle = Math.atan2(finalY - centerY, finalX - centerX);
                const minDistance = 30; // Move to at least 30% from center
                finalX = centerX + Math.cos(angle) * minDistance;
                finalY = centerY + Math.sin(angle) * minDistance;
            }
            
            // Ensure cards stay within safe bounds
            finalX = Math.max(10, Math.min(90, finalX)); // Keep away from edges with more margin
            finalY = Math.max(15, Math.min(80, finalY)); // Keep away from header and footer with more margin
            
            // Special positioning for Corporate Events card (lightning2) - move up by 2 card heights and left by 1 card width
            if (lightningIndex === 1) { // Corporate Events card is index 1 (0-based)
                finalY = Math.max(15, finalY - 20); // Move up by 20% (2 card heights total) but keep within bounds
                finalX = Math.max(10, finalX - 10); // Move left by 10% (1 card width) but keep within bounds
            }
            
            // Special positioning for Multimedia card (lightning3) - place under letter "U" and closer to bottom, then lower by half card height
            if (lightningIndex === 2) { // Multimedia card is index 2 (0-based)
                finalX = 30; // Position under letter "U" (30% from left)
                finalY = 80; // Position closer to bottom (75% from top) + half card height (5%)
            }
            
            // Special positioning for Artists card (lightning4) - move right by 2x card width
            if (lightningIndex === 3) { // Artists card is index 3 (0-based)
                finalX = Math.min(90, finalX + 20); // Move right by 20% (2x card width) but keep within bounds
            }
            
            // Special positioning for Digitalization card (lightning5) - move left by 2x card width + half card width + half card width
            if (lightningIndex === 4) { // Digitalization card is index 4 (0-based)
                finalX = Math.max(5, finalX - 20); // Move left by 20% (2x card width + half card width + half card width) but keep within bounds
            }
            
            // Special positioning for Quests card (lightning6) - use exact lightning end position
            if (lightningIndex === 5) { // Quests card is index 5 (0-based)
                finalX = 70; // Exact position where lightning ends
                finalY = 15; // Exact position where lightning ends
            }
            
            // Special positioning for Intellectual card (lightning7) - move left by half card width and up by half card height
            if (lightningIndex === 6) { // Intellectual card is index 6 (0-based)
                console.log('Positioning Intellectual card - before:', finalX, finalY);
                finalY = 10; // Fixed position - up by half card height from original
                finalX = 5; // Fixed position - left by half card width from original
                console.log('Positioning Intellectual card - after:', finalX, finalY);
            }
            
            // Special positioning for Training card (lightning8) - move up by half card height and left by 1.5 card width
            if (lightningIndex === 7) { // Training card is index 7 (0-based)
                finalY = Math.max(15, finalY - 5); // Move up by 5% (half card height) but keep within bounds
                finalX = Math.max(10, finalX - 7); // Move left by 7% (1.5 card width) but keep within bounds
            }
            
            // Set position exactly where lightning ended
            eventCard.style.left = finalX + '%';
            eventCard.style.top = finalY + '%';
            eventCard.style.position = 'absolute';
            
            // Debug: log final position
            console.log(`Event card ${lightningIndex} final position:`, finalX + '%', finalY + '%');
            
            // Start with flash effect
            eventCard.classList.add('flash-effect');
            eventCard.style.opacity = '1';
            eventCard.style.transform = 'scale(1.1)';
            
            // After flash effect, show the text
            setTimeout(() => {
                eventCard.classList.add('show-text');
                
                // Remove flash effect after text appears
                setTimeout(() => {
                    eventCard.classList.remove('flash-effect');
                    eventCard.style.transform = 'scale(1)';
                }, 500);
            }, 300);
        }
    }
    
    showEventCards() {
        // Cards are now shown individually by lightning animations
        // This method is kept for compatibility but does nothing
    }
    
    hideEventCards() {
        anime({
            targets: this.eventCards,
            opacity: 0,
            scale: 0.5,
            duration: 300,
            easing: 'easeInQuad'
        });
    }
    
    resetAllLightnings() {
        const lightnings = this.lightningContainer.querySelectorAll('.lightning');
        lightnings.forEach((lightning) => {
            const path = lightning.querySelector('path');
            const dot = lightning.querySelector('.lightning-dot');
            path.style.strokeDasharray = '0 1000';
            path.style.opacity = '0';
            dot.style.opacity = '0';
        });
        
        // Reset event cards
        this.eventCards.forEach((card) => {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.5)';
            card.classList.remove('flash-effect', 'show-text');
        });
    }
    
    animateUneventText() {
        const letters = ['letterU', 'letterN', 'letterE1', 'letterV', 'letterE2', 'letterN2', 'letterT'];
        let currentLetter = 0;
        
        const animateNextLetter = () => {
            if (currentLetter < letters.length) {
                const letterElement = document.getElementById(letters[currentLetter]);
                if (letterElement) {
                    letterElement.classList.add('animate');
                    currentLetter++;
                    setTimeout(animateNextLetter, 600); // Delay between letters
                }
            }
            // Text remains visible until user clicks on UN logo
        };
        
        // Start animation
        animateNextLetter();
    }
    
    hideUneventText() {
        const letters = ['letterU', 'letterN', 'letterE1', 'letterV', 'letterE2', 'letterN2', 'letterT'];
        letters.forEach(letterId => {
            const letterElement = document.getElementById(letterId);
            if (letterElement) {
                letterElement.style.opacity = '0';
                letterElement.classList.remove('animate');
            }
        });
    }
    
    animateArrow() {
        if (!this.clickIndicator) {
            console.log('Click indicator not found');
            return;
        }
        
        console.log('Starting arrow animation');
        
        // Reset animation state
        this.clickIndicator.classList.remove('animate', 'reverse');
        
        // Force reflow to ensure reset
        this.clickIndicator.offsetHeight;
        
        // Start forward animation after a brief delay
        setTimeout(() => {
            console.log('Adding animate class');
            this.clickIndicator.classList.add('animate');
        }, 100);
        
        // Start reverse animation (path disappears first, then cursor)
        setTimeout(() => {
            console.log('Adding reverse class');
            this.clickIndicator.classList.add('reverse');
        }, 3600); // Start reverse after 3.6s (when cursor is fully visible)
        
        // Complete reset after reverse animation
        setTimeout(() => {
            console.log('Removing animation classes');
            this.clickIndicator.classList.remove('animate', 'reverse');
        }, 4500); // Total animation time: 4.5s
        
        // Repeat animation every 5 seconds
        setTimeout(() => {
            this.animateArrow();
        }, 5000);
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait for Anime.js to load
    if (typeof anime !== 'undefined') {
        new LogoAnimations();
    } else {
        // Retry after a short delay
        setTimeout(() => {
            if (typeof anime !== 'undefined') {
                new LogoAnimations();
            } else {
                console.error('Anime.js failed to load after retry');
            }
        }, 1000);
    }
});
