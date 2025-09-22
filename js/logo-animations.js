// Logo Interactive Animations with Anime.js

class LogoAnimations {
    constructor() {
        this.logoU = document.getElementById('logoU');
        this.logoN = document.getElementById('logoN');
        this.interactiveLogo = document.getElementById('interactiveLogo');
        this.lightningContainer = document.getElementById('lightningContainer');
        this.eventCardsContainer = document.getElementById('eventCardsContainer');
        this.eventCards = document.querySelectorAll('.event-card');
        
        this.isAnimating = false;
        this.isPulsing = false;
        this.lastFlashPosition = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Hover effects for both letters and entire logo area
        this.logoU.addEventListener('mouseenter', () => this.onLogoHover());
        this.logoN.addEventListener('mouseenter', () => this.onLogoHover());
        this.interactiveLogo.addEventListener('mouseenter', () => this.onLogoHover());
        
        this.logoU.addEventListener('mouseleave', () => this.onLogoLeave());
        this.logoN.addEventListener('mouseleave', () => this.onLogoLeave());
        this.interactiveLogo.addEventListener('mouseleave', () => this.onLogoLeave());
        
        // Click effect for the entire logo
        this.interactiveLogo.addEventListener('click', () => this.onLogoClick());
    }
    
    onLogoHover() {
        if (this.isAnimating) return;
        
        // Scale up both letters
        anime({
            targets: [this.logoU, this.logoN],
            scale: 2,
            color: 'rgba(255, 215, 0, 0.8)',
            textShadow: '0 0 100px rgba(255, 215, 0, 0.8)',
            duration: 300,
            easing: 'easeOutQuad'
        });
        
        // Start pulsing after scale animation
        setTimeout(() => {
            if (!this.isPulsing) {
                this.startPulsing();
            }
        }, 300);
    }
    
    onLogoLeave() {
        if (this.isAnimating) return;
        
        this.stopPulsing();
        
        // Scale back down
        anime({
            targets: [this.logoU, this.logoN],
            scale: 1,
            color: 'rgba(255, 215, 0, 0.15)',
            textShadow: '0 0 50px rgba(255, 215, 0, 0.3)',
            duration: 300,
            easing: 'easeOutQuad'
        });
    }
    
    startPulsing() {
        this.isPulsing = true;
        
        anime({
            targets: [this.logoU, this.logoN],
            scale: [2, 2.1, 2],
            duration: 800,
            easing: 'easeInOutQuad',
            loop: true
        });
    }
    
    stopPulsing() {
        this.isPulsing = false;
        anime.remove([this.logoU, this.logoN]);
    }
    
    onLogoClick() {
        if (this.isAnimating) return;
        
        this.isAnimating = true;
        this.stopPulsing();
        
        // Reset all lightnings to hidden state
        this.resetAllLightnings();
        
        // Hide event cards first
        this.hideEventCards();
        
        // Animate lightning effects
        this.animateLightning();
        
        // Animation state will be reset automatically when sequence completes
    }
    
    animateLightning() {
        const lightnings = this.lightningContainer.querySelectorAll('.lightning');
        
        // Add random lightning flashes for realism
        this.addRandomLightningFlashes();
        
        // Start the sequential animation
        this.animateLightningSequence(lightnings, 0);
    }
    
    animateLightningSequence(lightnings, index) {
        if (index >= lightnings.length) {
            // All lightnings completed
            this.isAnimating = false;
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
        
        // Start with dot visible at the beginning
        dot.style.opacity = '1';
        
        // Animate the glowing dot moving along the path while drawing the lightning
        this.animateLightningGrowth(dot, path, index, 0, () => {
            // After this lightning completes, start the next one
            setTimeout(() => {
                this.animateLightningSequence(lightnings, index + 1);
            }, 400); // Shorter delay for shortened lightnings
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
    
    animateLightningGrowth(dot, path, lightningIndex, delay, onComplete) {
        // Get path length for dot animation
        const pathLength = path.getTotalLength();
        const pathPoints = [];
        
        // Create more points for smoother animation with diagonal movement
        for (let i = 0; i <= 80; i++) {
            const point = path.getPointAtLength((pathLength / 80) * i);
            pathPoints.push({ x: point.x, y: point.y });
        }
        
        // Get end point for flash effect
        const endPoint = pathPoints[pathPoints.length - 1];
        
        // Set initial position of dot at start of path
        const startPoint = pathPoints[0];
        dot.setAttribute('cx', startPoint.x);
        dot.setAttribute('cy', startPoint.y);
        
        // Animate dot moving along the path while drawing the lightning
        anime({
            targets: dot,
            duration: 600, // Shorter duration for shortened paths
            easing: 'easeOutQuad',
            delay: delay,
            update: (anim) => {
                const progress = anim.progress / 100;
                const pointIndex = Math.floor(progress * (pathPoints.length - 1));
                const point = pathPoints[pointIndex];
                if (point) {
                    // Add more pronounced diagonal movement and jitter
                    const jitterX = (Math.random() - 0.5) * 1.0; // Increased jitter
                    const jitterY = (Math.random() - 0.5) * 1.0;
                    
                    // Add diagonal movement based on progress
                    const diagonalOffset = Math.sin(progress * Math.PI * 4) * 0.5;
                    const finalX = point.x + jitterX + diagonalOffset;
                    const finalY = point.y + jitterY + diagonalOffset;
                    
                    dot.setAttribute('cx', finalX);
                    dot.setAttribute('cy', finalY);
                    
                    // Add more dynamic flickering effect
                    const flicker = 0.6 + Math.random() * 0.8; // Random opacity between 0.6 and 1.4
                    dot.style.opacity = flicker;
                    
                    // Add size variation for more dynamic effect
                    const sizeVariation = 0.3 + Math.random() * 0.4; // Size between 0.3 and 0.7
                    dot.setAttribute('r', sizeVariation);
                }
                
                // Update lightning path to show the part that dot has traveled
                const currentLength = pathLength * progress;
                
                // Show the path from start to current position
                path.style.strokeDasharray = `${currentLength} ${pathLength}`;
                path.style.strokeDashoffset = '0';
                path.style.opacity = '1';
                
                // Add subtle lightning shake effect
                const shakeX = (Math.random() - 0.5) * 0.3;
                const shakeY = (Math.random() - 0.5) * 0.3;
                path.style.transform = `translate(${shakeX}px, ${shakeY}px)`;
            },
            complete: () => {
                // Fade out the lightning path gradually
                anime({
                    targets: path,
                    opacity: 0,
                    duration: 200,
                    easing: 'easeOutQuad',
                    complete: () => {
                        // Reset strokeDasharray to hide the lightning path
                        path.style.strokeDasharray = '0 1000';
                        path.style.opacity = '0';
                    }
                });
                
                // Hide dot immediately
                dot.style.opacity = '0';
                
                // Create and animate flash effect, then show event card
                this.createLightningFlash(endPoint, lightningIndex, () => {
                    // Show event card after flash with small delay
                    setTimeout(() => {
                        this.showEventCard(lightningIndex, endPoint);
                        
                        // Call the completion callback to start next lightning
                        if (onComplete) {
                            onComplete();
                        }
                    }, 200); // Small delay to let user see the flash
                });
            }
        });
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
        
        // Store flash position for event card
        this.lastFlashPosition = { x: endPoint.x, y: endPoint.y };
        
        // Animate flash
        anime({
            targets: flash,
            opacity: [0, 1, 0],
            scale: [0, 3, 0],
            duration: 300,
            easing: 'easeOutQuad',
            complete: () => {
                // Remove flash element
                flash.remove();
                
                // Call completion callback
                if (onComplete) {
                    onComplete();
                }
            }
        });
    }
    
    showEventCard(lightningIndex, endPoint) {
        const eventCard = this.eventCards[lightningIndex];
        if (eventCard) {
            // Use the exact same coordinates as the flash
            let finalX = this.lastFlashPosition ? this.lastFlashPosition.x : endPoint.x;
            let finalY = this.lastFlashPosition ? this.lastFlashPosition.y : endPoint.y;
            
            // Debug: log coordinates
            console.log(`Lightning ${lightningIndex} end point:`, endPoint);
            console.log(`Using flash position:`, finalX, finalY);
            
            // Exclude the area with title and button (center-right area)
            // Title area: roughly 60-90% horizontal, 30-60% vertical
            const isInTitleArea = finalX >= 60 && finalX <= 90 && finalY >= 30 && finalY <= 60;
            
            if (isInTitleArea) {
                // Move to a different area - prefer corners and edges
                if (finalX > 50) {
                    // Move to right edge
                    finalX = 85 + Math.random() * 10; // 85-95%
                } else {
                    // Move to left edge
                    finalX = 5 + Math.random() * 10; // 5-15%
                }
                
                if (finalY > 50) {
                    // Move to bottom area
                    finalY = 70 + Math.random() * 15; // 70-85%
                } else {
                    // Move to top area
                    finalY = 15 + Math.random() * 15; // 15-30%
                }
            }
            
            // Ensure cards don't overlap with logo area
            const centerX = 50;
            const centerY = 50;
            const distanceFromCenter = Math.sqrt(Math.pow(finalX - centerX, 2) + Math.pow(finalY - centerY, 2));
            
            // If too close to center (logo area), move further out
            if (distanceFromCenter < 35) {
                const angle = Math.atan2(finalY - centerY, finalX - centerX);
                const farDistance = 40; // Move to at least 40% from center
                finalX = centerX + Math.cos(angle) * farDistance;
                finalY = centerY + Math.sin(angle) * farDistance;
            }
            
            // Add small random offset to avoid overlapping cards
            const randomOffsetX = (Math.random() - 0.5) * 4; // ±2%
            const randomOffsetY = (Math.random() - 0.5) * 4; // ±2%
            finalX += randomOffsetX;
            finalY += randomOffsetY;
            
            // Ensure cards stay within safe bounds
            // Header area: top 10%, Footer area: bottom 15%
            finalX = Math.max(5, Math.min(95, finalX)); // Keep away from edges
            finalY = Math.max(10, Math.min(85, finalY)); // Keep away from header (10%) and footer (15%)
            
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
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new LogoAnimations();
});
