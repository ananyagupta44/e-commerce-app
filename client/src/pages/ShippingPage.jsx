import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import axios from "axios";
import "../css/ShippingPage.css";
import API_URL from "@/config/api";
import ParticleBackground from "@/components/ParticleBackground";

const ShippingPage = () => {
  const navigate = useNavigate();

  const userInfo = JSON.parse(
    localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo"),
  );

  const [savedAddresses, setSavedAddresses] = useState([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const [saving, setSaving] = useState(false);

  const [fullName, setFullName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");
  const [errors, setErrors] = useState({});

  // ── Fetch addresses from backend ──
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/users/addresses`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setSavedAddresses(data);
        // If no saved addresses, show new form
        if (data.length === 0) setShowNewForm(true);
      } catch (error) {
        console.error("Failed to fetch addresses", error);
        setShowNewForm(true);
      } finally {
        setLoadingAddresses(false);
      }
    };
    fetchAddresses();
  }, []);

  // ── Validation ──
  const validate = () => {
    const e = {};
    const trimmedFullName = fullName.trim();
    const trimmedAddress = address.trim();
    const trimmedCity = city.trim();
    const trimmedPostalCode = postalCode.trim();
    const trimmedCountry = country.trim();

    if (!trimmedFullName) e.fullName = "Full name is required";
    else if (trimmedFullName.length < 2) e.fullName = "At least 2 characters";
    else if (!/^[A-Za-z ]+$/.test(trimmedFullName)) e.fullName = "Letters only";

    if (!trimmedAddress) e.address = "Address is required";
    else if (trimmedAddress.length < 5) e.address = "Address is too short";

    if (!trimmedCity) e.city = "City is required";
    else if (!/^[A-Za-z ]+$/.test(trimmedCity)) e.city = "Letters only";

    if (!trimmedPostalCode) e.postalCode = "Postal code is required";
    else if (!/^[0-9]{4,10}$/.test(trimmedPostalCode))
      e.postalCode = "Invalid postal code";

    if (!trimmedCountry) e.country = "Country is required";
    else if (!/^[A-Za-z ]+$/.test(trimmedCountry)) e.country = "Letters only";

    return e;
  };

  // ── Continue Handler ──
  const continueHandler = async (e) => {
    e.preventDefault();

    // Use existing saved address
    if (selectedAddressIndex !== null && !showNewForm) {
      const finalAddress = savedAddresses[selectedAddressIndex];
      localStorage.setItem("shipping", JSON.stringify(finalAddress));
      navigate("/placeorder");
      return;
    }

    // Validate new address form
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const finalAddress = {
      fullName: fullName.trim(),
      address: address.trim(),
      city: city.trim(),
      postalCode: postalCode.trim(),
      country: country.trim(),
    };

    try {
      setSaving(true);

      // ✅ Save to backend (user's own addresses in DB)
      await axios.post(`${API_URL}/api/users/addresses`, finalAddress, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });

      localStorage.setItem("shipping", JSON.stringify(finalAddress));
      navigate("/placeorder");
    } catch (error) {
      console.error("Failed to save address", error);
      alert("Failed to save address. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loadingAddresses) {
    return (
      <>
        <CheckoutSteps step1 step2 containerStyle={{ marginTop: "50px" }} />
        <div className="shipping-page">
          <div className="shipping-card">
            <p
              style={{ color: "#475569", fontFamily: "'DM Sans', sans-serif" }}
            >
              Loading addresses...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <ParticleBackground />
      <CheckoutSteps step1 step2 containerStyle={{ marginTop: "50px" }} />

      <div className="shipping-page">
        <div className="shipping-card">
          {/* ── Header ── */}
          <p className="shipping-eyebrow">Checkout</p>
          <h1 className="shipping-title">Shipping Address</h1>

          {/* ── Saved Addresses ── */}
          {savedAddresses.length > 0 && (
            <div className="saved-addresses">
              <p className="shipping-section-label">Saved Addresses</p>

              {savedAddresses.map((item, index) => (
                <div
                  key={index}
                  className={`saved-address-card ${
                    selectedAddressIndex === index && !showNewForm
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => {
                    setSelectedAddressIndex(index);
                    setShowNewForm(false);
                  }}
                >
                  <div className="address-radio">
                    <div className="address-radio-dot" />
                  </div>
                  <div className="address-card-body">
                    <p className="address-card-name">{item.fullName}</p>
                    <p className="address-card-detail">
                      {item.address}, {item.city}
                      <br />
                      {item.postalCode} · {item.country}
                    </p>
                  </div>
                </div>
              ))}

              <button
                className="add-new-btn"
                onClick={() => {
                  setShowNewForm(true);
                  setSelectedAddressIndex(null);
                }}
              >
                + Add New Address
              </button>

              {showNewForm && <hr className="form-divider" />}
            </div>
          )}

          {/* ── New Address Form ── */}
          {showNewForm && (
            <>
              {savedAddresses.length > 0 && (
                <p className="shipping-section-label">New Address</p>
              )}

              <form className="shipping-form" onSubmit={continueHandler}>
                <div className="form-field">
                  <label className="form-label">Full Name</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="e.g. John Doe"
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      setErrors((p) => ({ ...p, fullName: "" }));
                    }}
                  />
                  {errors.fullName && <FieldError msg={errors.fullName} />}
                </div>

                <div className="form-field">
                  <label className="form-label">Address</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Street address"
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      setErrors((p) => ({ ...p, address: "" }));
                    }}
                  />
                  {errors.address && <FieldError msg={errors.address} />}
                </div>

                <div className="form-row">
                  <div className="form-field">
                    <label className="form-label">City</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="City"
                      value={city}
                      onChange={(e) => {
                        setCity(e.target.value);
                        setErrors((p) => ({ ...p, city: "" }));
                      }}
                    />
                    {errors.city && <FieldError msg={errors.city} />}
                  </div>

                  <div className="form-field">
                    <label className="form-label">Postal Code</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="000000"
                      value={postalCode}
                      onChange={(e) => {
                        setPostalCode(e.target.value);
                        setErrors((p) => ({ ...p, postalCode: "" }));
                      }}
                    />
                    {errors.postalCode && (
                      <FieldError msg={errors.postalCode} />
                    )}
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">Country</label>
                  <input
                    className="form-input"
                    type="text"
                    placeholder="Country"
                    value={country}
                    onChange={(e) => {
                      setCountry(e.target.value);
                      setErrors((p) => ({ ...p, country: "" }));
                    }}
                  />
                  {errors.country && <FieldError msg={errors.country} />}
                </div>

                <button
                  type="submit"
                  className="continue-btn"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Continue"}
                  {!saving && <span className="continue-btn-arrow">→</span>}
                </button>
              </form>
            </>
          )}

          {/* ── Continue with existing address ── */}
          {!showNewForm && selectedAddressIndex !== null && (
            <button className="continue-btn" onClick={continueHandler}>
              Continue <span className="continue-btn-arrow">→</span>
            </button>
          )}
        </div>
      </div>
    </>
  );
};

// ── Inline error helper ──
const FieldError = ({ msg }) => (
  <p
    style={{
      fontFamily: "'DM Mono', monospace",
      fontSize: "11px",
      color: "#fca5a5",
      marginTop: "5px",
      letterSpacing: "0.3px",
    }}
  >
    {msg}
  </p>
);

export default ShippingPage;
