import React from "react";

export default function Contributions({ contributions }) {
  return (
    <div className="card">
      <h3 className="text-lg font-semibold mb-3">Contributions Summary</h3>
      <ul className="space-y-2">
        <li>
          <span className="label">Tithes:</span>{" "}
          <span className="value">{contributions.tithes}</span>
        </li>
        <li>
          <span className="label">Offerings:</span>{" "}
          <span className="value">{contributions.offerings}</span>
        </li>
        <li>
          <span className="label">Camp Offerings:</span>{" "}
          <span className="value">{contributions.campOfferings}</span>
        </li>
        <li>
          <span className="label">Church Development:</span>{" "}
          <span className="value">{contributions.churchDevelopment}</span>
        </li>
      </ul>
    </div>
  );
}
