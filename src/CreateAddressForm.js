import React, {useState} from 'react';



const CreateAddressForm = ({createAddress})=>{

  const [address, setAddress] = useState("");

  const onSubmit = (ev)=>{
    ev.preventDefault()
    console.log("CreateAddressForm, onSubmit function address: ", address)
    createAddress(address)

  }
  return(
    <div>Create Address form
      <form onSubmit={onSubmit}>
        <input type="text" onChange={(ev)=>setAddress(ev.target.value)}value= {address} placeholder="Enter address here"></input>
        <button>Submit Address</button>
      </form>
    </div>
  )
}

export default CreateAddressForm;
