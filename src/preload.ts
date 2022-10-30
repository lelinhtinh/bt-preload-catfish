import { addHours, calcSize, isMobileDevice } from './utils';
import { IBannerOptions } from './types';
import * as Cookies from 'js-cookie';
import { debounce } from 'throttle-debounce';

declare global {
  interface JQuery {
    preload(options: IBannerOptions): void;
  }
}

(function ($) {
  $.fn.preload = (options: Omit<IBannerOptions, 'save_state'>) => {
    const settings = $.extend(
      {
        banner_click: null,
        close_click: null,
        width: 625,
        height: 500,
        mobile_only: false,
        limit: 1,
        expires: 36,
      },
      options,
    ) as Required<Omit<IBannerOptions, 'save_state'>>;

    if (settings.mobile_only && !isMobileDevice) {
      return;
    }

    if (settings.limit > 0) {
      settings.limit -= 1;
      let preloadCookie = Cookies.get('preload_banner_limit');
      if (preloadCookie === '-1') {
        Cookies.remove('preload_banner_limit');
        preloadCookie = undefined;
      }
      if (preloadCookie !== undefined) {
        const preloadCookieLimit = parseInt(preloadCookie, 10);
        if (preloadCookieLimit <= 0) return;
        settings.limit = preloadCookieLimit - 1;
      }
    }

    const $overlay = $('<div />', {
      css: {
        display: 'block',
        position: 'fixed',
        width: '100%',
        height: '100%',
        top: 0,
        left: 0,
        zIndex: 2147483647,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
      },
    });

    const $wrapper = $('<div />', {
      css: {
        display: 'block',
        position: 'fixed',
        height: settings.height,
        width: settings.width,
        left: '50%',
        top: '50%',
        marginRight: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 2147483647,
        lineHeight: 1,
      },
    });

    const $close = $('<div />', {
      css: {
        position: 'absolute',
        border: 0,
        top: -30,
        right: 0,
        width: 30,
        height: 30,
        cursor: 'pointer',
        textAlign: 'center',
        lineHeight: 1,
        fontSize: '1.3em',
        padding: '0.35em',
        color: '#005a00',
        background: '#16FF16',
      },
    }).append(
      $('<span />', {
        class: 'glyphicon glyphicon-remove',
      }),
    );

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

    const $body = $('body');
    $body.append($overlay);
    $body.append($wrapper.append($iframe, $close));

    const updateWrapperSize = (
      $wrapper: JQuery,
      settingWidth: number,
      settingHeight: number,
    ) => {
      $wrapper.css(
        calcSize(
          window.outerWidth - 40, // scrollbar width
          window.outerHeight - 200, // floating address bar height
          settingWidth,
          settingHeight,
        ),
      );
    };
    updateWrapperSize($wrapper, settings.width, settings.height);
    $(window).on(
      'resize',
      debounce(
        300,
        () => {
          updateWrapperSize($wrapper, settings.width, settings.height);
        },
        { atBegin: false },
      ),
    );

    const $iframeBody = $iframe.contents().find('body');
    const $image = $('<img />', {
      src: settings.banner_image,
      css: {
        display: 'block',
        position: 'relative',
        border: 0,
        margin: 0,
        lineHeight: 1,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
      },
    });
    $iframeBody.append($image);

    if (settings.banner_click) {
      $image.wrap(
        $('<a />', {
          href: settings.banner_click,
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

    const closeModal = () => {
      $overlay.remove();
      $wrapper.remove();
    };
    $overlay.on('click', closeModal);
    $close.on('click', closeModal);

    Cookies.set('preload_banner_limit', settings.limit.toString(), {
      expires: addHours(settings.expires),
    });
  };
})(jQuery);
