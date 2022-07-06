/* eslint-disable camelcase */

const { ObjectID } = require('mongodb');
const cloudinary = require('cloudinary');

const User = require('../../../models/user');
const Post = require('../../../models/post');

const { getArgumentInput } = require('../../../helpers/workWithObjects');
const { uploadFile } = require('../../../helpers/uploadFile');
const isAuth = require('../../../middleware/is-auth');


const getDepartment = (can_view, creator) => {
  if (can_view === 'My Team' || can_view === 'My Department') {
    return creator.current_positions.function.function_short_name;
  }
  if (
    can_view === 'Local Committee'
      || can_view === 'All Alumni'
      || can_view === 'Only EB'
  ) {
    return can_view;
  }
  throw new Error('Please select a permission view!');
};

module.exports.PostMutations = {
  createPost: async (_, { post, attachements }, { req }) => {
    const { createReadStream, filename } = await attachements;

    const creator = await User.findById(isAuth(req));
    const {
      posted_to: { can_view },
    } = getArgumentInput(post);

    const { public_id: id, url: file } = attachements
    && (await uploadFile(filename, createReadStream));

    const newPost = new Post({
      ...getArgumentInput(post),
      is_approved: creator.is_eb || can_view === 'My Team',
      posted_to: {
        can_view,
        department: getDepartment(can_view, creator),
      },
      creator: isAuth(req),
      post_components: {
        component_attachment: {
          file,
          id,
          filename: getArgumentInput(post).filename,
          filesize: getArgumentInput(post).size,
          type: getArgumentInput(post).type,
        },
      },
    });

    try {
      await newPost.save();

      const postResult = await Post.findById(newPost.id).populate('creator');

      if (!creator) {
        throw new Error('User not found.');
      }

      creator.createdPosts.push(newPost);
      await creator.save();

      return postResult;
    } catch (err) {
      throw new Error(err);
    }
  },

  approvePost: async (_, { id }, { req }) => {
    const getPost = await Post.findById(id);
    const user = await User.findById(isAuth(req));

    if (!user.is_admin) {
      throw new Error("You don't have the permission!");
    }
    if (getPost.is_approved) {
      throw new Error('Post is already approved!');
    }
    getPost.is_approved = true;
    getPost.save();

    return getPost;
  },

  updatePost: async (_, { id, post, attachements }, { req }) => {
    const getAttachement = await attachements;

    const getPost = await Post.findById(id);
    const creator = await User.findById(isAuth(req));

    const {
      title,
      description,
      posted_to: { can_view },
    } = getArgumentInput(post);

    getPost.title = title;
    getPost.description = description;

    getPost.posted_to.department = getDepartment(can_view, creator);
    getPost.posted_to.can_view = can_view;

    if (getAttachement.createReadStream) {
      const { public_id, url: file } = getAttachement
      && (await uploadFile(getAttachement.filename, getAttachement.createReadStream));
      if (getPost.post_components[0].id) {
        await cloudinary.uploader.destroy(getPost.post_components[0].id, async (result) => result);
      }
      getPost.post_components[0] = {
        component_attachment: {
          file,
          id: public_id,
          filename: getArgumentInput(post).filename,
          filesize: getArgumentInput(post).size,
          type: getArgumentInput(post).type,
        },
      };
    }
    getPost.save();

    return getPost;
  },

  likePost: async (_, { id }, { req }) => {
    const user = await User.findById(isAuth(req));
    const getPost = await Post.findById(id).populate('likes.liked_by');

    if (!user) {
      throw new Error('User not found.');
    }
    if (!getPost) {
      throw new Error('Post not found.');
    }
    const checkIfLiked = getPost.likes.liked_by.find(
      (liker) => liker.id.toString() === isAuth(req).toString(),
    );
    if (checkIfLiked) {
      throw new Error("You've already liked this post!");
    }

    getPost.likes.count += 1;
    getPost.likes.liked_by.push(user);

    getPost.save();

    return getPost;
  },

  disLikePost: async (_, { id }, { req }) => {
    const user = await User.findById(isAuth(req));
    const getPost = await Post.findById(id).populate('likes.liked_by');

    if (!user) {
      throw new Error('User not found.');
    }
    if (!getPost) {
      throw new Error('Post not found.');
    }
    const checkIfLiked = getPost.likes.liked_by.find(
      (liker) => liker.id === isAuth(req),
    );

    if (!checkIfLiked) {
      throw new Error("You've already disliked this post!");
    }

    const getLiker = getPost.likes.liked_by.findIndex(
      (liker) => liker.id === isAuth(req),
    );
    getPost.likes.count -= 1;
    getPost.likes.liked_by.splice(getLiker, 1);

    getPost.save();

    return getPost;
  },

  commentPost: async (_, { id, comment }, { req }) => {
    const user = await User.findById(isAuth(req));
    const getPost = await Post.findById(id).populate('comments');

    if (!user) {
      throw new Error('User not found.');
    }
    if (!getPost) {
      throw new Error('Post not found.');
    }

    getPost.comments.push({
      comment,
      createdAt: Date.now(),
      commenter: ObjectID(isAuth(req)),
    });

    getPost.save();
  },

  editPostComment: async (_, { postId, commentId, newComment }) => {
    const getPost = await Post.findById(postId).populate('comments');
    const getComment = getPost.comments.find(({ id }) => id === commentId);

    if (!getPost) {
      throw new Error('Post not found.');
    }

    if (!getComment) {
      throw new Error('Comment not found.');
    }

    getComment.comment = newComment;

    getPost.save();
  },

  deletePostComment: async (_, { postId, commentId }) => {
    const getPost = await Post.findById(postId);
    const getComment = getPost.comments.findIndex(({ id }) => id === commentId);

    if (!getPost) {
      throw new Error('Post not found.');
    }

    if (getComment < 0) {
      throw new Error('Comment not found.');
    }

    getPost.comments.splice(getComment, 1);
    getPost.save();
  },

  likeComment: async (_, { postId, commentId }, { req }) => {
    const getPost = await Post.findById(postId)
      .populate('comments.likes.liked_by')
      .populate('comments.commenter', 'id');
    const getComment = getPost.comments.find(({ id }) => id === commentId);

    if (!getPost) {
      throw new Error('Post not found.');
    }
    if (!getComment) {
      throw new Error('Comment not found.');
    }

    const checkIfLiked = getComment.likes.liked_by.find(
      (liker) => liker.id === isAuth(req),
    );

    if (checkIfLiked) {
      throw new Error("You've already liked this comment!");
    }

    getComment.likes.liked_by.push(isAuth(req));
    getComment.likes.count += 1;

    getPost.save();

    return getComment;
  },

  disLikeComment: async (_, { postId, commentId }, { req }) => {
    const getPost = await Post.findById(postId).populate(
      'comments.likes.liked_by',
    );
    const getComment = getPost.comments.find(({ id }) => id === commentId);

    if (!getPost) {
      throw new Error('Post not found.');
    }
    if (!getComment) {
      throw new Error('Comment not found.');
    }

    const checkIfLiked = getComment.likes.liked_by.find(
      (liker) => liker.id === isAuth(req),
    );

    if (!checkIfLiked) {
      throw new Error("You've already disliked this comment!");
    }

    const getLiker = getComment.likes.liked_by.findIndex(
      (liker) => liker.id === isAuth(req),
    );
    getComment.likes.count -= 1;
    getComment.likes.liked_by.splice(getLiker, 1);

    getPost.save();

    return getComment;
  },

  replyComment: async (_, { postId, commentId, comment }, { req }) => {
    const getPost = await Post.findById(postId).populate(
      'comments.replies.commenter',
    );

    const getComment = getPost.comments.find(({ id }) => id === commentId);

    if (!getPost) {
      throw new Error('Post not found!');
    }
    if (!getComment) {
      throw new Error('Comment not found!');
    }

    getComment.replies.push({ comment, commenter: isAuth(req) });
    getPost.save();

    return getComment.replies;
  },

  deletePost: async (_, { id }) => {
    const deletedPost = await Post.findByIdAndRemove(id);
    if (deletedPost.post_components[0].component_attachment.id) {
      await cloudinary.uploader.destroy(
        deletedPost.post_components[0].component_attachment.id,
        async (result) => result,
      );
    }
    if (!deletedPost) {
      throw new Error('Post does not exist');
    }
    return deletedPost;
  },
};
