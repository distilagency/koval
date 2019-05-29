import React from 'react';
import { graphql } from 'gatsby';
import Previewable from '../components/Previewable';
import Layout from '../components/Layout';
import * as AcfLayout from '../acf';
import SEO from '../components/SEO';

const AcfComponent = ({ location, componentName, item }) => {
  // If component does not exist in acf folder, print error message
  if (!(componentName in AcfLayout)) {
    return (
      <div className="wrapper">
        {`Error: Component does not exist. `}
        {`Please create component "${componentName}.jsx" in src/acf folder `}
        {`and add export to src/acf/index.js`}
      </div>
    );
  }
  const ComponentName = AcfLayout[componentName];
  return (
    <ComponentName
      location={location}
      {...item}
    />
  );
};

const Page = ({ data, location }) => {
  const { wordpressPage: page, site } = data;
  const { title, yoast, acf = {} } = page;
  const { layout } = acf;
  const { title: siteTitle } = site.siteMetadata;
  return (
    <Layout location={location}>
      <SEO
        title={`${yoast.metaTitle || title} | ${siteTitle}`}
        desc={yoast.metaDescription}
      />
      {layout && layout.map(item => {
        if (!item.__typename) return null;
        const layoutComponentName = item.__typename.replace('WordPressAcf_','');
        return (
          <AcfComponent
            key={item.id}
            componentName={layoutComponentName}
            item={item}
            location={location}
          />
        );
      })}
    </Layout>
  )
}

export default Previewable(Page);

export const pageQuery = graphql`
  query PageById($id: String!) {
    site {
      siteMetadata {
        title,
        functionsUrl
      }
    }
    wordpressPage(id: { eq: $id }) {
      title
      content
      yoast {
        metaTitle: title
        metaDescription: metadesc
      }
      acf {
        layout: layout_page {
          __typename,
          ... on WordPressAcf_IntroSection {
            id
            title
            subtitle
          }
        }
      }
    }
  }
`
