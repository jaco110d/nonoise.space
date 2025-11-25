// Modern GDPR Cookie Banner for NoNoise
(function() {
    'use strict';

    const COOKIE_NAME = 'nonoise_cookie_consent';
    const DATAFAST_ID = 'dfid_gJvJ3jbOS18UCmgXaK783';
    
    // Check if consent already given
    function hasConsent() {
        return document.cookie.split('; ').find(row => row.startsWith(COOKIE_NAME + '='));
    }

    // Set consent cookie
    function setConsent(value) {
        const expiryDate = new Date();
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        document.cookie = `${COOKIE_NAME}=${value}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
    }

    // Load DataFast tracking
    function loadDataFast() {
        if (typeof window.datafast === 'undefined') {
            const script = document.createElement('script');
            script.defer = true;
            script.setAttribute('data-website-id', DATAFAST_ID);
            script.setAttribute('data-domain', 'nonoise.space');
            script.src = 'https://datafa.st/js/script.js';
            document.head.appendChild(script);
        }
    }

    // Show cookie banner
    function showBanner() {
        const banner = document.createElement('div');
        banner.id = 'cookie-banner';
        banner.innerHTML = `
            <div class="cookie-banner-content">
                <div class="cookie-text">
                    <p><strong>🍪 We use cookies</strong></p>
                    <p>We use analytics cookies to improve your experience and understand how visitors use our site. No personal data is sold or shared.</p>
                </div>
                <div class="cookie-buttons">
                    <button id="cookie-accept" class="cookie-btn cookie-accept">Accept</button>
                    <button id="cookie-decline" class="cookie-btn cookie-decline">Decline</button>
                </div>
            </div>
        `;
        document.body.appendChild(banner);

        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #cookie-banner {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                background: linear-gradient(135deg, rgba(20, 20, 25, 0.98) 0%, rgba(15, 15, 20, 0.98) 100%);
                backdrop-filter: blur(40px);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                padding: 24px;
                z-index: 10000;
                animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.5);
            }

            @keyframes slideUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }

            .cookie-banner-content {
                max-width: 1200px;
                margin: 0 auto;
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 32px;
            }

            .cookie-text p {
                margin: 0;
                color: rgba(255, 255, 255, 0.8);
                font-size: 14px;
                line-height: 1.6;
            }

            .cookie-text p strong {
                color: white;
                font-size: 15px;
                display: block;
                margin-bottom: 6px;
            }

            .cookie-buttons {
                display: flex;
                gap: 12px;
                flex-shrink: 0;
            }

            .cookie-btn {
                padding: 12px 28px;
                border-radius: 10px;
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
                border: none;
                font-family: inherit;
            }

            .cookie-accept {
                background: rgba(255, 255, 255, 0.15);
                border: 1px solid rgba(255, 255, 255, 0.2);
                color: white;
            }

            .cookie-accept:hover {
                background: rgba(255, 255, 255, 0.25);
                transform: translateY(-2px);
            }

            .cookie-decline {
                background: transparent;
                border: 1px solid rgba(255, 255, 255, 0.1);
                color: rgba(255, 255, 255, 0.6);
            }

            .cookie-decline:hover {
                background: rgba(255, 255, 255, 0.05);
                color: rgba(255, 255, 255, 0.9);
            }

            @media (max-width: 768px) {
                .cookie-banner-content {
                    flex-direction: column;
                    align-items: stretch;
                    gap: 20px;
                }

                .cookie-buttons {
                    justify-content: stretch;
                }

                .cookie-btn {
                    flex: 1;
                }
            }
        `;
        document.head.appendChild(style);

        // Handle clicks
        document.getElementById('cookie-accept').addEventListener('click', function() {
            setConsent('accepted');
            loadDataFast();
            banner.style.animation = 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse';
            setTimeout(() => banner.remove(), 300);
        });

        document.getElementById('cookie-decline').addEventListener('click', function() {
            setConsent('declined');
            banner.style.animation = 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) reverse';
            setTimeout(() => banner.remove(), 300);
        });
    }

    // Initialize
    function init() {
        const consent = hasConsent();
        
        if (!consent) {
            // Show banner if no consent decision made
            setTimeout(showBanner, 1000);
        } else {
            // Load tracking if previously accepted
            const consentValue = document.cookie.split('; ')
                .find(row => row.startsWith(COOKIE_NAME + '='))
                .split('=')[1];
            
            if (consentValue === 'accepted') {
                loadDataFast();
            }
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

