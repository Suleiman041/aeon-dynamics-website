// ============================================
// Theme Toggle (Tesla-Style Light/Dark Mode)
// ============================================

function updateLogo(theme) {
    const logoImage = document.getElementById('logoImage');
    if (logoImage) {
        logoImage.src = theme === 'dark'
            ? 'AEON_dark_mode-removebg-preview.png'
            : 'AEON_light_mode-removebg-preview.png';
    }
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateLogo(newTheme);
}

// Initialize theme on page load - default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
updateLogo(savedTheme);

// Theme toggle button
const themeToggle = document.getElementById('themeToggle');
if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

// ============================================
// Mobile Navigation
// ============================================

function initMobileNav() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });

        // Close mobile menu when clicking on a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu.classList.contains('active') &&
                !navMenu.contains(e.target) &&
                !navToggle.contains(e.target)) {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            }
        });
    }
}

// Initialize navigation when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMobileNav);
} else {
    initMobileNav();
}

// ============================================
// Smooth Scroll
// ============================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// Navbar Scroll Effect
// ============================================

let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.style.padding = '0.5rem 0';
        navbar.style.boxShadow = 'var(--shadow-md)';
    } else {
        navbar.style.padding = '0.75rem 0';
        navbar.style.boxShadow = 'none';
    }

    lastScroll = currentScroll;
});

// ============================================
// Scroll Animations
// ============================================

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all animatable elements
document.querySelectorAll('.tech-card, .product-card, .project-card, .why-card, .award-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Save observer globally for product details page
window.observer = observer;

// ============================================
// 3D Hero Background
// ============================================

// ============================================
// Dynamic Hero Background (Engineering Network)
// ============================================

const canvas = document.getElementById('heroCanvas');
let ctx;
let particles = [];
let animationId;
let mouse = { x: null, y: null, radius: 150 };

function initHeroAnimation() {
    if (!canvas) return;

    ctx = canvas.getContext('2d');
    resizeCanvas();

    // Create particles
    createParticles();

    // Start animation
    animateParticles();

    // Event listeners
    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    // Mouse interaction
    window.addEventListener('mousemove', (event) => {
        mouse.x = event.x;
        mouse.y = event.y;
    });

    // Touch interaction
    window.addEventListener('touchmove', (event) => {
        mouse.x = event.touches[0].clientX;
        mouse.y = event.touches[0].clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });
}

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.baseX = this.x;
        this.baseY = this.y;
        this.density = (Math.random() * 30) + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        // Bounce off edges
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Mouse interaction
        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const maxDistance = mouse.radius;
                const force = (maxDistance - distance) / maxDistance;
                const directionX = forceDirectionX * force * this.density;
                const directionY = forceDirectionY * force * this.density;

                if (distance < mouse.radius) {
                    this.x -= directionX;
                    this.y -= directionY;
                }
            }
        }
    }

    draw() {
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        // Draw technical "data" ring around some particles
        if (this.size > 2.5) {
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size * 2, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}

function createParticles() {
    particles = [];
    const numberOfParticles = Math.min(window.innerWidth / 15, 80); // Balanced density
    for (let i = 0; i < numberOfParticles; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw particles
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw connections
    connectParticles();

    animationId = requestAnimationFrame(animateParticles);
}

function connectParticles() {
    const maxDistance = 150;
    const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim();

    // Convert hex/named color to RGB for opacity handling if needed, 
    // but for simplicity we'll use the variable and globalAlpha

    for (let i = 0; i < particles.length; i++) {
        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < maxDistance) {
                ctx.beginPath();
                ctx.strokeStyle = accentColor;
                ctx.globalAlpha = 1 - (distance / maxDistance);
                ctx.lineWidth = 0.5; // Thinner, more precise lines
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
                ctx.globalAlpha = 1; // Reset alpha
            }
        }

        // Connect to mouse
        if (mouse.x != null) {
            const dx = particles[i].x - mouse.x;
            const dy = particles[i].y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                ctx.beginPath();
                ctx.strokeStyle = accentColor;
                ctx.globalAlpha = 1 - (distance / mouse.radius);
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
                ctx.globalAlpha = 1;
            }
        }
    }
}

// Initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeroAnimation);
} else {
    initHeroAnimation();
}

// ============================================
// Product Scroll Slow Motion Effect
// ============================================

const productsScroll = document.querySelector('.products-scroll');
const scrollIndicators = document.querySelectorAll('.scroll-indicator-btn');

if (productsScroll && scrollIndicators.length > 0) {
    scrollIndicators.forEach(btn => {
        btn.addEventListener('click', () => {
            const index = parseInt(btn.dataset.index);
            const scrollAmount = index * productsScroll.offsetWidth;
            productsScroll.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });
    });

    productsScroll.addEventListener('scroll', () => {
        const scrollLeft = productsScroll.scrollLeft;
        const width = productsScroll.offsetWidth;
        const activeIndex = Math.round(scrollLeft / width);

        scrollIndicators.forEach((btn, idx) => {
            btn.classList.toggle('active', idx === activeIndex);
        });
    });
}

// ============================================
// Contact Form
// ============================================

const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');

        // Create mailto link with form data
        const subject = encodeURIComponent(`Contact from ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoLink = `mailto:aeondynamics@gmail.com?subject=${subject}&body=${body}`;

        //Open user's email client
        window.location.href = mailtoLink;

        // Show success message
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Opening Email Client...';
        submitButton.disabled = true;

        setTimeout(() => {
            submitButton.textContent = originalText;
            submitButton.disabled = false;
            contactForm.reset();
        }, 2000);
    });
}

// ============================================
// Micro-interactions
// ============================================

// Add hover effects to cards
document.querySelectorAll('.tech-card, .product-card, .project-card').forEach(card => {
    card.addEventListener('mouseenter', function () {
        this.style.transform = 'translateY(-8px)';
    });
    card.addEventListener('mouseleave', function () {
        this.style.transform = 'translateY(0)';
    });
});

// ============================================
// Active Navigation Link Highlighting
// ============================================

const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function highlightNav() {
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');

        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightNav);

// ============================================
// Product Details Page Dynamic Content
// ============================================

const productData = {
    'smart-greenhouse': {
        title: 'Smart Automated Greenhouse',
        subtitle: 'Flagship fully autonomous climate-controlled farming system designed for African agriculture',
        image: 'Full greenhouse.jpg',
        description: 'The Aeon Dynamics Smart Automated Greenhouse is a fully autonomous climate-controlled farming system designed specifically for African agriculture. Built with AeonOS at its core, it integrates sensors, robotics, and intelligent algorithms to monitor and regulate temperature, humidity, soil moisture, irrigation, lighting, and ventilation—all in real time.',
        description2: 'Built with a custom control system and advanced electronics, the greenhouse ensures optimal crop growth with minimal human intervention. It increases yield, reduces water usage, and empowers farmers with a reliable, locally engineered agricultural automation solution. This is our flagship innovation, proving the power of homegrown robotics and intelligent automation.',
        specs: [
            { label: 'OS', value: 'AeonOS' },
            { label: 'Water Savings', value: 'Up to 40%' },
            { label: 'Yield Increase', value: '25-35%' },
            { label: 'Sensors', value: 'Multi-Spectral' }
        ],
        features: [
            { title: 'Climate Control', description: 'Automated temperature, humidity, and ventilation regulation for optimal growing conditions.' },
            { title: 'Smart Irrigation', description: 'Precision water delivery based on soil moisture levels, reducing waste by up to 40%.' },
            { title: 'AeonOS Integration', description: 'Powered by our custom embedded operating system for reliable real-time automation and control.' }
        ]
    },
    'uv-solar-panel': {
        title: 'LumaGlass',
        subtitle: 'Experimental high-efficiency solar technology for next-generation renewable energy',
        image: 'LumaGlass.jpg',
        description: 'The Luminous Ultraviolet Solar Panel is an experimental high-efficiency solar technology designed to convert ultraviolet and visible light into usable electrical power. Unlike traditional panels that lose performance in low-light or cloudy environments, this design amplifies energy capture using UV-reactive materials and enhanced photovoltaic layering.',
        description2: 'This innovation represents our vision for next-generation renewable energy systems: low-cost, durable, and capable of maintaining performance even under challenging environmental conditions. It showcases Aeon Dynamics\' commitment to pushing boundaries in sustainable engineering and renewable energy solutions for Africa.',
        specs: [
            { label: 'Technology', value: 'UV-Enhanced PV' },
            { label: 'Efficiency', value: '22-28%' },
            { label: 'Durability', value: '25+ Years' },
            { label: 'Low-Light', value: 'Enhanced' }
        ],
        features: [
            { title: 'UV-Reactive Layer', description: 'Special coating captures ultraviolet light in addition to visible spectrum for increased energy yield.' },
            { title: 'Weather Resilient', description: 'Maintains performance in cloudy or low-light conditions where traditional panels struggle.' },
            { title: 'Cost-Effective', description: 'Locally engineered design reduces reliance on expensive imported solar technology.' }
        ]
    },
    'anpr-system': {
        title: 'ANPR System',
        subtitle: 'AI-powered computer vision for real-time vehicle plate recognition',
        image: 'ANPR SYSTEM.jpg',
        description: 'Our ANPR (Automatic Number Plate Recognition) system is an AI-powered computer vision solution designed to detect, read, and verify vehicle number plates in real time. Built using advanced image processing and machine learning algorithms running on AeonOS, it accurately identifies plates even under low-light, motion, or challenging environmental conditions.',
        description2: 'The system is ideal for smart security gates, parking facilities, estates, campuses, and law enforcement applications. It brings intelligent security capabilities to local environments without the need for expensive imported solutions, demonstrating our expertise in AI and computer vision.',
        specs: [
            { label: 'OS', value: 'AeonOS' },
            { label: 'Accuracy', value: '>95%' },
            { label: 'Speed', value: 'Real-Time' },
            { label: 'Conditions', value: 'All-Weather' }
        ],
        features: [
            { title: 'Real-Time Detection', description: 'Instant plate recognition and verification with minimal latency for security applications.' },
            { title: 'Low-Light Performance', description: 'Advanced image processing works effectively in challenging lighting and weather conditions.' },
            { title: 'Smart Integration', description: 'Connects seamlessly with access control systems, gates, and security databases.' }
        ]
    },
    'laser-measuring': {
        title: 'Ultrasonic Laser Measuring Device',
        subtitle: 'Compact precision distance-measuring tool for professional applications',
        image: 'AeonBox.jpg',
        description: 'The Aeon Dynamics Ultrasonic Laser Measuring Device is a compact, precise distance-measuring tool that combines ultrasonic sensing with laser guidance to deliver highly accurate readings. Controlled by AeonOS-based firmware, it provides professional-grade measurement capabilities in a portable form factor.',
        description2: 'Designed for engineers, technicians, and builders, the device provides fast and reliable measurements for construction, automation, and industrial applications. With its dual-sensor architecture, it ensures accuracy both indoors and outdoors, making it a versatile addition to any technical toolkit. This project highlights our expertise in embedded systems, sensor integration, and precision mechatronics.',
        specs: [
            { label: 'OS', value: 'AeonOS' },
            { label: 'Range', value: '0.05-50m' },
            { label: 'Accuracy', value: '±1mm' },
            { label: 'Battery', value: '2000+ Readings' }
        ],
        features: [
            { title: 'Dual-Sensor Tech', description: 'Combines ultrasonic and laser sensors for maximum accuracy in various environments.' },
            { title: 'Fast Readings', description: 'Instant distance measurement with clear digital display and data logging capabilities.' },
            { title: 'Versatile Use Cases', description: 'Perfect for construction, automation projects, industrial applications, and technical fieldwork.' }
        ]
    },
    'aeonbox': {
        title: 'AEONBOX',
        subtitle: 'The core brain of the Smart Automated Greenhouse',
        image: 'AeonBox.jpg',
        description: 'The Control Box is the core brain of the Smart Automated Greenhouse—a fully engineered embedded system capable of processing sensor data, running automation logic, IoT/Cloud messaging, and controlling all greenhouse actuators.',
        description2: 'Built as a standalone device, it features a custom PCB, power management system, microcontroller unit, relay/driver modules, and communication interfaces. The control box can be installed in any greenhouse structure and customized for crop type, climate needs, or user preferences. It represents Aeon Dynamics\' ability to design, assemble, and deploy complete industrial-grade control systems from scratch.',
        specs: [
            { label: 'OS', value: 'AeonOS' },
            { label: 'PCB', value: 'Custom Design' },
            { label: 'Connectivity', value: 'IoT/Cloud' },
            { label: 'Grade', value: 'Industrial' }
        ],
        features: [
            { title: 'Sensor Processing', description: 'Real-time data acquisition and processing from multiple environmental sensors for climate monitoring.' },
            { title: 'Automation Logic', description: 'Intelligent decision-making algorithms control irrigation, ventilation, lighting, and climate systems autonomously.' },
            { title: 'IoT & Cloud Integration', description: 'Remote monitoring and control via cloud messaging, enabling real-time alerts and data logging.' }
        ]
    }
};

function initProductDetails() {
    // Only run on product details page
    if (!document.querySelector('.product-overview')) return;

    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');
    const data = productData[productId];

    if (data) {
        // Update Hero
        document.querySelector('.hero-title').textContent = data.title;
        document.querySelector('.hero-subtitle').textContent = data.subtitle;

        // Update Product Image
        const productImage = document.querySelector('.product-detail-image img');
        if (productImage && data.image) {
            productImage.src = data.image;
            productImage.alt = data.title;
        }

        // Update Overview
        const overviewContent = document.querySelector('.overview-content');
        overviewContent.querySelector('.section-title').textContent = data.title;
        const paragraphs = overviewContent.querySelectorAll('.overview-text');
        if (paragraphs.length >= 2) {
            paragraphs[0].textContent = data.description;
            paragraphs[1].textContent = data.description2;
        }

        // Update Specs
        const specsList = document.querySelector('.product-specs-list');
        specsList.innerHTML = '';
        data.specs.forEach(spec => {
            const specItem = document.createElement('div');
            specItem.className = 'spec-item';
            specItem.innerHTML = `
                <span class="spec-label">${spec.label}</span>
                <span class="spec-value">${spec.value}</span>
            `;
            specsList.appendChild(specItem);
        });

        // Update Features
        const techGrid = document.querySelector('.tech-grid');
        techGrid.innerHTML = '';

        // Define different icons for variety
        const icons = [
            `<path d="M12 2L2 7L12 12L22 7L12 2Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
             <path d="M2 17L12 22L22 17" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
             <path d="M2 12L12 17L22 12" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>`,
            `<circle cx="12" cy="12" r="10" stroke-width="2"/>
             <path d="M12 6v6l4 2" stroke-width="2" stroke-linecap="round"/>`,
            `<rect x="3" y="3" width="18" height="18" rx="2" stroke-width="2"/>
             <path d="M9 9h6v6H9z" stroke-width="2"/>`
        ];

        data.features.forEach((feature, index) => {
            const card = document.createElement('div');
            card.className = 'tech-card';
            const iconIndex = index % icons.length;
            card.innerHTML = `
                <div class="tech-icon-wrapper">
                    <svg class="tech-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        ${icons[iconIndex]}
                    </svg>
                </div>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            `;
            techGrid.appendChild(card);
        });

        // Re-initialize scroll animations for new elements
        if (window.observer) {
            document.querySelectorAll('.tech-card').forEach(el => {
                el.style.opacity = '0';
                el.style.transform = 'translateY(30px)';
                el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                window.observer.observe(el);
            });
        }

    } else {
        console.warn('Product ID not found or invalid');
    }
}

// Call initProductDetails on load
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initProductDetails);
} else {
    initProductDetails();
}
