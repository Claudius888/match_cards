const tintColorLight = '#2f95dc';
const tintColorDark = '#fff';

const _lightPurple = "rgb(177,156,217)";
const _lightYellow = "rgba(255, 255, 0, 0.7)";
const _yellow = "rgba(255, 255, 0, 1)";

export { _lightPurple, _lightYellow, _yellow };

export default {
  light: {
    text: '#000',
    background: '#fff',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#fff',
    background: '#000',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
  },
};
