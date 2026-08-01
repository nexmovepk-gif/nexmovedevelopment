/**
 * NexMove Development - Enterprise Interactive Engine (V3 Update)
 * Handles Hero Particle Canvas, Budget Category Tabs, 70k PKR & High-Tier Apps Calculators, Marquee, Booking & Animations
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroCanvas();
  initMobileNav();
  initStickyHeader();
  initBudgetCalculator();
  initPortfolioFilters();
  initFaqAccordion();
  initSlotPicker();
  initFormValidations();
  initCounterObserver();
});

/* --- 0. HERO ANIMATED TECH CANVAS (HOME PAGE) --- */
function initHeroCanvas() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = canvas.width = canvas.parentElement.offsetWidth;
  let height = canvas.height = canvas.parentElement.offsetHeight;

  window.addEventListener('resize', () => {
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.parentElement.offsetHeight;
  });

  const particles = [];
  const particleCount = Math.min(width < 768 ? 25 : 55, 60);

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.8,
      vy: (Math.random() - 0.5) * 0.8,
      radius: Math.random() * 2 + 1
    });
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // Draw connecting lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 210, 255, ${0.18 * (1 - dist / 130)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = '#00D2FF';
      ctx.shadowBlur = 8;
      ctx.shadowColor = '#00D2FF';
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(draw);
  }

  draw();
}

/* --- 1. MOBILE NAVIGATION DRAWER --- */
function initMobileNav() {
  const toggleBtn = document.getElementById('mobileNavToggle');
  const closeBtn = document.getElementById('mobileDrawerClose');
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');

  if (!toggleBtn || !drawer) return;

  function openDrawer() {
    drawer.classList.add('open');
    if (overlay) overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggleBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (overlay) overlay.addEventListener('click', closeDrawer);
}

/* --- 2. STICKY HEADER EFFECTS --- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      header.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.8)';
    } else {
      header.style.boxShadow = 'none';
    }
  });
}

/* --- 3. DYNAMIC BUDGET & PROPOSAL NEGOTIATOR (TWO SEPARATE CATEGORY TABS) --- */
function initBudgetCalculator() {
  const calcForm = document.getElementById('budgetCalculatorForm');
  if (!calcForm) return;

  let currentCategory = 'standard'; // 'standard' (70k floor) or 'engineering' (250k floor)
  let currentCurrency = 'PKR'; // 'PKR' or 'USD'
  const exchangeRate = 280; // 1 USD = 280 PKR

  const tabBtns = document.querySelectorAll('.calc-tab-btn');
  const currencyBtns = document.querySelectorAll('.currency-btn');
  const standardCheckboxes = document.getElementById('standardServicesGroup');
  const engineeringCheckboxes = document.getElementById('engineeringServicesGroup');
  const budgetSlider = document.getElementById('budgetSlider');
  const customBudgetInput = document.getElementById('customBudgetInput');
  const sliderValDisplay = document.getElementById('sliderValDisplay');
  const estimatedScopeText = document.getElementById('estimatedScopeText');
  const timelineText = document.getElementById('timelineText');
  const discountText = document.getElementById('discountText');

  // Baseline Prices in PKR
  const basePricesPKR = {
    web: 70000,
    seo: 70000,
    smm: 70000,
    dm: 70000,
    software: 250000,
    mobile: 280000,
    saas: 350000
  };

  // Category Tab Switching
  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.dataset.category;

      if (currentCategory === 'standard') {
        if (standardCheckboxes) standardCheckboxes.style.display = 'grid';
        if (engineeringCheckboxes) engineeringCheckboxes.style.display = 'none';
      } else {
        if (standardCheckboxes) standardCheckboxes.style.display = 'none';
        if (engineeringCheckboxes) engineeringCheckboxes.style.display = 'grid';
      }

      // Reset initial values when tab changes
      const minPKR = currentCategory === 'standard' ? 70000 : 250000;
      const minVal = currentCurrency === 'PKR' ? minPKR : Math.round(minPKR / exchangeRate);

      if (budgetSlider) budgetSlider.value = minVal;
      if (customBudgetInput) customBudgetInput.value = minVal;

      updateCalculator();
    });
  });

  // Currency Switcher
  currencyBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      currencyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCurrency = btn.dataset.currency;

      const minPKR = currentCategory === 'standard' ? 70000 : 250000;
      const minVal = currentCurrency === 'PKR' ? minPKR : Math.round(minPKR / exchangeRate);

      if (budgetSlider) budgetSlider.value = minVal;
      if (customBudgetInput) customBudgetInput.value = minVal;

      updateCalculator();
    });
  });

  // Checkbox styling & event handlers
  const allCheckboxes = calcForm.querySelectorAll('input[type="checkbox"]');
  allCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const card = cb.closest('.checkbox-card');
      if (card) {
        if (cb.checked) card.classList.add('selected');
        else card.classList.remove('selected');
      }
      updateCalculator();
    });
  });

  // Slider & manual input sync
  if (budgetSlider) {
    budgetSlider.addEventListener('input', () => {
      if (customBudgetInput) customBudgetInput.value = budgetSlider.value;
      updateCalculator();
    });
  }

  if (customBudgetInput) {
    customBudgetInput.addEventListener('input', () => {
      if (budgetSlider) budgetSlider.value = customBudgetInput.value;
      updateCalculator();
    });
  }

  function updateCalculator() {
    let activeGroup = currentCategory === 'standard' ? standardCheckboxes : engineeringCheckboxes;
    let checkboxes = activeGroup ? activeGroup.querySelectorAll('input[type="checkbox"]') : [];

    let totalBasePKR = 0;
    let selectedCount = 0;

    checkboxes.forEach(cb => {
      if (cb.checked) {
        selectedCount++;
        totalBasePKR += (basePricesPKR[cb.value] || (currentCategory === 'standard' ? 70000 : 250000));
      }
    });

    const minPKR = currentCategory === 'standard' ? 70000 : 250000;
    const maxPKR = currentCategory === 'standard' ? 300000 : 1200000;

    if (selectedCount === 0) totalBasePKR = minPKR;

    const minUSD = Math.round(minPKR / exchangeRate); // ~$250 or ~$900 USD
    const maxUSD = Math.round(maxPKR / exchangeRate);

    let minVal = currentCurrency === 'PKR' ? minPKR : minUSD;
    let maxVal = currentCurrency === 'PKR' ? maxPKR : maxUSD;
    let stepVal = currentCurrency === 'PKR' ? (currentCategory === 'standard' ? 5000 : 15000) : 25;

    if (budgetSlider) {
      budgetSlider.min = minVal;
      budgetSlider.max = maxVal;
      budgetSlider.step = stepVal;
    }

    let userBudget = parseFloat(budgetSlider ? budgetSlider.value : minVal);
    if (isNaN(userBudget) || userBudget < minVal) userBudget = minVal;

    // Display formatted proposal amounts
    const symbol = currentCurrency === 'PKR' ? 'PKR ' : '$';
    if (sliderValDisplay) {
      sliderValDisplay.textContent = `${symbol}${userBudget.toLocaleString()}`;
    }

    // Determine Scope Tier & Delivery Timeline
    let ratio = currentCurrency === 'PKR' ? (userBudget / totalBasePKR) : (userBudget * exchangeRate / totalBasePKR);
    let scopeTier = currentCategory === 'standard' ? "Standard Marketing & Web Package" : "High-Tier Engineering & Apps Suite";
    let weeks = currentCategory === 'standard' ? Math.max(1, Math.ceil(1.5 + selectedCount * 0.8)) : Math.max(3, Math.ceil(3 + selectedCount * 1.5));
    let bonus = "Standard QA & 1-Month Post Launch Support";

    if (ratio >= 1.25) {
      scopeTier = currentCategory === 'standard' ? "Priority Scale Web & Marketing Suite" : "Enterprise SaaS & App Architecture";
      weeks = Math.max(1, weeks - 1);
      bonus = "VIP Dedicated Senior Lead + 3-Month Extended Warranty & Analytics Setup";
    } else if (ratio < 0.85) {
      scopeTier = currentCategory === 'standard' ? "Essential Starter Web & Marketing" : "MVP Mobile / SaaS Architecture";
      bonus = "Essential Deliverables & Post-Launch Handoff";
    }

    if (estimatedScopeText) estimatedScopeText.textContent = scopeTier;
    if (timelineText) timelineText.textContent = `${weeks} - ${weeks + 1} Weeks`;
    if (discountText) discountText.textContent = bonus;
  }

  // Handle Form Submission
  calcForm.addEventListener('submit', (e) => {
    e.preventDefault();
    showToast('Custom Proposal Submitted! CEO Ali Hamza’s team will contact you within 2 hours.');
    calcForm.reset();
    allCheckboxes.forEach(cb => {
      const card = cb.closest('.checkbox-card');
      if (card) card.classList.remove('selected');
    });
    updateCalculator();
  });

  updateCalculator();
}

/* --- 4. PORTFOLIO CATEGORY FILTERS --- */
function initPortfolioFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioItems = document.querySelectorAll('.portfolio-item');

  if (filterBtns.length === 0 || portfolioItems.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.dataset.filter;

      portfolioItems.forEach(item => {
        const category = item.dataset.category;
        if (filterVal === 'all' || category === filterVal) {
          item.style.display = 'flex';
          item.style.animation = 'fadeIn 0.4s ease';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* --- 5. FAQ ACCORDION --- */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      faqItems.forEach(i => i.classList.remove('active'));

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}

/* --- 6. STRATEGY CALL CONSULTATION SLOT PICKER --- */
function initSlotPicker() {
  const slotBtns = document.querySelectorAll('.slot-btn');
  const selectedSlotInput = document.getElementById('selectedTimeSlot');

  slotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      slotBtns.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      if (selectedSlotInput) {
        selectedSlotInput.value = btn.dataset.slot || btn.textContent.trim();
      }
    });
  });
}

/* --- 7. FORM VALIDATION & SUBMISSION TOASTS --- */
function initFormValidations() {
  const bookingForm = document.getElementById('consultationBookingForm');
  const contactForm = document.getElementById('generalContactForm');

  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Strategy Session Booked! Executive confirmation sent to your email.');
      bookingForm.reset();
      document.querySelectorAll('.slot-btn').forEach(b => b.classList.remove('selected'));
    });
  }

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      showToast('Thank you for contacting NexMove Development. Founder Ali Hamza’s team will reply shortly!');
      contactForm.reset();
    });
  }
}

/* --- 8. COUNTER ANIMATION ON SCROLL --- */
function initCounterObserver() {
  const counters = document.querySelectorAll('.stat-num[data-target]');
  if (counters.length === 0) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = +counter.dataset.target;
        const prefix = counter.dataset.prefix || '';
        const suffix = counter.dataset.suffix || '';
        let count = 0;
        const increment = target / 50;

        const updateCount = () => {
          count += increment;
          if (count < target) {
            counter.innerText = `${prefix}${Math.ceil(count)}${suffix}`;
            setTimeout(updateCount, 30);
          } else {
            counter.innerText = `${prefix}${target}${suffix}`;
          }
        };
        updateCount();
        obs.unobserve(counter);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(c => observer.observe(c));
}

/* --- UTILITY: TOAST NOTIFICATIONS --- */
function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#00D2FF" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    toast.style.transition = 'all 0.4s ease';
    setTimeout(() => toast.remove(), 400);
  }, 4000);
}
