import React from "react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="links col-md-5 col-sm-5 col-xs-8">
            <ul  className="quick-links">
              <li>
                <Link to="/our-story">Our Story</Link>
              </li>
              <li>
                <Link to="/robotics">Robotics</Link>
              </li>
              <li>
                <Link to="/media">Media</Link>
              </li>
              <li>
                <Link to="/conference">Conference</Link>
              </li>
            </ul>
          </div>
        <div className="main-footer col-md-12 col-xs-12">
          <div className="foter-logo col-md-3 col-sm-3 col-xs-2">
            <a href="index.html">
              <img
                className="desktop"
                src="images/Globo-Logo-white-footer.svg"
                alt=""
              />
              <img className="mobileImg" src="images/G.png" alt="" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
