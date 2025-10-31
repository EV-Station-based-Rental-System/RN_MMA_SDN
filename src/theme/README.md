# Theme System - Qent Car Rental App

Hệ thống theme chuẩn cho React Native Expo App.

## 📁 Cấu trúc

```
src/theme/
├── index.ts          # Main export
├── colors.ts         # Bảng màu
├── typography.ts     # Font và text styles
├── spacing.ts        # Khoảng cách và layout
├── shadows.ts        # Bóng đổ (iOS & Android)
└── globalStyles.ts   # Styles dùng chung
```

## 🎨 Sử dụng

### Import Theme

```tsx
import { theme } from '@/src/theme';
// hoặc
import { colors, typography, spacing, shadows } from '@/src/theme';
```

### Colors

```tsx
import { colors } from '@/src/theme';

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background.default,
  },
  text: {
    color: colors.text.primary,
  },
  button: {
    backgroundColor: colors.primary.main,
  },
});
```

**Available Colors:**
- `colors.primary.*` - Màu chính (đen)
- `colors.secondary.*` - Màu phụ (trắng)
- `colors.background.*` - Màu nền
- `colors.text.*` - Màu chữ
- `colors.success/error/warning/info` - Màu theo ngữ nghĩa
- `colors.border.*` - Màu viền

### Typography

```tsx
import { typography } from '@/src/theme';

const styles = StyleSheet.create({
  heading: typography.h1,
  body: typography.body1,
  button: typography.button,
});
```

**Available Typography:**
- `h1, h2, h3, h4` - Headers
- `body1, body2` - Body text
- `button` - Button text
- `caption` - Small text
- `input` - Input text

### Spacing

```tsx
import { spacing, borderRadius } from '@/src/theme';

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,        // 16px
    marginTop: spacing.lg,      // 24px
    borderRadius: borderRadius.xl, // 16px
  },
});
```

**Spacing Scale:** `xs(4), sm(8), md(16), lg(24), xl(32), 2xl(40), 3xl(48), 4xl(64)`

**Border Radius:** `sm(4), md(8), lg(12), xl(16), 2xl(24), full(9999)`

### Shadows

```tsx
import { shadows } from '@/src/theme';

const styles = StyleSheet.create({
  card: {
    ...shadows.md, // Auto iOS/Android shadow
  },
});
```

**Shadow Levels:** `none, sm, md, lg, xl`

### Global Styles

```tsx
import { globalStyles } from '@/src/theme';

<View style={globalStyles.container} />
<View style={globalStyles.card} />
<TouchableOpacity style={globalStyles.buttonPrimary} />
<TextInput style={globalStyles.input} />
```

## 🎯 Best Practices

1. **Luôn dùng theme constants** thay vì hard-code values
2. **Dùng spacing scale** cho consistency
3. **Tận dụng globalStyles** cho các UI patterns phổ biến
4. **Tránh inline styles** khi có thể

## 📱 Design Tokens

### Color Palette
- **Primary:** #000000 (Black)
- **Text on Dark:** #FFFFFF (White)
- **Background:** #FFFFFF
- **Border:** #E0E0E0

### Font Sizes
- Small: 12-14px
- Base: 16px
- Large: 18-24px
- Headings: 28-48px

### Spacing
- Base unit: 8px
- Scale: 4, 8, 16, 24, 32, 40, 48, 64
