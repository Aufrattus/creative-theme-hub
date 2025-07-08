
// Projects page specific functionality
document.addEventListener('DOMContentLoaded', function() {
    // Project filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('[data-category]');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
    
    // Project modal functionality
    const projectCards2 = document.querySelectorAll('.project-card-large');
    
    projectCards2.forEach(card => {
        const overlay = card.querySelector('.project-overlay');
        const details = card.querySelector('.project-details');
        
        if (overlay && details) {
            card.addEventListener('click', function(e) {
                if (e.target.closest('.project-links')) {
                    return; // Don't open modal if clicking on links
                }
                
                // Create and show modal
                showProjectModal(details.innerHTML);
            });
        }
    });
    
    // Video autoplay on hover
    const videos = document.querySelectorAll('.project-image video');
    
    videos.forEach(video => {
        const card = video.closest('.project-card-large');
        
        card.addEventListener('mouseenter', () => {
            video.play();
        });
        
        card.addEventListener('mouseleave', () => {
            video.pause();
            video.currentTime = 0;
        });
    });
    
    // Masonry layout for project grid
    function initMasonryLayout() {
        const grid = document.querySelector('.projects-grid');
        if (!grid) return;
        
        // Simple masonry-like layout
        const cards = Array.from(grid.children);
        const columns = getColumnCount();
        const columnHeights = new Array(columns).fill(0);
        
        cards.forEach(card => {
            const shortestColumn = columnHeights.indexOf(Math.min(...columnHeights));
            const x = shortestColumn * (100 / columns);
            
            card.style.position = 'absolute';
            card.style.left = `${x}%`;
            card.style.top = `${columnHeights[shortestColumn]}px`;
            card.style.width = `${100 / columns - 2}%`;
            
            columnHeights[shortestColumn] += card.offsetHeight + 32; // 32px gap
        });
        
        grid.style.height = `${Math.max(...columnHeights)}px`;
        grid.style.position = 'relative';
    }
    
    function getColumnCount() {
        const width = window.innerWidth;
        if (width >= 1200) return 3;
        if (width >= 768) return 2;
        return 1;
    }
    
    // Initialize masonry layout
    window.addEventListener('load', initMasonryLayout);
    window.addEventListener('resize', debounce(initMasonryLayout, 250));
    
    // Project search functionality
    const searchInput = createSearchInput();
    
    function createSearchInput() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'project-search';
        searchContainer.innerHTML = `
            <input type="text" placeholder="Search projects..." id="project-search">
        `;
        
        const filterSection = document.querySelector('.project-filter .container');
        if (filterSection) {
            filterSection.appendChild(searchContainer);
        }
        
        const input = document.getElementById('project-search');
        if (input) {
            input.addEventListener('input', debounce(handleSearch, 300));
        }
        
        return input;
    }
    
    function handleSearch(e) {
        const searchTerm = e.target.value.toLowerCase();
        
        projectCards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const description = card.querySelector('p').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase());
            
            const matches = title.includes(searchTerm) || 
                           description.includes(searchTerm) || 
                           tags.some(tag => tag.includes(searchTerm));
            
            card.style.display = matches ? 'block' : 'none';
        });
    }
    
    // Enhanced project hover effects
    projectCards.forEach(card => {
        const image = card.querySelector('.project-image img, .project-image video');
        
        card.addEventListener('mouseenter', function() {
            if (image) {
                image.style.transform = 'scale(1.1) rotate(2deg)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            if (image) {
                image.style.transform = 'scale(1) rotate(0deg)';
            }
        });
    });
});

// Modal functionality
function showProjectModal(content) {
    const modal = document.createElement('div');
    modal.className = 'project-modal';
    modal.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close">&times;</button>
                ${content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    document.body.style.overflow = 'hidden';
    
    // Close modal events
    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');
    
    closeBtn.addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    
    document.addEventListener('keydown', handleModalKeydown);
    
    function closeModal() {
        document.body.removeChild(modal);
        document.body.style.overflow = '';
        document.removeEventListener('keydown', handleModalKeydown);
    }
    
    function handleModalKeydown(e) {
        if (e.key === 'Escape') closeModal();
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add project-specific styles
const projectStyles = document.createElement('style');
projectStyles.textContent = `
    .project-search {
        margin-top: 2rem;
        display: flex;
        justify-content: center;
    }
    
    .project-search input {
        padding: 1rem 2rem;
        border: 2px solid var(--border-color);
        border-radius: 2rem;
        background: var(--card-bg);
        color: var(--text-color);
        font-size: 1rem;
        width: 300px;
        max-width: 100%;
        transition: all 0.3s ease;
    }
    
    .project-search input:focus {
        outline: none;
        border-color: var(--primary-color);
        box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
    }
    
    .project-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }
    
    .modal-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 2rem;
    }
    
    .modal-content {
        background: var(--card-bg);
        border-radius: 1rem;
        padding: 3rem;
        max-width: 600px;
        width: 100%;
        position: relative;
        animation: slideIn 0.3s ease;
    }
    
    .modal-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: none;
        border: none;
        font-size: 2rem;
        color: var(--text-secondary);
        cursor: pointer;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        transition: all 0.3s ease;
    }
    
    .modal-close:hover {
        background: var(--accent-bg);
        color: var(--text-color);
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes slideIn {
        from { 
            opacity: 0;
            transform: translateY(-50px) scale(0.9);
        }
        to { 
            opacity: 1;
            transform: translateY(0) scale(1);
        }
    }
    
    @media (max-width: 768px) {
        .modal-content {
            padding: 2rem;
            margin: 1rem;
        }
        
        .project-search input {
            width: 250px;
        }
    }
`;

document.head.appendChild(projectStyles);
