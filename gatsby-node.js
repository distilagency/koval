require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const path = require('path');
const { createFilePath } = require('gatsby-source-filesystem');
const { paginate } = require('gatsby-awesome-pagination');

const { WORDPRESS_PROTOCOL, WORDPRESS_URL, BLOG_SLUG, HOME_SLUG, IS_STAGING } = process.env;
const wordPressUrl = `${WORDPRESS_PROTOCOL}://${WORDPRESS_URL}`;

const getOnlyPublished = edges => edges.filter(({ node }) => {
  if (IS_STAGING === true) return node.status === 'staging' || node.status === 'publish';
  return node.status === 'publish';
});

exports.createPages = ({ actions, graphql }) => {
  const { createPage } = actions

  return graphql(`
    {
      allWordpressPage {
        edges {
          node {
            id
            link
            slug
            status
            acf {
              layout: layout_page {
                __typename
              }
            }
          }
        }
      }
    }
  `)
    .then(result => {
      if (result.errors) {
        result.errors.forEach(e => console.error(e.toString()))
        return Promise.reject(result.errors)
      }

      const pageTemplate = path.resolve(`./src/templates/page.js`)

      // Only publish pages with a `status === 'publish'` in production. This
      // excludes drafts, future posts, etc. They will appear in development,
      // but not in a production build.

      const allPages = result.data.allWordpressPage.edges
      const pages =
        process.env.NODE_ENV === 'production'
          ? getOnlyPublished(allPages)
          : allPages
      if (!pages.find(({ node: page }) => page.slug === HOME_SLUG)) {
        console.log("\x1b[41m%s\x1b[0m", `Please create page with slug '${HOME_SLUG}'`);
        process.exit(1);
      }
      // Call `createPage()` once per WordPress page
      pages.forEach(({ node: page }) => {
        const splat = page.link.replace(wordPressUrl, '');
        // Only create the page if it contains ACF components
        if (page.acf !== null) {
          createPage({
            path: splat,
            component: pageTemplate,
            context: {
              id: page.id,
            },
          })
        }
      })
    })
    .then(() => {
      return graphql(`
        {
          allWordpressPost {
            edges {
              node {
                id
                slug
                status
              }
            }
          }
        }
      `)
    })
    .then(result => {
      if (result.errors) {
        result.errors.forEach(e => console.error(e.toString()))
        return Promise.reject(result.errors)
      }

      const postTemplate = path.resolve(`./src/templates/post.js`)
      const blogTemplate = path.resolve(`./src/templates/blog.js`)

      // In production builds, filter for only published posts.
      const allPosts = result.data.allWordpressPost.edges
      const posts =
        process.env.NODE_ENV === 'production'
          ? getOnlyPublished(allPosts)
          : allPosts

      // Iterate over the array of posts
      posts.forEach(({ node: post }) => {
        // Create the Gatsby page for this WordPress post
        createPage({
          path: `/${post.slug}/`,
          component: postTemplate,
          context: {
            id: post.id,
          },
        })
      })

      // Create a paginated blog, e.g., /, /page/2, /page/3
      paginate({
        createPage,
        items: posts,
        itemsPerPage: 10,
        pathPrefix: ({ pageNumber }) => (pageNumber === 0 ? `/${BLOG_SLUG}` : `/${BLOG_SLUG}/page`),
        component: blogTemplate,
      })
    })
    .then(() => {
      return graphql(`
        {
          allWordpressCategory {
            edges {
              node {
                id
                name
                link
                slug
              }
            }
          }
        }
      `)
    })
    .then(result => {
      if (result.errors) {
        result.errors.forEach(e => console.error(e.toString()))
        return Promise.reject(result.errors)
      }

      const categoriesTemplate = path.resolve(`./src/templates/category.js`)

      // Create a Gatsby page for each WordPress Category
      result.data.allWordpressCategory.edges.forEach(({ node: cat }) => {
        const splat = cat.link.replace(wordPressUrl, '');
        createPage({
          path: splat,
          component: categoriesTemplate,
          context: {
            name: cat.name,
            slug: cat.slug,
          },
        })
      })
    })
}

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
