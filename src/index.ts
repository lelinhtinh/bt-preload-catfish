import { isMobileDevice } from './utils';
import { ICatfishOptions } from './types';
import * as Cookies from 'js-cookie';

declare global {
  interface JQuery {
    catfish(options: ICatfishOptions): void;
  }
}

(function ($) {
  $.fn.catfish = (options: ICatfishOptions) => {
    const settings = $.extend(
      {
        catfish_click: null,
        close_click: null,
        width: 400,
        height: 100,
        mobile_width: '100vw',
        mobile_height: '10vh',
        mobileOnly: false,
        limit: 1,
        expires: 36,
      },
      options,
    ) as Required<ICatfishOptions>;

    if (settings.mobileOnly && !isMobileDevice) {
      return;
    }

    settings.limit -= 1;
    const catfishCookie = Cookies.get('catfish_preload');
    if (catfishCookie !== undefined) {
      const catfishCookieLimit = parseInt(catfishCookie, 10);
      if (catfishCookieLimit <= 0) return;
      settings.limit = catfishCookieLimit - 1;
    }

    const width =
      isMobileDevice && settings.mobile_width
        ? settings.mobile_width
        : settings.width;
    const height =
      isMobileDevice && settings.mobile_height
        ? settings.mobile_height
        : settings.height;

    const $wrapper = $('<div />', {
      css: {
        display: 'block',
        position: 'fixed',
        zIndex: 2147483647,
        left: '50%',
        bottom: 0,
        marginRight: '-50%',
        transition: 'transform ease-in-out 0.4s',
        transform: 'translate(-50%, 0)',
        height,
        width,
        lineHeight: 1,
      },
    });

    const $close = $('<div />', {
      css: {
        position: 'absolute',
        border: 0,
        top: -30,
        left: '50%',
        marginLeft: -15,
        width: 30,
        height: 30,
        cursor: 'pointer',
        textAlign: 'center',
        lineHeight: 1,
        padding: '0.25em',
        fontSize: '1.5em',
        color: 'red',
        transition: 'transform ease-in-out 0.4s',
        transform: 'rotateX(0deg)',
      },
    }).append(
      $('<span />', {
        class: 'glyphicon glyphicon-menu-down',
      }),
    );
    $close.on('click', () => {
      if ($close.css('transform') === 'matrix(1, 0, 0, 1, 0, 0)') {
        $close.css('transform', 'rotateX(180deg)');
        $wrapper.css('transform', 'translate(-50%, 100%)');
      } else {
        $close.css('transform', 'rotateX(0deg)');
        $wrapper.css('transform', 'translate(-50%, 0)');
      }
    });

    const $iframe = $('<iframe />', {
      css: {
        overflow: 'hidden',
        display: 'block',
        position: 'relative',
        border: 0,
        margin: 0,
        lineHeight: 1,
        width: '100%',
        height: '100%',
      },
      scrolling: 0,
      marginwidth: 0,
      marginheight: 0,
      frameborder: 0,
    });
    $('body').append($wrapper.append($close, $iframe));

    const wrapperSize = $wrapper.get(0).getBoundingClientRect();
    const wrapperWidth =
      wrapperSize.width > window.outerWidth
        ? window.outerWidth
        : wrapperSize.width;
    const catfishMaxHeight = (window.outerHeight * 10) / 100;
    const wrapperHeight =
      wrapperSize.height > catfishMaxHeight
        ? catfishMaxHeight
        : wrapperSize.height;
    $wrapper.css({
      width: wrapperWidth,
      height: wrapperHeight,
    });

    const $iframeBody = $iframe.contents().find('body');
    const $image = $('<img />', {
      src: settings.catfish_src,
      css: {
        display: 'block',
        position: 'relative',
        border: 0,
        margin: 0,
        lineHeight: 1,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
      },
    });
    $iframeBody.append($image);

    if (settings.catfish_click) {
      $image.wrap(
        $('<a />', {
          href: settings.catfish_click,
          target: '_blank',
        }),
      );
    }

    if (settings.close_click) {
      $close.wrap(
        $('<a />', {
          href: settings.close_click,
          target: '_blank',
        }),
      );
    }

    const limitByHours = new Date(
      new Date().getTime() + settings.expires * 60 * 60 * 1000,
    );
    Cookies.set('catfish_preload', settings.limit.toString(), {
      expires: limitByHours,
    });
  };
})(jQuery);
