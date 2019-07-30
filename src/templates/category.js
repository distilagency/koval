import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import PostList from '../components/PostList';
import { decodeEntities } from '../utils/htmlParse';

const Category = props => {
  const { data, pageContext, location } = props
  const { allWordpressPost, site } = data;
  const { edges: posts, totalCount } = allWordpressPost
  const { title: siteTitle } = site.siteMetadata;
  const { name: categoryName, slug: categorySlug } = pageContext;
  const title = `${totalCount} post${ totalCount === 1 ? '' : 's'} in the “${categoryName}” category`
  return (
    <Layout location={location}>
      <SEO title={`${decodeEntities(categoryName)} | ${decodeEntities(siteTitle)}`} />
      <PostList
        posts={posts}
        title={title}
        blogSlug={site.siteMetadata.blogSlug}
        pageContext={pageContext}
        siteMetadata={site.siteMetadata}
        pathPrefix={`${site.siteMetadata.blogSlug}/category/${categorySlug}`}
      />
    </Layout>
  )
}
export default Category

export const pageQuery = graphql`
  query CategoryPage($slug: String!, $limit: Int!, $skip: Int!) {
    site {
      siteMetadata {
        title
        blogSlug
      }
    }
    allWordpressPost(
      filter: {
        categories: { elemMatch: { slug: { eq: $slug } } }
      }
      sort: { fields: date, order: DESC }
      limit: $limit
      skip: $skip
    ) {
      totalCount
      edges {
        node {
          id
          featuredImage: featured_media {
            localFile {
              childImageSharp {
                fluid(maxWidth: 1200, quality: 90) {
                  ...GatsbyImageSharpFluid_withWebp
                }
              }
            }
          }
          title
          excerpt
          date(formatString: "MMMM DD, YYYY")
          slug
        }
      }
    }
  }
`
