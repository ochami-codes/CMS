
export default function DateFilter({ onChange }) {
  return (
    <div className="form-stack">
      <div
        className="form-group"
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
        }}
      >
        <div style={{ flex: "1 1 200px" }}>
          <label>Start Date</label>
          <input
            type="date"
            className="input-field"
            onChange={(e) =>
              onChange((prev) => ({ ...prev, start: e.target.value }))
            }
          />
        </div>

        <div style={{ flex: "1 1 200px" }}>
          <label>End Date</label>
          <input
            type="date"
            className="input-field"
            onChange={(e) =>
              onChange((prev) => ({ ...prev, end: e.target.value }))
            }
          />
        </div>
      </div>
    </div>
  );
}
