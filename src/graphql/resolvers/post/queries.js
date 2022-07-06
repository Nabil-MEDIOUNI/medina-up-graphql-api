const isAuth = require('../../../middleware/is-auth');
const Post = require('../../../models/post');
const User = require('../../../models/user');

module.exports.PostQueries = {
  allPosts: async (_, args, { req }) => {
    const allPosts = await Post.find()
      .populate('creator')
      .populate('comments.commenter')
      .populate('likes.liked_by')
      .populate('seen_by', 'id full_name cover_photo')
      .populate('comments.replies.commenter')
      .populate('comments.likes.liked_by');
    const user = await User.findById(isAuth(req)).populate('manager');
    const userFunction = user.current_positions.function.function_short_name;
    const isAdmin = user.is_admin;
    const isMember = user.is_member;
    const isAlumni = user.is_alumni;
    const currentTerm = new Date();

    const showByTerm = (postedAt) => (new Date(postedAt).getFullYear() === currentTerm.getFullYear() && (new Date(postedAt).getMonth() + 1) >= 2)
      || ((new Date(postedAt).getFullYear() + 1) === currentTerm.getFullYear() && (new Date(postedAt).getMonth() + 1) < 2);

    if (isAdmin) {
      return allPosts
        .filter(
          (post) => (post.creator.id === isAuth(req)
          || post.posted_to.can_view === 'Local Committee'
          || (post.posted_to.can_view === 'Only EB' && user.is_eb)
          || (post.posted_to.can_view === 'All Alumni' && (user.is_admin || user.is_lcp))
          || (post.posted_to.can_view === 'My Department' && post.posted_to.department === userFunction))
          && showByTerm(post.createdAt),
        )
        .reverse();
    }

    if (isAlumni) {
      return allPosts
        .filter(
          (post) => (post.creator.id === isAuth(req) || post.posted_to.can_view === 'All Alumni')
          && showByTerm(post.createdAt) && post.is_approved,
        )
        .reverse();
    }

    if (!isMember) {
      return allPosts
        .filter(
          (post) => (post.creator.id === isAuth(req)
            || post.posted_to.can_view === 'Local Committee'
            || (post.posted_to.can_view === 'Only EB' && user.is_eb)
            || (post.posted_to.can_view === 'All Alumni' && (user.is_admin || user.is_lcp))
            || (post.posted_to.can_view === 'My Department' && post.posted_to.department === userFunction))
            && showByTerm(post.createdAt) && post.is_approved,
        )
        .reverse();
    }

    return allPosts
      .filter(
        (post) => (post.creator.id === user.manager.id || post.posted_to.can_view === 'Local Committee')
        && showByTerm(post.createdAt) && post.is_approved,
      )
      .reverse();
  },

  getPost: async (_, { id }, { req }) => {
    const getPost = await Post.findById(id)
      .populate('creator')
      .populate('seen_by', 'id full_name cover_photo')
      .populate('comments.commenter')
      .populate('likes.liked_by')
      .populate('comments.replies.commenter')
      .populate('comments.likes.liked_by');
    const seen_by = getPost.seen_by.map(({ id }) => id);
    const NEVER_SEEN = !seen_by.includes(isAuth(req));
    if (NEVER_SEEN) {
      getPost.seen_by.push(isAuth(req));
      getPost.save();
    }
    return getPost;
  },
};
