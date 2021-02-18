const { verify } = require("jsonwebtoken");
const { AuthenticationError } = require("apollo-server");
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const authenticate = (next) => async (parent, args, context, info) => {
  const { cookies } = context;
  const accessToken = cookies["access-token"];
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
    try {
      const refreshToken = cookies["refresh-token"];
      if (!refreshToken) {
        throw new AuthenticationError("Unauthenticated");
      }
      const { id: refreshTokenId } = verify(
        refreshToken,
        process.env.JWT_SECRET
      );
      console.log("rt function ran");
      const user = await User.find({ _id: refreshTokenId });
      if (!user) {
        throw new AuthenticationError("Unauthenticated");
      }
      //Re-new access token
      const token = jwt.sign({ id: user[0]._id }, process.env.JWT_SECRET, {
        expiresIn: "15min",
      });
      context.res.cookie("access-token", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 15, // 15 Minutes
        secure: process.env.NODE_ENV === "production",
      });
      if (!next) return user[0];
      context.user = user[0];
      return next(parent, args, context, info);
    } catch (error) {
      throw new AuthenticationError("Authentication Failed");
    }
  }
};

module.exports = authenticate;
