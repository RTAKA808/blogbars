const router = require('express').Router();
const { User } = require('../../models');

//DO GET ROUTE
router.get('/', async (req,res)=>{
try{
  const dbUserData=await User.findAll({
    });
    res.status(200).json(dbUserData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});
// CREATE new user
router.post('/', async (req, res) => {
  try {  
    const dbUserData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id=dbUserData.id
      req.session.loggedIn = true;

      res.status(200).json(dbUserData);
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// Login
router.post('/login', async (req, res) => {
  try {  
    const dbUserData = await User.findOne({
        where: {username: req.body.username }
    });  

    if (!dbUserData) {
        res.status(400).json({ message: 'Incorrect username or password. Please try again!' });
        return;
    }

    const validPassword = await dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
        res.status(400).json({ message: 'Incorrect username or password. Please try again!' });
        return;
    }

    req.session.save(()=>{
      req.session.user_id=dbUserData.id;
      req.session.loggedIn = true;
      res.status(200).json(dbUserData);
    }); 

} catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Login failed, please try again.' });
}
});
// Logout
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});

module.exports = router;
