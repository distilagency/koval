// require('dotenv').config({
//   path: `.env.${process.env.NODE_ENV}`,
// });

// const path = require('path');

// exports.createPages = ({ actions, graphql }) => {
//   const { createPage } = actions
//
//   return graphql(`
//     {
//       exampleApi {
//         edges {
//           node {
//             id
//             title
//             content
//             slug
//           }
//         }
//       }
//     }
//   `)
//   .then(result => {
//     if (result.errors) {
//       result.errors.forEach(e => console.error(e.toString()))
//       return Promise.reject(result.errors)
//     }
//
//     const pageTemplate = path.resolve(`./src/templates/page.js`)
//
//     const pages = result.data.exampleApi.edges
//     // Call `createPage()` once per WordPress page
//     return pages.forEach(({ node: page }) => {
//       createPage({
//         path: page.slug,
//         component: pageTemplate,
//         context: {
//           id: page.id,
//         },
//       });
//     })
//   })
// }
