const express = require("express");
const router = express.Router();
const authMiddleWare = require("../middleware/authMiddleWare");
const UserModel = require("../models/UserModel");

router.get("/:searchText", authMiddleWare, async (req, res) => {
  const { searchText } = req.params;
  if (searchText.length === 0) return;
  try {
    const results = await UserModel.find({
      name: { $regex: searchText, $options: "i" /*not case sensetive */ },
    });
    res.json(results);
  } catch (error) {
    return res.status(500).send("Server Error");
  }
});

module.exports = router;
