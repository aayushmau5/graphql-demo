const Blog = require("../models/Blog");
const { validateBlogInput } = require("../utils/Validate");

exports.blogs = async function () {
  const blogs = await Blog.find().populate("author");
  return blogs;
};

exports.blog = async function (_, args) {
  const { id } = args;
  const blog = await Blog.find({ _id: id }).populate("author");
  return blog[0];
};

exports.addBlog = async function (_, args, { user }) {
  const { title, post } = validateBlogInput(args.blog);
  const blog = new Blog({
    title,
    post,
    author: user._id,
  });
  const savedBlog = await blog.save();
  savedBlog.author = user;
  return savedBlog;
};

exports.deleteBlog = async function (_, args) {
  const { id } = args;
  //TODO delete blog after authentication
};

exports.updateBlog = async function (_, args) {
  const { title, post } = validateBlogInput(args.blog);
  const { id } = args.blog;
  //TODO update blog after authentication
};
