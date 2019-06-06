require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const website = require('./config/website');

const pathPrefix = website.pathPrefix === '/' ? '' : website.pathPrefix;

const {
  NODE_ENV,
  IS_STAGING,
  BASE_URL,
  gatsby_executing_command: GATSBY_CMD,
  USE_ANALYSER
} = process.env;

// Robots txt warning on build
if (IS_STAGING && NODE_ENV !== 'development') {
  console.log("\x1b[41m%s\x1b[0m" , 'blocking search engines, change IS_STAGING env variable to prevent this');
}
if (!IS_STAGING && NODE_ENV !== 'development') {
  console.log("\x1b[42m%s\x1b[0m" , 'visible to search engines, change IS_STAGING env variable to prevent this');
}

if (GATSBY_CMD !== 'serve') {
  // Env variable check
  const requiredEnvVariables = ['BASE_URL'];
  requiredEnvVariables.map((item) => {
    if (!process.env[item]) {
      throw Error(`Set ${item} env variable, ensure you have created .env.development and .env.production based on .env.template`);
    }
    return null;
  });
}

module.exports = {
  /* General Information */
  pathPrefix: website.pathPrefix,
  siteMetadata: {
    siteUrl: BASE_URL + pathPrefix,
    functionsUrl: `${NODE_ENV === 'development' ? BASE_URL.replace('8000', '9000') : BASE_URL}/.netlify/functions`,
    pathPrefix,
    title: website.title,
    description: website.description,
    banner: website.banner,
    headline: website.headline,
    siteLanguage: website.siteLanguage,
    ogLanguage: website.ogLanguage,
    author: website.author,
    twitter: website.twitter,
    facebook: website.facebook,
    pwaShortName: website.shortName,
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
      resolve: 'gatsby-source-filesystem',
      options: {
        name: 'src',
        path: `${__dirname}/src/`,
      },
    },
    {
      resolve: 'gatsby-plugin-canonical-urls',
      options: {
        siteUrl: BASE_URL,
      },
    },
    {
      resolve: 'gatsby-plugin-sitemap',
      options: {
        output: '/sitemap.xml',
        exclude: ['/preview/*'],
      },
    },
    {
      resolve: 'gatsby-plugin-robots-txt',
      options: {
        host: null,
        sitemap: null,
        configFile: IS_STAGING ? 'robots-txt.staging.js' : 'robots-txt.production.js'
      }
    },
    {
      resolve: `gatsby-plugin-google-tagmanager`,
      options: {
        id: website.googleTagManagerId,

        // Include GTM in development.
        // Defaults to false meaning GTM will only be loaded in production.
        includeInDevelopment: false,

        // Specify optional GTM environment details.
        // gtmAuth: "YOUR_GOOGLE_TAGMANAGER_ENVIROMENT_AUTH_STRING",
        // gtmPreview: "YOUR_GOOGLE_TAGMANAGER_ENVIROMENT_PREVIEW_NAME",
      },
    },
    'gatsby-plugin-sharp',
    'gatsby-transformer-sharp',
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: website.title,
        short_name: website.shortName,
        description: website.description,
        start_url: pathPrefix,
        background_color: website.backgroundColor,
        theme_color: website.themeColor,
        display: 'standalone',
        icon: website.favicon,
      },
    },
    {
      resolve: 'gatsby-plugin-webpack-bundle-analyzer',
      options: {
          analyzerPort: NODE_ENV === 'development' ? 8002 : 9002,
          production: true,
          disable: !USE_ANALYSER || USE_ANALYSER === 'false'
      },
    },
    'gatsby-plugin-offline',
    'gatsby-plugin-brotli',
    'gatsby-plugin-netlify-cache',
    'gatsby-plugin-netlify', // make sure to keep it last in the array
  ],
}
