import React from 'react';

const Cart = ({ lineItems, cart, createOrder, removeFromCart, products,
  CreateAddressForm, createAddress })=> {

  const _removeFromCart = async(lineItem, product) => {
    product.avail = product.avail + lineItem.quantity;
    await removeFromCart(lineItem.id, product) //see App.js
  }
  return (
    <div>
      <h2><a href={`#view=cart&id=${cart.id}`}>Cart - { cart.id && cart.id.slice(0, 4) }</a></h2>
      <button disabled={ !lineItems.find( lineItem => lineItem.orderId === cart.id )} onClick={ createOrder }>Create Order</button>
      <CreateAddressForm createAddress= {createAddress}/>
      <ul>
        {
          lineItems.filter( lineItem => lineItem.orderId === cart.id ).map( lineItem => {
            const product = products.find( product => product.id === lineItem.productId);
            return (
              <li key={ lineItem.id }>
                { product && product.name}
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

export default Cart;
