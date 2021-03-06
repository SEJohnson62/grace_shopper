import React, {useState} from 'react';

const Product = ({ product, addToCart })=> {
  // Added a quantity selector
  // Pass the quantity as a parameter to addToCart
  const [quantity, setQuantity] = useState(0);

  const _addToCart = async() => {
    //console.log("In _addToCart: quantity =",quantity,"product avail=",product.avail);
    product.avail = product.avail - quantity;
    await addToCart(product, quantity) //see App.js
    setQuantity(0);
  }
  const onSubmit = (ev)=> {
    ev.preventDefault();
  }
  return (
    <form onSubmit={onSubmit}>
      <li key={ product.id }>
        <span><a href={`#view=product&id=${product.id}`} >{ product.name }</a></span>
        <span>
          ${
            Number(product.price).toFixed(2)
          }
        </span>
        <div>
        <label>Choose quantity:</label>
        <input key={ product.id } value={ quantity }
          onChange={ev=> setQuantity(ev.target.value*1)}
          id={product.id} type="number" name="quantity"
          min="0" max={product.avail}></input>
        <button disabled={!quantity} onClick={ _addToCart}>Add to Cart</
button>
        </div>
      </li>
    </form>
  )
}

export default Product;
