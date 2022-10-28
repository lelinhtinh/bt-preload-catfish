import { addHours, isMobileDevice } from './utils';
import { ICatfishOptions } from './types';
import * as Cookies from 'js-cookie';
import { updateWrapperSize } from './helpers';
import { debounce } from 'throttle-debounce';

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
        mobile_only: false,
        status: false,
        limit: 1,
        expires: 36,
      },
      options,
    ) as Required<ICatfishOptions>;

    if (settings.mobile_only && !isMobileDevice) {
      return;
    }

    if (settings.limit > 0) {
      settings.limit -= 1;
      let catfishCookie = Cookies.get('catfish_preload');
      if (catfishCookie === '-1') {
        Cookies.remove('catfish_preload');
        catfishCookie = undefined;
      }
      if (catfishCookie !== undefined) {
        const catfishCookieLimit = parseInt(catfishCookie, 10);
        if (catfishCookieLimit <= 0) return;
        settings.limit = catfishCookieLimit - 1;
      }
    }

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
        height: settings.height,
        width: settings.width,
        lineHeight: 1,
      },
    });

    const $close = $('<div />', {
      css: {
        position: 'absolute',
        border: 0,
        top: -25,
        left: '50%',
        marginLeft: -30,
        width: 60,
        height: 25,
        cursor: 'pointer',
        textAlign: 'center',
        lineHeight: 1,
        fontSize: '1.5em',
        color: '#005a00',
        background: '#16FF16',
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
        settings.status && Cookies.set('catfish_preload_closed', 'true');
      } else {
        $close.css('transform', 'rotateX(0deg)');
        $wrapper.css('transform', 'translate(-50%, 0)');
        settings.status && Cookies.remove('catfish_preload_closed');
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

    $('body').append($wrapper.append($iframe, $close));
    if (settings.status && Cookies.get('catfish_preload_closed')) {
      $close.trigger('click');
    }

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

    Cookies.set('catfish_preload', settings.limit.toString(), {
      expires: addHours(settings.expires),
    });
  };
})(jQuery);
