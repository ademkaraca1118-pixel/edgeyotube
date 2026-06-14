// Elementi seç
const subtitleFile = document.getElementById('subtitleFile');
const fileStatus = document.getElementById('fileStatus');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const stopBtn = document.getElementById('stopBtn');
const status = document.getElementById('status');
const languageSelect = document.getElementById('language');
const rateInput = document.getElementById('rate');
const volumeInput = document.getElementById('volume');
const volumeValue = document.getElementById('volumeValue');

// Ses dosyasını yükle
subtitleFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const content = event.target.result;
            await chrome.storage.local.set({ subtitleContent: content });
            fileStatus.textContent = '✅ Dosya yüklendi!';
            fileStatus.className = 'status success';
            setTimeout(() => {
                fileStatus.className = 'status';
            }, 3000);
        } catch (error) {
            fileStatus.textContent = '❌ Hata: ' + error.message;
            fileStatus.className = 'status error';
        }
    };
    reader.readAsText(file);
});

// Ses seviyesi kontrolü
volumeInput.addEventListener('input', (e) => {
    volumeValue.textContent = Math.round(e.target.value * 100) + '%';
});

// Başla butonu
startBtn.addEventListener('click', async () => {
    try {
        const { subtitleContent } = await chrome.storage.local.get('subtitleContent');
        if (!subtitleContent) {
            showStatus('❌ Lütfen önce bir subtitle dosyası yükleyin!', 'error');
            return;
        }

        const settings = {
            language: languageSelect.value,
            rate: parseFloat(rateInput.value),
            volume: parseFloat(volumeInput.value),
            subtitleContent: subtitleContent
        };

        await chrome.storage.local.set({ ttsSettings: settings, isPlaying: true });
        
        // Aktif tab'a mesaj gönder
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        await chrome.tabs.sendMessage(tab.id, { action: 'startTTS', settings });

        showStatus('▶️ Sesli okuma başlatıldı!', 'success');
    } catch (error) {
        showStatus('❌ Hata: ' + error.message, 'error');
    }
});

// Duraklat butonu
pauseBtn.addEventListener('click', async () => {
    try {
        await chrome.storage.local.set({ isPlaying: false });
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        await chrome.tabs.sendMessage(tab.id, { action: 'pauseTTS' });
        showStatus('⏸️ Sesli okuma duraklatıldı!', 'info');
    } catch (error) {
        showStatus('❌ Hata: ' + error.message, 'error');
    }
});

// Durdur butonu
stopBtn.addEventListener('click', async () => {
    try {
        await chrome.storage.local.set({ isPlaying: false });
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        await chrome.tabs.sendMessage(tab.id, { action: 'stopTTS' });
        showStatus('⏹️ Sesli okuma durduruldu!', 'info');
    } catch (error) {
        showStatus('❌ Hata: ' + error.message, 'error');
    }
});

// Durum mesajı göster
function showStatus(message, type) {
    status.textContent = message;
    status.className = `status ${type}`;
    setTimeout(() => {
        status.className = 'status';
    }, 4000);
}

// Sayfa yüklendiğinde ayarları geri yükle
window.addEventListener('load', async () => {
    const { ttsSettings } = await chrome.storage.local.get('ttsSettings');
    if (ttsSettings) {
        languageSelect.value = ttsSettings.language || 'tr-TR';
        rateInput.value = ttsSettings.rate || 1;
        volumeInput.value = ttsSettings.volume || 1;
        volumeValue.textContent = Math.round(ttsSettings.volume * 100) + '%';
    }
});
