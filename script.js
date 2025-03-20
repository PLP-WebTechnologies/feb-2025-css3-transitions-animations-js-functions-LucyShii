document.addEventListener('DOMContentLoaded', function() {
    // DOM Elements
    const animatedBox = document.getElementById('animated-box');
    const playPulseBtn = document.getElementById('play-pulse');
    const playRotateBtn = document.getElementById('play-rotate');
    const playBounceBtn = document.getElementById('play-bounce');
    const playShakeBtn = document.getElementById('play-shake');
    const playCustomBtn = document.getElementById('play-custom');
    
    const backgroundColorPicker = document.getElementById('background-color');
    const elementColorPicker = document.getElementById('element-color');
    const textColorPicker = document.getElementById('text-color');
    const saveThemeBtn = document.getElementById('save-theme');
    const resetThemeBtn = document.getElementById('reset-theme');
    
    const durationSlider = document.getElementById('animation-duration');
    const durationValue = document.getElementById('duration-value');
    const scaleSlider = document.getElementById('animation-scale');
    const scaleValue = document.getElementById('scale-value');
    const rotationSlider = document.getElementById('animation-rotation');
    const rotationValue = document.getElementById('rotation-value');
    const timingFunction = document.getElementById('timing-function');
    const iterationsSelect = document.getElementById('animation-iterations');
    const applyCustomBtn = document.getElementById('apply-custom');
    const saveAnimationBtn = document.getElementById('save-animation');
    const savedList = document.getElementById('saved-list');
    
    // Current animation state
    let currentAnimation = {
        duration: 1,
        scale: 1.2,
        rotation: 0,
        timing: 'ease',
        iterations: 1
    };
    
    // Initialize - Load saved data from localStorage
    initializeFromLocalStorage();
    
    // Animation Showcase Event Listeners
    playPulseBtn.addEventListener('click', () => playAnimation('animate-pulse'));
    playRotateBtn.addEventListener('click', () => playAnimation('animate-rotate'));
    playBounceBtn.addEventListener('click', () => playAnimation('animate-bounce'));
    playShakeBtn.addEventListener('click', () => playAnimation('animate-shake'));
    playCustomBtn.addEventListener('click', playComboAnimation);
    
    // Theme Customizer Event Listeners
    backgroundColorPicker.addEventListener('input', updateThemePreview);
    elementColorPicker.addEventListener('input', updateThemePreview);
    textColorPicker.addEventListener('input', updateThemePreview);
    saveThemeBtn.addEventListener('click', saveTheme);
    resetThemeBtn.addEventListener('click', resetTheme);
    
    // Animation Creator Event Listeners
    durationSlider.addEventListener('input', updateDurationValue);
    scaleSlider.addEventListener('input', updateScaleValue);
    rotationSlider.addEventListener('input', updateRotationValue);
    applyCustomBtn.addEventListener('click', applyCustomAnimation);
    saveAnimationBtn.addEventListener('click', saveCustomAnimation);
    
    // Animation Showcase Functions
    function playAnimation(animationClass) {
        // Remove any current animations
        resetAnimations();
        
        // Add the new animation class
        animatedBox.classList.add(animationClass);
        
        // Play a quick scale animation when button is clicked for feedback
        const button = document.getElementById(`play-${animationClass.replace('animate-', '')}`);
        if (button) {
            button.classList.add('clicked');
            setTimeout(() => {
                button.classList.remove('clicked');
            }, 300);
        }
    }
    
    function playComboAnimation() {
        resetAnimations();
        
        // Create and apply a random combo of transformations
        const keyframesName = 'combo-animation';
        const duration = Math.random() * 2 + 1;
        const delay = Math.random() * 0.5;
        
        // Generate random transformations
        const transforms = [
            'scale(1.5)',
            'rotate(180deg)',
            'translateY(-20px)',
            'skew(15deg, 15deg)'
        ];
        
        // Create a random sequence of transformations
        let keyframes = '';
        for (let i = 0; i <= 10; i++) {
            const percent = i * 10;
            const randomTransform = transforms[Math.floor(Math.random() * transforms.length)];
            keyframes += `${percent}% { transform: ${randomTransform}; }\n`;
        }
        
        // Create a new style element for our keyframes
        const styleEl = document.createElement('style');
        styleEl.innerHTML = `
            @keyframes ${keyframesName} {
                ${keyframes}
            }
        `;
        document.head.appendChild(styleEl);
        
        // Apply the animation
        animatedBox.style.animation = `${keyframesName} ${duration}s ease-in-out ${delay}s infinite alternate`;
        
        // Clean up after animation ends
        setTimeout(() => {
            document.head.removeChild(styleEl);
        }, (duration * 1000) + 100);
    }
    
    function resetAnimations() {
        // Remove all animation classes
        animatedBox.className = 'animated-element';
        animatedBox.style.animation = '';
    }
    
    // Theme Customizer Functions
    function updateThemePreview() {
        document.documentElement.style.setProperty('--background-color', backgroundColorPicker.value);
        document.documentElement.style.setProperty('--element-color', elementColorPicker.value);
        document.documentElement.style.setProperty('--text-color', textColorPicker.value);
    }
    
    function saveTheme() {
        // Save the current theme to localStorage
        const theme = {
            backgroundColor: backgroundColorPicker.value,
            elementColor: elementColorPicker.value,
            textColor: textColorPicker.value
        };
        
        localStorage.setItem('savedTheme', JSON.stringify(theme));
        
        // Show feedback
        showFeedback(saveThemeBtn, 'Theme Saved!');
    }
    
    function resetTheme() {
        // Reset to default values
        backgroundColorPicker.value = '#ffffff';
        elementColorPicker.value = '#3498db';
        textColorPicker.value = '#333333';
        
        // Apply the reset theme
        updateThemePreview();
        
        // Remove from localStorage
        localStorage.removeItem('savedTheme');
        
        // Show feedback
        showFeedback(resetThemeBtn, 'Theme Reset!');
    }
    
    // Animation Creator Functions
    function updateDurationValue() {
        const value = durationSlider.value;
        durationValue.textContent = `${value}s`;
        currentAnimation.duration = value;
    }
    
    function updateScaleValue() {
        const value = scaleSlider.value;
        scaleValue.textContent = `${value}x`;
        currentAnimation.scale = value;
    }
    
    function updateRotationValue() {
        const value = rotationSlider.value;
        rotationValue.textContent = `${value}°`;
        currentAnimation.rotation = value;
    }
    
    function applyCustomAnimation() {
        resetAnimations();
        
        // Get current values
        currentAnimation.timing = timingFunction.value;
        currentAnimation.iterations = iterationsSelect.value;
        
        // Create a unique name for this animation
        const keyframesName = 'custom-animation-' + Date.now();
        
        // Create the keyframes
        const styleEl = document.createElement('style');
        styleEl.innerHTML = `
            @keyframes ${keyframesName} {
                0% { transform: scale(1) rotate(0deg); }
                50% { transform: scale(${currentAnimation.scale}) rotate(${currentAnimation.rotation}deg); }
                100% { transform: scale(1) rotate(0deg); }
            }
        `;
        document.head.appendChild(styleEl);
        
        // Apply the animation
        animatedBox.style.animation = `${keyframesName} ${currentAnimation.duration}s ${currentAnimation.timing} 0s ${currentAnimation.iterations} normal forwards`;
        
        // Clean up after animation ends (if it's not infinite)
        if (currentAnimation.iterations !== 'infinite') {
            const duration = currentAnimation.duration * currentAnimation.iterations;
            setTimeout(() => {
                if (styleEl.parentNode) {
                    document.head.removeChild(styleEl);
                }
            }, (duration * 1000) + 100);
        }
    }
    
    function saveCustomAnimation() {
        // Get current values for animation
        currentAnimation.timing = timingFunction.value;
        currentAnimation.iterations = iterationsSelect.value;
        
        // Create a name for the animation
        const name = `Animation ${new Date().toLocaleString().split(',')[1].trim()}`;
        
        // Save to localStorage
        let savedAnimations = JSON.parse(localStorage.getItem('savedAnimations')) || [];
        savedAnimations.push({
            name: name,
            settings: { ...currentAnimation }
        });
        
        localStorage.setItem('savedAnimations', JSON.stringify(savedAnimations));
        
        // Refresh the saved animations list
        renderSavedAnimations();
        
        // Show feedback
        showFeedback(saveAnimationBtn, 'Animation Saved!');
    }
    
    function renderSavedAnimations() {
        // Get saved animations from localStorage
        const savedAnimations = JSON.parse(localStorage.getItem('savedAnimations')) || [];
        
        // Clear the current list
        savedList.innerHTML = '';
        
        if (savedAnimations.length === 0) {
            savedList.innerHTML = '<p class="empty-state">No saved animations yet. Create and save some!</p>';
            return;
        }
        
        // Render each saved animation
        savedAnimations.forEach((anim, index) => {
            const animItem = document.createElement('div');
            animItem.className = 'saved-animation-item';
            animItem.innerHTML = `
                <span>${anim.name}</span>
                <div>
                    <button class="play-btn" data-index="${index}">Play</button>
                    <button class="delete-btn" data-index="${index}">×</button>
                </div>
            `;
            savedList.appendChild(animItem);
        });
        
        // Add event listeners to the new buttons
        document.querySelectorAll('.play-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                playSavedAnimation(index);
            });
        });
        
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                deleteSavedAnimation(index);
            });
        });
    }
    
    function playSavedAnimation(index) {
        // Get the saved animation
        const savedAnimations = JSON.parse(localStorage.getItem('savedAnimations')) || [];
        const anim = savedAnimations[index];
        
        if (!anim) return;
        
        // Reset current animations
        resetAnimations();
        
        // Load the saved settings into the controls
        durationSlider.value = anim.settings.duration;
        scaleSlider.value = anim.settings.scale;
        rotationSlider.value = anim.settings.rotation;
        timingFunction.value = anim.settings.timing;
        iterationsSelect.value = anim.settings.iterations;
        
        // Update the display values
        updateDurationValue();
        updateScaleValue();
        updateRotationValue();
        
        // Update the current animation object
        currentAnimation = { ...anim.settings };
        
        // Play the animation
        applyCustomAnimation();
    }
    
    function deleteSavedAnimation(index) {
        // Get saved animations
        let savedAnimations = JSON.parse(localStorage.getItem('savedAnimations')) || [];
        
        // Remove the animation at the specified index
        savedAnimations.splice(index, 1);
        
        // Save back to localStorage
        localStorage.setItem('savedAnimations', JSON.stringify(savedAnimations));
        
        // Refresh the list
        renderSavedAnimations();
    }
    
    // Helper Functions
    function showFeedback(button, message) {
        const originalText = button.textContent;
        button.textContent = message;
        
        setTimeout(() => {
            button.textContent = originalText;
        }, 1500);
    }
    
    function initializeFromLocalStorage() {
        // Load theme if saved
        const savedTheme = JSON.parse(localStorage.getItem('savedTheme'));
        if (savedTheme) {
            backgroundColorPicker.value = savedTheme.backgroundColor;
            elementColorPicker.value = savedTheme.elementColor;
            textColorPicker.value = savedTheme.textColor;
            updateThemePreview();
        }
        
        // Load saved animations
        renderSavedAnimations();
    }
});