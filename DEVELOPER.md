# YouTube Subtitle TTS Eklentisi - Geliştirici Rehberi

## 🛠️ Teknoloji Stack

- **Manifest V3**: Modern Edge eklenti standartı
- **Web Speech API**: Sesli okuma (TTS)
- **Chrome Storage API**: Veri saklama
- **Content Scripts**: YouTube sayfası entegrasyonu
- **Service Worker**: Arka plan işlemleri

## 📚 API Detayları

### Web Speech API
```javascript
const utterance = new SpeechSynthesisUtterance(text);
utterance.lang = 'tr-TR';  // Dil
utterance.rate = 1;         // Hız (0.1 - 10)
utterance.volume = 1;       // Ses (0 - 1)
speechSynthesis.speak(utterance);
```

### Chrome Storage
```javascript
// Kaydet
chrome.storage.local.set({ key: value });

// Oku
chrome.storage.local.get('key', (result) => {
    console.log(result.key);
});
```

### Message Passing
```javascript
// Gönder
chrome.tabs.sendMessage(tabId, { action: 'startTTS', data: {...} });

// Dinle
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'startTTS') {
        // İşle
        sendResponse({ status: 'ok' });
    }
});
```

## 🔄 İş Akışı

```
┌─────────────────┐
│  Popup Açılır   │
└────────┬────────┘
         │
         ↓
┌─────────────────────────┐
│ Subtitle Dosyası Yüklenir │
└────────┬────────────────┘
         │
         ↓
┌──────────────────────┐
│ Ayarlar Yapılandırılır │
└────────┬─────────────┘
         │
         ↓
┌────────────────────────────┐
│ "Başla" Butonuna Basılır    │
└────────┬───────────────────┘
         │
         ↓
┌──────────────────────────────────┐
│ Content Script'e Mesaj Gönderilir │
└────────┬───────────────────────┘
         │
         ↓
┌────────────────────────────┐
│ Subtitle'lar Parse Edilir   │
└────────┬───────────────────┘
         │
         ↓
┌──────────────────────────┐
│ Video Zamanı İzlenmeye   │
│ Başlanır (500ms aralığı) │
└────────┬─────────────────┘
         │
         ↓
┌────────────────────────────────┐
│ Mevcut Zaman ile Subtitle      │
│ Eşleştirilir                   │
└────────┬───────────────────────┘
         │
         ↓
┌──────────────────────────┐
│ Web Speech API ile      │
│ Metni Sesli Okur        │
└────────┬─────────────────┘
         │
         ↓
┌────────────────────────┐
│ Monitor UI Güncellenir │
└────────────────────────┘
```

## 🧪 Test Etme

1. **Manifest Doğrulaması**
   - Manifest.json geçerli mi kontrol edin
   - Tüm scriptler belirtilmiş mi

2. **Konsol Hataları**
   - Edge DevTools açın (F12)
   - Console sekmesine bakın
   - Hata mesajlarını inceleyin

3. **Storage Kontrol**
   - DevTools → Storage → Local Storage
   - Kaydedilen verileri gözlemleyin

4. **Mesaj Passing**
   - Content script mesajları alıyor mu
   - Popup'a cevaplar gönderiliyor mu

## 🚀 Dağıtım

### Edge Add-ons Store'a Yükleme

1. Developer hesabı oluşturun
2. Partner Center'da yeni uygulama başlatın
3. Bilgileri doldurun
4. Paket dosyasını yükleyin (.zip)
5. Test ve onay bekleyin

### Paket Oluşturma

```bash
zip -r edgeyotube.zip * -x "*.git*" "node_modules/*" ".DS_Store"
```

## 📦 Gereksinimler

- Microsoft Edge 88+
- Manifest V3 uyumlu
- Modern JavaScript (ES6+)

## 🔒 İzinler Açıklaması

```json
{
  "permissions": ["scripting", "activeTab", "storage"],
  "host_permissions": ["https://www.youtube.com/*"]
}
```

- **scripting**: YouTube sayfasında kod çalıştırmak
- **activeTab**: Açık sekmeye erişmek
- **storage**: Verileri kaydetmek
- **host_permissions**: YouTube'a erişim

## 🎯 Geliştirme İpuçları

1. **Debuging**: `console.log()` kullanın
2. **DevTools**: F12 ile açın
3. **Reload**: Değişiklik sonrası eklentiyi yeniden yükleyin
4. **Network**: Ağ isteklerini kontrol edin

## 📖 Kaynaklar

- [Manifest V3 Docs](https://developer.chrome.com/docs/extensions/mv3/)
- [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)

## 🐛 Bilinen Sorunlar

- Bazı tarayıcılar Web Speech API'yi tam desteklemeyebilir
- Çevrimdışı modda sesli okuma çalışmaz
- Eşzamanlı birden çok subtitle okunamamaz

## ✅ Yapılacak İyileştirmeler

- [ ] SRT dosya formatı desteği
- [ ] Subtitle çevirisi
- [ ] Özel ses seçimi
- [ ] Kayıt ve oynatma geçmişi
- [ ] Gelişmiş ayarlar paneli
- [ ] Ses görselleştiricisi

---

**Geliştirici**: Adem Karaca  
**Versiyon**: 1.0.0
