import React, {useState} from 'react';

const Product_details = (params)=>{

  const product = params.product[0]
  console.log("inside product_detail...logging product: ", product)
  return(
    <div>
      <h2>Product name: {product.name}</h2><br/>
      <b>Product id: </b>{product.id} <br/>
      <b>Product price: </b>${product.price} <br/>
      <b>Product availability: </b>{product.avail} <br/>
      <b>Product Description: </b>{product.description}<br/>
    </div>
  )

}

export default Product_details
