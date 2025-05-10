import {useState,useEffect} from 'react';
export default function MyPro(){
const [submit,setSubmit] = useState(false);
const [disable,setDisable] = useState(false)
const [name,setName] = useState("");
const [blood,setBlood] = useState("");
const [contact,setContact] = useState("");
const [bbms,setBbms] = useState([]);
const [err,setErr] = useState("");
const [success,setSuccess] = useState("");
const [slist,setSlist] = useState("Show List")
const [value,setValue] = useState(false)
const [editId,setEditid] = useState(-1)
const apiUrl = "https://onest-mern-app-backend.onrender.com";
const [editname,setEditname] = useState("");
const [editblood,setEditblood] = useState("");
const [editcontact,setEditcontact] = useState("");
const handleUpdate = ()=>{
  setErr("")
  if(editname && editblood && editcontact){
  fetch(`${apiUrl}/bbm/${editId}`,{
  method:"PUT",
  headers:{
    'Content-Type':'application/json',
  },
  body:JSON.stringify({name:editname,blood:editblood,contact:editcontact})
}).then((res)=>{
if(res.ok)
{
 const updatedBbms = bbms.map((item)=>{
    if(item._id === editId){
      item.name = editname
      item.blood = editblood
      item.contact = editcontact
    }
    return item;
  })
  setBbms(updatedBbms);
  setSuccess("Details Updated Successfully!!!")
  setTimeout(()=>{
    setSuccess("")
  },3000)
  setEditid(-1)
  }
else{setErr("Unable to Create")}
}).catch(()=>{
setErr("Unable to Create")
})
}
else{setErr("Unable to Create")}
}
const handleCancel = ()=>{
  setEditid(-1)
  setEditname("")
  setEditblood("")
  setEditcontact("")
}
const handleEdit = (item)=>{
  setEditid(item._id);
  setEditname(item.name);
  setEditblood(item.blood);
  setEditcontact(item.contact)
}
const handleList = ()=>{
  if(slist==="Show List"){
  setSlist("Hide List")
  setValue(true)
  
  //
  }
  else{
    setSlist("Show List")
    setValue(false)
  //
  }
}
const handleName = (e)=> setName(e.target.value);
const clearSubmit = ()=>{
      setName("");
      setBlood("");
      setContact("");
     }
const handleSubmit = ()=>{
    if(!disable){
      setDisable(true)
    }
    setErr("")
    if(name && blood && contact){
    fetch(apiUrl+"/bbm",{
    method:"POST",
    headers:{
      'Content-Type':'application/json',
    },
    body:JSON.stringify({name,blood,contact})
  }).then((res)=>{
  if(res.ok)
  {
    res.json().then((newEntry) => {
      setBbms([...bbms, newEntry]);
    });
    setSuccess("Details Added Successfully!!!")
    setTimeout(()=>{
      setSuccess("")
    },3000)
    }
  else{setErr("Unable to Create")}
}
).catch(()=>{
  setErr("Unable to Create")
})
}
else{setErr("Unable to Create")}
}
useEffect(()=>{
  getItems()
},[])
const getItems = ()=>{
  fetch(apiUrl+"/bbm")
  .then((res)=>res.json())
  .then((res)=>{
    setBbms(res)
  })
}
const handleDelete = (_id) => {
  if(window.confirm("Are You Sure Want To Delete")){
  fetch(`${apiUrl}/bbm/${_id}`, {
    method: 'DELETE'
  }).then(res => {
    if (res.ok) {
      setBbms(bbms.filter(item => item._id !== _id));
    } else {
      setTimeout(()=>{setErr("Unable to Delete")},3000);
    }
  }).catch(() => {
    setErr("Unable to Delete");
  });
}
}

return (
    <>
      <div className="row p-3 text-danger text-center">
        <h1>Blood Bank Management System</h1>
      </div>
      <div className="text-center row">
        <h2>Add Your Details</h2>
        {success && <p className="text-success">{success}</p>}
      </div>
      <div className="form-group gap-3 d-flex flex-column">
        <input placeholder="Name" className="form-control" type="text" value={name} onChange={handleName} required></input>
        <input placeholder="Bloodgroup" className="form-control" type="text" value={blood} onChange={(e)=> setBlood(e.target.value)} required></input>
        <input placeholder="Contact" className="form-control" type="text" value={contact} onChange={(e)=> setContact(e.target.value)} required></input>
      </div>
      <br></br>
      <div className="d-flex flex-row gap-3 ">
      <input type="checkbox" className="custom-checkbox-lg" onClick={() =>{
        if (submit===false){setSubmit(true)}
        else{setSubmit(false)}}}></input>
      <p className=""> By Clicking this, I accept the T&C of this website and I'm completety okay to share my details in this website...</p>
      <div className='d-flex gap-3 ms-auto'>
      <button className='btn btn-dark' onClick={clearSubmit}>Clear</button>
      <button className="btn btn-danger" disabled={!submit} onClick={handleSubmit}>Submit</button><br></br>
      </div>
      </div>
      <center>
      {err && <p className='text-danger'>{err}</p>}
      </center>
      
      <div className='text-center row mt-3' style={{
       opacity: disable ? 1 : 0 
      }}>
        <div className='row mt-3 gap-3'>
        <h3>Your Details</h3>
          <ul>
            <li className='list-group-item d-flex justify-content-between align-items-center'>
              <div  className='d-flex flex-column justify-content-between'>
              <span className='fw'>Name:{name}</span>
              <span className='fw'>Blood-grp:{blood}</span>
              <span className='fw'>Contact:{contact}</span>
              </div>
            </li>
          </ul>
          </div>
          <div className='align-items-center d-flex justify-content-center bg-transparent'>
           <button className='btn btn-warning'><h5 style={{backgroundColor:'transparent'}} onClick={handleList}>{slist}</h5></button>
          </div><br></br>
           <div className=''style={{opacity: value ? 1 : 0}}> 
            <ul className='list-group'>
  {
    bbms.map((item) => (
      <li key={item._id} className='list-group-item bg- my-2'>
        <div className='d-flex flex-row gap-5'>
          {
            editId !== item._id || editId === -1 ? (
              <>
                <span>Name: {item.name}</span>
                <span>Bloodgroup: {item.blood}</span>
                <span>Contact: {item.contact}</span>
              </>
            ) : (
              <div className="form-group gap-3 d-flex flex-row">
                <input placeholder="Edit Name" className="form-control" type="text" value={editname} onChange={(e) => setEditname(e.target.value)} required />
                <input placeholder="Edit Bloodgroup" className="form-control" type="text" value={editblood} onChange={(e) => setEditblood(e.target.value)} required />
                <input placeholder="Edit Contact" className="form-control" type="text" value={editcontact} onChange={(e) => setEditcontact(e.target.value)} required />
              </div>
            )
          }
          <div className='d-flex gap-2 ms-auto'>
            {
              editId === -1 || editId !== item._id
                ? <button className='btn btn-success' onClick={() => handleEdit(item)}>Edit</button>
                : <button className='btn btn-warning' onClick={handleUpdate}>Update</button>
            }
            {
              editId === -1 || editId !== item._id
                ? <button className='btn btn-danger' onClick={() => handleDelete(item._id)}>Delete</button>
                : <button className='btn btn-danger' onClick={handleCancel}>Cancel</button>
            }
          </div>
        </div>
      </li>
    ))
  }
</ul>

            </div>
            </div>
            </>);
}
