import isMobile from 'is-mobile';

export const isMobileDevice = navigator?.userAgentData
  ? navigator.userAgentData.mobile
  : isMobile({ ua: navigator.userAgent, tablet: true, featureDetect: true });
