// Global değişkenler
let subtitles = [];
let currentSettings = {};
let isRunning = false;
let isSpeaking = false;
let lastSpokenTime = -1;
let monitorInterval = null;

// Mesaj dinleyicisi
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startTTS') {
        startTTS(request.settings);
        sendResponse({ status: 'started' });
    } else if (request.action === 'pauseTTS') {
        pauseTTS();
        sendResponse({ status: 'paused' });
    } else if (request.action === 'stopTTS') {
        stopTTS();
        sendResponse({ status: 'stopped' });
    }
});

// TTS başlat
function startTTS(settings) {
    currentSettings = settings;
    
    // Subtitle'ları parse et
    try {
        subtitles = parseSubtitles(settings.subtitleContent);
        console.log('Subtitle\'lar yüklendi:', subtitles.length, 'adet');
    } catch (error) {
        console.error('Subtitle parse hatası:', error);
        subtitles = [];
        return;
    }
    
    isRunning = true;
    lastSpokenTime = -1;
    
    // Video izlemeyi başla
    startMonitoring();
    
    // UI göster
    showMonitorUI();
}

// TTS duraklat
function pauseTTS() {
    pauseSpeaking();
    if (monitorInterval) {
        clearInterval(monitorInterval);
    }
}

// TTS durdur
function stopTTS() {
    isRunning = false;
    isSpeaking = false;
    stopSpeaking();
    if (monitorInterval) {
        clearInterval(monitorInterval);
        monitorInterval = null;
    }
    removeMonitorUI();
}

// Video zamanını izle
function startMonitoring() {
    if (monitorInterval) {
        clearInterval(monitorInterval);
    }
    
    monitorInterval = setInterval(() => {
        if (!isRunning) return;
        
        const currentTime = getVideoTime();
        const isPlaying = isVideoPlaying();
        
        if (isPlaying && !isSpeaking) {
            checkAndSpeak(currentTime);
        }
        
        updateMonitorUI(currentTime);
    }, 500); // Her 500ms kontrol et
}

// Zaman damgasını kontrol et ve konuş
async function checkAndSpeak(currentTime) {
    const subtitle = findSubtitleAtTime(subtitles, currentTime);
    
    if (subtitle && subtitle.time !== lastSpokenTime) {
        lastSpokenTime = subtitle.time;
        
        console.log(`[${formatTime(subtitle.time)}] Okunuyor: ${subtitle.text}`);
        
        isSpeaking = true;
        await speakText(subtitle.text, currentSettings);
        isSpeaking = false;
    }
}

// Zaman formatlama
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
        return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    return `${minutes}:${String(secs).padStart(2, '0')}`;
}

// Monitoring UI göster
function showMonitorUI() {
    if (document.getElementById('tts-monitor')) {
        return;
    }
    
    const monitor = document.createElement('div');
    monitor.id = 'tts-monitor';
    monitor.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        z-index: 10000;
        box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        font-size: 13px;
        max-width: 300px;
        user-select: none;
    `;
    
    monitor.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <strong>🎬 Sesli Okuma Aktif</strong>
            <button id="tts-close" style="
                background: rgba(255,255,255,0.3);
                border: none;
                color: white;
                padding: 2px 8px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 12px;
            ">×</button>
        </div>
        <div id="tts-current-text" style="
            background: rgba(255,255,255,0.1);
            padding: 10px;
            border-radius: 4px;
            margin-bottom: 8px;
            min-height: 30px;
            max-height: 60px;
            overflow-y: auto;
            font-size: 12px;
        ">Hazır...</div>
        <div style="font-size: 11px; opacity: 0.9;">
            <div>⏱️ Zaman: <span id="tts-time">00:00</span></div>
            <div>📝 Subtitle: <span id="tts-count">0</span></div>
        </div>
    `;
    
    document.body.appendChild(monitor);
    
    document.getElementById('tts-close').addEventListener('click', stopTTS);
}

// Monitoring UI güncelle
function updateMonitorUI(currentTime) {
    const monitor = document.getElementById('tts-monitor');
    if (!monitor) return;
    
    const subtitle = findSubtitleAtTime(subtitles, currentTime);
    const timeEl = document.getElementById('tts-time');
    const textEl = document.getElementById('tts-current-text');
    const countEl = document.getElementById('tts-count');
    
    if (timeEl) timeEl.textContent = formatTime(currentTime);
    if (countEl) countEl.textContent = subtitles.length;
    
    if (textEl) {
        if (subtitle) {
            textEl.textContent = subtitle.text;
        } else {
            textEl.textContent = 'Beklemede...';
            textEl.style.opacity = '0.5';
        }
    }
}

// Monitoring UI kaldır
function removeMonitorUI() {
    const monitor = document.getElementById('tts-monitor');
    if (monitor) {
        monitor.remove();
    }
}

// Sayfa yüklendiğinde depo kontrol et
chrome.storage.local.get('ttsSettings', (result) => {
    if (result.ttsSettings) {
        startTTS(result.ttsSettings);
    }
});
