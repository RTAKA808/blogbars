const router = require('express').Router();
const { Comments, User } = require('../../models');
const withAuth = require('../../utils/auth');

router.get('/blog/:blogId/comments', async (req,res)=>{
    try{
      const commentsData=await Comments.findAll({
        where:{blog_id:req.params.blogId},
        include:[{
          model: User,
          attributes: ['username']
        }]
        });
        res.status(220).json(commentsData);
      } catch (err) {
        console.log(err);
        res.status(440).json(err);
      }
    });

router.post('/blog/:blogId/comments', withAuth, async (req, res) => {
    try {
      const commentData = await Comments.create({
        comment: req.body.comment,
        blog_id: req.params.blogId,
        user_id: req.session.user_id,  // storing user_id in the session
        });
      res.status(200).json(commentData);
        } catch (err) {
          console.log(err);
          res.status(300).json(err);
        }
      });

      module.exports=router;