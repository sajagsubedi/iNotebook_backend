const { validationResult } = require("express-validator");
const Notes = require("../models/Note.js");
const { createCustomError } = require("../errors/customError");

//-----CONTROLLER 1 : To  fetch  note corresponding to A a user  using GET '/api/notes/fetchallnotes'----
const fetchNotes = async (req, res) => {
  //getting user id from req
  const { id: userId } = req.user;
  let data = await Notes.find({ user: userId });
  res.json({ TotalResults: data.length, note: data });
};

//----CONTROLLER 2 : To add a note using POST '/api/notes/addnote'-----
const addNote = async (req, res) => {
  //checking validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  //getting required parameters
  const { title, description, tag } = req.body;
  const { id: userId } = req.user;

  //creating a note
  let newNote = await Notes.create({ title, description, tag, user: userId });

  //sending the newNote which is added
  res.json(newNote);
};

//------CONTROLLER 3 : To Update a note using PUT '/api/notes/updatenote/:id'----
const updateNote = async (req, res) => {
  //getting required parameters
  const { id: noteId } = req.params;
  const { title, description, tag } = req.body;
  const { id: userId } = req.user;
  let updatenote = {};

  //adding title to updated note if it exists
  if (title) {
    updatenote.title = title;
  }
  //adding Description to updated note if it exists
  if (description) {
    updatenote.description = description;
  }
  //adding tag to updated note if it exists
  if (tag) {
    updatenote.tag = tag;
  }

  //updating a note
  const newNote = await Notes.findOneAndUpdate(
    {
      _id: noteId,
      user: userId,
    },
    updatenote,
    {
      new: true,
      runValidators: true,
    }
  );
  //checking weather the note exists or not
  if (!newNote) {
    return createCustomError("Note doesn't exists with the given id", 404);
  }

  //sending the updated note
  res.json({ success: "true", msg: "Updated Successfully", newNote });
};

//-----CONTROLLER 4 : To Delete a note using DELETE '/api/notes/deletenote/:id'-----
const deleteNote = async (req, res) => {
  //getting required parameters
  const { id: noteId } = req.params;
  const { id: userId } = req.user;

  //deleting a note
  const deletedNote = await Notes.findOneAndDelete({
    _id: noteId,
    user: userId,
  });
  //checking weather the note exists or not
  if (!newNote) {
    createCustomError("Note doesn't exists with the given id", 404);
  }
  res.json({ success: true, msg: "deleted note successfully", deletedNote });
};

//exports
module.exports = {
  fetchNotes,
  addNote,
  updateNote,
  deleteNote,
};
