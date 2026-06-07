// this component shows the sliding history panel
const HistorySidebar = ({ history, onLoad, onClear, onClose }) => {
  return (
    <div className="overlay" onClick={onClose}>
      {/* stop click from closing when clicking inside sidebar */}
      <div className="sidebar" onClick={(e) => e.stopPropagation()}>
        <div className="sidebar-head">
          <h3>📋 Review History</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="sidebar-list">
          {history.length === 0 ? (
            <p className="no-history">No history yet.</p>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="h-item"
                onClick={() => onLoad(item)}
              >
                <div className="h-item-top">
                  <span className="h-lang">{item.language}</span>
                  <span className="h-type">{item.type}</span>
                  <span className="h-time">{item.time}</span>
                </div>
                <div className="h-preview">{item.codePreview}…</div>
              </div>
            ))
          )}
        </div>

        {history.length > 0 && (
          <button className="clear-btn" onClick={onClear}>
            🗑️ Clear All History
          </button>
        )}
      </div>
    </div>
  );
};

export default HistorySidebar;
