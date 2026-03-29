import { Color, IRGBA } from '../figmaAPI/apiTypes';

export function convertRgbaToHex(color: Color) {
  const alpha = (color as IRGBA)?.a ?? 1;

  const result = `#${[color.r, color.g, color.b, alpha]
    .map((number) => Math.round(number * 255).toString(16))
    .map((string) => (string.length === 1 ? `0${string}` : string))
    .join('')}`;

  return result;
}
