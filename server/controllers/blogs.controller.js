import Blog from "../models/blogs.model.js";
import { asyncHandler } from "../utils/asyncHandler.utility.js";
import { errorHandler } from "../utils/errorHandler.utility.js";

// Get all blogs
export const getAllBlogs = asyncHandler(async (req, res, next) => {
    const blogs = await Blog.find({}).sort({ createdAt: -1 }).populate("author", "username fullName bio avatar").populate("comments.commentedBy", "username avatar");;
    res.status(200).json({
        success: true,
        responseData: blogs,
    });
});

// Get a single blog
export const getBlogById = asyncHandler(async (req, res, next) => {
    const blog = await Blog.findById(req.params.id).populate("author", "username fullName bio avatar").populate("comments.commentedBy", "username avatar");
    if (!blog) return next(new errorHandler("Blog not found", 404));
    res.status(200).json({
        success: true,
        responseData: blog,
    });
});

// Create a new blog
export const createBlog = asyncHandler(async (req, res, next) => {
    const blog = await Blog.create({
        ...req.body,
        author: req.user._id,
    });
    res.status(201).json({
        success: true,
        responseData: blog,
    });
});

// Update a blog
export const updateBlog = asyncHandler(async (req, res, next) => {
    let blog = await Blog.findById(req.params.id);
    if (!blog) return next(new errorHandler("Blog not found", 404));

    if (blog.author.toString() !== req.user._id.toString()) {
        return next(new errorHandler("Unauthorized", 403));
    }

    blog = await Blog.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        responseData: blog,
    });
});

// Delete a blog
export const deleteBlog = asyncHandler(async (req, res, next) => {
    let blog = await Blog.findById(req.params.id);
    if (!blog) return next(new errorHandler("Blog not found", 404));

    if (blog.author.toString() !== req.user._id.toString()) {
        return next(new errorHandler("Unauthorized", 403));
    }

    blog = await Blog.findByIdAndDelete(req.params.id);

    res.status(200).json({
        success: true,
        responseData: blog,
    });
});

// Comment on a blog
export const commentOnBlog = asyncHandler(async (req, res, next) => {
    const { text } = req.body;
    const blog = await Blog.findByIdAndUpdate(
        req.params.id,
        { $push: { comments: { text, commentedBy: req.user._id } } },
        { new: true, runValidators: true }
    ).populate("comments.commentedBy", "username avatar");
    if (!blog) return next(new errorHandler("Blog not found", 404));
    res.status(200).json({
        success: true,
        responseData: blog,
    });
});

// Delete a comment
export const deleteComment = asyncHandler(async (req, res, next) => {
    const { blogId, commentId } = req.params;

    const blog = await Blog.findById(blogId);
    if (!blog) return next(new errorHandler("Blog not found", 404));

    const comment = blog.comments.id(commentId);
    if (!comment) return next(new errorHandler("Comment not found", 404));

    if (comment.commentedBy.toString() !== req.user._id.toString()) {
        return next(new errorHandler("Unauthorized", 403));
    }

    blog.comments.pull(comment);
    await blog.save();

    res.status(200).json({
        success: true,
        responseData: blog,
    });
});

// Like a blog
export const likeBlog = asyncHandler(async (req, res, next) => {
    const blog = await Blog.findByIdAndUpdate(
        req.params.id,
        { $addToSet: { likes: req.user.id } },
        { new: true, runValidators: true }
    );
    if (!blog) return next(new errorHandler("Blog not found", 404));
    res.status(200).json({
        success: true,
        responseData: blog,
    });
});

// Search for blogs by author or title
export const searchBlogs = asyncHandler(async (req, res, next) => {
    const keyword = req.query.keyword?.toLowerCase() || "";
    const blogs = await Blog.find({
        $or: [
            { title: { $regex: keyword, $options: "i" } },
            { authorName: { $regex: keyword, $options: "i" } },
        ],
    }).sort({ createdAt: -1 }).populate("author", "username fullName blog avatar");
    res.status(200).json({
        success: true,
        responseData: blogs,
    });
});

// Increment a blog's view count
export const incrementViewCount = asyncHandler(async (req, res, next) => {
    const blog = await Blog.findByIdAndUpdate(
        req.params.id,
        { $inc: { views: 1 } },
        { new: true, runValidators: true }
    );
    if (!blog) return next(new errorHandler("Blog not found", 404));
    res.status(200).json({
        success: true,
        responseData: blog,
    });
});
