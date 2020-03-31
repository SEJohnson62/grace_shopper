import React, {useState} from 'react';



const CreateAddressForm = ({createAddress})=>{

  const [address, setAddress] = useState("");

  const onSubmit = (ev)=>{
    ev.preventDefault()
    createAddress(address)

  }
  return(
    <div>
      <form onSubmit={onSubmit}>
        Create a new address form
        <input type="text" onChange={(ev)=>setAddress(ev.target.value)}value= {address} placeholder="Enter address here"></input>
        <button>Submit Address</button>
      </form>
    </div>
  )
}

export default CreateAddressForm;
