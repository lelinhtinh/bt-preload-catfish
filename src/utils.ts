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
  width: number,
  height: number,
  maxWidth: number,
  maxHeight: number,
  settingWidth: number,
  settingHeight: number,
) {
  let temp = {
    width: width < settingWidth ? settingWidth : width,
    height: height < settingHeight ? settingHeight : height,
  };

  if (temp.width > maxWidth) {
    temp = {
      width: maxWidth,
      height: sizeByRatio(width, height, 'width', maxWidth),
    };
  }
  if (temp.height > maxHeight) {
    temp = {
      width: sizeByRatio(width, height, 'height', maxHeight),
      height: maxHeight,
    };
  }

  return {
    width: temp.width > maxWidth ? maxWidth : temp.width,
    height: temp.height > maxHeight ? maxHeight : temp.height,
  };
}
