const { PubSub } = require("apollo-server");

const { Blog } = require("../utils/DB");
const isValidId = require("../utils/CheckId");
const { validateBlogInput } = require("../utils/Validate");

const pubsub = new PubSub();

exports.blogs = async function () {
  return await Blog.getAllBlogs();
};

exports.blog = async function (_, args) {
  const { id } = args;
  isValidId(id);
  return await Blog.getSpecificBlog(id);
};

exports.addBlog = async function (_, args, { user }) {
  const { title, post } = validateBlogInput(args.blog);
  try {
    const blog = new Blog(title, post, user._id);
    const savedBlog = await blog.addBlog();
    pubsub.publish("BLOG_ADDED", savedBlog);
    return savedBlog;
  } catch (err) {
    return err;
  }
};

exports.updateBlog = async function (_, args, { user }) {
  const { title, post } = validateBlogInput(args.blog);
  const { id } = args.blog;
  isValidId(id);
  try {
    const blog = new Blog(title, post, user._id);
    const updatedBlog = await blog.updateBlog(id);
    return updatedBlog;
  } catch (err) {
    return err;
  }
};

exports.deleteBlog = async function (_, args, { user }) {
  const { id } = args;
  isValidId(id);
  try {
    const deletedBlog = await Blog.deleteBlog(id, user._id);
    return deletedBlog;
  } catch (err) {
    return err;
  }
};

exports.blogAdded = {
  subscribe: () => pubsub.asyncIterator("BLOG_ADDED"),
  resolve: (payload) => payload,
};
