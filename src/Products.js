import React, {useState} from 'react';
import Product from './Product.js';

const Products = ({ products, addToCart })=> {

  // TODO: Disable the addToCart button when available inventory reaches zero.
  // TODO: Update product.avail after Create Order event
  // Pass the quantity as a parameter to addToCart

  return (
    <div>
      <h2>Products</h2>
      <ul>
        {
          products.map( product => {
            return (
              <Product key={product.id} product={ product }/>
            );
          })
        }
      </ul>
    </div>
  );
};

export default Products;
