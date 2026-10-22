function StatCard({ title, value, icon, color }) {
  return (
    <div className="stat-card">

      <div className="stat-card-top">

        <div>
          <p className="stat-title">{title}</p>
          <h2 className="stat-value">{value}</h2>
        </div>

        <div
          className="stat-icon"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>

      </div>

      <div className="stat-footer">
        <span className="status-dot"></span>
        Academic overview
      </div>

    </div>
  );
}

export default StatCard;