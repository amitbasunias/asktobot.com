import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-container">
        <div className="footer-logo">
          <h2>MyLogo</h2>
          <p>Your go-to hub for smart calculators and AI tools.</p>
        </div>

        <nav className="footer-nav">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/tools">Tools</a></li>
            <li><a href="/calculators">Calculators</a></li>
            <li><a href="/ai-writer">AI Writer</a></li>
            <li><a href="/ai-chatbot">AI Chatbot</a></li>
          </ul>
        </nav>

        <nav className="footer-nav">
          <h3>Categories</h3>
          <ul>
            <li><a href="/finance">Finance</a></li>
            <li><a href="/health">Health</a></li>
            <li><a href="/science">Science</a></li>
            <li><a href="/fitness">Fitness</a></li>
            <li><a href="/daily">Daily</a></li>
          </ul>
        </nav>

        <section className="footer-contact">
          <h3>Contact</h3>
          <p>Email: support@mysite.com</p>
          <p>Location: Internet World</p>
        </section>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} MySite. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
