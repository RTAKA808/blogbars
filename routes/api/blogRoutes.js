const router = require("express").Router();
const { Blog} = require("../../models");
const withAuth = require("../../utils/auth");







router.post('/', withAuth, async (req, res) => {
  try {    console.log(req.body)
    const newBlog = await Blog.create({
        title: req.body.title,
        contents: req.body.contents,
        user_id: req.session.user_id, // Assumes the user is logged in
    });

    res.status(201).json(newBlog);
  } catch (err) {
    console.error(err);
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
