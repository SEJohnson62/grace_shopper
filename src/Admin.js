import React, {useState, useEffect} from 'react';
import axios from 'axios';

const Admin = ({ auth })=> {
  const [ users, setUsers ] = useState([]);

  useEffect(()=> {
    axios.get('/api/users', {
      headers: {
        authorization: window.localStorage.getItem('token')
      }
    })
    .then( response=> setUsers(response.data))
    .catch(next)
  }

  return(
    <div>
      <h2>Users</h2>
    </div>
  )
}
