import React from 'react';
import Nav from '../../../components/en/header/Nav'
import Footer from '../../../components/en/footer/Footer';
import JointCompoundCalculator from '../../../components/en/calculator/jointCompoundCalcul';

const JoinCompoundCalulatorPage = () => {
  return (
    <>
      <Nav />
     <header className="hero-section">
        <div className="hero-content">
          <h1>Welcome to Our Site</h1>
          <p>Modern tools, seamless UX, and pure CSS for speed and performance.</p>
        </div>
      </header>

      <main className="main-content">
        <section className="feature-section">
          <JointCompoundCalculator/>
        </section>
      </main>
      <Footer />


    </>
  );
};

export default JoinCompoundCalulatorPage;