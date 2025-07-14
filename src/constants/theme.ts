import colors from '../shared/colors.json';

export const sizes = {
  paddingSmall: '2px',
  paddingMedium: '6px',

  gapSmall: '2px',
  gapMedium: '4px',
  gapLarge: '6px',

  borderRadiusSmall: '6px',
  borderRadiusMedium: '8px',
  borderRadiusLarge: '14px',

  headerButtonSize: '13px',
  inputWidth: '32px',
  inputHeight: '24px',
};

export const typography = {
  fontFamily: 'bitdust1, monospace',
  fontSize: {
    small: '16px',
    medium: '28px',
  },
  fontWeight: {
    normal: 'normal',
    bold: 'bold',
  },
};

export const animations = {
  transition: {
    fast: '0.2s',
    medium: '0.5s',
  },
};

export const theme = {
  colors,
  sizes,
  typography,
  animations,
};
