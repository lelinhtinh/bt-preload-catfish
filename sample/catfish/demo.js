jQuery.fn.catfish({
  banners: [
    {
      image: '/sample/ads-1.gif',
      link: 'https://blogtruyen.com/',
    },
    {
      image: '/sample/ads-3.gif',
      link: 'https://m.blogtruyen.com/',
    },
  ],
  width: 400,
  height: 200,
  mobile_only: false,
  limit: 10, // -1 to disable limit
  expires: 24, // hours
  action: 'toggle', // remove | toggle
  save_state: true, // save closed state, ignore if action is 'remove'
});
