(() => {
  'use strict';
  const apiBase = 'https://aepuns-secrets-api.sheav06.workers.dev';
  const leaderboard = document.getElementById('leaderboard');
  if (!leaderboard) return;
  let applying = false;
  function addControls() {
    if (applying) return;
    applying = true;
    try {
      for (const form of leaderboard.querySelectorAll('form[data-score]')) {
        const row = form.closest('tr');
        if (!row || row.querySelector('.moderate-name')) continue;
        const viewerId = form.dataset.score;
        const usernameCell = row.querySelector('td');
        if (!usernameCell) continue;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'secondary moderate-name';
        button.textContent = 'Change username';
        button.style.marginTop = '8px';
        button.style.whiteSpace = 'nowrap';
        button.addEventListener('click', async () => {
          const oldName = usernameCell.textContent.trim();
          const proposed = window.prompt(`Replacement username for ${oldName}:`, oldName);
          if (proposed === null) return;
          const newName = proposed.trim().normalize('NFC');
          if (!newName || newName === oldName) return;
          if (!window.confirm(`Change ${oldName}'s username to ${newName}? This won't reset their 30-day cooldown.`)) return;
          button.disabled = true;
          try {
            const response = await fetch(`${apiBase}/admin/viewers/${encodeURIComponent(viewerId)}/username`, {
              method: 'POST', credentials: 'include',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ username: newName })
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok) throw new Error(data.error || `Request failed (${response.status})`);
            usernameCell.textContent = data.username;
            // Reload leaderboard and redemption history using existing admin refresh control.
            const refreshButton = document.getElementById('refreshButton');
            if (refreshButton) refreshButton.click();
            const status = document.getElementById('globalStatus');
            if (status) { status.textContent = `Username changed to ${data.username}.`; status.className = 'status ok'; }
          } catch (error) {
            window.alert(`Couldn't change username: ${error.message}`);
          } finally { button.disabled = false; }
        });
        form.appendChild(button);
      }
    } finally { applying = false; }
  }
  new MutationObserver(addControls).observe(leaderboard, { childList: true, subtree: true });
  addControls();
})();
