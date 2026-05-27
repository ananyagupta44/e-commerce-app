import { Link } from "react-router-dom";
import "../css/footer.css";
import instagramIcon from "../assets/instagramIcon.png";
import XIcon from "../assets/XIcon.png";
import facebookIcon from "../assets/facebookIcon.png";
import twitterIcon from "../assets/twitterIcon.png";
import logo from "../assets/logofull.png";

const Footer = () => {
  return (
    <footer className="footer">
      {/* TOP */}

      <div className="footer-container">
        <div className="footer-grid">
          {/* HELP */}

          <div>
            <h2 className="footer-title">NEED HELP</h2>

            <div className="footer-links">
              <p className="footer-link">Contact Us</p>

              <p className="footer-link">Track Order</p>

              <p className="footer-link">Returns & Refunds</p>

              <p className="footer-link">FAQs</p>

              <p className="footer-link">My Account</p>
            </div>
          </div>

          {/* COMPANY */}

          <div>
            <h2 className="footer-title">COMPANY</h2>

            <div className="footer-links">
              <p className="footer-link">About Us</p>

              <p className="footer-link">Careers</p>

              <p className="footer-link">Investor Relations</p>

              <p className="footer-link">Gift Vouchers</p>

              <p className="footer-link">Community Initiatives</p>
            </div>
          </div>

          {/* INFO */}

          <div>
            <h2 className="footer-title">MORE INFO</h2>

            <div className="footer-links">
              <p className="footer-link">Privacy Policy</p>

              <p className="footer-link">Terms & Conditions</p>

              <p className="footer-link">Blogs</p>

              <p className="footer-link">Sitemap</p>

              <p className="footer-link">Get Notified</p>
            </div>
          </div>

          {/* STORES */}

          <div>
            <h2 className="footer-title">STORE NEAR ME</h2>

            <div className="footer-links">
              <p className="footer-link">Mumbai</p>

              <p className="footer-link">Delhi</p>

              <p className="footer-link">Bangalore</p>

              <p className="footer-link">Ahmedabad</p>

              <Link
                to="/products"
                style={{
                  color: "#2563eb",
                  fontWeight: "700",
                  textDecoration: "none",
                  marginTop: "6px",
                }}
              >
                View More
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* MIDDLE */}

      <div className="footer-middle">
        {/* APP */}

        <div className="footer-app-section">
          <div className="footer-img-title-div">
            <img className="footer-img-logo" src={logo} alt="" />

            <div className="footer-app-content">
              <h3 className="footer-app-title">EXPERIENCE THE NOVA APP</h3>

              <div className="footer-apps">
                <img
                  src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
                  alt=""
                />

                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>

        {/* SOCIAL */}

        <div className="footer-social">
          <p className="footer-social-title">Follow Us:</p>

          <div className="footer-social-icons">
            <div className="footer-social-icon">
              <img src={facebookIcon} alt="" className="social-img" />
            </div>

            <div className="footer-social-icon">
              <img src={instagramIcon} alt="" className="social-img" />
            </div>

            <div className="footer-social-icon">
              <img src={XIcon} alt="" className="social-img" />
            </div>

            <div className="footer-social-icon">
              <img src={twitterIcon} alt="" className="social-img" />
            </div>
          </div>
        </div>
      </div>

      {/* DIVIDER */}

      <div className="footer-divider" />

      {/* BOTTOM */}

      <div className="footer-bottom">
        {/* PAYMENTS */}

        <div className="footer-payments">
          <p className="footer-payment-title">100% Secure Payments:</p>

          <span className="footer-payment-icon">💳</span>

          <span className="footer-payment-icon">📱</span>

          <span className="footer-payment-icon">🏦</span>

          <span className="footer-payment-icon">💰</span>

          <span className="footer-payment-icon">🪙</span>
        </div>

        {/* COPYRIGHT */}

        <div className="footer-copyright">© NOVA 2026-27</div>
      </div>
    </footer>
  );
};

export default Footer;
