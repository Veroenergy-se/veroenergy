/**
 * Vero Cookie Consent Manager
 * Handles GDPR/CCPA compliant cookie consent with Google Analytics integration
 */

class VeroCookieConsent {
  constructor() {
    this.cookieName = 'vero-cookie-consent';
    this.consentData = this.getConsentData();
    this.init();
  }

  init() {
    // Only show banner if no consent has been given
    if (!this.consentData) {
      this.showConsentBanner();
    } else {
      // Apply existing consent preferences
      this.applyConsent(this.consentData);
    }
  }

  getConsentData() {
    const cookie = document.cookie
      .split('; ')
      .find(row => row.startsWith(this.cookieName + '='));
    
    if (cookie) {
      try {
        return JSON.parse(decodeURIComponent(cookie.split('=')[1]));
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  setConsentData(data) {
    const expires = new Date();
    expires.setFullYear(expires.getFullYear() + 1); // 1 year expiry
    
    document.cookie = `${this.cookieName}=${encodeURIComponent(JSON.stringify(data))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    this.consentData = data;
  }

  showConsentBanner() {
    const banner = document.createElement('div');
    banner.id = 'vero-cookie-banner';
    banner.innerHTML = `
      <div class="vero-cookie-overlay"></div>
      <div class="vero-cookie-banner">
        <div class="vero-cookie-content">
          <div class="vero-cookie-text">
            <h3>We use cookies to enhance your experience</h3>
            <p>We use a limited set of cookies to enhance your experience. Feel free to read more under Settings, or click "Accept all".</p>
            <a href="#" class="vero-cookie-policy-link" onclick="window.open('/privacy-policy.html', '_blank')">Read our cookie policy</a>
          </div>
          <div class="vero-cookie-actions">
            <button class="vero-cookie-btn vero-cookie-settings" onclick="veroCookies.showSettings()">Settings</button>
            <button class="vero-cookie-btn vero-cookie-reject" onclick="veroCookies.rejectAll()">Refuse all</button>
            <button class="vero-cookie-btn vero-cookie-accept" onclick="veroCookies.acceptAll()">Accept all</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(banner);
    
    // Add styles
    this.addStyles();
    
    // Show banner with animation
    setTimeout(() => {
      banner.classList.add('vero-cookie-show');
    }, 100);
  }

  showSettings() {
    const existingBanner = document.getElementById('vero-cookie-banner');
    if (existingBanner) {
      existingBanner.remove();
    }

    const settings = document.createElement('div');
    settings.id = 'vero-cookie-settings';
    settings.innerHTML = `
      <div class="vero-cookie-overlay"></div>
      <div class="vero-cookie-modal">
        <div class="vero-cookie-modal-content">
          <div class="vero-cookie-modal-header">
            <h3>Cookie Settings</h3>
            <button class="vero-cookie-close" onclick="veroCookies.hideSettings()">&times;</button>
          </div>
          <div class="vero-cookie-modal-body">
            <div class="vero-cookie-category">
              <div class="vero-cookie-category-header">
                <h4>Essential Cookies</h4>
                <span class="vero-cookie-always-on">Always On</span>
              </div>
              <p>These cookies are necessary for the website to function and cannot be switched off. They are usually only set in response to actions made by you which amount to a request for services.</p>
            </div>
            
            <div class="vero-cookie-category">
              <div class="vero-cookie-category-header">
                <h4>Analytics Cookies</h4>
                <label class="vero-cookie-toggle">
                  <input type="checkbox" id="analytics-consent" ${this.consentData?.analytics !== false ? 'checked' : ''}>
                  <span class="vero-cookie-slider"></span>
                </label>
              </div>
              <p>These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This includes Google Analytics.</p>
            </div>
          </div>
          <div class="vero-cookie-modal-footer">
            <button class="vero-cookie-btn vero-cookie-save" onclick="veroCookies.saveSettings()">Save Settings</button>
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(settings);
    setTimeout(() => {
      settings.classList.add('vero-cookie-show');
    }, 100);
  }

  hideSettings() {
    const settings = document.getElementById('vero-cookie-settings');
    if (settings) {
      settings.classList.remove('vero-cookie-show');
      setTimeout(() => settings.remove(), 300);
    }
  }

  acceptAll() {
    const consent = {
      essential: true,
      analytics: true,
      timestamp: Date.now()
    };
    
    this.setConsentData(consent);
    this.applyConsent(consent);
    this.hideBanner();
  }

  rejectAll() {
    const consent = {
      essential: true,
      analytics: false,
      timestamp: Date.now()
    };
    
    this.setConsentData(consent);
    this.applyConsent(consent);
    this.hideBanner();
  }

  saveSettings() {
    const analyticsConsent = document.getElementById('analytics-consent').checked;
    
    const consent = {
      essential: true,
      analytics: analyticsConsent,
      timestamp: Date.now()
    };
    
    this.setConsentData(consent);
    this.applyConsent(consent);
    this.hideSettings();
  }

  applyConsent(consent) {
    if (consent.analytics) {
      this.enableAnalytics();
    } else {
      this.disableAnalytics();
    }
  }

  enableAnalytics() {
    // Enable Google Analytics if it exists
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  }

  disableAnalytics() {
    // Disable Google Analytics
    if (typeof gtag !== 'undefined') {
      gtag('consent', 'update', {
        'analytics_storage': 'denied'
      });
    }
    
    // Clear existing GA cookies
    this.clearAnalyticsCookies();
  }

  clearAnalyticsCookies() {
    const cookies = document.cookie.split(';');
    cookies.forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name.startsWith('_ga') || name.startsWith('_gid')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    });
  }

  hideBanner() {
    const banner = document.getElementById('vero-cookie-banner');
    if (banner) {
      banner.classList.remove('vero-cookie-show');
      setTimeout(() => banner.remove(), 300);
    }
  }

  addStyles() {
    if (document.getElementById('vero-cookie-styles')) return;

    const styles = document.createElement('style');
    styles.id = 'vero-cookie-styles';
    styles.textContent = `
      /* Vero Cookie Consent Styles */
      #vero-cookie-banner,
      #vero-cookie-settings {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10000;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
      }

      #vero-cookie-banner.vero-cookie-show,
      #vero-cookie-settings.vero-cookie-show {
        opacity: 1;
        visibility: visible;
      }

      .vero-cookie-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
      }

      .vero-cookie-banner {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: #000000;
        color: #ffffff;
        padding: 24px;
        transform: translateY(100%);
        transition: transform 0.3s ease;
      }

      #vero-cookie-banner.vero-cookie-show .vero-cookie-banner {
        transform: translateY(0);
      }

      .vero-cookie-content {
        max-width: 1200px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 32px;
      }

      .vero-cookie-text h3 {
        font-family: 'Poppins', sans-serif;
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0 0 8px 0;
        color: #ffffff;
      }

      .vero-cookie-text p {
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        margin: 0 0 8px 0;
        color: #cccccc;
        line-height: 1.4;
      }

      .vero-cookie-policy-link {
        color: rgba(255, 208, 116);
        text-decoration: underline;
        font-size: 0.85rem;
        font-family: 'Inter', sans-serif;
      }

      .vero-cookie-policy-link:hover {
        color: #ffffff;
      }

      .vero-cookie-actions {
        display: flex;
        gap: 12px;
        flex-shrink: 0;
      }

      .vero-cookie-btn {
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        font-weight: 600;
        padding: 12px 24px;
        border: none;
        border-radius: 0;
        cursor: pointer;
        transition: all 0.2s ease;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .vero-cookie-settings {
        background: transparent;
        color: #ffffff;
        border: 1px solid #ffffff;
      }

      .vero-cookie-settings:hover {
        background: #ffffff;
        color: #000000;
      }

      .vero-cookie-reject {
        background: #666666;
        color: #ffffff;
      }

      .vero-cookie-reject:hover {
        background: #888888;
      }

      .vero-cookie-accept {
        background: rgba(255, 208, 116);
        color: #000000;
        border: 1px solid #000000;
      }

      .vero-cookie-accept:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(255, 208, 116, 0.3);
      }

      /* Modal Styles */
      .vero-cookie-modal {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0.9);
        background: #ffffff;
        border-radius: 0;
        max-width: 600px;
        width: 90%;
        max-height: 80vh;
        overflow: hidden;
        transition: transform 0.3s ease;
      }

      #vero-cookie-settings.vero-cookie-show .vero-cookie-modal {
        transform: translate(-50%, -50%) scale(1);
      }

      .vero-cookie-modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px;
        border-bottom: 1px solid #e5e7eb;
        background: #000000;
        color: #ffffff;
      }

      .vero-cookie-modal-header h3 {
        font-family: 'Poppins', sans-serif;
        font-size: 1.25rem;
        font-weight: 700;
        margin: 0;
      }

      .vero-cookie-close {
        background: none;
        border: none;
        font-size: 1.5rem;
        color: #ffffff;
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .vero-cookie-close:hover {
        color: rgba(255, 208, 116);
      }

      .vero-cookie-modal-body {
        padding: 24px;
        max-height: 400px;
        overflow-y: auto;
      }

      .vero-cookie-category {
        margin-bottom: 24px;
      }

      .vero-cookie-category-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
      }

      .vero-cookie-category h4 {
        font-family: 'Poppins', sans-serif;
        font-size: 1rem;
        font-weight: 600;
        margin: 0;
        color: #000000;
      }

      .vero-cookie-category p {
        font-family: 'Inter', sans-serif;
        font-size: 0.85rem;
        color: #666666;
        line-height: 1.4;
        margin: 0;
      }

      .vero-cookie-always-on {
        background: #e5e7eb;
        color: #6b7280;
        padding: 4px 12px;
        border-radius: 12px;
        font-size: 0.75rem;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      /* Toggle Switch */
      .vero-cookie-toggle {
        position: relative;
        display: inline-block;
        width: 50px;
        height: 24px;
      }

      .vero-cookie-toggle input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .vero-cookie-slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        transition: 0.3s;
        border-radius: 24px;
      }

      .vero-cookie-slider:before {
        position: absolute;
        content: "";
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.3s;
        border-radius: 50%;
      }

      .vero-cookie-toggle input:checked + .vero-cookie-slider {
        background-color: rgba(255, 208, 116);
      }

      .vero-cookie-toggle input:checked + .vero-cookie-slider:before {
        transform: translateX(26px);
      }

      .vero-cookie-modal-footer {
        padding: 24px;
        border-top: 1px solid #e5e7eb;
        text-align: right;
      }

      .vero-cookie-save {
        background: #000000;
        color: #ffffff;
      }

      .vero-cookie-save:hover {
        background: #333333;
      }

      /* Mobile Responsive */
      @media (max-width: 768px) {
        .vero-cookie-content {
          flex-direction: column;
          align-items: stretch;
          gap: 20px;
        }

        .vero-cookie-actions {
          justify-content: center;
        }

        .vero-cookie-btn {
          flex: 1;
          min-width: 0;
        }

        .vero-cookie-modal {
          width: 95%;
          max-height: 90vh;
        }

        .vero-cookie-text h3 {
          font-size: 1.1rem;
        }

        .vero-cookie-text p {
          font-size: 0.85rem;
        }
      }
    `;

    document.head.appendChild(styles);
  }

  // Public method to show settings (for footer links)
  static showSettings() {
    if (window.veroCookies) {
      window.veroCookies.showSettings();
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  window.veroCookies = new VeroCookieConsent();
});

// Export for manual initialization if needed
window.VeroCookieConsent = VeroCookieConsent;