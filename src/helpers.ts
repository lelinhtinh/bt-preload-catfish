import { calcSize } from './utils';

export function updateWrapperSize(
  $wrapper: JQuery,
  settingWidth: number,
  settingHeight: number,
) {
  const wrapperSize = $wrapper.get(0).getBoundingClientRect();
  $wrapper.css(
    calcSize(
      wrapperSize.width,
      wrapperSize.height,
      window.outerWidth,
      window.outerHeight / 2,
      settingWidth,
      settingHeight,
    ),
  );
}
