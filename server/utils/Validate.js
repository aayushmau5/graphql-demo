const Joi = require("joi");
const { UserInputError } = require("apollo-server");

const userSignupValidationSchema = Joi.object({
  username: Joi.string().alphanum().min(2).required(),
  password: Joi.string().min(6).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
});

const userLoginValidationSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ["com", "net"] },
    })
    .required(),
  password: Joi.string().min(6).required(),
});

const blogInputValidationSchema = Joi.object({
  title: Joi.string().min(2).max(200).required(),
  post: Joi.string().min(2).required(),
});

function validateSignupInput({ username, password, email }) {
  const { value, error } = userSignupValidationSchema.validate({
    username,
    password,
    email,
  });
  if (error) {
    throw new UserInputError(error.message);
  }
  return value;
}

function validateLoginInput({ email, password }) {
  const { value, error } = userLoginValidationSchema.validate({
    email,
    password,
  });
  if (error) {
    throw new UserInputError(error.message);
  }
  return value;
}

function validateBlogInput({ title, post }) {
  const { value, error } = blogInputValidationSchema.validate({
    title,
    post,
  });
  if (error) {
    throw new UserInputError(error.message);
  }
  return value;
}

module.exports = {
  validateSignupInput,
  validateLoginInput,
  validateBlogInput,
};
