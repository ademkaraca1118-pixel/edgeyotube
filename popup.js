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

let uploadedFilename = '';

// Sayfa yüklendiğinde tüm sesli okumacıları yükle
window.addEventListener('load', async () => {
    // Ayarları geri yükle
    const { ttsSettings, uploadedFile } = await chrome.storage.local.get(['ttsSettings', 'uploadedFile']);
    
    if (ttsSettings) {
        languageSelect.value = ttsSettings.language || 'tr-TR';
        rateInput.value = ttsSettings.rate || 1;
        volumeInput.value = ttsSettings.volume || 1;
        volumeValue.textContent = Math.round(ttsSettings.volume * 100) + '%';
    }
    
    // Dosya durumunu göster
    if (uploadedFile && uploadedFile.name) {
        uploadedFilename = uploadedFile.name;
        fileStatus.textContent = `✅ Yüklendi: ${uploadedFile.name}`;
        fileStatus.className = 'status success';
    }
    
    // Tüm sesli okumacıları yükle
    loadVoices();
    
    // Sesli okumacılar değiştiğinde tekrar yükle
    speechSynthesis.onvoiceschanged = loadVoices;
});

// Tüm mevcut sesli okumacıları yükle
function loadVoices() {
    const voices = speechSynthesis.getVoices();
    console.log('Mevcut sesli okumacılar:', voices.length);
    
    if (voices.length === 0) {
        console.warn('Hiç sesli okumacı bulunamadı');
        return;
    }
    
    // Mevcut seçimi saklı tut
    const currentValue = languageSelect.value;
    
    // Select'i temizle
    languageSelect.innerHTML = '';
    
    // Önce Türkçe seçeneğini ekle (önerilen)
    let turkishOption = document.createElement('option');
    turkishOption.value = 'tr-TR';
    turkishOption.textContent = '🇹🇷 Türkçe (Önerilen)';
    turkishOption.style.fontWeight = 'bold';
    turkishOption.style.color = '#667eea';
    languageSelect.appendChild(turkishOption);
    
    // Ayırıcı - Sistem Sesli Okumacıları
    let separator1 = document.createElement('option');
    separator1.disabled = true;
    separator1.textContent = '───── Tüm Sistem Sesli Okumacıları ─────';
    languageSelect.appendChild(separator1);
    
    // Tüm sesli okumacıları ekle
    const addedLangs = new Set(['tr-TR']); // Türkçe'yi zaten ekledik
    const voicesByLang = {};
    
    // Sesli okumacıları dile göre grupla
    voices.forEach(voice => {
        const lang = voice.lang;
        if (!voicesByLang[lang]) {
            voicesByLang[lang] = [];
        }
        voicesByLang[lang].push(voice);
    });
    
    // Diller alfabetik sıraya göre
    const sortedLangs = Object.keys(voicesByLang).sort();
    
    sortedLangs.forEach(lang => {
        if (!addedLangs.has(lang)) {
            addedLangs.add(lang);
            
            const langVoices = voicesByLang[lang];
            
            // Dil başlığı olarak ilk sesi ekle
            let option = document.createElement('option');
            option.value = lang;
            
            // Dil adını güzelce göster
            const langName = new Intl.DisplayNames(['en'], { type: 'language' }).of(lang.split('-')[0]);
            const countryCode = lang.split('-')[1] || '';
            const fullName = countryCode ? `${langName} (${countryCode})` : langName;
            
            // Varsayılan ses varsa işaret et
            const defaultVoice = langVoices.find(v => v.default);
            const voiceName = defaultVoice ? defaultVoice.name : langVoices[0].name;
            
            option.textContent = `${fullName} - ${voiceName}`;
            
            // Tersih edilen sesleri işaretle
            if (defaultVoice) {
                option.textContent = `⭐ ${option.textContent} [Varsayılan]`;
            }
            
            languageSelect.appendChild(option);
            
            // Diğer sesli okumacıları da ekle
            langVoices.slice(1).forEach((voice, index) => {
                let voiceOption = document.createElement('option');
                voiceOption.value = lang;
                voiceOption.textContent = `   └─ ${voice.name}`;
                languageSelect.appendChild(voiceOption);
            });
        }
    });
    
    // Önceki seçimi geri yükle
    if (currentValue && Array.from(languageSelect.options).some(opt => opt.value === currentValue)) {
        languageSelect.value = currentValue;
    } else {
        languageSelect.value = 'tr-TR';
    }
}

// Subtitle dosyasını yükle
subtitleFile.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
        try {
            const content = event.target.result;
            
            // Dosya içeriğini storage'a kaydet
            await chrome.storage.local.set({ 
                subtitleContent: content,
                uploadedFile: {
                    name: file.name,
                    size: file.size,
                    timestamp: new Date().toISOString()
                }
            });
            
            uploadedFilename = file.name;
            
            fileStatus.textContent = `✅ Yüklendi: ${file.name} (${Math.round(file.size / 1024)} KB)`;
            fileStatus.className = 'status success';
            
            console.log('Dosya başarıyla yüklendi:', file.name);
            
            // Kalıcı olarak göster
            subtitleFile.style.opacity = '0.5';
        } catch (error) {
            fileStatus.textContent = '❌ Hata: ' + error.message;
            fileStatus.className = 'status error';
            console.error('Dosya yükleme hatası:', error);
        }
    };
    
    reader.onerror = (error) => {
        fileStatus.textContent = '❌ Dosya okunamadı';
        fileStatus.className = 'status error';
    };
    
    reader.readAsText(file);
});

// Ses seviyesi kontrolü
volumeInput.addEventListener('input', (e) => {
    volumeValue.textContent = Math.round(e.target.value * 100) + '%';
    
    // Ayarları kaydet
    chrome.storage.local.get('ttsSettings', (result) => {
        let settings = result.ttsSettings || {};
        settings.volume = parseFloat(e.target.value);
        chrome.storage.local.set({ ttsSettings: settings });
    });
});

// Hız kontrolü - geçerli aralıkta kalmasını sağla
rateInput.addEventListener('input', (e) => {
    let rateValue = parseFloat(e.target.value);
    
    // Aralığı kontrol et
    if (rateValue < 0.5) rateValue = 0.5;
    if (rateValue > 2) rateValue = 2;
    
    rateInput.value = rateValue;
    
    // Ayarları kaydet
    chrome.storage.local.get('ttsSettings', (result) => {
        let settings = result.ttsSettings || {};
        settings.rate = rateValue;
        chrome.storage.local.set({ ttsSettings: settings });
    });
});

rateInput.addEventListener('change', (e) => {
    let rateValue = parseFloat(e.target.value);
    
    // Aralığı kontrol et
    if (rateValue < 0.5) rateValue = 0.5;
    if (rateValue > 2) rateValue = 2;
    
    rateInput.value = rateValue;
    
    // Ayarları kaydet
    chrome.storage.local.get('ttsSettings', (result) => {
        let settings = result.ttsSettings || {};
        settings.rate = rateValue;
        chrome.storage.local.set({ ttsSettings: settings });
    });
});

// Dil seçimini kaydet
languageSelect.addEventListener('change', (e) => {
    chrome.storage.local.get('ttsSettings', (result) => {
        let settings = result.ttsSettings || {};
        settings.language = e.target.value;
        chrome.storage.local.set({ ttsSettings: settings });
    });
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
            rate: Math.max(0.5, Math.min(2, parseFloat(rateInput.value) || 1)),
            volume: Math.max(0, Math.min(1, parseFloat(volumeInput.value) || 1)),
            subtitleContent: subtitleContent
        };

        console.log('TTS başlatılıyor:', settings);

        await chrome.storage.local.set({ ttsSettings: settings, isPlaying: true });
        
        // Aktif tab'a mesaj gönder
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        chrome.tabs.sendMessage(tab.id, { action: 'startTTS', settings }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Mesaj gönderme hatası:', chrome.runtime.lastError.message);
                showStatus('⚠️ YouTube sayfasını yenileyin ve tekrar deneyin', 'error');
            } else if (response && response.success) {
                showStatus('▶️ Sesli okuma başlatıldı!', 'success');
            }
        });
    } catch (error) {
        console.error('Başlat hatası:', error);
        showStatus('❌ Hata: ' + error.message, 'error');
    }
});

// Duraklat butonu
pauseBtn.addEventListener('click', async () => {
    try {
        await chrome.storage.local.set({ isPlaying: false });
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        chrome.tabs.sendMessage(tab.id, { action: 'pauseTTS' }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Duraklat mesaj hatası:', chrome.runtime.lastError.message);
            } else if (response && response.success) {
                showStatus('⏸️ Sesli okuma duraklatıldı!', 'info');
            }
        });
    } catch (error) {
        console.error('Duraklat hatası:', error);
        showStatus('❌ Hata: ' + error.message, 'error');
    }
});

// Durdur butonu
stopBtn.addEventListener('click', async () => {
    try {
        await chrome.storage.local.set({ isPlaying: false });
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        chrome.tabs.sendMessage(tab.id, { action: 'stopTTS' }, (response) => {
            if (chrome.runtime.lastError) {
                console.error('Durdur mesaj hatası:', chrome.runtime.lastError.message);
            } else if (response && response.success) {
                showStatus('⏹️ Sesli okuma durduruldu!', 'info');
            }
        });
    } catch (error) {
        console.error('Durdur hatası:', error);
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
