const User = require('./User.js');
const Blog = require('./Blog.js');
const Comments = require('./Comments.js');
User.hasMany(Blog, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

Blog.belongsTo(User, {
  foreignKey: 'user_id'
});

User.hasMany(Comments,{
  foreignKey:'user_id'
});

Comments.belongsTo(User, {
  foreignKey: 'user_id'
});

Blog.hasMany(Comments,{
  foreignKey:'user_id'
});
Comments.belongsTo(Blog,{
  foreignKey:'blog_id'
})

module.exports = { User, Blog,Comments };
