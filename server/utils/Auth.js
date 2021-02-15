const { verify } = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");

const User = require("../models/User");

const authenticate = (next) => async (parent, args, context, info) => {
  const { cookies } = context;
  const accessToken = cookies["access-token"];
  const refreshToken = cookies["refresh-token"];
  console.log({ accessToken, refreshToken });
  if (!accessToken || !refreshToken) {
    throw new AuthenticationError("Unauthenticated");
  }
  try {
    const { id: accessTokenId } = verify(accessToken, process.env.JWT_SECRET);
    const { id: refreshTokenId } = verify(refreshToken, process.env.JWT_SECRET);
    const user = await User.find({ _id: accessTokenId });
    if (!user) {
      throw new AuthenticationError("Unauthenticated");
    }
    if (!next) return user[0];
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
