const apiKey = JSON.stringify(process.env.SHOPIFY_API_KEY);
const isProd = process.env.NODE_ENV === 'production'
module.exports = {
  webpack: (config, { webpack }) => {
    const env = { API_KEY: apiKey };
    config.plugins.push(new webpack.DefinePlugin(env));
    if (isProd) {
      config.plugins.push(new webpack.IgnorePlugin(/pages\/api\/generatePdf.js/))
    }
    return config;
  }
};
