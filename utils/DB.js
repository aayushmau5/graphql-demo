const bcrypt = require("bcryptjs");
const { UserInputError, AuthenticationError } = require("apollo-server");

const UserModel = require("../models/User");
const BlogModel = require("../models/Blog");

class User {
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  async hashPassword(password) {
    return await bcrypt.hash(password, 16);
  }

  static async comparePassword(normalPassword, hashedPassword) {
    return await bcrypt.compare(normalPassword, hashedPassword);
  }

  async signup() {
    const hashedPassword = await this.hashPassword(this.password);
    const user = new UserModel({
      username: this.username,
      email: this.email,
      password: hashedPassword,
    });
    return await user.save();
  }

  static async login(email, password) {
    const user = (await UserModel.find({ email: email }).populate("blogs"))[0];
    if (!user) {
      throw new UserInputError("Invalid username or password");
    }
    const result = await this.comparePassword(password, user.password);
    if (!result) {
      throw new UserInputError("Invalid username or password");
    }
    return user;
  }

  static async getAllUsers() {
    const allUsers = await UserModel.find().populate("blogs");
    return allUsers;
  }

  static async getSpecificUser(id) {
    const user = (await UserModel.find({ _id: id }).populate("blogs"))[0];
    return user;
  }
}

class Blog {
  constructor(title, post, authorID) {
    this.title = title;
    this.post = post;
    this.authorID = authorID;
  }

  static async getAllBlogs() {
    return await BlogModel.find().populate("author");
  }

  static async getSpecificBlog(id) {
    const blog = (await BlogModel.find({ _id: id }).populate("author"))[0];
    return blog;
  }

  async addBlog() {
    const blog = new BlogModel({
      title: this.title,
      post: this.post,
      author: this.authorID,
    });
    const savedBlog = await blog.save();
    const author = await this.addBlogInAuthor(savedBlog._id);
    savedBlog.author = author;
    return savedBlog;
  }

  async updateBlog(blogID) {
    const blog = (await BlogModel.find({ _id: blogID }))[0];
    if (!blog) {
      throw new UserInputError("No blogs found");
    }
    if (this.authorID.toString() !== blog.author.toString()) {
      throw new AuthenticationError("Permission denied to delete this blog");
    }
    blog.title = this.title;
    blog.post = this.post;
    let updatedBlog = await blog.save();
    updatedBlog = (
      await BlogModel.find({ _id: updatedBlog._id }).populate("author")
    )[0];
    return updatedBlog;
  }

  static async deleteBlog(blogID, authorID) {
    const blog = (await BlogModel.find({ _id: blogID }))[0];
    if (!blog) {
      throw new UserInputError("No blogs found");
    }
    if (authorID.toString() !== blog.author.toString()) {
      throw new AuthenticationError("Permission denied to delete this blog");
    }
    const deletedBlog = await blog.delete();
    const author = await this.deleteBlogFromAuthor(authorID, deletedBlog._id);
    deletedBlog.author = author;
    return deletedBlog;
  }

  async addBlogInAuthor(blogID) {
    const author = (await UserModel.find({ _id: this.authorID }))[0];
    author.blogs.push(blogID);
    return await author.save();
  }

  static async deleteBlogFromAuthor(authorID, blogID) {
    const author = (await UserModel.find({ _id: authorID }))[0];
    author.blogs = author.blogs.filter(
      (blog) => blog.toString() !== blogID.toString()
    );
    let updatedAuthor = await author.save();
    updatedAuthor = (
      await UserModel.find({ _id: updatedAuthor._id }).populate("blogs")
    )[0];
    return updatedAuthor;
  }
}

module.exports = {
  User,
  Blog,
};
