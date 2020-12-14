import colorsJson from '~/assets/colors.json';

export function generatePalette() {
  const ran = Math.floor(Math.random() * colorsJson.length);

  const palette = colorsJson[ran].map((color) => {
    return '#' + color;
  });

  return palette;
}

export function shadeColor(color, amount) {
  return (
    '#' +
    color
      .replace(/^#/, '')
      .replace(/../g, (color) =>
        (
          '0' +
          Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)
        ).substr(-2)
      )
  );
}
