const router = require('express').Router();
const { Comments,Blog, User } = require('../../models');
const withAuth = require('../../utils/auth');


router.get('/blog/:id/comments', async (req, res) => {
  try {
      const commentsData = await Comments.findAll({
          where: { blog_id: req.params.id },
          include: [{
              model: Blog,
              attributes: ['title', 'content'] // Assuming you want the title and description from Blog
          }, {
              model: User,
              attributes: ['username'] // Including User data associated with each comment
          }]
      });
      res.status(200).json(commentsData);
  } catch (err) {
      console.log(err);
      res.status(500).json(err);
  }
});

router.post('/blog/:blogId/comments', withAuth, async (req, res) => {
  try {
    const commentData = await Comments.create({
      comment: req.body.comment,
      blog_id: req.params.blogId,  // Ensure this matches the URL parameter
      user_id: req.session.user_id,  // Storing user_id from the session
    });
    res.status(200).json(commentData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

      module.exports=router;