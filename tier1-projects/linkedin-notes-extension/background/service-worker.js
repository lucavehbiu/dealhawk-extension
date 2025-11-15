// LinkedIn Note Saver - Service Worker

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // First-time install
    console.log('LinkedIn Note Saver installed!');

    // Open welcome page
    chrome.tabs.create({
      url: 'https://yourdomain.com/welcome'
    });

    // Set up default storage
    chrome.storage.local.set({
      linkedinNotes: [],
      settings: {
        enableReminders: true,
        theme: 'light'
      }
    });
  } else if (details.reason === 'update') {
    console.log('LinkedIn Note Saver updated to version', chrome.runtime.getManifest().version);
  }
});

// Handle messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'openPopup') {
    // Open extension popup programmatically
    chrome.action.openPopup();
  }

  return true;
});

// Daily reminder check (for follow-ups)
chrome.alarms.create('checkFollowups', {
  delayInMinutes: 1,
  periodInMinutes: 1440 // Daily
});

chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name === 'checkFollowups') {
    await checkFollowupReminders();
  }
});

async function checkFollowupReminders() {
  const { linkedinNotes } = await chrome.storage.local.get(['linkedinNotes']);

  if (!linkedinNotes || linkedinNotes.length === 0) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  linkedinNotes.forEach(note => {
    if (note.nextFollowup) {
      const followupDate = new Date(note.nextFollowup);
      followupDate.setHours(0, 0, 0, 0);

      // If follow-up is today
      if (followupDate.getTime() === today.getTime()) {
        chrome.notifications.create({
          type: 'basic',
          iconUrl: 'icons/icon128.png',
          title: '📅 LinkedIn Follow-up Reminder',
          message: `Time to follow up with ${note.profileName || 'connection'}!`,
          buttons: [
            { title: 'Open Profile' }
          ],
          priority: 2
        });
      }
    }
  });
}

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener((notificationId, buttonIndex) => {
  if (buttonIndex === 0) {
    // Open LinkedIn (you'd need to pass profile URL in notification somehow)
    chrome.tabs.create({
      url: 'https://www.linkedin.com'
    });
  }
});
