import React, {useState} from 'react';
import Products from './Products';

const Product = ({ product })=> {
  // Added a quantity selector
  const [quantity, setQuantity] = useState(1);

  const onSubmit = (ev)=> {
    ev.preventDefault();
  }
  return (
    <form onSubmit={onSubmit}>
      <li key={ product.id }>
        <span>{ product.name }</span>
        <span>
          ${
            Number(product.price).toFixed(2)
          }
        </span>
        <div>
        <label>Choose quantity:</label>
        <input value={ quantity }
          onChange={ev=> setQuantity(ev.target.value)}
          id="quantity" type="number" name="quantity"
          min="1" max={product.avail}></input>
        <button onClick={()=> addToCart(product.id, quantity)}>Add to Cart</
button>
        </div>
      </li>
    </form>
)
}

export default Product;
