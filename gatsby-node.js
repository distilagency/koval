require('dotenv').config({
  path: `.env.${process.env.NODE_ENV}`,
});

const path = require('path');
const { paginate } = require('gatsby-awesome-pagination');

const {
  WORDPRESS_PROTOCOL,
  WORDPRESS_URL,
  BLOG_SLUG,
  HOME_SLUG,
  POSTS_PER_PAGE,
  IS_STAGING
} = process.env;

const wordPressUrl = `${WORDPRESS_PROTOCOL}://${WORDPRESS_URL}`;

const getOnlyPublished = edges => edges.filter(({ node }) => {
  if (IS_STAGING) return node.status === 'staging' || node.status === 'publish';
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
        });
      }
    })
    // Create blank page for previews base
    // Use data from existing page as this will be replaced by previewable content
    createPage({
      path: 'preview/page',
      component: pageTemplate,
      context: {
        id: "",
      },
    });
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
        path: `/${BLOG_SLUG}/${post.slug}/`,
        component: postTemplate,
        context: {
          id: post.id,
        },
      })
    })
    // Create blank post for previews base
    // Use data from existing post as this will be replaced by previewable content
    createPage({
      path: 'preview/post',
      component: postTemplate,
      context: {
        id: "",
      },
    });

    // Create a paginated blog, e.g., /, /page/2, /page/3
    paginate({
      createPage,
      items: posts,
      itemsPerPage: parseInt(POSTS_PER_PAGE, 10),
      pathPrefix: ({ pageNumber }) => (pageNumber === 0 ? `/${BLOG_SLUG}` : `/${BLOG_SLUG}/page`),
      component: blogTemplate,
    })
  })
  .then(() => {
    return graphql(`
      {
        allWordpressCategory(filter: { count: { gt: 0 } }) {
          edges {
            node {
              id
              wordpress_id
              name
              slug
            }
          }
        }
        allWordpressPost {
          edges {
            node {
              slug
              categories {
                wordpress_id
              }
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

    const categoryTemplate = path.resolve(`./src/templates/category.js`);
    const allCategories = result.data.allWordpressCategory.edges;
    const allPosts = result.data.allWordpressPost.edges;

    allCategories.forEach(({ node: cat }) => {
      const categoryPath = `/${BLOG_SLUG}/category/${cat.slug}/`;
      const categoryPosts = allPosts.filter(({node: post}) => {
        return post.categories.find(category => category.wordpress_id === cat.wordpress_id);
      })
      if (categoryPosts.length !== 0) {
        paginate({
          createPage,
          items: categoryPosts,
          itemsPerPage: parseInt(POSTS_PER_PAGE, 10),
          pathPrefix: ({ pageNumber }) => (pageNumber === 0 ? categoryPath : `${categoryPath}page`),
          component: categoryTemplate,
          context: {
            name: cat.name,
            slug: cat.slug,
          },
        })
      }
    })
  })
}

// Set featured_media field for WordPress Post GraphQL node
exports.sourceNodes = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
    type wordpress__POST implements Node {
      featured_media: wordpress__wp_media
    }
    type wordpress__wp_media implements Node {
      localFile: File
    }
  `
  createTypes(typeDefs)
}
