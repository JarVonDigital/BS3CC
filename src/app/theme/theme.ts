// my-theme.ts
import { definePreset } from '@primeuix/themes';
import Aura from '@primeuix/themes/aura';

export const primaryPalette = {
  50:  '#fdf2f1',
  100: '#f9d9d5',
  200: '#f3b6ae',
  300: '#ec9286',
  400: '#e6786b',
  500: '#E06552', // base
  600: '#da5d4a',
  700: '#d15240',
  800: '#c94736',
  900: '#ba3426'
};

export const secondaryPalette = {
  50:  '#fdf2f1',
  100: '#f9d9d5',
  200: '#f3b6ae',
  300: '#ec9286',
  400: '#e6786b',
  500: '#E06552', // base
  600: '#da5d4a',
  700: '#d15240',
  800: '#c94736',
  900: '#ba3426'
};

export const accentPalette = {
  50:  '#e0f5f7',
  100: '#b3e5ea',
  200: '#80d3dc',
  300: '#4dc1ce',
  400: '#26b4c3',
  500: '#087E8B', // base
  600: '#077783',
  700: '#066c78',
  800: '#05626e',
  900: '#034f5b'
};

export const textPalette = {
  50:  '#f2f3f1',
  100: '#d9dcd6',
  200: '#bfc4bb',
  300: '#a5aca0',
  400: '#909889',
  500: '#1E2019', // base
  600: '#1b1d16',
  700: '#181a13',
  800: '#141610',
  900: '#0f110b'
};

export const backgroundPalette = {
  50:  '#ffffff',
  100: '#fdfdf9',
  200: '#fbfbf3',
  300: '#fafaf0',
  400: '#f9f9ec',
  500: '#FAFAED', // base
  600: '#e1e1d5',
  700: '#c8c8bd',
  800: '#aeaea5',
  900: '#8b8b82'
};

// ✅ PrimeNG Preset Theme
export const MyTheme = definePreset(Aura, {
  semantic: {
    primary: primaryPalette,
    secondary: secondaryPalette,
    accent: accentPalette,
    text: textPalette,
    background: backgroundPalette
  },
  components: {}
});
