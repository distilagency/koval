import React from 'react';
import { Link } from 'gatsby';

const Pagination = ({ pageContext, pathPrefix }) => {
  if (!pageContext) {
    return null;
  }
  const { previousPagePath = null, nextPagePath = null, numberOfPages = null } = pageContext
  const pages = [];
  // eslint-disable-next-line
  for (let i = 0; i < numberOfPages; i++) {
    pages.push(i+1);
  }
  return (
    <nav className="pagination" role="navigation">
      <div className="navbar navbar-menu">
        {previousPagePath && (
          <Link to={`/${previousPagePath}/`} className="prev">Prev</Link>
        )}
        {pages.map((key, index) => (
          <Link key={index} to={key !== 1 ? `/${pathPrefix}/page/${key}/` : `/${pathPrefix}/`} activeClassName="active">{key}</Link>
        ))}
        {nextPagePath && (
          <Link to={`/${nextPagePath}/`} className="next">Next</Link>
        )}
      </div>
    </nav>
  );
}

export default Pagination
