// LinkedIn Note Saver - Popup Logic

class LinkedInNotes {
  constructor() {
    this.currentProfile = null;
    this.allNotes = [];
    this.init();
  }

  async init() {
    await this.loadAllNotes();
    await this.detectCurrentProfile();
    this.setupEventListeners();
    this.renderNotesList();
  }

  async loadAllNotes() {
    const result = await chrome.storage.local.get(['linkedinNotes']);
    this.allNotes = result.linkedinNotes || [];
  }

  async detectCurrentProfile() {
    // Get current tab's LinkedIn profile info
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    if (!tab.url || !tab.url.includes('linkedin.com/in/')) {
      this.showNotOnProfile();
      return;
    }

    // Extract profile URL
    const profileUrl = this.extractProfileUrl(tab.url);

    // Try to get profile data from content script
    try {
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'getProfileInfo' });

      if (response && response.success) {
        this.currentProfile = {
          url: profileUrl,
          name: response.name,
          headline: response.headline,
          profilePic: response.profilePic
        };

        this.showProfileEditor();
        this.loadExistingNote();
      } else {
        this.showNotOnProfile();
      }
    } catch (error) {
      console.error('Error getting profile info:', error);
      this.showNotOnProfile();
    }
  }

  extractProfileUrl(fullUrl) {
    const match = fullUrl.match(/linkedin\.com\/in\/([^\/\?]+)/);
    return match ? match[1] : null;
  }

  showProfileEditor() {
    document.getElementById('current-profile').classList.remove('hidden');
    document.getElementById('not-on-profile').classList.add('hidden');

    // Populate profile info
    document.getElementById('profile-name').textContent = this.currentProfile.name || 'Unknown';
    document.getElementById('profile-headline').textContent = this.currentProfile.headline || '';

    if (this.currentProfile.profilePic) {
      document.getElementById('profile-pic').src = this.currentProfile.profilePic;
    }
  }

  showNotOnProfile() {
    document.getElementById('current-profile').classList.add('hidden');
    document.getElementById('not-on-profile').classList.remove('hidden');
  }

  async loadExistingNote() {
    const existingNote = this.allNotes.find(note => note.profileUrl === this.currentProfile.url);

    if (existingNote) {
      document.getElementById('note-input').value = existingNote.note || '';
      document.getElementById('last-contact').value = existingNote.lastContact || '';
      document.getElementById('next-followup').value = existingNote.nextFollowup || '';
      document.getElementById('tags').value = existingNote.tags || '';
    }
  }

  setupEventListeners() {
    // Save note button
    document.getElementById('save-note')?.addEventListener('click', () => this.saveNote());

    // Export notes button
    document.getElementById('export-notes')?.addEventListener('click', () => this.exportNotes());

    // Search notes
    document.getElementById('search-notes')?.addEventListener('input', (e) => {
      this.renderNotesList(e.target.value);
    });

    // Upgrade button
    document.getElementById('upgrade-btn')?.addEventListener('click', () => {
      window.open('https://gumroad.com/YOUR_PRODUCT_LINK', '_blank');
    });

    // Feedback link
    document.getElementById('feedback-link')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.open('mailto:feedback@yourapp.com', '_blank');
    });
  }

  async saveNote() {
    if (!this.currentProfile) {
      this.showStatus('Please navigate to a LinkedIn profile first', 'error');
      return;
    }

    const noteText = document.getElementById('note-input').value.trim();

    if (!noteText) {
      this.showStatus('Please enter a note', 'error');
      return;
    }

    const noteData = {
      profileUrl: this.currentProfile.url,
      profileName: this.currentProfile.name,
      profileHeadline: this.currentProfile.headline,
      profilePic: this.currentProfile.profilePic,
      note: noteText,
      lastContact: document.getElementById('last-contact').value,
      nextFollowup: document.getElementById('next-followup').value,
      tags: document.getElementById('tags').value,
      lastUpdated: new Date().toISOString()
    };

    // Update or add note
    const existingIndex = this.allNotes.findIndex(n => n.profileUrl === this.currentProfile.url);

    if (existingIndex !== -1) {
      this.allNotes[existingIndex] = noteData;
    } else {
      this.allNotes.unshift(noteData);
    }

    // Save to storage
    await chrome.storage.local.set({ linkedinNotes: this.allNotes });

    this.showStatus('✅ Note saved successfully!', 'success');
    this.renderNotesList();
  }

  showStatus(message, type) {
    const statusEl = document.getElementById('save-status');
    statusEl.textContent = message;
    statusEl.className = `status ${type}`;
    statusEl.classList.remove('hidden');

    setTimeout(() => {
      statusEl.classList.add('hidden');
    }, 3000);
  }

  renderNotesList(searchQuery = '') {
    const listEl = document.getElementById('notes-list');

    if (this.allNotes.length === 0) {
      listEl.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No notes yet. Start by saving a note on a LinkedIn profile!</p>';
      return;
    }

    // Filter notes based on search
    let filteredNotes = this.allNotes;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredNotes = this.allNotes.filter(note =>
        note.profileName?.toLowerCase().includes(query) ||
        note.note?.toLowerCase().includes(query) ||
        note.tags?.toLowerCase().includes(query)
      );
    }

    if (filteredNotes.length === 0) {
      listEl.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">No notes match your search.</p>';
      return;
    }

    listEl.innerHTML = filteredNotes.map(note => this.renderNoteItem(note)).join('');

    // Add click listeners to note items
    listEl.querySelectorAll('.note-item').forEach(item => {
      item.addEventListener('click', () => {
        const profileUrl = item.dataset.profileUrl;
        window.open(`https://www.linkedin.com/in/${profileUrl}`, '_blank');
      });
    });
  }

  renderNoteItem(note) {
    const tags = note.tags ? note.tags.split(',').map(t => t.trim()).filter(t => t) : [];
    const lastUpdated = new Date(note.lastUpdated).toLocaleDateString();

    // Check if follow-up is soon (within 7 days)
    let followupBadge = '';
    if (note.nextFollowup) {
      const followupDate = new Date(note.nextFollowup);
      const today = new Date();
      const daysUntil = Math.ceil((followupDate - today) / (1000 * 60 * 60 * 24));

      if (daysUntil >= 0 && daysUntil <= 7) {
        followupBadge = `<span class="followup-soon">📅 Follow up in ${daysUntil} days</span>`;
      }
    }

    return `
      <div class="note-item" data-profile-url="${note.profileUrl}">
        <div class="note-item-header">
          <div class="note-item-name">${note.profileName || 'Unknown'}</div>
          <div class="note-item-date">${lastUpdated}</div>
        </div>
        <div class="note-item-text">${note.note}</div>
        ${followupBadge}
        ${tags.length > 0 ? `
          <div class="note-item-tags">
            ${tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
          </div>
        ` : ''}
      </div>
    `;
  }

  exportNotes() {
    if (this.allNotes.length === 0) {
      alert('No notes to export!');
      return;
    }

    // Create CSV
    const headers = ['Name', 'Profile URL', 'Headline', 'Note', 'Last Contact', 'Next Follow-up', 'Tags', 'Last Updated'];
    const rows = this.allNotes.map(note => [
      note.profileName || '',
      `https://www.linkedin.com/in/${note.profileUrl}`,
      note.profileHeadline || '',
      note.note || '',
      note.lastContact || '',
      note.nextFollowup || '',
      note.tags || '',
      new Date(note.lastUpdated).toLocaleString()
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linkedin-notes-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new LinkedInNotes();
});
