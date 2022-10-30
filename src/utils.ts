import isMobile from 'is-mobile';

export const isMobileDevice = isMobile({
  ua: navigator.userAgent,
  tablet: true,
  featureDetect: true,
});

export function addHours(hours: number): Date {
  return new Date(new Date().getTime() + hours * 60 * 60 * 1000);
}

export function sizeByRatio(
  baseWidth: number,
  baseHeight: number,
  sizeType: 'width' | 'height',
  sizeValue: number,
): number {
  if (sizeType === 'width') {
    return (baseHeight * sizeValue) / baseWidth;
  }
  return (baseWidth * sizeValue) / baseHeight;
}

export function calcSize(
  maxWidth: number,
  maxHeight: number,
  settingWidth: number,
  settingHeight: number,
) {
  let temp = { width: settingWidth, height: settingHeight };

  if (temp.width > maxWidth) {
    temp = {
      width: maxWidth,
      height: sizeByRatio(settingWidth, settingHeight, 'width', maxWidth),
    };
  }
  if (temp.height > maxHeight) {
    temp = {
      width: sizeByRatio(settingWidth, settingHeight, 'height', maxHeight),
      height: maxHeight,
    };
  }
  if (temp.width > maxWidth) {
    temp = {
      width: maxWidth,
      height: sizeByRatio(settingWidth, settingHeight, 'width', maxWidth),
    };
  }

  return temp;
}
