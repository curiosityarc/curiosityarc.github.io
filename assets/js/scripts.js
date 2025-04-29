// Load header and footer
document.addEventListener('DOMContentLoaded', function() {
    // Load header and footer using jQuery
    $("#header").load("../partials/header.html", function(response, status) {
        if (status === 'error') {
            console.error('Failed to load header');
            return;
        }

        // After header is loaded, set active state with a small delay
        setTimeout(() => {
            const currentPath = window.location.pathname;
            const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
            
            navLinks.forEach(link => {
                const href = link.getAttribute('href');
                if (href) {
                    // Clean up the paths for comparison
                    const cleanCurrentPath = currentPath.toLowerCase()
                        .replace(/^\/+|\/+$/g, '')
                        .replace(/index\.html$/, '');
                    
                    let cleanHref = href.toLowerCase()
                        .replace(/^\.\.?\/?/, '')  // Remove ../ or ./ from start
                        .replace(/^\/+|\/+$/g, '') // Remove leading/trailing slashes
                        .replace(/index\.html$/, '')
                        .replace(/\.html$/, '');

                    // Special case for home page
                    if (cleanHref === '') {
                        cleanHref = 'index';
                    }
                    
                    // Check if current path matches the href
                    if (cleanCurrentPath === cleanHref || 
                        cleanCurrentPath === cleanHref + '.html' ||
                        cleanCurrentPath.endsWith('/' + cleanHref) ||
                        (cleanCurrentPath === '' && cleanHref === 'index')) {
                        link.classList.add('active');
                        // Force a style recalculation
                        window.getComputedStyle(link).opacity;
                    }
                }
            });

            // Force browser to recalculate styles
            document.body.offsetHeight;
        }, 100);

        // Initialize tooltips after header is loaded
        if (typeof $ !== 'undefined') {
            try {
                $('[data-toggle="tooltip"]').tooltip();
            } catch (e) {
                console.warn('Failed to initialize tooltips:', e);
            }
        }
    });

    $("#footer").load("../partials/footer.html", function(response, status) {
        if (status === 'error') {
            console.error('Failed to load footer');
        }
    });

    // Initialize counters
    const counters = document.querySelectorAll('.counter');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 2000; // 2 seconds
        const increment = target / (duration / 16); // Update every 16ms (60fps)
        let current = 0;

        const updateCounter = () => {
            current += increment;
            if (current < target) {
                counter.textContent = Math.round(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target;
            }
        };

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                updateCounter();
                observer.unobserve(counter);
            }
        });

        observer.observe(counter);
    });
});

// Function to display research information in modal
function showResearchInfo(title, description) {
    document.getElementById('researchModalLabel').textContent = title;
    document.getElementById('researchModalBody').textContent = description;
    new bootstrap.Modal(document.getElementById('researchModal')).show();
}

function openModal(projectId) {
    const modal = new bootstrap.Modal(document.getElementById('researchModal'));
    const modalTitle = document.getElementById('modalTitle');
    const modalBody = document.getElementById('modalBody');
    
    let title = '';
    let content = '';
    
    switch(projectId) {
        case 'weather':
            title = 'High Resolution Weather Project';
            content = `
                <div class="project-details">
                    <p>Our pilot project aims to install Automatic Weather Stations in villages in close proximity to create a high-density network of weather monitoring points.</p>
                    <p>This network will enable:</p>
                    <ul>
                        <li>Better local forecasting of weather patterns</li>
                        <li>More accurate predictions closer to the actual events</li>
                        <li>High-resolution data both spatially and temporally</li>
                        <li>Improved agricultural planning and disaster preparedness</li>
                    </ul>
                    <p>By providing hyperlocal weather data, we're empowering communities with information they can act upon immediately.</p>
                </div>
            `;
            break;
        case 'agriculture':
            title = 'Sustainable Agriculture';
            content = `
                <div class="project-details">
                    <p>We're establishing model farms that demonstrate how technology can revolutionize agriculture while maintaining sustainability.</p>
                    <p>Key technologies and approaches include:</p>
                    <ul>
                        <li>Hyperspectral imaging for crop health monitoring</li>
                        <li>Precision agriculture techniques for resource optimization</li>
                        <li>Data-driven decision making for planting and harvesting</li>
                        <li>Integration of traditional knowledge with modern technology</li>
                    </ul>
                    <p>These model farms serve as living laboratories where we can develop and showcase profitable, sustainable cultivation methods that produce high-quality produce while effectively utilizing resources.</p>
                </div>
            `;
            break;
        case 'climate-map':
            title = 'World Climate Map';
            content = `
                <div class="project-details">
                    <p>We're developing an open-source AI portal designed to educate people about climate change and its various aspects through interactive visualization.</p>
                    <p>Users will be able to:</p>
                    <ul>
                        <li>Interact with the map through natural language chat</li>
                        <li>Visualize the progression of ice retreat over time</li>
                        <li>Explore changing weather patterns globally</li>
                        <li>Locate renewable energy sources worldwide</li>
                        <li>Access location-specific emission data</li>
                    </ul>
                    <p>This tool aims to make complex climate data accessible, understandable, and actionable for everyone from students to policymakers.</p>
                </div>
            `;
            break;
        default:
            title = 'Project Details';
            content = '<p>Details for this project are coming soon.</p>';
    }
    
    modalTitle.textContent = title;
    modalBody.innerHTML = content;
    modal.show();
}

