const router = require("express").Router();
const { Blog, User} = require("../../models");
const withAuth = require("../../utils/auth");

router.get("/", async (req, res) => {
    try {
    const blogData = await Blog.findAll();
    res.status(200).json(blogData);
    } catch (err) {
    res.status(400).json({error:err});
    }
});

router.get('/:id', async (req, res) => {
    try {
    const blogData = await Blog.findByPk(req.params.id, {
        include: [{ model: User, attributes: ['username'] }],
    });
    if (!blogData) {
        res.status(404).json({ message: "No blog found with that id" });
        return;
    }
    res.json(blogData.get({ plain: true }));
    } catch (err) {
    console.log(err);
    res.status(500).json(err);
    }
});

    router.get(':id', async (req, res) => {
    try {
        const blogData = await Blog.findByPk(req.params.id, {
        include: [{ model: User, attributes: ['username'] }],
        });
        if (!blogData) {
        res.status(404).render('error', { message: "No blog found with that id" });
        return;
    }
      // Render a specific Handlebars template for displaying a blog
    res.render('profile', {
        blog: blogData.get({ plain: true }),
        loggedIn: req.session.loggedIn // Assuming you want to pass the session logged-in state
    });
    } catch (err) {
    console.log(err);
    res.status(500).render('error', { message: "Internal server error" });
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
    res.status(200).json(blogData);
} catch (err) {
    res.status(475).json(err);
}
});

module.exports = router;
