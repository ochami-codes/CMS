import React from "react";

const Contributions = ({ contributions }) => {
  return (
    <div className="card">
      <h4 className="font-semibold mb-3">Contributions Summary</h4>
      <ul className="space-y-2">
        <li className="text-gray-700">Tithes: {contributions.tithes}</li>
        <li className="text-gray-700">Offerings: {contributions.offerings}</li>
        <li className="text-gray-700">Camp Offerings: {contributions.campOfferings}</li>
        <li className="text-gray-700">Church Development: {contributions.churchDevelopment}</li>
      </ul>
    </div>
  );
};

export default Contributions;
