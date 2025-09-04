// main.js – main JavaScript for the power usage tracker web app
const apiBase = '/api';

// Utility: fetch JSON and handle errors
async function fetchJson(url, opts = {}) {
  const resp = await fetch(url, opts);
  if (!resp.ok) throw new Error(`HTTP ${resp.status}: ${await resp.text()}`);
  return resp.json();
}

// ---------- Overall usage ----------
document.getElementById('addOverallBtn').addEventListener('click', async () => {
  const total = parseFloat(document.getElementById('totalWatts').value);
  if (isNaN(total)) return alert('Enter a valid number');

  await fetchJson(`${apiBase}/overall`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ timestamp: new Date().toISOString(), total_watts: total })
  });

  loadOverall(); // refresh table
});

async function loadOverall() {
  const rows = await fetchJson(`${apiBase}/overall`);
  const tbody = document.querySelector('#overallTable tbody');
  tbody.innerHTML = rows.map(r =>
    `<tr><td>${new Date(r.timestamp).toLocaleString()}</td><td>${r.total_watts}</td></tr>`
  ).join('');
}

// ---------- Device usage ----------
document.getElementById('addDeviceBtn').addEventListener('click', async () => {
  const name = document.getElementById('deviceName').value.trim();
  const watts = parseFloat(document.getElementById('deviceWatts').value);
  if (!name || isNaN(watts)) return alert('Fill both fields correctly');

  await fetchJson(`${apiBase}/devices`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ device_name: name, timestamp: new Date().toISOString(), watts })
  });

  loadDevices(); // refresh table
});

async function loadDevices() {
  const rows = await fetchJson(`${apiBase}/devices`);
  const tbody = document.querySelector('#deviceTable tbody');
  tbody.innerHTML = rows.map(r =>
    `<tr><td>${new Date(r.timestamp).toLocaleString()}</td><td>${r.device_name}</td><td>${r.watts}</td></tr>`
  ).join('');
}

// Init
loadOverall();
loadDevices();
