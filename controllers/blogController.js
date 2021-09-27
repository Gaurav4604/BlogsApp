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

exports.getBlog = catchAsync(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id);

    res.status(200).json({
        status: 'success',
        data: {
            blog
        }
    });
});

exports.deleteBlog = catchAsync(async (req, res, next) => {
    await Blog.findByIdAndDelete(req.params.id, req.body);

    res.status(204).json({
        status: 'success'
    });
});

exports.editBlog = catchAsync(async (req, res, next) => {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            blog
        }
    });
})