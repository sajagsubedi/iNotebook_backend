const router = require("express").Router();
const { body } = require("express-validator");
const checkUser = require("../middleware/checkuser");
const {
  fetchNotes,
  addNote,
  updateNote,
  deleteNote,
} = require("../controllers/notes");

//validation options
const postOption = [
  body("title", "Title must be atleast 3 characters").isLength({ min: 3 }),
  body("description", "Description mustbe atleast 5 characters").isLength({
    min: 5,
  }),
];

//-------ROUTES FOR CRUD OF NOTES--------
//Route:1
router.route("/fetchallnotes").get(checkUser, fetchNotes);
//Route:2
router.route("/addnote").post(postOption, checkUser, addNote);
//Route:3
router.route("/updatenote/:id").put(checkUser, updateNote);
//Route:4
router.route("/deletenote/:id").delete(checkUser, deleteNote);

//export of a router
module.exports = router;
