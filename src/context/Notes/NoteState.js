import React,{useState} from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) =>{
    // const s1 = {
    //     "name" : "Tanishk",
    //     "class":"12A",
    // }
    // const [state, setstate] = useState(s1);
    // const update =()=>{
    //     setTimeout(() => {
    //         setstate({
    //             "name":"Tanishk",
    //             "class":"12B",
    //         })
    //     }, 1000);
    // }
    const host = "http://localhost:5000"
    const notesInitial = []
      const [notes, setnotes] = useState(notesInitial)
      //get notes
      const getNotes = async () =>{
        //API call
        const response = await fetch(`${host}/api/notes/fetchallnotes`, {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json',
            "auth-token": localStorage.getItem('token')
            
          },
        });
        const json = await response.json(); 
        console.log(json);
        setnotes(json)
      }
      //add note
      const addNote = async (title,description,tag) =>{
         //API call
         const response = await fetch(`${host}/api/notes/addnote`, {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
            "auth-token": localStorage.getItem('token')
            
          },
          body: JSON.stringify({title,description,tag}) 
        });
        const note = await response.json();
        setnotes(notes.concat(note))
      }
      //delete note
      const deleteNote =async (id) =>{
        //API call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
          method: 'DELETE', 
          headers: {
            'Content-Type': 'application/json',
            "auth-token": localStorage.getItem('token')
            
          },
        });
        const json = response.json(); 
        console.log(json)
        console.log("deleting note with id "+ id );
        const newNote = notes.filter((note)=>{return note._id!==id})
       
        setnotes(newNote);
      }

      const editNote = async (id,title,description,tag) =>{
        //API call
        const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
          method: 'PUT', 
          headers: {
            'Content-Type': 'application/json',
            "auth-token": localStorage.getItem('token')
            
          },
          body: JSON.stringify({title,description,tag}) 
        });
        const json = response.json(); 
        console.log(json);
      

        //logic to edit in client
        let newNotes = JSON.parse(JSON.stringify(notes))
        for (let index = 0; index < newNotes.length; index++) {
          const element = newNotes[index];
          if(element._id===id)
          {
            newNotes[index].title=title;
            newNotes[index].description=description;
            newNotes[index].tag=tag;
            break;
          }
        }
        setnotes(newNotes);
      }
      const getUser = async () =>{
        //API call
        const response = await fetch(`${host}/api/auth/getuser`, {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json',
            "auth-token": localStorage.getItem('token')
            
          },
        });
        const json = await response.json(); 
        console.log(json);
        setnotes(json)
      }
    return(
       <NoteContext.Provider value={{notes,addNote,deleteNote,editNote,getNotes,getUser}}>
           {props.children}
       </NoteContext.Provider>

    );
}

export default NoteState;