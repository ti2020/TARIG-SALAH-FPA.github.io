/**
 * CV Loader - Dynamically loads CV links from cv-config.json
 * This allows updating CV links in one central location
 */

let cvConfig = null;

/**
 * Load CV configuration from cv-config.json
 */
async function loadCVConfig() {
    try {
        const response = await fetch('./cv-config.json');
        if (!response.ok) {
            throw new Error('Failed to load CV configuration');
        }
        cvConfig = await response.json();
        return cvConfig;
    } catch (error) {
        console.error('Error loading CV config:', error);
        return null;
    }
}

/**
 * Get CV link by type
 * @param {string} type - Type of CV (default, about, vimeo, etc.)
 * @returns {string} CV URL
 */
function getCVLink(type = 'default') {
    if (!cvConfig) {
        console.warn('CV config not loaded yet');
        return '#';
    }
    return cvConfig.cv[type] || cvConfig.cv.default;
}

/**
 * Update all CV links on the page
 * Finds all elements with data-cv-type attribute and updates their href
 */
async function updateAllCVLinks() {
    await loadCVConfig();
    
    if (!cvConfig) {
        console.error('Failed to load CV configuration');
        return;
    }
    
    // Update all links with data-cv-type attribute
    const cvLinks = document.querySelectorAll('[data-cv-type]');
    cvLinks.forEach(link => {
        const type = link.getAttribute('data-cv-type');
        const cvUrl = getCVLink(type);
        link.href = cvUrl;
    });
}

/**
 * Initialize CV loader when DOM is ready
 */
document.addEventListener('DOMContentLoaded', updateAllCVLinks);

// Also expose functions globally for manual use
window.cvLoader = {
    loadCVConfig,
    getCVLink,
    updateAllCVLinks
};
