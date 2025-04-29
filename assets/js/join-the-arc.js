$(document).ready(function() {
    // Initialize AOS
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // Smooth scroll for anchor links
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

    // Handle modal form pre-selection
    $('#contactModal').on('show.bs.modal', function(event) {
        // Button that triggered the modal
        var button = $(event.relatedTarget);
        
        // Get the involvement type from data attribute
        var involvement = button.data('involvement');
        
        // Update the select field
        $('#involvement').val(involvement);

        // Update modal title based on involvement type
        var titles = {
            'sponsor': 'Sponsor a Project',
            'contribute': 'Make a Contribution',
            'submit': 'Submit a Project',
            'partner': 'Partner with Us'
        };
        $(this).find('.modal-title').text(titles[involvement] || 'Get in Touch');
    });

    // Handle form submission
    const form = document.getElementById('contactForm');
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

        const formData = new FormData(form);
        
        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (response.ok) {
                showMessage('success', 'Thank you for your message! We will get back to you soon.');
                form.reset();
                setTimeout(() => {
                    $('#contactModal').modal('hide');
                }, 3000);
            } else {
                throw new Error('Network response was not ok');
            }
        })
        .catch(error => {
            showMessage('error', 'Oops! Something went wrong. Please try again later.');
        })
        .finally(() => {
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        });
    });
    
    function showMessage(type, message) {
        // Remove any existing message
        const existingMessage = form.querySelector('.alert');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create new message
        const messageDiv = document.createElement('div');
        messageDiv.className = `alert alert-${type === 'success' ? 'success' : 'danger'} mt-3`;
        messageDiv.role = 'alert';
        messageDiv.innerHTML = message;
        
        // Insert message before the form buttons
        const buttonsDiv = form.querySelector('.text-right');
        form.insertBefore(messageDiv, buttonsDiv);
    }
    
    // Clear form and messages when modal is closed
    $('#contactModal').on('hidden.bs.modal', function() {
        form.reset();
        const existingMessage = form.querySelector('.alert');
        if (existingMessage) {
            existingMessage.remove();
        }
    });

    // Dynamic form field handling
    const involvementSelect = document.getElementById('involvement');
    if (involvementSelect) {
        involvementSelect.addEventListener('change', function() {
            const messageField = document.getElementById('message');
            let placeholder = 'Please tell us about yourself and your interest in joining Curiosity Arc...';
            
            switch(this.value) {
                case 'researcher':
                    placeholder = 'Please tell us about your research experience and areas of interest...';
                    break;
                case 'partner':
                    placeholder = 'Please tell us about your organization and potential collaboration opportunities...';
                    break;
                case 'supporter':
                    placeholder = 'Please tell us how you would like to support our mission...';
                    break;
            }
            
            messageField.placeholder = placeholder;
        });
    }
}); 