// LinkedIn Note Saver - Content Script
// Runs on LinkedIn pages to extract profile information

class LinkedInProfileExtractor {
  constructor() {
    this.setupMessageListener();
    this.injectNoteButton();
  }

  setupMessageListener() {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      if (request.action === 'getProfileInfo') {
        const profileInfo = this.extractProfileInfo();
        sendResponse(profileInfo);
      }
      return true;
    });
  }

  extractProfileInfo() {
    try {
      // Extract profile name
      const nameSelectors = [
        'h1.text-heading-xlarge',
        'h1.inline.t-24.v-align-middle.break-words',
        '.pv-text-details__left-panel h1',
        '.ph5 h1'
      ];

      let name = '';
      for (const selector of nameSelectors) {
        const el = document.querySelector(selector);
        if (el) {
          name = el.textContent.trim();
          break;
        }
      }

      // Extract headline
      const headlineSelectors = [
        '.text-body-medium.break-words',
        '.pv-text-details__left-panel .text-body-medium',
        '.ph5 .text-body-medium'
      ];

      let headline = '';
      for (const selector of headlineSelectors) {
        const el = document.querySelector(selector);
        if (el && !el.querySelector('button')) {
          headline = el.textContent.trim();
          break;
        }
      }

      // Extract profile picture
      const picSelectors = [
        '.pv-top-card-profile-picture__image',
        'img.pv-top-card-profile-picture__image',
        '.profile-photo-edit__preview img'
      ];

      let profilePic = '';
      for (const selector of picSelectors) {
        const el = document.querySelector(selector);
        if (el) {
          profilePic = el.src;
          break;
        }
      }

      if (!name) {
        return { success: false, error: 'Could not extract profile name' };
      }

      return {
        success: true,
        name,
        headline,
        profilePic
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  injectNoteButton() {
    // Wait for page to load
    setTimeout(() => {
      this.addFloatingButton();
    }, 2000);
  }

  addFloatingButton() {
    // Check if we're on a profile page
    if (!window.location.pathname.includes('/in/')) {
      return;
    }

    // Don't add if button already exists
    if (document.getElementById('linkedin-note-saver-btn')) {
      return;
    }

    // Create floating button
    const button = document.createElement('div');
    button.id = 'linkedin-note-saver-btn';
    button.innerHTML = '📝';
    button.title = 'Save a private note about this person';

    button.addEventListener('click', () => {
      chrome.runtime.sendMessage({ action: 'openPopup' });
    });

    document.body.appendChild(button);
  }
}

// Initialize
new LinkedInProfileExtractor();
