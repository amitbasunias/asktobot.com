import React from 'react';
import Nav from '../../components/en/header/Nav'
import Footer from '../../components/en/footer/Footer';

const HomePage = () => {
  return (
    <>
      <Nav />
      <header className="hero-section container">
        <div className="hero-content">
          <h1>Welcome to Our Site</h1>
          <p>Modern tools, seamless UX, and pure CSS for speed and performance.</p>
          <a href="/get-started" className="btn-primary">Get Started</a>
        </div>
      </header>

      <main className="main-content">
        <section className="container">
          <h2>Why Choose Us</h2>
          <div className="features-grid">
          
          </div>
        </section>
      </main>
      <Footer />


    </>
  );
};

export default HomePage;