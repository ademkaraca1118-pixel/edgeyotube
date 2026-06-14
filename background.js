// Arka plan hizmet çalışanı
// Temel işlemler ve mesaj yönetimi

chrome.runtime.onInstalled.addListener(() => {
    console.log('YouTube Subtitle TTS eklentisi yüklendi!');
    
    // Varsayılan ayarları oluştur
    chrome.storage.local.set({
        ttsSettings: {
            language: 'tr-TR',
            rate: 1,
            volume: 1
        },
        isPlaying: false,
        subtitleContent: ''
    });
});

// Tab değiştiğinde TTS'yi durdur
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.storage.local.get('isPlaying', (result) => {
        if (result.isPlaying) {
            chrome.tabs.sendMessage(activeInfo.tabId, { action: 'stopTTS' }).catch(() => {});
        }
    });
});

// Eklenti kaldırıldığında temizlik yap
chrome.runtime.onSuspend.addListener(() => {
    chrome.storage.local.clear();
});
