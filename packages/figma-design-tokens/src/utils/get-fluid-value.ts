/**
 * Calculates a fluid font size value based on the provided parameters.
 * @param maxFontSize - The maximum font size in pixels.
 * @param minFontSize - The minimum font size in pixels.
 * @param baseFontSize - The base font size in pixels. Defaults to 16px.
 * @param contentMinWidth - The minimum content width in pixels. Defaults to 375px.
 * @param contentMaxWidth - The maximum content width in pixels. Defaults to 1280px.
 * @returns A CSS value representing the calculated fluid font size.
 * @description
 * - This function is used to calculate the clamp value based on the breakpoints.
 * - If the value is greater than the desktopSize, then it will return the desktopSize value.
 * - We use REM values to support browser accessibility.
 */
export function getFluidValue(
  maxFontSize: number,
  minFontSize: number,
  baseFontSize = 16,
  contentMinWidth = 375,
  contentMaxWidth = 1280
) {
  const removeTrailingZeros = /\.?0+$/;
  const fontSizeRange = maxFontSize - minFontSize;
  const widthRange = contentMaxWidth - contentMinWidth;
  const slope = fontSizeRange / widthRange;
  const intercept = maxFontSize - slope * contentMaxWidth;

  const minSize = `${(minFontSize / baseFontSize)
    .toFixed(3)
    .replace(removeTrailingZeros, '')}rem`;
  const fluidSize = `${slope * 100}vw + ${(intercept / baseFontSize)
    .toFixed(3)
    .replace(removeTrailingZeros, '')}rem`;
  const maxSize = `${(maxFontSize / baseFontSize)
    .toFixed(3)
    .replace(removeTrailingZeros, '')}rem`;

  const fontSize = `clamp(${minSize}, ${fluidSize}, ${maxSize})`;
  return fontSize;
}
