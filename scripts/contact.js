
// Contact form functionality
document.addEventListener('DOMContentLoaded', function() {
    const contactForm = document.getElementById('contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
        
        // Add form validation
        const inputs = contactForm.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.addEventListener('blur', validateField);
            input.addEventListener('input', clearErrors);
        });
    }
    
    // Form animation on load
    animateFormFields();
    
    // Add floating labels effect
    addFloatingLabels();
});

function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate form
    if (!validateForm(form)) {
        showNotification('Please fill in all required fields correctly.', 'error');
        return;
    }
    
    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual API call)
    setTimeout(() => {
        console.log('Form data:', data);
        showNotification('Thank you! Your message has been sent successfully.', 'success');
        form.reset();
        
        // Reset button
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
        
        // Reset floating labels
        resetFloatingLabels();
        
    }, 2000);
}

function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    requiredFields.forEach(field => {
        if (!validateField({ target: field })) {
            isValid = false;
        }
    });
    
    return isValid;
}

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    const fieldName = field.name;
    
    // Remove existing error
    clearFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (fieldName === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Name validation
    if (fieldName === 'name' && value) {
        if (value.length < 2) {
            showFieldError(field, 'Name must be at least 2 characters long');
            return false;
        }
    }
    
    // Message validation
    if (fieldName === 'message' && value) {
        if (value.length < 10) {
            showFieldError(field, 'Message must be at least 10 characters long');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    let errorElement = field.parentNode.querySelector('.field-error');
    if (!errorElement) {
        errorElement = document.createElement('span');
        errorElement.className = 'field-error';
        field.parentNode.appendChild(errorElement);
    }
    
    errorElement.textContent = message;
}

function clearFieldError(field) {
    field.classList.remove('error');
    const errorElement = field.parentNode.querySelector('.field-error');
    if (errorElement) {
        errorElement.remove();
    }
}

function clearErrors(e) {
    clearFieldError(e.target);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

function animateFormFields() {
    const formGroups = document.querySelectorAll('.form-group');
    
    formGroups.forEach((group, index) => {
        group.style.opacity = '0';
        group.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            group.style.transition = 'all 0.5s ease';
            group.style.opacity = '1';
            group.style.transform = 'translateY(0)';
        }, index * 100);
    });
}

function addFloatingLabels() {
    const inputs = document.querySelectorAll('.form-group input, .form-group textarea, .form-group select');
    
    inputs.forEach(input => {
        const label = input.parentNode.querySelector('label');
        if (!label) return;
        
        // Check if field has value on load
        checkFloatingLabel(input, label);
        
        input.addEventListener('focus', () => {
            label.classList.add('floating');
        });
        
        input.addEventListener('blur', () => {
            checkFloatingLabel(input, label);
        });
        
        input.addEventListener('input', () => {
            checkFloatingLabel(input, label);
        });
    });
}

function checkFloatingLabel(input, label) {
    if (input.value.trim() !== '' || input === document.activeElement) {
        label.classList.add('floating');
    } else {
        label.classList.remove('floating');
    }
}

function resetFloatingLabels() {
    const labels = document.querySelectorAll('.form-group label');
    labels.forEach(label => {
        label.classList.remove('floating');
    });
}

// Character counter for textarea
const messageTextarea = document.getElementById('message');
if (messageTextarea) {
    const maxLength = 500;
    const counter = document.createElement('div');
    counter.className = 'character-counter';
    counter.textContent = `0/${maxLength}`;
    
    messageTextarea.parentNode.appendChild(counter);
    
    messageTextarea.addEventListener('input', function() {
        const length = this.value.length;
        counter.textContent = `${length}/${maxLength}`;
        
        if (length > maxLength * 0.9) {
            counter.classList.add('warning');
        } else {
            counter.classList.remove('warning');
        }
    });
}

// Add contact form styles
const contactStyles = document.createElement('style');
contactStyles.textContent = `
    .form-group {
        position: relative;
    }
    
    .form-group label {
        position: absolute;
        left: 1rem;
        top: 1rem;
        transition: all 0.3s ease;
        pointer-events: none;
        color: var(--text-secondary);
        background: var(--bg-color);
        padding: 0 0.5rem;
    }
    
    .form-group label.floating {
        top: -0.5rem;
        left: 0.75rem;
        font-size: 0.8rem;
        color: var(--primary-color);
    }
    
    .form-group input:focus + label,
    .form-group textarea:focus + label,
    .form-group select:focus + label {
        color: var(--primary-color);
    }
    
    .form-group input.error,
    .form-group textarea.error,
    .form-group select.error {
        border-color: #e74c3c;
    }
    
    .field-error {
        color: #e74c3c;
        font-size: 0.8rem;
        margin-top: 0.5rem;
        display: block;
    }
    
    .character-counter {
        text-align: right;
        font-size: 0.8rem;
        color: var(--text-secondary);
        margin-top: 0.25rem;
    }
    
    .character-counter.warning {
        color: #f39c12;
    }
    
    .notification {
        position: fixed;
        top: 100px;
        right: 2rem;
        padding: 1rem 2rem;
        border-radius: 0.5rem;
        color: white;
        font-weight: 600;
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        background: #27ae60;
    }
    
    .notification-error {
        background: #e74c3c;
    }
    
    .notification-info {
        background: var(--primary-color);
    }
    
    @media (max-width: 768px) {
        .notification {
            right: 1rem;
            left: 1rem;
            max-width: none;
        }
    }
`;

document.head.appendChild(contactStyles);
