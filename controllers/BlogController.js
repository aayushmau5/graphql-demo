const Blog = require("../models/Blog");

exports.blogs = async function () {
  const blogs = await Blog.find().populate("User");
  return blogs;
};

exports.blog = async function (_, args) {
  const { id } = args;
  const blog = await Blog.find({ _id: id }).populate("User");
  return blog[0];
};

exports.addBlog = async function (_, args) {
  const { title, post } = args.blog;
  const blog = new Blog({
    title,
    post,
    author: "get from token",
  });
  const savedBlog = await blog.save();
  return savedBlog;
};

exports.deleteBlog = async function (_, args) {
  const { id } = args;
  //TODO delete blog after authentication
};

exports.updateBlog = async function (_, args) {
  const { id, title, post } = args.blog;
  //TODO update blog after authentication
};
