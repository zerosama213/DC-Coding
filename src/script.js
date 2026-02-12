// DOM Elements
const form = document.querySelector('form');
const nameInput = document.getElementById('name');

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log('HTML Programming Workspace Ready!');
    initializeApp();
});

if (form) {
    form.addEventListener('submit', handleFormSubmit);
}

// Functions
function initializeApp() {
    // Add smooth scrolling to navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

function handleFormSubmit(e) {
    e.preventDefault();
    const name = nameInput.value.trim();
    
    if (name) {
        alert(`Hello, ${name}! Thank you for your submission.`);
        form.reset();
    } else {
        alert('Please enter your name.');
    }
}

// Utility Functions
function log(message) {
    console.log(`[APP] ${message}`);
}
