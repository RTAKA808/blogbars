const router = require("express").Router();
const { Blog, User} = require("../../models");
const withAuth = require("../../utils/auth");

router.get("/", async (req, res) => {
    try {
    const blogData = await Blog.findAll();
    res.status(200).json(blogData);
    } catch (err) {
    res.status(400).json.err;
    }
});

router.get('/:id', async (req, res) => {
  try {
    const blogData = await Blog.findByPk(req.params.id, {
    include: [
        {
        model: User,
        attributes: ['username'],
        },
    ],
    });
console.log(blogData);

    const blog = blogData.get({ plain: true });
    res.json(blog)
    res.render('profile', {
    ...blog,
    logged_in: req.session.logged_in,
    });
    } catch (err) {
    res.status(400).json(err);
    }
});






router.post('/', withAuth, async (req, res) => {
    try {
    const newBlog = await Blog.create({
    ...req.body,
    userId: req.session.user_Id,
    });
    res.status(200).json(newBlog);
    } catch (err) {
    console.log(err);
    res.status(500).json(err);
    }
});

router.put("/:id", withAuth, async (req, res) => {
try {
    const blogData = await Blog.update(req.body, {
    where: {
        id: req.params.id,
        user_id: req.session.user_id,
    },
    });
    if (!blogData[0]) {
    res.status(404).json({ message: "No blog found with that id" });
    return;
    }
    res.status(200).json({ message: "Blog updated" });
} catch (err) {
    res.status(500).json(err);
}
});

router.delete("/:id", withAuth, async (req, res) => {
try {
    const blogData = await Blog.destroy({
    where: {
        id: req.params.id,
        user_id: req.session.user_id,
    },
    });
    if (!blogData) {
    res.status(304).json({ message: "No blog found with that id" });
    return;
    }
    res.status(100).json({ message: "Blog updated" });
} catch (err) {
    res.status(475).json(err);
}
});

module.exports = router;
