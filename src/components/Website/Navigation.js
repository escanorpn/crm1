import React, { useState } from "react";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };  
  const closeleMenu = () => {
    setIsOpen(false);
  };
  
  return (
    <div className="navigation-container">
      <button className={` close-chip1 hamburger  ${isOpen ? "open" : ""}`} onClick={toggleMenu}>
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </button>
      {/* <button className="close-chip" onClick={toggleMenu} style={{ display: isOpen ? "block" : "none" }}>
        &#10005;
      </button> */}
      <nav className="navbar">
        <ul className={isOpen ? "menu open" : "menu"}>
          <li>
            <a href="#/Website/" onClick={closeleMenu}>
              Home
            </a>
          </li>
          
          <li>
            <a href="#/Website/folio" onClick={closeleMenu}>
              Folio
            </a>
          </li>
          <li>
            <a href="#/Website/about" onClick={closeleMenu}>
              About
            </a>
          </li>
          <li>
            <a href="#/Website/contact" onClick={closeleMenu}>
              Contact
            </a>
          </li>
        </ul>
      </nav>
      <style jsx>{`
        .navigation-container {
          position: relative;
        }

        .hamburger {
          background-color: transparent;
          border: none;
          cursor: pointer;
          padding: 10px;
          position: fixed;
          top: 10px;
          left: 10px;
          z-index: 999;
          display: block;
        }

        .line {
          background-color: #52ffc0de;
          height: 2px;
          margin: 4px 0;
          transition: transform 0.3s ease;
          width: 25px;
        }

        .open .line:nth-child(1) {
          transform: translateY(10px) rotate(45deg);
        }

        .open .line:nth-child(2) {
          opacity: 0;
        }

        .open .line:nth-child(3) {
          transform: translateY(-10px) rotate(-45deg);
        }
       
        .close-chip1 {
          background-color: #333333; /* Default background color */
          color: #52ffc0de; /* Icon color */
          border: none;
          border-radius: 30%;
          cursor: pointer;
          
          z-index: 999;
        box-shadow: 12px 10px 17px 7px #00000033;
          transition: transform 0.3s ease;
         
        }
        .close-chip {
          background-color: #333333; /* Default background color */
          color: #52ffc0de; /* Icon color */
          border: none;
          border-radius: 30%;
          cursor: pointer;
          padding: 15px; /* Increase padding */
          position: fixed;
        //   top: 15px; /* Adjust top position */
        //   left: 15px; /* Adjust left position */
          z-index: 999;
        box-shadow: 12px 10px 17px 7px #00000033;
          transition: transform 0.3s ease;
          transform: ${isOpen ? "scale(1)" : "scale(0)"};
          display: none;
        }

        .menu {
          list-style-type: none;
          margin: 0;
          padding: 0;
          display: none;
        }

        .menu.open {
          display: block;
          background-color: #333;
          position: fixed;
          top: 0;
          left: 0;
          width: 200px;
          height: 100vh;
          padding: 50px 30px;
          z-index: 998;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .menu li {
          margin-bottom: 20px;
        }

        .menu a {
          color: white;
          text-decoration: none;
          font-size: 18px;
        }

        .menu a:hover {
          color: #ccc;
        }

        /* Large Screen Styles */
        @media screen and (min-width: 768px) {
          .navbar {
            padding: 20px; /* Increase padding for desktop */
          }

          .hamburger {
            display: none;
          }

          .close-chip {
            display: none;
          }

          .navbar {
            display: block;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            background-color: #333;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .menu {
            display: flex;
            // justify-content: flex-end;
          }

          .menu li {
            margin-left: 20px;
            margin-bottom: 0;
          }
        }

        /* Small Screen Styles */
        @media screen and (max-width: 767px) {
          .close-chip {
            display: block;
          }
        }
      `}</style>
    </div>
  );
};

export default Navigation;
