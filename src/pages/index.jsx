import React from 'react'
import Layout from '../components/Layout'
import SEO from '../components/SEO';

const Index = () => (
  <Layout>
    <SEO title="Homepage" />
    <section className="home">
      <div className="wrapper">
        <h1>Home</h1>
        <p>Edit pages/index.jsx to get started</p>
      </div>
    </section>
  </Layout>
)

export default Index
