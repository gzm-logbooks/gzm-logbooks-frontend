module.exports = {
  pwa: {
    workboxOptions: {
      skipWaiting: true,
      navigateFallback: '/index.html',
      exclude: [/_redirects/],
    },
  },
};
