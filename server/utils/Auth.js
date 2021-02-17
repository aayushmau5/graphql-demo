const { verify } = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");

const User = require("../models/User");

const authenticate = (next) => async (parent, args, context, info) => {
  const { cookies } = context;
  const accessToken = cookies["access-token"];
  if (!accessToken) {
    throw new AuthenticationError("Unauthenticated");
  }
  try {
    const { id: accessTokenId } = verify(accessToken, process.env.JWT_SECRET);
    const user = await User.find({ _id: accessTokenId });
    if (!user) {
      throw new AuthenticationError("Unauthenticated");
    }
    if (!next) return user[0];
    context.user = user[0];
    return next(parent, args, context, info);
  } catch (err) {
    let errMessage = "Authetication Failed";
    if (err.message === "jwt expired") {
      try {
        const refreshToken = cookies["refresh-token"];
        if (!refreshToken) {
          throw new AuthenticationError("Unauthenticated");
        }
        const { id: refreshTokenId } = verify(
          refreshToken,
          process.env.JWT_SECRET
        );
        const user = await User.find({ _id: refreshTokenId });
        if (!user) {
          throw new AuthenticationError("Unauthenticated");
        }
        //TODO: Re-new access token
        if (!next) return user[0];
        context.user = user[0];
        return next(parent, args, context, info);
      } catch (error) {
        throw new AuthenticationError("Authentication Failed");
      }
    }
    throw new AuthenticationError(errMessage);
  }
};

module.exports = authenticate;
