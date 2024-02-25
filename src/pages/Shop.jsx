import React, { useState } from "react";
// import Navigation from "./Navigation/Nav";
import Products from "../components/Shop-page/Products/Products";
import products from "../components/Shop-page/db/data";
import Recommended from "../components/Shop-page/Recommended/Recommended";
import Sidebar from "../components/Shop-page/Sidebar/Sidebar";
import Card from "../components/Shop-page/components/Card";
import "../App.css";

function Shop() {
  const [selectedCategory, setSelectedCategory] = useState(null);

  // Input Filter
  const [query, setQuery] = useState("");

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const filteredItems = products.filter(
    (product) => product.title.toLowerCase().indexOf(query.toLowerCase()) !== -1
  );

  // Radio Filtering
  const handleChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  // Button Filtering
  const handleClick = (event) => {
    setSelectedCategory(event.target.value);
  };

  function filteredData(products, selected, query) {
    let filteredProducts = products;

    // Filtering Input Items
    if (query) {
      filteredProducts = filteredItems;
    }

    // Applying selected filter
    if (selected) {
      filteredProducts = filteredProducts.filter(
        ({ category, color, company, newPrice, title }) =>
          category === selected ||
          color === selected ||
          company === selected ||
          newPrice === selected ||
          title === selected
      );
    }

    return filteredProducts.map(
      ({ img, title, star, reviews, prevPrice, newPrice }) => (
        <Card
          key={Math.random()}
          img={img}
          title={title}
          star={star}
          reviews={reviews}
          prevPrice={prevPrice}
          newPrice={newPrice}
        />
      )
    );
  }

  const result = filteredData(products, selectedCategory, query);

  return (
    <div className="shop">
      <Sidebar handleChange={handleChange} />
      {/* <Navigation query={query} handleInputChange={handleInputChange} /> */}
      <Recommended handleClick={handleClick} />
      <Products result={result} />
    </div>
  );
}

export default Shop;