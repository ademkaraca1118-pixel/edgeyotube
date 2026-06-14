// Zaman damgasını saniyeye çevir
function timeToSeconds(timeStr) {
    if (!timeStr) return 0;
    
    // Format: mm:ss veya hh:mm:ss veya mm:ss.ms
    const parts = timeStr.trim().split(':');
    let seconds = 0;
    
    if (parts.length === 2) {
        // mm:ss
        seconds = parseInt(parts[0]) * 60 + parseFloat(parts[1]);
    } else if (parts.length === 3) {
        // hh:mm:ss
        seconds = parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseFloat(parts[2]);
    }
    
    return Math.floor(seconds);
}

// Subtitle dosyasını parse et
function parseSubtitles(content) {
    const subtitles = [];
    const lines = content.split('\n');
    
    let currentTimestamp = null;
    let currentText = '';
    
    for (let line of lines) {
        line = line.trim();
        
        // Zaman damgası satırını kontrol et
        if (line.includes(':') && line.includes('-') && !line.includes(' ')) {
            // Yeni bir subtitle başla
            if (currentTimestamp !== null && currentText) {
                subtitles.push({
                    time: timeToSeconds(currentTimestamp),
                    text: currentText.trim()
                });
            }
            currentTimestamp = line.split('-')[0].trim();
            currentText = '';
        } else if (line && currentTimestamp !== null) {
            // Metin satırı
            if (currentText) {
                currentText += ' ' + line;
            } else {
                currentText = line;
            }
        }
    }
    
    // Son subtitle'ı ekle
    if (currentTimestamp !== null && currentText) {
        subtitles.push({
            time: timeToSeconds(currentTimestamp),
            text: currentText.trim()
        });
    }
    
    return subtitles.sort((a, b) => a.time - b.time);
}

// Mevcut zaman için subtitle bul
function findSubtitleAtTime(subtitles, currentTime) {
    for (let i = 0; i < subtitles.length; i++) {
        const current = subtitles[i];
        const next = subtitles[i + 1];
        
        if (current.time <= currentTime && (!next || currentTime < next.time)) {
            return current;
        }
    }
    
    return null;
}

// Metin sesle oku (Web Speech API)
function speakText(text, settings = {}) {
    return new Promise((resolve) => {
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.lang = settings.language || 'tr-TR';
        utterance.rate = settings.rate || 1;
        utterance.volume = settings.volume || 1;
        utterance.pitch = 1;
        
        utterance.onend = () => {
            resolve();
        };
        
        utterance.onerror = (error) => {
            console.error('TTS Error:', error);
            resolve();
        };
        
        speechSynthesis.speak(utterance);
    });
}

// Konuşmayı durdur
function stopSpeaking() {
    speechSynthesis.cancel();
}

// Konuşmayı duraklat
function pauseSpeaking() {
    if (speechSynthesis.speaking) {
        speechSynthesis.pause();
    }
}

// Konuşmayı devam ettir
function resumeSpeaking() {
    if (speechSynthesis.paused) {
        speechSynthesis.resume();
    }
}

// Mevcut video zamanını al (YouTube)
function getVideoTime() {
    try {
        const video = document.querySelector('video');
        return video ? Math.floor(video.currentTime) : 0;
    } catch (error) {
        return 0;
    }
}

// Video oynatılıyor mu kontrol et
function isVideoPlaying() {
    try {
        const video = document.querySelector('video');
        return video && !video.paused;
    } catch (error) {
        return false;
    }
}
