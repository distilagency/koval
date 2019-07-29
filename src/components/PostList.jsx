import React, { Component } from 'react';
import { Link } from 'gatsby';
import Pagination from './Pagination';

export default class PostList extends Component {
  render() {
    const {
      posts,
      title = "Posts",
      blogSlug,
      pathPrefix,
      pageContext
    } = this.props;
    return (
      <section className="post-feed">
        <div className="wrapper">
          <h1 dangerouslySetInnerHTML={{__html: title}} />
          {posts && (
            <div className="feed-items">
              {posts.map(({ node: post }) => {
                const { title: postTitle, excerpt, featuredImage, slug } = post;
                return (
                  <div className="feed-item" key={post.id}>
                    <Link to={`/${blogSlug}/${slug}/`}>
                      <h2 dangerouslySetInnerHTML={{__html: postTitle}} />
                    </Link>

                  </div>
                );
              })}
            </div>
          )}
          <Pagination pageContext={pageContext} pathPrefix={pathPrefix} />
        </div>
      </section>
    )
  }
}
