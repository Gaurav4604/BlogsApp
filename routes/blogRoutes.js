const express = require('express');
const blogController = require('../controllers/blogController');
// create a router
const blogRouter = express.Router();

// define routes

blogRouter.route('/')
    .get(blogController.getAllBlogs)
    .post(blogController.createBlog);

blogRouter.route('/:id')
    .get(blogController.getBlog)
    .patch(blogController.editBlog)
    .delete(blogController.deleteBlog);

// export
exports.blogRouter = blogRouter;