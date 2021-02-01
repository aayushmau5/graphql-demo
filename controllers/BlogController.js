const { AuthenticationError, UserInputError } = require("apollo-server");
const isValidId = require("../utils/CheckId");

const Blog = require("../models/Blog");
const User = require("../models/User");
const { validateBlogInput } = require("../utils/Validate");

exports.blogs = async function () {
  const blogs = await Blog.find().populate("author");
  return blogs;
};

exports.blog = async function (_, args) {
  const { id } = args;
  isValidId(id);
  const blog = await Blog.find({ _id: id }).populate("author");
  return blog[0];
};

exports.addBlog = async function (_, args, { user }) {
  const { title, post } = validateBlogInput(args.blog);
  try {
    const blog = new Blog({
      title,
      post,
      author: user._id,
    });
    const savedBlog = await blog.save();
    const author = (await User.find({ _id: user._id }))[0];
    author.blogs.push(savedBlog._id);
    const savedUser = await author.save();
    savedBlog.author = savedUser;
    return savedBlog;
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.deleteBlog = async function (_, args, { user }) {
  const { id } = args;
  isValidId(id);
  const blog = (await Blog.find({ _id: id }))[0];
  if (!blog) {
    throw new UserInputError("No blogs found");
  }
  console.log(blog);
  console.log(user._id.toString());
  if (user._id.toString() !== blog.author.toString()) {
    throw new AuthenticationError("Permission denied to delete this blog");
  }

  try {
    const deletedBlog = await blog.delete();
    const author = (await User.find({ _id: user._id }))[0];
    author.blogs = author.blogs.filter(
      (blogId) => blogId.toString() !== deletedBlog._id.toString()
    );
    await author.save();
    deletedBlog.author = user;
    return deletedBlog;
  } catch (err) {
    throw new Error(err.message);
  }
};

exports.updateBlog = async function (_, args, { user }) {
  const { title, post } = validateBlogInput(args.blog);
  const { id } = args.blog;
  isValidId(id);
  const blog = (await Blog.find({ _id: id }))[0];
  if (!blog) {
    throw new UserInputError("No blogs found");
  }
  if (user._id !== blog.author.toString()) {
    throw new AuthenticationError("Permission denied to delete this blog");
  }
  blog.title = title;
  blog.post = post;

  try {
    const updatedBlog = await blog.save();
    updatedBlog.author = user;
    return updatedBlog;
  } catch (err) {
    throw new Error(err.message);
  }
};
