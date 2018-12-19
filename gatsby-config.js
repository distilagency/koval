require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const {
  NODE_ENV,
  IS_STAGING,
  BASE_URL = "(set BASE_URL env variable)"
} = process.env;

// Robots txt warning on build
if (IS_STAGING && NODE_ENV !== 'development') {
  // eslint-disable-next-line
  console.log("\x1b[41m" ,`${BASE_URL} is blocking search engines, change IS_STAGING env variable to prevent this`);
}
if (!IS_STAGING && NODE_ENV !== 'development') {
  // eslint-disable-next-line
  console.log("\x1b[42m" ,`${BASE_URL} is visible to search engines, change IS_STAGING env variable to prevent this`);
}

module.exports = {
  siteMetadata: {
    title: 'Gatsby + WordPress Starter',
  },
  plugins: [
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-plugin-sass',
      options: {
        data: '@import "resources.scss";',
        includePaths: [
          'src/sass/base',
        ],
      },
    },
    {
      resolve: 'gatsby-source-wordpress',
      options: {
        // The base url to your WP site.
        baseUrl: 'capitalpartners.wp.birdbrain.io',
        // WP.com sites set to true, WP.org set to false
        hostingWPCOM: false,
        // The protocol. This can be http or https.
        protocol: 'https',
        // Use 'Advanced Custom Fields' Wordpress plugin
        useACF: true,
        auth: {},
        // Set to true to debug endpoints on 'gatsby build'
        verboseOutput: false,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: 'src',
        path: `${__dirname}/src/`,
      },
    },
    {
      resolve: 'gatsby-plugin-html-attributes',
      options: {
        lang: 'en'
      }
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    'gatsby-plugin-purgecss',
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: null,
        sitemap: null,
        configFile: IS_STAGING ? 'robots-txt.staging.js' : 'robots-txt.production.js'
      }
    },
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'Koval - Gatsby Wordpress',
        short_name: 'Koval',
        start_url: '/',
        background_color: '#000000',
        theme_color: '#000000',
        display: 'standalone',
        icon: 'src/images/logo.png',
      },
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-brotli',
    'gatsby-plugin-netlify', // make sure to keep it last in the array
  ],
}
