import axios from 'axios';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    FirstName: '',
    LastName: '',
    Address: '',
    City: '',
  });
// Get request to get all the persons
  useEffect(() => {
    axios
      .get('http://localhost:8800/persons')
      .then(response => {
        setData(response.data);
      })
      .catch(error => {
        console.error('Unable to fetch data:', error);
      });
  }, []);


    // Create a handlechange event for the input fields
  const handleChange = event => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

    // Submit event for the form
  const handleSubmit = event => {
    event.preventDefault();

    axios
      .post('http://localhost:8800/persons/submit-form', formData)
      .then(() => {
        setSuccess(true);
        window.location.reload();
      })
      .catch(error => {
        console.error('Unable to submit the form:', error);
      });
  };

    const handleDelete = (event) => {
        event.preventDefault();
    axios
      .delete(`http://localhost:8800/persons/${formData.id}`)
        .then(() => {


          setData(data.filter(item => item.id !== formData.id));

            console.log('User deleted successfully');
 window.location.reload();

      })
      .catch(error => {
        console.error('unable deleting user:', error);
      });
  }; 

  return (
    <>
      <div className='form-container'>
        <form className='form' onSubmit={handleSubmit}>
          <label>
            id:
            <input type='number' name='id' value={formData.id} onChange={handleChange} />
          </label>
          <label>
            FirstName:
            <input type='text' name='FirstName' value={formData.FirstName} onChange={handleChange} />
          </label>
          <label>
            LastName:
            <input type='text' name='LastName' value={formData.LastName} onChange={handleChange} />
          </label>
          <label>
            Address:
            <input type='text' name='Address' value={formData.Address} onChange={handleChange} />
          </label>
          <label>
            City:
            <input type='text' name='City' value={formData.City} onChange={handleChange} />
          </label>
          <button type='submit'>Submit</button>
          <button type='button' onClick={handleDelete}>Delete</button>
        </form>

        {data.map(item => (
          <div key={item.id} className='submitted-form'>
            <h2>Submitted Form</h2>
            <p>ID: {item.id}</p>
            <p>FirstName: {item.firstname}</p>
            <p>LastName: {item.lastname}</p>
            <p>Address: {item.address}</p>
            <p>City: {item.city}</p>
          </div>
        ))}

        {success && <p>Form is submitted</p>}
      </div>
    </>
  );
}

export default App;
