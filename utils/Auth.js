const { verify } = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");

const User = require("../models/User");

const authenticate = (next) => async (parent, args, context, info) => {
  const { token } = context;
  if (token === "") {
    throw new AuthenticationError("Unauthenticated");
  }
  try {
    const { id } = verify(token, process.env.JWT_SECRET);
    const user = await User.find({ _id: id });
    if (!user) {
      throw new AuthenticationError("Unauthenticated");
    }
    context.user = user[0];
    return next(parent, args, context, info);
  } catch (err) {
    let errMessage = "Authetication failed";
    if (err.message === "jwt expired") {
      errMessage = "JWT Expired";
    }
    throw new AuthenticationError(errMessage);
  }
};

module.exports = authenticate;
