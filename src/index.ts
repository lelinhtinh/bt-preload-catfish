import { isMobileDevice } from './utils';
import { ICatfishOptions } from './types';

declare global {
  interface JQuery {
    catfish(options: ICatfishOptions): JQuery;
  }
}

(function ($) {
  const catfish = function (options: ICatfishOptions): JQuery {
    const settings = $.extend(
      {
        mobileOnly: false,
        mobile_width: '100%',
        mobile_height: '10%',
      },
      options,
    ) as ICatfishOptions;

    if (settings.mobileOnly && !isMobileDevice) {
      return this;
    }

    return (this as JQuery).each((i, ele) => {
      $(ele).css({
        width: settings.width,
        height: settings.height,
      });
    });
  };

  $.fn.catfish = catfish;
})(jQuery);
