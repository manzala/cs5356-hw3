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
  gsap.registerPlugin(ScrollTrigger);
  
  // Make sure all content is visible initially
  document.querySelectorAll('.timeline-item, .skill-card').forEach(item => {
    item.style.opacity = 1;
    item.style.transform = 'translateX(0)';
  });
  
  // Typing animation for subtitle
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
      // Start chibi text animation after subtitle is complete
      animateChibibText();
    }
  };
  
  new Typed('#subtitle', subtitleOptions);

  async function apiCall() {
    try {
        const response = await fetch('https://hellosalut.stefanbohacek.dev/?mode=auto'); //Fetch headers
        const data = await response.json(); //Fetch body
        
        // Log the entire response to understand its structure
        console.log('API Response:', data);

        // Access the 'hello' property directly
        if (data && data.hello) {
            return data.hello + ',';
        } else {
            console.warn('Greeting not found in response, using default.');
            return 'Hello' + ','; // Fallback greeting
        }
    } catch (error) {
        console.error('Error fetching data:', error);
        return 'Hello' + ','; // Fallback greeting
    }
  }
  
  // Function to animate chibi text
  async function animateChibibText() {
    const chibiTextElement = document.getElementById('chibi-text');
    if (!chibiTextElement) return;

    let greeting;
    try {
        greeting = await apiCall();
    } catch (error) {
        console.error('Error fetching greeting:');
        greeting = 'Hello'; // Fallback greeting
    }

    const chibiTextOptions = {
      strings: [greeting + ' GitHub or LinkedIn?'],
      typeSpeed: 60,
      backSpeed: 0,
      loop: false,
      showCursor: true,
      cursorChar: '|',
      startDelay: 500
    };

    new Typed('#chibi-text', chibiTextOptions);
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
  });
  
  // Add hover effects to dialog boxes
  document.querySelectorAll('.dialog-box').forEach(box => {
    box.addEventListener('mouseenter', () => {
      gsap.to(box, {
        y: -5,
        duration: 0.3,
        ease: "power1.out"
      });
    });
    
    box.addEventListener('mouseleave', () => {
      gsap.to(box, {
        y: 0,
        duration: 0.3,
        ease: "power1.out"
      });
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
    gsap.to(popup.querySelector('#popup-content'), {
      scale: 0.8,
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