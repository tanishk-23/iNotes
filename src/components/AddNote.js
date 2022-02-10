import React, { useState,useContext } from "react";
import NoteContext from "../context/Notes/NoteContext";
const AddNote = (props) => {
    const context = useContext(NoteContext);
  const { addNote } = context;
  const [note, setnote] = useState({"title":"","description":"","tag":""})
  const handleClick = (e) =>{
    e.preventDefault();
    addNote(note.title,note.description,note.tag);
    setnote({"title":"","description":"","tag":""})
    props.showAlert("Added successfully","success")
  }
  const onChange = (e) =>{
    setnote({...note,[e.target.name]:e.target.value})
  }
  return (
    <>
      <div className="container my-3">
        <h1>Add a note</h1>
        <form className="my-3">
          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              className="form-control"
              id="title"
              name="title"
              value={note.title}
              aria-describedby="emailHelp"
              onChange={onChange}
              minLength={5}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              className="form-control"
              name="description"
              id="description"
              value={note.description}
              onChange={onChange}
              minLength={5}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="tag" className="form-label">
              Tag
            </label>
            <input
              type="text"
              className="form-control"
              name="tag"
              id="tag"
              value={note.tag}
              onChange={onChange}
            />
          </div>
          <button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>
            Add Note
          </button>
        </form>
      </div>
    </>
  );
};

export default AddNote;
