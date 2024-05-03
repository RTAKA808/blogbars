const router = require('express').Router();
const { Blog, User, Comments } = require('../models');
const withAuth = require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    // Serialize data so the template can read it
    const blogArray = blogData.map((blog) => blog.get({ plain: true }));

    // Pass serialized data and session flag into template
    res.render('homepage', { 
      blogArray, 
      logged_in: req.session.logged_in 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/blog/:id', async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
      include: [
        {
          model: User,
          attributes: ['username'],
        },
      ],
    });

    const blog = blogData.get({ plain: true });
    res.render('blog', {
      ...blog,
      logged_in: req.session.logged_in
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/blog/:blogId/comment', withAuth, async (req, res) => {
  try {
    const commentData = await Comments.create({
      comment: req.body.comment,
      blog_id: req.params.blogId,
      user_id: req.session.user_id,  // storing user_id in the session
      });
    res.status(200).json(commentData);
      } catch (err) {
        console.log(err);
        res.status(500).json(err);
      }
    });

    router.delete('/blog/:id', withAuth, async (req, res) => {
      try {
        const blogData = await Blog.destroy({
          where: {
            id: req.params.id,
            user_id: req.session.user_id,  // Ensure only the author can delete
          },
        });
        if (!blogData) {
          res.status(404).json({ message: 'No blog found with this id!' });
          return;
        }
        res.status(204).end();
      } catch (err) {
        res.status(500).json(err);
      }
    });

// Create a comment
router.post('/', async (req, res) => {
    try {
        const newComment = await Comments.create({
            content: req.body.content,
            userId: req.session.userId, // Assumes the user is logged in
            postId: req.body.postId,
        });
        res.status(201).json(newComment);
    } catch (error) {
        res.status(500).json(error);
    }
});


// Use withAuth middleware to prevent access to route
router.get('/profile', withAuth, async (req, res) => {
  try {
    // Find the logged in user based on the session ID
    const userData = await User.findByPk(req.session.user_id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Blog }],
    });

    const user = userData.get({ plain: true });

    res.render('profile', {
      ...user,
      logged_in: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.logged_in) {
    res.redirect('/profile');
    return;
  }

  res.render('login');
});

module.exports = router;