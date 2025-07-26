import React, { useState, useEffect } from 'react';
import './nav.css';

const SUPPORTED_LANGUAGES = ['en', 'de', 'es', 'fr', 'pt'];

const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const pathParts = window.location.pathname.split('/');
    const maybeLang = pathParts[1];
    if (SUPPORTED_LANGUAGES.includes(maybeLang)) {
      setLanguage(maybeLang);
    }
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleSubmenu = (name) =>
    setOpenSubmenu(openSubmenu === name ? null : name);

  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    const currentPath = window.location.pathname;
    const pathParts = currentPath.split('/');

    let updatedPath;

    if (SUPPORTED_LANGUAGES.includes(pathParts[1])) {
      pathParts[1] = newLang;
      updatedPath = pathParts.join('/');
    } else if (newLang === 'en') {
      updatedPath = currentPath;
    } else {
      updatedPath = `/${newLang}${currentPath}`;
    }

    window.location.href = updatedPath;
  };

  return (
    <nav className="navbar">
      <div className="nav-logo">MyLogo</div>
      <button className="nav-toggle" onClick={toggleMenu} aria-label="Toggle menu">☰</button>
      <ul className={`nav-menu ${menuOpen ? 'open' : ''}`}>
        <li><a href="/">Home</a></li>

        <li className={`has-submenu ${openSubmenu === 'calculators' ? 'open' : ''}`}>
          <button onClick={() => toggleSubmenu('calculators')}>Calculators ▾</button>
          <ul className="submenu">
            <li><a href="/constructions">Constructions</a></li>
            <li><a href="/countdown">Countdown</a></li>
            <li><a href="/home-improvement">Home Improvement</a></li>
            <li><a href="/health">Health</a></li>
            <li><a href="/science">Science</a></li>
            <li><a href="/math">Math</a></li>
            <li><a href="/productivity">Productivity</a></li>
            <li><a href="/sports">Sports</a></li>
            <li><a href="/office">Office</a></li>
            <li><a href="/statistics">Statistics</a></li>
            <li><a href="/finance">Finance</a></li>
            <li><a href="/fitness">Fitness</a></li>
            <li><a href="/daily">Daily</a></li>
          </ul>
        </li>

        <li className={`has-submenu ${openSubmenu === 'tools' ? 'open' : ''}`}>
          <button onClick={() => toggleSubmenu('tools')}>Tools ▾</button>
          <ul className="submenu">
            <li><a href="/conversion-tools">Conversion Tools</a></li>
            <li><a href="/editing-tools">Editing Tools</a></li>
          </ul>
        </li>

        <li className={`has-submenu ${openSubmenu === 'ai' ? 'open' : ''}`}>
          <button onClick={() => toggleSubmenu('ai')}>AI Tools ▾</button>
          <ul className="submenu">
            <li><a href="/ai-chatbot">AI Chatbot</a></li>
            <li><a href="/ai-writer">AI Writer</a></li>
          </ul>
        </li>

        <li className="language-switcher">
          <select value={language} onChange={handleLanguageChange}>
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
