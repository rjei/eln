# 🎮 English Wordle - Animasi & Efek

## ✨ Daftar Animasi yang Ditambahkan

### 1. **Flip Animation** 🔄

- **Kapan**: Saat tile reveal setelah submit guess
- **Efek**: Kartu flip 3D dengan rotasi X-axis
- **Durasi**: 0.6 detik per tile
- **Delay**: 300ms antar tile (cascade effect)

### 2. **Shake Animation** 🤝

- **Kapan**: Saat input tidak valid (< 5 huruf)
- **Efek**: Seluruh row bergoyang kiri-kanan
- **Durasi**: 0.5 detik

### 3. **Pop Animation** 🎯

- **Kapan**: Saat mengetik huruf
- **Efek**: Tile membesar sedikit (scale 1.05)
- **Durasi**: 0.2 detik

### 4. **Bounce-In Animation** 📥

- **Kapan**: Huruf muncul di tile
- **Efek**: Scale dari 0 ke 1.2 lalu ke 1
- **Durasi**: 0.3 detik

### 5. **Confetti Particles** 🎉

- **Kapan**: Saat menang
- **Efek**: 50 partikel warna-warni jatuh dari atas
- **Warna**: 6 warna random (red, yellow, green, blue, purple, pink)
- **Fisika**: Gravitasi + velocity horizontal

### 6. **Pulse Animation** 💫

- **Kapan**: Current cell yang aktif
- **Efek**: Ring biru berkedip
- **Durasi**: Infinite

### 7. **Bounce Animation** 🏀

- **Kapan**: Emoji status saat menang
- **Efek**: Bounce vertical infinite
- **Durasi**: 1 detik per cycle

### 8. **Slide-Up Animation** ⬆️

- **Kapan**: Game over message muncul
- **Efek**: Slide dari bawah dengan fade in
- **Durasi**: 0.5 detik

### 9. **Gradient Animation** 🌈

- **Kapan**: Judul "English Wordle"
- **Efek**: Gradient bergerak animasi
- **Durasi**: 3 detik infinite

### 10. **Blob Animation** 🫧

- **Kapan**: Background shapes
- **Efek**: Floating dan morphing shapes
- **Durasi**: 7 detik infinite

### 11. **Card Bounce** 🎴

- **Kapan**: Stats cards saat menang
- **Efek**: Bounce dengan staggered delay
- **Durasi**: 1 detik infinite

### 12. **Button Hover Effects** 🔘

- Scale transform (1.05-1.1)
- Shadow elevation
- Smooth transitions
- Active state (scale 0.95)

## 🎨 Visual Enhancements

### Color System

- **Correct**: Green (#10b981) + shadow
- **Present**: Yellow (#f59e0b) + shadow
- **Absent**: Gray (#9ca3af) + shadow
- **Empty**: White + border

### Gradients

- Background: Purple → Blue → Green
- Title: Purple → Blue → Green (animated)
- Game over card: Purple → Blue

### Shadows & Depth

- Cards: xl shadow (hover: 2xl)
- Tiles: md shadow (revealed: lg)
- Buttons: md shadow (hover: lg)

## 🔧 Technical Details

### CSS Classes Added

```css
.animate-flip          /* Tile reveal flip */
/* Tile reveal flip */
.animate-shake         /* Invalid input shake */
.animate-pop           /* Letter entry pop */
.animate-bounce-in     /* Letter appearance */
.animate-slide-up      /* Game over message */
.animate-fade-in       /* Fade transitions */
.animate-pulse-slow    /* Slow pulse effect */
.animate-bounce-slow   /* Slow bounce effect */
.animate-blob          /* Background blobs */
.animate-gradient; /* Gradient animation */
```

### Animation Delays

- `.animation-delay-100` - 100ms
- `.animation-delay-200` - 200ms
- `.animation-delay-2000` - 2s
- `.animation-delay-4000` - 4s

## 🎮 User Experience

### Visual Feedback

1. **Typing**: Instant pop animation
2. **Invalid input**: Shake dengan toast error
3. **Reveal**: Sequential flip dengan suspense
4. **Win**: Confetti + bounce + gradient
5. **Hover**: Semua element interactive

### Performance

- CSS animations (GPU accelerated)
- No JS animation libraries needed
- Smooth 60fps transitions
- Optimized particle system

## 📱 Responsive

- Semua animasi responsive
- Mobile-friendly touch feedback
- Smooth di semua device sizes

## 🎯 Next Level Ideas

- Sound effects
- Haptic feedback (mobile)
- More particle types
- Win streak animations
- Daily challenge mode
- Leaderboard entrance animations
