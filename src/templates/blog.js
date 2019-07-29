import React from 'react';
import { graphql } from 'gatsby';
import Layout from '../components/Layout';
import SEO from '../components/SEO';
import PostList from '../components/PostList';
import { decodeEntities } from '../utils/htmlParse';

export default class BlogPage extends React.Component {
  render() {
    const { data, pageContext, location } = this.props;
    const { site, allWordpressPost } = data;
    const {
      title: siteTitle,
      blogSlug
    } = site.siteMetadata;
    const { edges: posts } = allWordpressPost

    return (
      <Layout location={location}>
        <SEO title={`Blog | ${decodeEntities(siteTitle)}`} />
        <PostList
          posts={posts}
          blogSlug={blogSlug}
          pathPrefix={blogSlug}
          pageContext={pageContext}
          siteMetadata={site.siteMetadata}
        />
      </Layout>
    )
  }
}

export const pageQuery = graphql`
  query BlogQuery($limit: Int!, $skip: Int!) {
    site {
      siteMetadata {
        title
        blogSlug
      }
    }
    allWordpressPost(
      sort: { fields: date, order: DESC }
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          id
          # featuredImage: featured_media {
          #   localFile {
          #     childImageSharp {
          #       fluid(maxWidth: 1200, quality: 90) {
          #         ...GatsbyImageSharpFluid_withWebp_tracedSVG
          #       }
          #     }
          #   }
          # }
          title
          excerpt
          date(formatString: "MMMM DD, YYYY")
          slug
        }
      }
    }
  }
`
