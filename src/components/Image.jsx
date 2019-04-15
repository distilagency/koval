import React, { Component } from 'react';
import Img from 'gatsby-image/withIEPolyfill';
import './Image.scss';

export default class Image extends Component {
  render() {
    const { image, className = '', ...props } = this.props;
    if (
      (image && image.localFile && image.localFile.childImageSharp && image.localFile.childImageSharp.fluid) ||
      (image && image.childImageSharp && image.childImageSharp.fluid)
    ) {
      return (
        <Img
          {...props}
          className={className}
          fluid={image.localFile ? image.localFile.childImageSharp.fluid : image.childImageSharp.fluid}
        />
      );
    }
    if (image && image.url) {
      return <img className={`gatsby-image-wrapper ${className}`} src={image.url} alt={image.alt || ''} />;
    }
    return <div className={`gatsby-image-wrapper placeholder ${className}`} />;
  }
}
