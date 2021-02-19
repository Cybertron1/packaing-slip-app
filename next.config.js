const webpack = require("webpack");
const apiKey = JSON.stringify(process.env.SHOPIFY_API_KEY);
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
const isProd = process.env.NODE_ENV === 'production'
module.exports = withBundleAnalyzer({
  webpack: config => {
    const env = { API_KEY: apiKey };
    config.plugins.push(new webpack.DefinePlugin(env));
    if (isProd) {
      config.plugins.push(new webpack.IgnorePlugin(/pages\/api\/generatePdf.js/))
    }
    return config;
  }
});
