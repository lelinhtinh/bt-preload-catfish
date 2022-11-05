jQuery.fn.catfish({
  banner_image: '/sample/ads.gif',
  banner_click: 'https://blogtruyen.com/',
  width: 400,
  height: 100,
  mobile_only: false,
  limit: 10, // -1 to disable limit
  expires: 24, // hours
  action: 'toggle', // remove | toggle
  save_state: true, // save closed state, ignore if action is 'remove'
});
