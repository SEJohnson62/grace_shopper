import React, {useState} from 'react';

const CartPage = ({ lineItems, cart, createOrder, removeFromCart, products,
  CreateAddressForm, createAddress, addresses })=> {

  //console.log("addresses in cart:", addresses )
  //console.log("lineItems in cart:", lineItems);
  const [selectedAddress, setSelectedAddress] = useState("");
  const onChange = (ev)=>{
    setSelectedAddress(ev.target.value);
  }

  const _removeFromCart = async(lineItem, product) => {
    product.avail = product.avail + lineItem.quantity;
    await removeFromCart(lineItem.id, product) //see App.js
  }
  return (
    <div>
      <h2>Cart - { cart.id && cart.id.slice(0, 4) }</h2>
      <button disabled={ !lineItems.find( lineItem => lineItem.orderId === cart.id )} onClick={ createOrder }>Create Order</button>

      <br/><br/> Select your shipping address:
      <select onChange={ev=> onChange(ev)}>
        {
          addresses.map((address, idx) =>{
            return(
              <option value={address} key={idx}>
                {address}
              </option>
            )
          })
        }
      </select>
      <br/><br/>

      <ul>
        {
          lineItems.filter( lineItem => lineItem.orderId === cart.id ).map( lineItem => {
            const product = products.find( product => product.id === lineItem.productId);
            return (
              <li key={ lineItem.id }>
                { product && <a href={`#view=product&id=${product.id}`} >{ product.name }</a>}
                { product && product.description}
                { ' ' }
                <span className='quantity'>Quantity: { lineItem.quantity }</span>
                <button onClick={ ()=> _removeFromCart(lineItem, product)}>Remove From Cart</button>
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};

export default CartPage;
