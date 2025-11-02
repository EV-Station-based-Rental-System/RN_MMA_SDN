export const colors = {
  primary: {
    main: '#000000',      
    light: '#333333',
    dark: '#000000',     
  },

  // Secondary Colors - Màu phụ
  secondary: {
    main: '#FFFFFF',      // Trắng
    light: '#F5F5F5',     // Xám rất nhạt
    dark: '#E0E0E0',      // Xám nhạt
  },

  // Background Colors - Màu nền
  background: {
    default: '#FFFFFF',   // Nền chính
    paper: '#F8F8F8',     // Nền card
    dark: '#1A1A1A',      // Nền tối
    overlay: 'rgba(0, 0, 0, 0.7)', // Overlay cho welcome screen
  },

  // Text Colors - Màu chữ
  text: {
    primary: '#000000',   // Chữ chính
    secondary: '#666666', // Chữ phụ
    disabled: '#999999',  // Chữ disabled
    inverse: '#FFFFFF',   // Chữ trên nền tối
    placeholder: '#AAAAAA', // Placeholder
  },

  // Semantic Colors - Màu theo ngữ nghĩa
  success: '#4CAF50',     // Xanh lá - thành công
  error: '#F44336',       // Đỏ - lỗi
  warning: '#FF9800',     // Cam - cảnh báo
  info: '#2196F3',        // Xanh dương - thông tin

  // Border Colors - Màu viền
  border: {
    light: '#E0E0E0',
    main: '#CCCCCC',
    dark: '#999999',
  },

  // Social/Brand Colors
  brand: {
    apple: '#000000',
    google: '#FFFFFF',
    facebook: '#1877F2',
  },

  // Gradient (cho welcome screen)
  gradient: {
    overlay: ['rgba(0, 0, 0, 0.3)', 'rgba(0, 0, 0, 0.7)'],
    // Primary black gradient - used for buttons / accents where a richer black is desired
    primary: ['#000000', '#1A1A1A'],
  },
} as const;

export type Colors = typeof colors;
