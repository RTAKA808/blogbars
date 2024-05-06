const router = require('express').Router();
const { Blog, User,Comments } = require('../models');
const withAuth= require('../utils/auth');

router.get('/', async (req, res) => {
  try {
    const blogData = await Blog.findAll({
      include: [
        {
          model: User,
          attributes: ['username'],
        },
        {
          model:Comments,
          include:[{model:User}]
          
        }
      ],
    });

    // Serialize data so the template can read it
    const blogArray = blogData.map(blog => blog.get({ plain: true }));
    console.log(blogArray)
    // Pass serialized data and session flag into template
    res.render('homepage', { 
      blogs: blogArray, // Ensure the template iterates over 'blogs'
      loggedIn: req.session.loggedIn 
    });
  } catch (err) {
    res.status(500).json(err);
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
    if(!userData){
      res.status(404).json({message:'User not found'})
      return;
    }

    const user = userData.get({ plain: true });
    console.log(user)
    res.render('profile', {
      user,
      loggedIn: true
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/profile/:id', async (req, res) => {
  if (!req.session.loggedIn) {
      res.redirect('/login');
      return;
  }

  try {
      const blog = await Blog.findByPk(req.params.id, {
          include: [
              {
                  model: User,
                  attributes: ['username']
              },
              {
                  model: Comments,
                  include: [{
                      model: User,
                      attributes: ['username']
                  }]
              }
          ]
      });
      if (blog) {
        const blogPlain = blog.get({ plain: true });
        res.render('profile', { blog: blogPlain, loggedIn: req.session.loggedIn });
    } else {
        res.status(404).send("Blog not found");
    }
} catch (error) {
    res.status(500).send(error.message);
}
});

router.get('/login', (req, res) => {
  // If the user is already logged in, redirect the request to another route
  if (req.session.loggedIn) {
    res.redirect('/');
    return;
  }

  res.render('login');
});

module.exports = router;