import React from "react";
import "./Header.scss";

const Header = ({ header }) => {
  return (
    <div className="header">
      <h2>{header}</h2>
    </div>
  );
};

export default Header;
