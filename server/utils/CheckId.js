const mongoose = require("mongoose");
const { UserInputError } = require("apollo-server");

function isValidId(id) {
  if (!mongoose.isValidObjectId(id)) {
    throw new UserInputError("Invalid ID");
  }

  return id;
}

module.exports = isValidId;
