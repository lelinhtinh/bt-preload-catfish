import { addHours, calcSize, isMobileDevice } from './utils';
import { IBannerOptions } from './types';
import * as Cookies from 'js-cookie';
import { debounce } from 'throttle-debounce';

declare global {
  interface JQuery {
    catfish(options: IBannerOptions): void;
  }
}

(function ($) {
  $.fn.catfish = (options: IBannerOptions) => {
    const settings = $.extend(
      {
        banner_click: null,
        close_click: null,
        width: 400,
        height: 100,
        mobile_only: false,
        limit: 1,
        expires: 36,
        save_state: false,
        action: 'toggle',
      },
      options,
    ) as Required<IBannerOptions>;

    if (settings.mobile_only && !isMobileDevice) {
      return;
    }

    const catfishCookieClose = Cookies.get('catfish_banner_closed');
    if (settings.limit > 0) {
      settings.limit -= 1;
      let catfishCookie = Cookies.get('catfish_banner_limit');
      if (catfishCookie === '-1') {
        Cookies.remove('catfish_banner_limit');
        catfishCookie = undefined;
      }
      if (catfishCookie !== undefined) {
        const catfishCookieLimit = parseInt(catfishCookie, 10);
        if (catfishCookieLimit <= 0) return;
        settings.limit = catfishCookieLimit - 1;
      }
    } else {
      if (catfishCookieClose && settings.action === 'remove') return;
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
        top: -20,
        left: '50%',
        marginLeft: -25,
        width: 50,
        height: 20,
        cursor: 'pointer',
        textAlign: 'center',
        lineHeight: 1,
        fontSize: '1.3em',
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
        if (settings.save_state) {
          if (
            (settings.limit === -1 && !catfishCookieClose) ||
            (settings.limit !== -1 && settings.action === 'toggle')
          ) {
            Cookies.set('catfish_banner_closed', 'true', {
              expires: addHours(settings.expires),
            });
          }
        }
        if (settings.action === 'remove') {
          setTimeout(() => {
            $wrapper.remove();
          }, 400);
        }
      } else {
        $close.css('transform', 'rotateX(0deg)');
        $wrapper.css('transform', 'translate(-50%, 0)');
        settings.save_state && Cookies.remove('catfish_banner_closed');
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
    if (
      settings.save_state &&
      catfishCookieClose &&
      settings.action === 'toggle'
    ) {
      $close.trigger('click');
    }

    const updateWrapperSize = (
      $wrapper: JQuery,
      settingWidth: number,
      settingHeight: number,
    ) => {
      $wrapper.css(
        calcSize(
          window.outerWidth,
          window.outerHeight / 2,
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
        objectFit: 'cover',
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

    Cookies.set('catfish_banner_limit', settings.limit.toString(), {
      expires: addHours(settings.expires),
    });
  };
})(jQuery);
