import React, { useState } from "react";
import "./LoginPage.css";

const LoginPage = () => {

  const images = [
    "/photo1.jpg",
    "/photo2.jpg",
    "/photo3.jpg",
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Function to handle next button
  const nextSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Function to handle previous button
  const prevSlide = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  return (
    <div>
      {/* Header */}
      <header className="header">
        <div className="logo">
          <img src="logorem.png" alt="City Logo" className="logo-img" />
          <h1>ILIGAN CITY TRAFFIC AND PARKING MANAGEMENT OFFICE</h1>
        </div>
        <nav className="nav">
          <a href="#" className="nav-link current">Home</a>
          <a href="#" className="nav-link">About us</a>
        </nav>
      </header>

      {/* Main Container */}
      <div className="container">
        {/* Login Form */}
        <div className="form-container">
          <h2>Welcome back! Please login to your account.</h2>
          <form>
            <input type="email" placeholder="Email" required className="input-field" />
            <input type="password" placeholder="Password" required className="input-field" />
            <div className="form-buttons">
              <button type="submit" className="login-btn">Login</button>
              <button type="button" className="signup-btn">Sign Up</button>
              <a href="#" className="forgot-password">Forgot Password?</a>
            </div>
          </form>
          <p className="terms">
            By signing in you are agreeing to our <a href="#">Term</a> and <a href="#">privacy policy</a>
          </p>
        </div>

        <div className="slideshow-container">
          <button onClick={prevSlide} className="left-arrow">
            &#10094;
          </button>
          <img
            src={images[currentImageIndex]}
            alt="Slideshow"
            className="slideshow-image"
          />
          <button onClick={nextSlide} className="right-arrow">
            &#10095;
          </button>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
