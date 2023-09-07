import React, { useState } from "react";
import Cart from "../Components/Cart";
import NavBar from "../Components/NavBar";
import ProductTable from "../Components/ProductTable";

function Home() {
  const [open, setOpen] = useState(false);
  const [cart, updateCart] = useState(
    JSON.parse(localStorage.getItem("shoppingCart")) || []
  );
  return (
    <main>
      <NavBar
        {...{
          setOpen,
          numOfItems: cart.reduce((acc, curr) => (acc += curr.quantity), 0),
        }}
      />
      <Cart {...{ open, setOpen, cart, updateCart }} />
      <ProductTable {...{ cart, updateCart, open, setOpen }} />
    </main>
  );
}

export default Home;
