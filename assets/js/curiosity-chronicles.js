document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Function to format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Function to create blog post HTML
    function createBlogPostHTML(post, isFeatured = false) {
        if (isFeatured) {
            return `
                <div class="col-12 mb-4" data-aos="fade-up">
                    <div class="featured-blog-post p-4 bg-light rounded">
                        <div class="row">
                            <div class="col-lg-5 mb-3 mb-lg-0">
                                <div class="featured-image rounded" style="background-image: url('${post.thumbnail}'); background-size: cover; background-position: center; min-height: 300px;"></div>
                            </div>
                            <div class="col-lg-7">
                                <div class="featured-blog-content">
                                    <span class="badge bg-primary mb-2">Latest</span>
                                    <h2 class="mb-3">${post.title}</h2>
                                    <p class="text-muted mb-3">${formatDate(post.pubDate)}</p>
                                    <p class="lead mb-4">${post.description}</p>
                                    <a href="${post.link}" class="btn btn-primary" target="_blank">Read More</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;
        } else {
            return `
                <div class="col-md-6 col-lg-4" data-aos="fade-up">
                    <div class="blog-card h-100 bg-light rounded">
                        <div class="blog-image rounded-top" style="background-image: url('${post.thumbnail}'); background-size: cover; background-position: center; height: 200px;"></div>
                        <div class="card-body p-4">
                            <h3 class="mb-3">${post.title}</h3>
                            <p class="text-muted mb-3">${formatDate(post.pubDate)}</p>
                            <p class="mb-4">${post.description}</p>
                            <a href="${post.link}" class="btn btn-link px-0" target="_blank">Continue Reading →</a>
                        </div>
                    </div>
                </div>`;
        }
    }

    // Function to create newsletter card
    function createNewsletterCard() {
        return `
            <div class="col-md-6 col-lg-4" data-aos="fade-up" data-aos-delay="200">
                <div class="blog-card newsletter-card h-100 p-4 bg-light rounded text-center">
                    <div class="card-body p-0">
                        <i class="fas fa-envelope fa-3x mb-3"></i>
                        <h3 class="mb-3">Subscribe to Our Newsletter</h3>
                        <p class="mb-4">Stay updated with our latest projects, research findings, and initiatives.</p>
                        <a href="https://curiosityarc.substack.com" class="btn btn-primary" target="_blank">Subscribe Now</a>
                    </div>
                </div>
            </div>`;
    }

    // Function to fetch and display posts
    async function fetchAndDisplayPosts() {
        try {
            // Fetch the RSS feed through a CORS proxy
            const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://curiosityarc.substack.com/feed');
            const data = await response.json();
            
            if (data.status === 'ok') {
                const posts = data.items;
                console.log('Featured post data:', posts[0]); // Debug log
                let blogHTML = '';

                // Function to get the best available image for a post
                function getPostImage(post) {
                    return post.thumbnail || // First try thumbnail
                           (post.enclosure && post.enclosure.link) || // Then try enclosure
                           post.content.match(/<img[^>]+src="([^">]+)"/)?.[1] || // Then try content
                           data.feed.image; // Finally fallback to feed image
                }

                // Add featured (latest) post
                if (posts.length > 0) {
                    const featuredPost = posts[0];
                    featuredPost.thumbnail = getPostImage(featuredPost);
                    console.log('Featured post thumbnail:', featuredPost.thumbnail); // Debug log
                    blogHTML += createBlogPostHTML(featuredPost, true);
                }

                // Add other posts
                posts.slice(1).forEach(post => {
                    post.thumbnail = getPostImage(post);
                    blogHTML += createBlogPostHTML(post);
                });

                // Add newsletter card
                blogHTML += createNewsletterCard();

                // Update the content
                const loadingElement = document.getElementById('loading');
                if (loadingElement) {
                    loadingElement.remove();
                }
                document.getElementById('blogPosts').innerHTML = blogHTML;

                // Reinitialize AOS for new content
                AOS.refresh();
            }
        } catch (error) {
            console.error('Error fetching blog posts:', error);
            const loadingElement = document.getElementById('loading');
            if (loadingElement) {
                loadingElement.innerHTML = '<div class="alert alert-danger">Error loading blog posts. Please try again later.</div>';
            }
        }
    }

    // Function to refresh AOS animations
    function refreshAOS() {
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.classList.remove('aos-animate');
            setTimeout(() => {
                el.classList.add('aos-animate');
            }, 10);
        });
        AOS.refresh();
    }

    // Initialize tabs with jQuery
    $(document).ready(function() {
        // Function to handle tab activation
        function handleTabActivation(tabId) {
            // Refresh animations
            refreshAOS();

            // If blog tab is activated, fetch posts
            if (tabId === '#blog') {
                fetchAndDisplayPosts();
            }
        }

        // Handle tab changes
        $('button[data-bs-toggle="pill"]').on('shown.bs.tab', function (e) {
            const targetId = $(this).attr('data-bs-target');
            
            handleTabActivation(targetId);

            // Update URL hash
            if (history.pushState) {
                history.pushState(null, null, targetId);
            } else {
                location.hash = targetId;
            }
        });

        // Handle initial tab based on URL hash
        const hash = window.location.hash;
        if (hash) {
            const tab = new bootstrap.Tab($(`button[data-bs-target="${hash}"]`)[0]);
            tab.show();
            handleTabActivation(hash);
        } else {
            // If no hash and blog tab is active, fetch posts
            const activeTab = $('.nav-link.active').attr('data-bs-target');
            if (activeTab === '#blog') {
                fetchAndDisplayPosts();
            }
        }

        // Initial animation refresh
        refreshAOS();
    });

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (event) {
            event.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}); 