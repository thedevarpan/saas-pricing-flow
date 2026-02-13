/**
 * Toast Notification System
 * Simple corner notifications
 */

// Create toast container
function createToastContainer() {
    if (document.getElementById('toast-container')) return;
    
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        max-width: 350px;
    `;
    document.body.appendChild(container);
}

function showToast(message, type = 'success') {
    createToastContainer();
    
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    
    const colors = {
        success: { bg: '#10b981', icon: '✓' },
        error: { bg: '#ef4444', icon: '✕' },
        warning: { bg: '#f59e0b', icon: '⚠' },
        info: { bg: '#3b82f6', icon: 'ℹ' }
    };
    
    const config = colors[type] || colors.success;
    
    toast.style.cssText = `
        background: ${config.bg};
        color: white;
        padding: 16px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 14px;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
        cursor: pointer;
        transition: transform 0.2s;
    `;
    
    toast.innerHTML = `
        <span style="font-size: 18px; font-weight: bold;">${config.icon}</span>
        <span style="flex: 1;">${message}</span>
        <span style="opacity: 0.8; font-size: 18px;">×</span>
    `;
    
    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    if (!document.getElementById('toast-styles')) {
        style.id = 'toast-styles';
        document.head.appendChild(style);
    }
    
    // Hover effect
    toast.onmouseenter = () => {
        toast.style.transform = 'scale(1.02)';
    };
    toast.onmouseleave = () => {
        toast.style.transform = 'scale(1)';
    };
    
    // Click to dismiss
    toast.onclick = () => removeToast(toast);
    
    container.appendChild(toast);
    
    // Auto remove after 4 seconds
    setTimeout(() => removeToast(toast), 4000);
}

function removeToast(toast) {
    toast.style.animation = 'slideOut 0.3s ease-in';
    setTimeout(() => {
        if (toast.parentElement) {
            toast.parentElement.removeChild(toast);
        }
    }, 300);
}

const showNotification = {
    success: (message) => showToast(message, 'success'),
    error: (message) => showToast(message, 'error'),
    warning: (message) => showToast(message, 'warning'),
    info: (message) => showToast(message, 'info')
};

// Make it globally available
window.notify = showNotification;
