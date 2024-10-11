import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedin,
  FaGithub,
} from "react-icons/fa";

import ContentWrapper from "../contentWrapper/ContentWrapper";

import "./footer.scss";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="footer">
      <ContentWrapper>
        <ul className="menuItems">
          <li className="menuItem">Terms Of Use</li>
          <li className="menuItem">Privacy-Policy</li>
          <li className="menuItem">About</li>
          <li className="menuItem">Blog</li>
          <li className="menuItem">FAQ</li>
        </ul>
        <div className="infoText">
          This AI-based movie recommendation website was developed as a minor
          project for our college by a dedicated team of three. Our aim is to
          enhance the movie-watching experience by providing personalized
          recommendations based on user preferences and viewing history.
        </div>
        <div className="teamMembers">
          <h4>Team Members: </h4>
          <ul>
            <li>Mukesh Pandey</li>
            <li>Alok Sati</li>
            <li>Bhanu Pratap Gusain</li>
          </ul>
        </div>
        <div className="socialIcons">
          <span className="icon">
            <Link target="_blank" to="https://github.com/mukeshpandey9">
              <FaGithub />
            </Link>
          </span>
          {/* <span className="icon">
            <FaInstagram />
          </span> */}
          <span className="icon">
            <Link target="_blank" to="https://twitter.com/mukeshpandey9">
              <FaTwitter />
            </Link>
          </span>
          <span className="icon">
            <Link target="_blank" to="https://linkedin.com/in/mukeshpandey9">
              <FaLinkedin />
            </Link>
          </span>
        </div>
      </ContentWrapper>
    </footer>
  );
};

export default Footer;
