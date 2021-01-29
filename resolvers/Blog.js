const BlogController = require("../controllers/BlogController");
const authenticate = require("../utils/Auth");

exports.blogs = BlogController.blogs;

exports.blog = BlogController.blog;

exports.addBlog = authenticate(BlogController.addBlog);

exports.deleteBlog = authenticate(BlogController.deleteBlog);

exports.updateBlog = authenticate(BlogController.updateBlog);
