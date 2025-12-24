import React from "react";

const Contributions = ({ contributions }) => {
  return (
    <ul>
      <li>Tithes: {contributions.tithes}</li>
      <li>Offerings: {contributions.offerings}</li>
      <li>Camp Offerings: {contributions.campOfferings}</li>
      <li>Church Development: {contributions.churchDevelopment}</li>
    </ul>
  );
};

export default Contributions;
