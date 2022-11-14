import { addHours, calcSize, isMobileDevice } from './utils';
import { IBannerOptions } from './types';
import * as Cookies from 'js-cookie';
import { debounce } from 'throttle-debounce';

export type CatfishOptions = Omit<
  IBannerOptions,
  'banner_image' | 'banner_click'
> & {
  banners: {
    image: string;
    link: string;
  }[];
};

declare global {
  interface JQuery {
    catfish(options: CatfishOptions): void;
  }
}

(function ($) {
  const namespace = 'catfish';

  $.fn[namespace] = (options: CatfishOptions) => {
    const settings = $.extend(
      {
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
    ) as Required<CatfishOptions>;

    if (settings.mobile_only && !isMobileDevice) {
      return;
    }

    const bannerCookieClose = Cookies.get(`${namespace}_banner_closed`);
    if (settings.limit > 0) {
      settings.limit -= 1;
      let bannerCookie = Cookies.get(`${namespace}_banner_limit`);
      if (bannerCookie === '-1') {
        Cookies.remove(`${namespace}_banner_limit`);
        bannerCookie = undefined;
      }
      if (bannerCookie !== undefined) {
        const bannerCookieLimit = parseInt(bannerCookie, 10);
        if (bannerCookieLimit <= 0) return;
        settings.limit = bannerCookieLimit - 1;
      }
    } else {
      if (bannerCookieClose && settings.action === 'remove') return;
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
            (settings.limit === -1 && !bannerCookieClose) ||
            (settings.limit !== -1 && settings.action === 'toggle')
          ) {
            Cookies.set(`${namespace}_banner_closed`, 'true', {
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
        settings.save_state && Cookies.remove(`${namespace}_banner_closed`);
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

    $wrapper.append($iframe, $close);
    const $body = $('html');
    $body.append($wrapper);

    if (
      settings.save_state &&
      bannerCookieClose &&
      settings.action === 'toggle'
    ) {
      $close.trigger('click');
    }

    const $window = $(window);
    const updateWrapperSize = () => {
      $wrapper.css(
        calcSize(
          $window.width(),
          $window.height() / 2,
          settings.width,
          settings.height,
        ),
      );
    };
    setTimeout(updateWrapperSize, 0);
    $window.on(
      'resize',
      debounce(
        300,
        () => {
          updateWrapperSize();
        },
        { atBegin: false },
      ),
    );
    $(document).on('visibilitychange', () => {
      if (!document.hidden) updateWrapperSize();
    });

    function addIframeContent() {
      const $iframeBody = $iframe.contents().find('body');
      const bannerHeight = `${100 / settings.banners.length}%`;

      settings.banners.forEach(({ image, link }) => {
        const $image = $('<img />', {
          src: image,
          css: {
            display: 'block',
            position: 'relative',
            border: 0,
            margin: 0,
            lineHeight: 1,
            width: '100%',
            height: bannerHeight,
            objectFit: 'cover',
          },
        });
        const $link = $('<a />', {
          href: link,
          target: '_blank',
        });
        $iframeBody.append($link.append($image));
      });
    }

    addIframeContent();
    (function infinityLoop() {
      const noDelay = setTimeout(() => {
        clearTimeout(noDelay);
        if (!$wrapper.is(':nth-last-child(1)')) {
          $body.append($wrapper);
          addIframeContent();
        }
        infinityLoop();
      }, 0);
    })();

    if (settings.close_click) {
      $close.wrap(
        $('<a />', {
          href: settings.close_click,
          target: '_blank',
        }),
      );
    }

    Cookies.set(`${namespace}_banner_limit`, settings.limit.toString(), {
      expires: addHours(settings.expires),
    });
  };
})(jQuery);
