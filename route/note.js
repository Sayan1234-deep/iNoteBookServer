const express = require("express");
const router = express.Router();
const fetchUser = require("../middleware/fetchUser");
const Notes = require("../model/notes");
const { body, validationResult } = require("express-validator");

//********************************ROUTE 1 : Get all notes*****************************************
router.get("/fetchallnotes", fetchUser, async (req, res) => {
  try {
    const notes = await Notes.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).json("Some internal server error occurred!");
  }

});

//***************************ROUTE 2 : Add New note (post)*************************
router.post(
  "/addnote",
  fetchUser,
  [
    body("title", "Enter A valid title").isLength({ min: 3 }),
    body("description", "Enter A valid desciption").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, tag } = req.body;
      const note = new Notes({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      res.status(500).json("Some internal server error occurred1!");
      console.log(error);
    }

  }

);

//*******************ROUTE 3 : Update a note (PUT method)********************************

router.put("/updatenote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;

  //create a newNote Object
  const newNote = {};

  if (title) {
    newNote.title = title;
  }
  if (description) {
    newNote.description = description;
  }
  if (tag) {
    newNote.tag = tag;
  }

  //find the note to be updated

  let note = await Notes.findById(req.params.id);
  if (!note) {
    res.status(404).send("Not Found!!");
    return
  }
  if (note.user.toString() !== req.user.id) {
    return res.status(401).send("Not Allowed!");
  }

  note = await Notes.findByIdAndUpdate(
    req.params.id,
    { $set: newNote },
    { new: true }
  );
  res.json(note);

});

//***************************ROUTE 4 : Delete New note (DELETE)*************************

router.delete("/deletenote/:id", fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;

  //find the note to be updated

  let note = await Notes.findById(req.params.id);
  if (!note) {
    res.status(404).json("Not Found!!");
  }
  if (note.user.toString() !== req.user.id) {
    return res.status(401).json("Not Allowed!");
  }

  note = await Notes.findByIdAndDelete(req.params.id);
  res.json("success!!");

});

module.exports = router;
