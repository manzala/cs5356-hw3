// Chibi avatar follows cursor horizontally and moves with scroll
document.addEventListener('mousemove', (e) => {
  const chibi = document.getElementById('chibi-avatar');
  const x = e.clientX - (window.innerWidth < 640 ? 20 : 36); // Center the chibi (smaller on mobile)
  gsap.to(chibi, { x: x, duration: 0.5, ease: 'power2.out' });
});

// Store the current active timeline item index
let activeTimelineIndex = 0;

// Map timeline items to their corresponding dialog boxes and content
const timelineData = {
  0: {
    id: 'mckinsey-current',
    title: 'Senior Software Engineer at McKinsey & Company',
    content: `• Architected Java-based middleware layer using Spring Boot for 46,000 global users
              • Led FirstUp project integration with secure API endpoints and data pipeline
              • Reduced security risks by 5% through OWASP vulnerability resolution
              • Achieved $200K annual savings by migrating from HEAP to Dynatrace`
  },
  1: {
    id: 'aws',
    title: 'Software Engineer at AWS',
    content: `• Optimized Network Load Balancers for DynamoDB
              • Developed solutions using Java, Python, AWS Lambda, and CloudFormation
              • Enhanced AWS Kendra's ML-driven data indexing
              • Engineered secure VPC-DynamoDB connections`
  },
  2: {
    id: 'mckinsey-previous',
    title: 'Software Engineer at McKinsey & Company',
    content: `• Built mission-critical election platform with Java and Spring Boot
              • Developed React/Redux frontend applications
              • Optimized Kubernetes cluster resources
              • Implemented comprehensive testing with Jest, Enzyme, and Cypress`
  },
  3: {
    id: 'early-career',
    title: 'Early Career Positions',
    content: `Fidelity Investments (2019):
              • Led backend development for PBO data analytics
              • Built scalable services and RESTful APIs

              Morgan Stanley (2018):
              • Created data-driven chatbot
              • Developed UI using Angular 6
              • Applied ML concepts with Stanford CoreNLP`
  }
};

// Wait for DOM to be fully loaded before setting up timeline interactions
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOM fully loaded - initializing timeline items');
  
  // Create our own popup system
  createStandalonePopupSystem();
  
  // Animate chibi to dialogue positions on scroll (initial setup)
  gsap.utils.toArray('.timeline-item').forEach((item, i) => {
    // Add click event to timeline items to make them reopenable
    item.addEventListener('click', () => {
      console.log(`Timeline item ${i} clicked`);
      activeTimelineIndex = i;
      moveChibiToTimelineItem(i);
      
      // Use our data to open the popup
      if (timelineData[i]) {
        console.log(`Opening popup for timeline item ${i}`);
        openPopup(timelineData[i].id);
      }
    });
    
    ScrollTrigger.create({
      trigger: item,
      start: 'top 80%',
      onEnter: () => {
        activeTimelineIndex = i;
        moveChibiToTimelineItem(i);
      }
    });
  });
  
  // Also add click events to dialog boxes
  document.querySelectorAll('.dialog-box').forEach((box, index) => {
    box.addEventListener('click', () => {
      const popupId = box.getAttribute('data-popup');
      console.log(`Dialog box clicked with popup ID: ${popupId}`);
      
      // Find the matching timeline data
      let popupData = null;
      for (const key in timelineData) {
        if (timelineData[key].id === popupId) {
          popupData = timelineData[key];
          break;
        }
      }
      
      if (popupData) {
        openPopup(popupData.id);
      } else {
        console.warn(`No data found for popup ID: ${popupId}`);
      }
    });
  });
});

// Create a completely standalone popup system
function createStandalonePopupSystem() {
  console.log('Creating standalone popup system');
  
  // Remove any existing popup with our ID
  const existingPopup = document.getElementById('standalone-popup');
  if (existingPopup) {
    existingPopup.remove();
  }
  
  // Create popup container
  const popupContainer = document.createElement('div');
  popupContainer.id = 'standalone-popup';
  popupContainer.style.position = 'fixed';
  popupContainer.style.top = '0';
  popupContainer.style.left = '0';
  popupContainer.style.width = '100%';
  popupContainer.style.height = '100%';
  popupContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  popupContainer.style.display = 'none';
  popupContainer.style.justifyContent = 'center';
  popupContainer.style.alignItems = 'center';
  popupContainer.style.zIndex = '9999';
  
  // Create popup content
  const popupContent = document.createElement('div');
  popupContent.id = 'standalone-popup-content';
  popupContent.style.backgroundColor = 'white';
  popupContent.style.padding = '24px';
  popupContent.style.borderRadius = '8px';
  popupContent.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
  popupContent.style.maxWidth = '90%';
  popupContent.style.width = '600px';
  popupContent.style.maxHeight = '80vh';
  popupContent.style.overflow = 'auto';
  popupContent.style.border = '4px solid #ec4899';
  
  // Create popup title
  const popupTitle = document.createElement('h2');
  popupTitle.id = 'standalone-popup-title';
  popupTitle.style.fontSize = '1.5rem';
  popupTitle.style.marginBottom = '16px';
  popupTitle.style.color = '#ec4899';
  
  // Create popup text
  const popupText = document.createElement('div');
  popupText.id = 'standalone-popup-text';
  popupText.style.marginBottom = '24px';
  popupText.style.whiteSpace = 'pre-line';
  
  // Create close button
  const closeButton = document.createElement('button');
  closeButton.id = 'standalone-popup-close';
  closeButton.textContent = '[CLOSE]';
  closeButton.style.backgroundColor = '#ec4899';
  closeButton.style.color = 'white';
  closeButton.style.padding = '8px 16px';
  closeButton.style.border = 'none';
  closeButton.style.borderRadius = '4px';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontFamily = "'Press Start 2P', cursive";
  closeButton.style.boxShadow = '4px 4px 0px rgba(0,0,0,0.2)';
  
  // Add event listeners
  closeButton.addEventListener('click', hideStandalonePopup);
  popupContainer.addEventListener('click', (e) => {
    if (e.target === popupContainer) {
      hideStandalonePopup();
    }
  });
  
  // Assemble popup
  popupContent.appendChild(popupTitle);
  popupContent.appendChild(popupText);
  popupContent.appendChild(closeButton);
  popupContainer.appendChild(popupContent);
  
  // Add to document
  document.body.appendChild(popupContainer);
  
  console.log('Standalone popup system created');
}

// Show the standalone popup
function showStandalonePopup(title, content) {
  console.log(`Showing standalone popup: ${title}`);
  
  const popupContainer = document.getElementById('standalone-popup');
  const popupTitle = document.getElementById('standalone-popup-title');
  const popupText = document.getElementById('standalone-popup-text');
  
  if (!popupContainer || !popupTitle || !popupText) {
    console.error('Standalone popup elements not found');
    return;
  }
  
  // Set content
  popupTitle.textContent = title;
  popupText.textContent = content;
  
  // Ensure display is set to flex
  popupContainer.style.display = 'flex';
  
  // Ensure z-index is high enough
  popupContainer.style.zIndex = '9999';
  
  // Show popup
  popupContainer.style.opacity = '1';
  
  // Animate appearance
  const popupContent = document.getElementById('standalone-popup-content');
  popupContent.style.transform = 'scale(0.8)';
  popupContent.style.opacity = '0';
  
  // Use setTimeout to ensure the initial state is applied before animating
  setTimeout(() => {
    popupContent.style.transition = 'transform 0.3s ease, opacity 0.3s ease';
    popupContent.style.transform = 'scale(1)';
    popupContent.style.opacity = '1';
  }, 10);
  
  console.log('Standalone popup shown successfully');
}

// Hide the standalone popup
function hideStandalonePopup() {
  console.log('Hiding standalone popup');
  
  const popupContainer = document.getElementById('standalone-popup');
  const popupContent = document.getElementById('standalone-popup-content');
  
  if (!popupContainer || !popupContent) {
    console.error('Standalone popup elements not found for hiding');
    return;
  }
  
  // Animate closing
  popupContent.style.transform = 'scale(0.8)';
  popupContent.style.opacity = '0';
  
  // Wait for animation to complete
  setTimeout(() => {
    // Hide popup
    popupContainer.style.display = 'none';
    
    // Reset content
    const popupText = document.getElementById('standalone-popup-text');
    if (popupText) {
      popupText.textContent = '';
    }
    
    // Reset transform and opacity for next opening
    popupContent.style.transform = 'scale(1)';
    popupContent.style.opacity = '1';
    
    console.log('Standalone popup hidden successfully');
  }, 300);
}

// Function to move chibi to a timeline item position
function moveChibiToTimelineItem(index) {
  const chibi = document.getElementById('chibi-avatar');
  gsap.to(chibi, {
    y: index * 100 + (window.innerWidth < 640 ? 30 : 50), // Adjust for mobile
    duration: 1,
    ease: 'power2.out'
  });
}

// Live text generation with typewriter effect (runs on page load and stays)
document.querySelectorAll('.dialog-text').forEach((textElement) => {
  const fullText = textElement.getAttribute('data-text');
  typeWriter(textElement, fullText, 0);
});

// Typewriter function for retro text animation
function typeWriter(element, text, index) {
  if (index < text.length) {
    element.textContent += text.charAt(index);
    setTimeout(() => typeWriter(element, text, index + 1), 50); // Adjust speed here (50ms per char)
  } else {
    element.style.opacity = 1; // Make text fully visible and stay
  }
}

// Retro Easter egg animation
const retroEasterEgg = document.getElementById('retro-easter-egg');
if (retroEasterEgg) {
  retroEasterEgg.addEventListener('click', (e) => {
    e.target.style.animation = 'blink 0.5s infinite';
    setTimeout(() => {
      e.target.style.animation = '';
    }, 2000);

    // Show retro pixel art effect in pink/lavender
    const pixel = document.createElement('div');
    pixel.classList.add('absolute', 'w-6 sm:w-8', 'h-6 sm:h-8', 'bg-pink-500', 'rounded', 'opacity-50', 'animate-pixel-bounce');
    pixel.style.left = `${Math.random() * 80 + 10}vw`;
    pixel.style.top = `${Math.random() * 80 + 10}vh`;
    document.body.appendChild(pixel);
    setTimeout(() => pixel.remove(), 2000);
  });
}

// CSS for pixel bounce animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes pixel-bounce {
    0% { transform: translateY(0); opacity: 0.5; }
    50% { transform: translateY(-20px); opacity: 1; }
    100% { transform: translateY(0); opacity: 0.5; }
  }
  .animate-pixel-bounce {
    animation: pixel-bounce 1s ease-in-out infinite;
  }
  @keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
  }
  
  /* Make timeline items clickable but without hover effect */
  .timeline-item {
    cursor: pointer;
  }
`;
document.head.appendChild(styleSheet);

// Function to open popup with item data
function openPopup(itemId) {
  const data = timelineData[itemId];
  if (!data) return;
  
  // Allow reopening the same item after closing
  if (isPopupOpen && currentPopupItem === itemId) {
    closePopupWithCleanup();
    return;
  }
  
  isAnimating = true;
  
  // First destroy any existing typed instance
  destroyTyped();
  
  // Reset popup content
  popupTitle.textContent = data.title;
  popupText.innerHTML = '';
  
  // Show popup
  popup.classList.remove('hidden');
  
  // Animate and initialize typing
  gsap.from(popup.querySelector('#popup-content'), {
    scale: 0.8,
    opacity: 0,
    duration: 0.3,
    onComplete: function() {
      currentTyped = new Typed(popupText, {
        strings: [data.content],
        typeSpeed: 10,
        showCursor: false
      });
      isPopupOpen = true;
      currentPopupItem = itemId;
      isAnimating = false;
    }
  });
}

// Inline JavaScript from index.html
// Tailwind CSS configuration
if (typeof tailwind !== 'undefined') {
  tailwind.config = {
    theme: {
      extend: {
        colors: {
          retropink: '#ec4899',
          retrolavender: '#E6E6FA',
          retroblack: '#333333'
        }
      }
    }
  };
}

// Popup content data
const popupData = {
  'mckinsey-current': {
    title: 'Senior Software Engineer at McKinsey & Company',
    content: `• Architected Java-based middleware layer using Spring Boot for 46,000 global users
              • Led FirstUp project integration with secure API endpoints and data pipeline
              • Reduced security risks by 5% through OWASP vulnerability resolution
              • Achieved $200K annual savings by migrating from HEAP to Dynatrace`
  },
  'aws': {
    title: 'Software Engineer at AWS',
    content: `• Optimized Network Load Balancers for DynamoDB
              • Developed solutions using Java, Python, AWS Lambda, and CloudFormation
              • Enhanced AWS Kendra's ML-driven data indexing
              • Engineered secure VPC-DynamoDB connections`
  },
  'mckinsey-previous': {
    title: 'Software Engineer at McKinsey & Company',
    content: `• Built mission-critical election platform with Java and Spring Boot
              • Developed React/Redux frontend applications
              • Optimized Kubernetes cluster resources
              • Implemented comprehensive testing with Jest, Enzyme, and Cypress`
  },
  'early-career': {
    title: 'Early Career Positions',
    content: `Fidelity Investments (2019):
              • Led backend development for PBO data analytics
              • Built scalable services and RESTful APIs

              Morgan Stanley (2018):
              • Created data-driven chatbot
              • Developed UI using Angular 6
              • Applied ML concepts with Stanford CoreNLP`
  }
};

// Animation and interaction logic
document.addEventListener('DOMContentLoaded', () => {
  // Initialize GSAP ScrollTrigger
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }
  
  // Make sure all content is visible initially
  document.querySelectorAll('.timeline-item, .skill-card').forEach(item => {
    item.style.opacity = 1;
    item.style.transform = 'translateX(0)';
  });
  
  // Typing animation for subtitle
  if (typeof Typed !== 'undefined') {
    const subtitleOptions = {
      strings: ['Software Engineer | Tech Explorer'],
      typeSpeed: 50,
      backSpeed: 0,
      loop: false,
      showCursor: true,
      cursorChar: '|',
      onComplete: function() {
        // Start section title animations after subtitle is complete
        animateSectionTitles();
      }
    };
    
    new Typed('#subtitle', subtitleOptions);
  }
  
  // Function to animate section titles
  function animateSectionTitles() {
    const titles = ['#education-title', '#experience-title', '#skills-title'];
    
    titles.forEach((selector, index) => {
      const element = document.querySelector(selector);
      if (!element) return;
      
      const originalText = element.textContent;
      element.textContent = originalText; // Ensure text is visible even if animation fails
      
      // Add the gradient borders immediately
      element.classList.add('section-title');
    });
  }

  // Simple fade-in animation for timeline items
  document.querySelectorAll('.timeline-item').forEach((item, index) => {
    // Set initial state
    if (typeof gsap !== 'undefined') {
      gsap.set(item, { opacity: 1, x: 0 });
      
      // Add a subtle animation on scroll
      gsap.from(item, {
        opacity: 0.5,
        y: 20,
        duration: 0.7,
        scrollTrigger: {
          trigger: item,
          start: "top 90%",
          toggleActions: "play none none none"
        },
        delay: index * 0.1
      });
    }
  });
  
  // Add hover effects to dialog boxes
  document.querySelectorAll('.dialog-box').forEach(box => {
    box.addEventListener('mouseenter', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(box, {
          y: -5,
          duration: 0.3,
          ease: "power1.out"
        });
      }
    });
    
    box.addEventListener('mouseleave', () => {
      if (typeof gsap !== 'undefined') {
        gsap.to(box, {
          y: 0,
          duration: 0.3,
          ease: "power1.out"
        });
      }
    });
  });

  // Popup functionality with typing animation
  const popup = document.getElementById('popup-container');
  const popupTitle = document.getElementById('popup-title');
  const popupText = document.getElementById('popup-text');
  const closePopup = document.getElementById('close-popup');
  let currentTyped = null;
  let isPopupOpen = false;
  let currentPopupItem = null;
  let isAnimating = false;

  // Function to safely destroy typed instance
  function destroyTyped() {
    if (currentTyped) {
      currentTyped.destroy();
      currentTyped = null;
    }
  }

  // Function to properly close the popup and clean up
  function closePopupWithCleanup() {
    if (isAnimating) return;
    
    isAnimating = true;
    if (typeof gsap !== 'undefined') {
      gsap.to(popup.querySelector('#popup-content'), {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        onComplete: function() {
          popup.classList.add('hidden');
          destroyTyped();
          popupText.innerHTML = '';
          isPopupOpen = false;
          currentPopupItem = null;
          isAnimating = false;
        }
      });
    }
  }

  // Function to open popup with item data
  function openPopup(itemId) {
    const data = popupData[itemId];
    if (!data) return;
    
    // Allow reopening the same item after closing
    if (isPopupOpen && currentPopupItem === itemId) {
      closePopupWithCleanup();
      return;
    }
    
    isAnimating = true;
    
    // First destroy any existing typed instance
    destroyTyped();
    
    // Reset popup content
    popupTitle.textContent = data.title;
    popupText.innerHTML = '';
    
    // Show popup
    popup.classList.remove('hidden');
    
    // Animate and initialize typing
    if (typeof gsap !== 'undefined') {
      gsap.from(popup.querySelector('#popup-content'), {
        scale: 0.8,
        opacity: 0,
        duration: 0.3,
        onComplete: function() {
          if (typeof Typed !== 'undefined') {
            currentTyped = new Typed(popupText, {
              strings: [data.content],
              typeSpeed: 10,
              showCursor: false
            });
          }
          isPopupOpen = true;
          currentPopupItem = itemId;
          isAnimating = false;
        }
      });
    }
  }

  document.querySelectorAll('.dialog-box').forEach(box => {
    box.addEventListener('click', () => {
      const itemId = box.dataset.popup;
      openPopup(itemId);
    });
  });

  // Use our clean close function for both button and outside clicks
  closePopup.addEventListener('click', closePopupWithCleanup);

  // Close popup when clicking outside
  popup.addEventListener('click', (e) => {
    if (e.target === popup) {
      closePopupWithCleanup();
    }
  });
  
  // Add retro sound effect on button clicks
  function playRetroSound() {
    const audio = new Audio('data:audio/wav;base64,UklGRl9vT19XQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YU9vT18A');
    audio.volume = 0.2;
    audio.play().catch(e => console.log('Audio play failed:', e));
  }
  
  document.querySelectorAll('button, .dialog-box').forEach(el => {
    el.addEventListener('click', playRetroSound);
  });
  
  // Fix for mobile responsiveness
  if (window.innerWidth <= 640) {
    document.querySelectorAll('.side-dialog').forEach(dialog => {
      dialog.style.marginLeft = '0';
    });
  }
});