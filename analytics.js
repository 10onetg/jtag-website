const GA_ID = 'G-XXXXXXXXXX';

window.dataLayer = window.dataLayer || [];
window.gtag = function () { window.dataLayer.push(arguments); };
window.jtagTrack = function (name) {
  if (window.jtagAnalyticsReady) window.gtag('event', name);
};

if (/^G-[A-Z0-9]{6,}$/.test(GA_ID) && GA_ID !== 'G-XXXXXXXXXX') {
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
  document.head.appendChild(s);
  window.gtag('js', new Date());
  window.gtag('config', GA_ID);
  window.jtagAnalyticsReady = true;
}
