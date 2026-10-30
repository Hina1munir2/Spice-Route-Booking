
import { useState } from "react";
import { Link } from "react-router-dom";
import menuBackground from "../assets/menubg.png";
import chickenBiryani from "../assets/biryani-chicken.jpg";
import lambBiryani from "../assets/biryani-lamb.jpg";
import chickenTikka from "../assets/chicken-tikka.jpg";
import butterChicken from "../assets/butter-chicken.jpg";
import garlicNaan from "../assets/garlic-naan.jpg";
import gulabJamun from "../assets/gulab-jamun.jpg";
import kulfi from "../assets/kulfi.jpg";

const menuData = {
  "Royal Biryanis": [
    {
      name: "Hyderabadi Chicken Biryani",
      price: "Rs.1850",
      desc: "Fragrant basmati rice layered with marinated chicken, saffron, caramelized onions, fresh mint and traditional Hyderabadi spices, served with cooling raita.",
      img: chickenBiryani,
    },
    {
      name: "Lamb Rogan Josh Biryani",
      price: "Rs.2250",
      desc: "Slow-cooked succulent lamb in rich Mughlai spices layered with basmati rice, garnished with slivered almonds and fresh coriander.",
      img: lambBiryani,
    },
  ],

  "Mughlai Curries": [
    {
      name: "Classic Butter Chicken",
      price: "Rs.1650",
      desc: "Tender chicken simmered in rich tomato-butter sauce with cream, fenugreek and warm spices.",
      img: butterChicken,
    },
  ],

  "Tandoor & Kebabs": [
    {
      name: "Chicken Tikka Kebab",
      price: "Rs.1450",
      desc: "Tender chicken marinated in yogurt, ginger-garlic and garam masala, chargrilled in a traditional tandoor and served with mint coriander chutney.",
      img: chickenTikka,
    },
  ],

  Breads: [
    {
      name: "Garlic Butter Naan",
      price: "Rs.350",
      desc: "Hand-rolled naan baked in a tandoor, brushed with garlic butter and fresh coriander.",
      img: garlicNaan,
    },
  ],

  Desserts: [
    {
      name: "Gulab Jamun",
      price: "Rs.550",
      desc: "Soft milk dumplings soaked in fragrant rose-cardamom syrup, garnished with crushed pistachio.",
      img: gulabJamun,
    },
    {
      name: "Pistachio Saffron Kulfi",
      price: "Rs.600",
      desc: "Traditional creamy kulfi infused with saffron, cardamom and chopped pistachios.",
      img: kulfi,
    },
  ],
};

function Menu() {
  const [activeTab, setActiveTab] = useState("Royal Biryanis");

  const tabs = [
    "Royal Biryanis",
    "Tandoor & Kebabs",
    "Mughlai Curries",
    "Breads",
    "Desserts",
  ];

  // Show all dishes initially, then filter when a category is selected.
  const displayItems =
    activeTab === "Royal Biryanis"
      ? [
          ...menuData["Royal Biryanis"],
          ...menuData["Tandoor & Kebabs"],
          ...menuData["Mughlai Curries"],
          ...menuData["Breads"],
          ...menuData["Desserts"],
        ]
      : menuData[activeTab];

  return (
    <main className="menu-page">
      {/* HERO BANNER */}
      <section
        className="menu-hero"
        style={{ backgroundImage: `url(${menuBackground})` }}
      >
        <div className="menu-hero-content">
          <h1>SPICE ROUTE</h1>
          <span>PAKISTANI & MUGHLAI CUISINE</span>

          <p>
            A Journey Through Rich Culinary Traditions — Crafted
            with Traditional Spices, Herbs and Time-Honored Recipes.
          </p>

          <div className="menu-hero-buttons">
            <a href="#menu-items" className="primary-button">
              VIEW MENU
            </a>

            <Link to="/booking" className="outline-button">
              RESERVE A TABLE
            </Link>
          </div>
        </div>
      </section>

      {/* MENU TITLE AND CATEGORY TABS */}
      <section className="menu-heading" id="menu-items">
        <span className="section-label">DISCOVER OUR FLAVOURS</span>

        <h2>OUR MENU</h2>

        <p>
          Authentic flavours inspired by royal Mughlai kitchens
          and the vibrant spice routes of the region.
        </p>

        <div className="menu-tabs">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`menu-tab ${
                activeTab === tab ? "active" : ""
              }`}
              aria-pressed={activeTab === tab}
            >
              {tab}
            </button>
          ))}
        </div>
      </section>

      {/* MENU ITEMS */}
      <section className="menu-grid">
        {displayItems.map((item) => (
          <article className="menu-item" key={item.name}>
            <img
              src={item.img}
              alt={item.name}
              className="menu-item-image"
              loading="lazy"
            />

            <div className="menu-item-content">
              <div className="menu-item-heading">
                <h3>{item.name}</h3>
                <span className="menu-item-price">{item.price}</span>
              </div>

              <p>{item.desc}</p>
            </div>
          </article>
        ))}
      </section>

      {/* RESERVATION BANNER */}
      <section className="menu-reservation">
        <h2>Ready for a Memorable Meal?</h2>
        <p>
          Experience the flavours of Spice Route. Reserve your
          table and let us welcome you.
        </p>

        <Link to="/booking" className="primary-button">
          BOOK YOUR TABLE
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <span>Spice Route</span>
        <span>•</span>
        <span>Rawalpindi, Pakistan</span>
        <span>•</span>
        <span>Open Daily 12pm – 11pm</span>
        <span>•</span>
        <span>Restaurant Reservations</span>
      </footer>
    </main>
  );
}

export default Menu;
