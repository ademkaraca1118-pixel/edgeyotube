# 🎬 YouTube Subtitle TTS (Metin Okuma)

YouTube videolarında subtitle'ları **zaman damgasına göre otomatik olarak sesli okuyan** bir Microsoft Edge eklentisidir.

## ✨ Özellikler

- 📝 **Otomatik Sesli Okuma**: Video oynatılırken subtitle'ları Web Speech API ile sesli okur
- ⏱️ **Zaman Damgası Senkronizasyonu**: Video zamanına göre doğru subtitle'ı seçer
- 🌐 **Çok Dilli Destek**: Türkçe, İngilizce, Almanca, Fransızca, İspanyolca, İtalyanca
- 🎚️ **Ayarlanabilir Hız ve Ses Düzeyi**: Okuma hızını ve ses seviyesini özelleştirebilir
- 🎮 **Kolay Kontrol**: Başlat, Duraklat, Durdur butonları
- 📊 **Canlı İzleme**: Şu anki metni ve zaman damgasını gösterir

## 📥 Kurulum

### 1. Eklentiyi İndir
Projeden dosyaları indirin veya klonlayın.

### 2. Edge'ye Ekle
1. **edge://extensions** adresine gidin
2. Sağ üstte **"Geliştirici modu"** açın
3. **"Paketlenmemiş uzantı yükle"** tıklayın
4. Bu klasörü seçin

### 3. YouTube'a Git
YouTube'da bir video açın ve eklenti hazır!

## 📋 Subtitle Dosyası Formatı

Dosya `.txt` uzantılı olmalı ve şu formatı izlemeli:

```
00:00 - 00:05
Video başlıyor...

00:05 - 00:10
İlk sahne açılıyor...

00:10 - 00:15
Ana karakter görünüyor...
```

**Format açıklaması:**
- `HH:MM:SS` veya `MM:SS` formatında zaman damgası
- Ardından `-` işareti
- Boş satır
- Metin (birden fazla satır olabilir)
- Boş satır
- Sonraki subtitle...

## 🚀 Kullanım

1. **Popup'ı Aç**: Eklenti simgesine tıklayın
2. **Subtitle Yükle**: "Dosya Seç" ile subtitle.txt seçin
3. **Ayarları Yapılandır**:
   - Dili seçin
   - Hızı ayarlayın (0.5x - 2x)
   - Ses düzeyini belirleyin
4. **Başlat**: "▶️ Başla" butonuna basın
5. **Video Oynayın**: YouTube videosunu oynatın
6. **Kontrol**: Gerekirse Duraklat veya Durdur

## 📁 Dosya Yapısı

```
edgeyotube/
├── manifest.json          # Eklenti yapılandırması
├── popup.html            # UI
├── popup.js              # Popup fonksiyonları
├── content-script.js     # YouTube sayfasında çalışan script
├── background.js         # Arka plan hizmet çalışanı
├── utils.js              # Yardımcı fonksiyonlar
├── example-subtitle.txt  # Örnek subtitle dosyası
├── README.md             # Bu dosya
└── images/              # Ikon dosyaları (isteğe bağlı)
```

## 🔧 İşleyiş

1. **Subtitle Yükleme**: Dosya depolama alanına kaydedilir
2. **Video İzleme**: Content script her 500ms video zamanını kontrol eder
3. **Zaman Eşleştirme**: Mevcut zaman damgasında subtitle'ı bulur
4. **Sesli Okuma**: Web Speech API kullanarak metni okur
5. **Senkronizasyon**: Sadece yeni subtitle'ı okumasını sağlar

## 🌍 Desteklenen Diller

- 🇹🇷 Türkçe (tr-TR)
- 🇺🇸 English (en-US)
- 🇩🇪 Deutsch (de-DE)
- 🇫🇷 Français (fr-FR)
- 🇪🇸 Español (es-ES)
- 🇮🇹 Italiano (it-IT)

## ⚙️ Ayarlar

### Hız (Rate)
- **0.5x**: Çok yavaş
- **1x**: Normal (Varsayılan)
- **2x**: Çok hızlı

### Ses Düzeyi (Volume)
- **0%**: Sessiz
- **100%**: Tam sesle (Varsayılan)

### Dil (Language)
6 farklı dil arasından seçim yapabilirsiniz.

## 🐛 Sorun Giderme

### Sesli Okuma Çalışmıyor
- Tarayıcının ses izni olup olmadığını kontrol edin
- Başka bir eklenti de ses okuma yapıyor olabilir
- Sayfayı yenileyin ve tekrar deneyin

### Subtitle'lar Eşleşmiyor
- Subtitle dosya formatını kontrol edin
- Zaman damgalarının doğru olup olmadığını verifikasyon edin
- Video ve subtitle'ların aynı hız ile oynatıldığını kontrol edin

### Eklenti Yüklenmedi
- Geliştirici modu açık olup olmadığını kontrol edin
- Manifest.json dosyasında hata olabilir
- Browser konsolunu açarak hataları kontrol edin

## 📝 Lisans

Bu eklenti açık kaynaktır. Serbestçe kullanabilirsiniz.

## 🤝 Katkı

Hata raporlamaları ve özellik önerileri için GitHub issues açabilirsiniz.

## 📧 İletişim

Sorularınız için GitHub'da issue açın veya pull request gönderin.

---

**Sürüm**: 1.0.0  
**Son Güncelleme**: 2026  
**Uyumluluk**: Microsoft Edge (Chromium-tabanlı)
