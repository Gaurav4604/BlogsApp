const catchAsync = require('../utils/catchAsync');
const {Blog} = require('../models/blogModel');

exports.getAllBlogs = catchAsync(async (req, res, next) => {
    const blogs = await Blog.find();

    res.status(200).json({
        status: 'success',
        length: blogs.length,
        data: {
            blogs
        }
    });
});

exports.createBlog = catchAsync(async (req, res, next) => {
    const blog = await Blog.create(req.body);
    
    res.status(200).json({
        status: 'success',
        data: {
            blog
        }
    });
});