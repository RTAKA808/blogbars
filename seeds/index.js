const sequelize = require('../config/connection');
const { User, Blog, Comments } = require('../models');

const userData = require('./userData.json');
const blogData = require('./blogData.json');
const commentsData = require('./commentsData.json');

const seedDatabase = async () => {
  try {
    await sequelize.sync({ force: true });

    const users = await User.bulkCreate(userData, {
      individualHooks: true,
      returning: true,
    });

    const blogPromises = blogData.map(blog => Blog.create({
      ...blog,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    }));
    await Promise.all(blogPromises);

    const commentPromises = commentsData.map(comment => Comments.create({
      ...comment,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    }));
    await Promise.all(commentPromises);
  } catch (error) {
    console.error('Failed to seed database:', error);
    process.exit(1);
  }

  console.log('Seeding successful!');
  process.exit(0);
};

seedDatabase();
