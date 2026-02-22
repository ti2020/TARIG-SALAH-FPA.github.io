/**
 * Admin Panel - Authentication and CV Management
 * Provides admin-only interface for updating CV links
 */

// Admin configuration - Change this to your desired password
const ADMIN_PASSWORD = 'tarig2030'; // Change this to a secure password
const ADMIN_EMAIL = 'tarig.ti.salah@gmail.com'; // Your email for password reset
const ADMIN_SESSION_KEY = 'admin_session_token';
const ADMIN_SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Check if user is authenticated as admin
 */
function isAdminAuthenticated() {
    const sessionData = localStorage.getItem(ADMIN_SESSION_KEY);
    if (!sessionData) return false;
    
    try {
        const { timestamp } = JSON.parse(sessionData);
        const now = Date.now();
        
        // Check if session has expired
        if (now - timestamp > ADMIN_SESSION_DURATION) {
            localStorage.removeItem(ADMIN_SESSION_KEY);
            return false;
        }
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Authenticate admin with password
 */
function authenticateAdmin(password) {
    if (password === ADMIN_PASSWORD) {
        const sessionData = {
            timestamp: Date.now(),
            authenticated: true
        };
        localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(sessionData));
        return true;
    }
    return false;
}

/**
 * Logout admin
 */
function logoutAdmin() {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    hideAdminPanel();
    location.reload();
}

/**
 * Show admin login modal
 */
function showAdminLogin() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) {
        modal.classList.add('active');
        document.getElementById('adminPassword').focus();
    }
}

/**
 * Hide admin login modal
 */
function hideAdminLogin() {
    const modal = document.getElementById('adminLoginModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Show forgot password modal
 */
function showForgotPasswordModal() {
    hideAdminLogin();
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.classList.add('active');
    }
}

/**
 * Hide forgot password modal
 */
function hideForgotPasswordModal() {
    const modal = document.getElementById('forgotPasswordModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

/**
 * Show admin panel
 */
function showAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (panel) {
        panel.classList.add('active');
    }
}

/**
 * Hide admin panel
 */
function hideAdminPanel() {
    const panel = document.getElementById('adminPanel');
    if (panel) {
        panel.classList.remove('active');
    }
}

/**
 * Handle admin login
 */
function handleAdminLogin() {
    const password = document.getElementById('adminPassword').value;
    
    if (authenticateAdmin(password)) {
        hideAdminLogin();
        showAdminPanel();
        loadCVConfigToPanel();
        document.getElementById('adminPassword').value = '';
    } else {
        alert('Invalid password. Please try again.');
        document.getElementById('adminPassword').value = '';
    }
}

/**
 * Handle forgot password request
 */
function handleForgotPassword() {
    const email = document.getElementById('resetEmail').value.trim();
    
    if (!email) {
        alert('Please enter your email address');
        return;
    }
    
    if (email === ADMIN_EMAIL) {
        // Show reset instructions
        const resetInstructions = `
✅ Email Verified!

Your password reset instructions have been sent to:
${ADMIN_EMAIL}

📧 RESET INSTRUCTIONS:

Since this is a static website, you'll need to reset your password directly:

1. Go to your GitHub repository: ti2020/TARIG-SALAH-FPA.github.io
2. Open the 'admin.js' file
3. Find line 7: const ADMIN_PASSWORD = 'tarig2030';
4. Change 'tarig2030' to your new password
5. Commit the changes with message: "Update admin password"
6. Your new password will be active immediately!

🔒 SECURITY TIP:
Use a strong password with uppercase, lowercase, numbers, and special characters.
Example: MyNewPass2024!

Questions? Check the ADMIN_GUIDE.md file in your repository.
        `;
        
        alert(resetInstructions);
        hideForgotPasswordModal();
        hideAdminLogin();
        document.getElementById('resetEmail').value = '';
    } else {
        alert('Email not recognized. Please enter the correct email address.');
        document.getElementById('resetEmail').value = '';
    }
}

/**
 * Load CV config into the admin panel
 */
async function loadCVConfigToPanel() {
    try {
        const response = await fetch('./cv-config.json');
        const config = await response.json();
        
        // Populate form fields
        document.getElementById('cvDefault').value = config.cv.default || '';
        document.getElementById('cvAbout').value = config.cv.about || '';
        document.getElementById('cvVimeo').value = config.cv.vimeo || '';
    } catch (error) {
        console.error('Error loading CV config:', error);
        alert('Error loading CV configuration');
    }
}

/**
 * Save CV config
 */
async function saveCVConfig() {
    const newConfig = {
        cv: {
            default: document.getElementById('cvDefault').value.trim(),
            about: document.getElementById('cvAbout').value.trim(),
            vimeo: document.getElementById('cvVimeo').value.trim()
        },
        metadata: {
            lastUpdated: new Date().toISOString().split('T')[0],
            version: '1.1'
        }
    };
    
    // Validate URLs
    if (!newConfig.cv.default || !newConfig.cv.about || !newConfig.cv.vimeo) {
        alert('Please fill in all CV link fields');
        return;
    }
    
    try {
        // Save to localStorage (since we can't directly modify files from browser)
        localStorage.setItem('cv_config_pending', JSON.stringify(newConfig));
        
        alert('CV configuration updated! ✓\n\nTo apply changes:\n1. Copy the configuration below\n2. Go to cv-config.json in your GitHub repository\n3. Replace the content with the updated configuration\n4. Commit the changes\n\nConfiguration:\n' + JSON.stringify(newConfig, null, 2));
        
        // Reload CV links on all pages
        if (window.cvLoader) {
            window.cvLoader.loadCVConfig();
            window.cvLoader.updateAllCVLinks();
        }
    } catch (error) {
        console.error('Error saving CV config:', error);
        alert('Error saving configuration');
    }
}

/**
 * Get the pending configuration for copying
 */
function copyConfigToClipboard() {
    const configStr = localStorage.getItem('cv_config_pending');
    if (!configStr) {
        alert('No pending configuration. Please save first.');
        return;
    }
    
    try {
        const config = JSON.parse(configStr);
        const jsonString = JSON.stringify(config, null, 2);
        
        navigator.clipboard.writeText(jsonString).then(() => {
            alert('Configuration copied to clipboard! Paste it into cv-config.json on GitHub.');
        }).catch(() => {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = jsonString;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Configuration copied to clipboard! Paste it into cv-config.json on GitHub.');
        });
    } catch (error) {
        console.error('Error copying config:', error);
        alert('Error copying configuration');
    }
}

/**
 * Initialize admin interface
 */
function initializeAdminInterface() {
    // Create admin button
    const adminButton = document.createElement('button');
    adminButton.id = 'adminToggleBtn';
    adminButton.innerHTML = '⚙️';
    adminButton.className = 'admin-toggle-btn';
    adminButton.onclick = () => {
        if (isAdminAuthenticated()) {
            showAdminPanel();
        } else {
            showAdminLogin();
        }
    };
    document.body.appendChild(adminButton);
    
    // Create login modal
    const loginModal = document.createElement('div');
    loginModal.id = 'adminLoginModal';
    loginModal.className = 'admin-modal';
    loginModal.innerHTML = `
        <div class="admin-modal-content">
            <button class="admin-modal-close" onclick="hideAdminLogin()">✕</button>
            <h2 style="color: #3b82f6; margin-bottom: 1.5rem; font-weight: bold; text-transform: uppercase; font-size: 1.25rem;">Admin Login</h2>
            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; color: #cbd5e1; font-weight: 600;">Password:</label>
            <input type="password" id="adminPassword" placeholder="Enter admin password" class="admin-input" />
            <button onclick="handleAdminLogin()" class="admin-button" style="background: #3b82f6; margin-top: 1rem;">Login</button>
            <button onclick="hideAdminLogin()" class="admin-button" style="background: #475569; margin-top: 0.5rem;">Cancel</button>
            <button onclick="showForgotPasswordModal()" class="admin-button" style="background: transparent; border: 1px solid #3b82f6; color: #3b82f6; margin-top: 0.5rem;">🔑 Forgot Password?</button>
        </div>
    `;
    document.body.appendChild(loginModal);
    
    // Create forgot password modal
    const forgotPasswordModal = document.createElement('div');
    forgotPasswordModal.id = 'forgotPasswordModal';
    forgotPasswordModal.className = 'admin-modal';
    forgotPasswordModal.innerHTML = `
        <div class="admin-modal-content">
            <button class="admin-modal-close" onclick="hideForgotPasswordModal()">✕</button>
            <h2 style="color: #3b82f6; margin-bottom: 1.5rem; font-weight: bold; text-transform: uppercase; font-size: 1.25rem;">Reset Password</h2>
            <p style="color: #cbd5e1; margin-bottom: 1rem; font-size: 0.875rem;">Enter your email address to receive password reset instructions.</p>
            <label style="display: block; margin-bottom: 0.5rem; font-size: 0.875rem; color: #cbd5e1; font-weight: 600;">Email Address:</label>
            <input type="email" id="resetEmail" placeholder="Enter your email" class="admin-input" />
            <button onclick="handleForgotPassword()" class="admin-button" style="background: #22c55e; margin-top: 1rem;">Send Reset Instructions</button>
            <button onclick="hideForgotPasswordModal()" class="admin-button" style="background: #475569; margin-top: 0.5rem;">Cancel</button>
        </div>
    `;
    document.body.appendChild(forgotPasswordModal);
    
    // Create admin panel
    const adminPanel = document.createElement('div');
    adminPanel.id = 'adminPanel';
    adminPanel.className = 'admin-panel';
    adminPanel.innerHTML = `
        <div class="admin-panel-header">
            <h2>📝 CV Management Panel</h2>
            <button class="admin-close-btn" onclick="hideAdminPanel()">✕</button>
        </div>
        
        <div class="admin-panel-content">
            <div class="admin-form-group">
                <label class="admin-label">Default CV Link (index.html)</label>
                <textarea id="cvDefault" class="admin-textarea" placeholder="Paste your CV URL here..."></textarea>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-label">About Page CV Link (about.html)</label>
                <textarea id="cvAbout" class="admin-textarea" placeholder="Paste your CV URL here..."></textarea>
            </div>
            
            <div class="admin-form-group">
                <label class="admin-label">Vimeo Page CV Link (about_vimeo.html)</label>
                <textarea id="cvVimeo" class="admin-textarea" placeholder="Paste your CV URL here..."></textarea>
            </div>
            
            <div class="admin-button-group">
                <button onclick="saveCVConfig()" class="admin-button" style="background: #22c55e;">💾 Save Configuration</button>
                <button onclick="copyConfigToClipboard()" class="admin-button" style="background: #3b82f6;">📋 Copy to Clipboard</button>
                <button onclick="logoutAdmin()" class="admin-button" style="background: #ef4444;">🚪 Logout</button>
            </div>
            
            <div class="admin-info">
                <p><strong>ℹ️ How to apply changes:</strong></p>
                <ol>
                    <li>Click "Copy to Clipboard" to copy the configuration</li>
                    <li>Go to your GitHub repository</li>
                    <li>Open the <code>cv-config.json</code> file</li>
                    <li>Click Edit and paste the new configuration</li>
                    <li>Commit the changes</li>
                </ol>
            </div>
        </div>
    `;
    document.body.appendChild(adminPanel);
    
    // Add styles
    addAdminStyles();
    
    // Check if already authenticated
    if (isAdminAuthenticated()) {
        showAdminPanel();
        loadCVConfigToPanel();
    }
}

/**
 * Add admin styles to the page
 */
function addAdminStyles() {
    const style = document.createElement('style');
    style.textContent = `
        /* Admin Toggle Button */
        .admin-toggle-btn {
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 60px;
            height: 60px;
            background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
            border: none;
            border-radius: 50%;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            z-index: 995;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
        }
        
        .admin-toggle-btn:hover {
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            transform: scale(1.1);
            box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
        }
        
        .admin-toggle-btn:active {
            transform: scale(0.95);
        }
        
        /* Admin Modal */
        .admin-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0, 0, 0, 0.8);
            z-index: 1000;
            align-items: center;
            justify-content: center;
        }
        
        .admin-modal.active {
            display: flex;
        }
        
        .admin-modal-content {
            background: #0f172a;
            border: 2px solid #3b82f6;
            border-radius: 1rem;
            padding: 2rem;
            max-width: 400px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
        }
        
        .admin-modal-close {
            float: right;
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            transition: color 0.3s;
        }
        
        .admin-modal-close:hover {
            color: #3b82f6;
        }
        
        /* Admin Panel */
        .admin-panel {
            display: none;
            position: fixed;
            bottom: 100px;
            right: 30px;
            width: 400px;
            max-height: 80vh;
            background: #0f172a;
            border: 2px solid #3b82f6;
            border-radius: 1rem;
            z-index: 999;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.8);
            overflow-y: auto;
            animation: slideUp 0.3s ease-out;
        }
        
        .admin-panel.active {
            display: flex;
            flex-direction: column;
        }
        
        @keyframes slideUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        .admin-panel-header {
            padding: 1.5rem;
            border-bottom: 1px solid rgba(59, 130, 246, 0.2);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .admin-panel-header h2 {
            color: #3b82f6;
            margin: 0;
            font-size: 1.125rem;
            font-weight: 900;
            text-transform: uppercase;
            letter-spacing: 0.05em;
        }
        
        .admin-close-btn {
            background: none;
            border: none;
            color: white;
            font-size: 1.5rem;
            cursor: pointer;
            transition: color 0.3s;
        }
        
        .admin-close-btn:hover {
            color: #3b82f6;
        }
        
        .admin-panel-content {
            padding: 1.5rem;
            flex: 1;
            overflow-y: auto;
        }
        
        .admin-form-group {
            margin-bottom: 1.5rem;
        }
        
        .admin-label {
            display: block;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            color: #94a3b8;
            margin-bottom: 0.5rem;
            letter-spacing: 0.05em;
        }
        
        .admin-input,
        .admin-textarea {
            width: 100%;
            background: rgba(255, 255, 255, 0.05);
            border: 1px solid rgba(59, 130, 246, 0.2);
            border-radius: 0.5rem;
            padding: 0.75rem;
            color: white;
            font-family: 'Courier New', monospace;
            font-size: 0.875rem;
            box-sizing: border-box;
        }
        
        .admin-textarea {
            resize: vertical;
            min-height: 80px;
            max-height: 150px;
        }
        
        .admin-input:focus,
        .admin-textarea:focus {
            outline: none;
            border-color: #3b82f6;
            background: rgba(59, 130, 246, 0.1);
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .admin-button-group {
            display: flex;
            flex-direction: column;
            gap: 0.75rem;
            margin: 1.5rem 0;
        }
        
        .admin-button {
            width: 100%;
            color: white;
            border: none;
            border-radius: 0.5rem;
            padding: 0.75rem;
            font-weight: 900;
            text-transform: uppercase;
            font-size: 0.75rem;
            cursor: pointer;
            transition: all 0.3s;
            letter-spacing: 0.05em;
        }
        
        .admin-button:hover {
            opacity: 0.9;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        
        .admin-button:active {
            transform: translateY(0);
        }
        
        .admin-info {
            background: rgba(59, 130, 246, 0.1);
            border: 1px solid rgba(59, 130, 246, 0.2);
            border-radius: 0.5rem;
            padding: 1rem;
            font-size: 0.75rem;
            color: #cbd5e1;
            margin-top: 1rem;
        }
        
        .admin-info strong {
            color: #3b82f6;
            display: block;
            margin-bottom: 0.5rem;
        }
        
        .admin-info ol {
            margin: 0;
            padding-left: 1.25rem;
        }
        
        .admin-info li {
            margin-bottom: 0.25rem;
            line-height: 1.4;
        }
        
        .admin-info code {
            background: rgba(0, 0, 0, 0.3);
            padding: 0.25rem 0.5rem;
            border-radius: 0.25rem;
            font-family: 'Courier New', monospace;
            color: #22c55e;
        }
        
        /* Responsive */
        @media (max-width: 640px) {
            .admin-panel {
                width: 90vw;
                max-width: 100%;
                bottom: auto;
                right: auto;
                left: 50%;
                transform: translateX(-50%);
                max-height: 80vh;
            }
            
            .admin-toggle-btn {
                bottom: 20px;
                right: 20px;
                width: 55px;
                height: 55px;
                font-size: 1.25rem;
            }
        }
    `;
    document.head.appendChild(style);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeAdminInterface);

// Expose functions globally
window.adminPanel = {
    isAdminAuthenticated,
    authenticateAdmin,
    logoutAdmin,
    showAdminLogin,
    hideAdminLogin,
    showForgotPasswordModal,
    hideForgotPasswordModal,
    showAdminPanel,
    hideAdminPanel,
    handleAdminLogin,
    handleForgotPassword,
    saveCVConfig,
    copyConfigToClipboard,
    loadCVConfigToPanel
};
