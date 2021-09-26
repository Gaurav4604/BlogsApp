const express = require('express');
const blogController = require('../controllers/blogController');
// create a router
const blogRouter = express.Router();

// define routes

blogRouter.route('/')
    .get(blogController.getAllBlogs)
    .post(blogController.createBlog);

// blogRouter.route('/:id')
//     .get(blogController.getBlog)
//     .post(blogController.deleteBlog)
//     .patch(blogController.editBlog);

// export
exports.blogRouter = blogRouter;