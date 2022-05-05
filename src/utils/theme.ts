import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const colors = {
  brand: {
    50: '#dbfff9',
    100: '#aeffed',
    200: '#7ffddc',
    300: '#4ffdc8',
    400: '#25fcc8',
    500: '#12e3bb',
    600: '#02b09f',
    700: '#007e79',
    800: '#004c4d',
    900: '#001a1b',
  },
  bg: {
    lightest: '#242D2E',
    lighter: '#1f2728',
    light: '#181e1f',
    regular: '#121717',
  },
  'vd-gray': {
    50: '#ebf4f9',
    100: '#d4dcdd',
    200: '#bac4c6',
    300: '#a0adaf',
    400: '#859698',
    500: '#6c7d7f',
    600: '#536162',
    700: '#3b4547',
    800: '#222a2b',
    900: '#031010',
  },
};

const theme = extendTheme({ config, colors, });

export default theme;
