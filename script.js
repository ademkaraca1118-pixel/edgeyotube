// Timezone data
const TIMEZONES = {
    // Asia
    'Asia/Tokyo': 'Tokyo 🇯🇵',
    'Asia/Shanghai': 'Shanghai 🇨🇳',
    'Asia/Hong_Kong': 'Hong Kong 🇭🇰',
    'Asia/Singapore': 'Singapore 🇸🇬',
    'Asia/Bangkok': 'Bangkok 🇹🇭',
    'Asia/Kolkata': 'New Delhi 🇮🇳',
    'Asia/Dubai': 'Dubai 🇦🇪',
    'Asia/Bangkok': 'Bangkok 🇹🇭',
    
    // Europe
    'Europe/London': 'London 🇬🇧',
    'Europe/Paris': 'Paris 🇫🇷',
    'Europe/Berlin': 'Berlin 🇩🇪',
    'Europe/Amsterdam': 'Amsterdam 🇳🇱',
    'Europe/Madrid': 'Madrid 🇪🇸',
    'Europe/Rome': 'Rome 🇮🇹',
    'Europe/Istanbul': 'Istanbul 🇹🇷',
    'Europe/Moscow': 'Moscow 🇷🇺',
    
    // Americas
    'America/New_York': 'New York 🇺🇸',
    'America/Chicago': 'Chicago 🇺🇸',
    'America/Denver': 'Denver 🇺🇸',
    'America/Los_Angeles': 'Los Angeles 🇺🇸',
    'America/Anchorage': 'Anchorage 🇺🇸',
    'America/Toronto': 'Toronto 🇨🇦',
    'America/Vancouver': 'Vancouver 🇨🇦',
    'America/Mexico_City': 'Mexico City 🇲🇽',
    'America/Sao_Paulo': 'São Paulo 🇧🇷',
    'America/Buenos_Aires': 'Buenos Aires 🇦🇷',
    
    // Australia
    'Australia/Sydney': 'Sydney 🇦🇺',
    'Australia/Melbourne': 'Melbourne 🇦🇺',
    'Australia/Perth': 'Perth 🇦🇺',
    'Pacific/Auckland': 'Auckland 🇳🇿',
    
    // Africa
    'Africa/Cairo': 'Cairo 🇪🇬',
    'Africa/Johannesburg': 'Johannesburg 🇿🇦',
    'Africa/Lagos': 'Lagos 🇳🇬',
    'Africa/Nairobi': 'Nairobi 🇰🇪',
};

// Preset configurations
const PRESETS = {
    world: [
        'Asia/Tokyo',
        'Asia/Shanghai',
        'Europe/London',
        'America/New_York',
        'Australia/Sydney',
    ],
    business: [
        'Asia/Tokyo',
        'Europe/London',
        'America/New_York',
        'Asia/Singapore',
        'Europe/Paris',
    ],
    tech: [
        'America/Los_Angeles',
        'Europe/Berlin',
        'Asia/Bangalore',
        'Asia/Shanghai',
        'America/New_York',
    ],
};

// State
let clocks = [];
let timeFormat = 12; // 12 or 24 hour

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    populateTimezoneSelect();
    setupEventListeners();
    loadClocks();
    updateClocks();
    setInterval(updateClocks, 1000);
});

// Populate timezone dropdown
function populateTimezoneSelect() {
    const select = document.getElementById('timezoneSelect');
    Object.entries(TIMEZONES).forEach(([tz, name]) => {
        const option = document.createElement('option');
        option.value = tz;
        option.textContent = name;
        select.appendChild(option);
    });
}

// Setup event listeners
function setupEventListeners() {
    document.getElementById('addBtn').addEventListener('click', addClock);
    document.getElementById('cityInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addClock();
    });
    document.getElementById('clearBtn').addEventListener('click', clearAllClocks);

    // Preset buttons
    document.querySelectorAll('.preset-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const preset = e.target.dataset.preset;
            loadPreset(preset);
        });
    });

    // Format toggle
    document.querySelectorAll('.format-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.format-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            timeFormat = parseInt(e.target.dataset.format);
            updateClocks();
        });
    });
}

// Add a new clock
function addClock() {
    const cityInput = document.getElementById('cityInput');
    const timezoneSelect = document.getElementById('timezoneSelect');
    const city = cityInput.value.trim();
    const timezone = timezoneSelect.value;

    if (!city) {
        alert('Please enter a city name');
        return;
    }

    // Check if already exists
    if (clocks.some(c => c.timezone === timezone)) {
        alert('This timezone is already added');
        return;
    }

    clocks.push({
        id: Date.now(),
        city: city,
        timezone: timezone,
    });

    cityInput.value = '';
    saveClocks();
    renderClocks();
}

// Remove a clock
function removeClock(id) {
    clocks = clocks.filter(c => c.id !== id);
    saveClocks();
    renderClocks();
}

// Clear all clocks
function clearAllClocks() {
    if (confirm('Remove all clocks?')) {
        clocks = [];
        saveClocks();
        renderClocks();
    }
}

// Load preset
function loadPreset(preset) {
    clocks = PRESETS[preset].map((tz, index) => ({
        id: Date.now() + index,
        city: TIMEZONES[tz].split(' ')[0],
        timezone: tz,
    }));
    saveClocks();
    renderClocks();
}

// Save clocks to localStorage
function saveClocks() {
    localStorage.setItem('clocks', JSON.stringify(clocks));
}

// Load clocks from localStorage
function loadClocks() {
    const saved = localStorage.getItem('clocks');
    if (saved) {
        try {
            clocks = JSON.parse(saved);
        } catch (e) {
            clocks = [];
        }
    }
}

// Update all clocks
function updateClocks() {
    const container = document.getElementById('clocks-container');
    
    if (clocks.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <h2>No clocks added yet</h2>
                <p>Add a custom timezone or select a preset to get started!</p>
            </div>
        `;
        return;
    }

    clocks.forEach(clock => {
        const clockElement = document.getElementById(`clock-${clock.id}`);
        if (clockElement) {
            updateClockDisplay(clockElement, clock);
        }
    });

    // Update last update time
    document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString();
}

// Render clocks
function renderClocks() {
    const container = document.getElementById('clocks-container');

    if (clocks.length === 0) {
        container.innerHTML = `
            <div class="empty-state" style="grid-column: 1 / -1;">
                <h2>No clocks added yet</h2>
                <p>Add a custom timezone or select a preset to get started!</p>
            </div>
        `;
        return;
    }

    container.innerHTML = clocks.map(clock => `
        <div class="clock-card" id="clock-${clock.id}">
            <button class="remove-btn" onclick="removeClock(${clock.id})">×</button>
            <div class="timezone-name">${clock.timezone}</div>
            <div class="city-name">${clock.city}</div>
            <div class="time-display" id="time-${clock.id}">--:--:--</div>
            <div class="date-display" id="date-${clock.id}">---</div>
            <div class="time-period" id="period-${clock.id}">--</div>
        </div>
    `).join('');

    updateClocks();
}

// Update individual clock display
function updateClockDisplay(element, clock) {
    const now = new Date();
    const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: clock.timezone,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: timeFormat === 12,
    });

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
        timeZone: clock.timezone,
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    const timeParts = formatter.formatToParts(now);
    let timeString = '';
    let period = '';

    timeParts.forEach(part => {
        if (part.type === 'hour' || part.type === 'minute' || part.type === 'second') {
            timeString += part.value;
            if (part.type !== 'second') timeString += ':';
        }
        if (part.type === 'dayPeriod') {
            period = part.value;
        }
    });

    const dateString = dateFormatter.format(now);

    const timeEl = element.querySelector(`#time-${clock.id}`);
    const dateEl = element.querySelector(`#date-${clock.id}`);
    const periodEl = element.querySelector(`#period-${clock.id}`);

    if (timeEl) timeEl.textContent = timeString;
    if (dateEl) dateEl.textContent = dateString;
    if (periodEl) {
        if (timeFormat === 12) {
            periodEl.textContent = period;
        } else {
            // For 24-hour format, show if it's day or night
            const hour = parseInt(timeParts.find(p => p.type === 'hour')?.value || 0);
            periodEl.textContent = hour >= 6 && hour < 18 ? '☀️ Day' : '🌙 Night';
        }
    }
}
