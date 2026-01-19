export default function DateFilter({ onChange }) {
  return (
    <div className="filter-row">
      <input
        type="date"
        onChange={(e) =>
          onChange((prev) => ({ ...prev, start: e.target.value }))
        }
      />
      <input
        type="date"
        onChange={(e) =>
          onChange((prev) => ({ ...prev, end: e.target.value }))
        }
      />
    </div>
  );
}

