function Navbar({ darkMode, setDarkMode, search, setSearch }) {
  return (
    <header className="header">

      <div className="brand">

        <div className="brand-icon">E</div>

        <div>
          <h2>EduDashboard</h2>
          <p>Student Learning Portal</p>
        </div>

      </div>

      <div className="nav-right">

        <div className="search-box">

          <span>⌕</span>

          <input
            type="text"
            placeholder="Search courses..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search courses"
          />

        </div>

        <button
          className="theme-btn"
          onClick={() => setDarkMode(!darkMode)}
        >
          {darkMode ? "☀️ Light" : "🌙 Dark"}
        </button>

        <div className="avatar" title="Student profile">
          I
        </div>

      </div>

    </header>
  );
}

export default Navbar;
