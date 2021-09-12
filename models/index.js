const User = require('./User');
const Post = require('./Post');

// Create associations - States that one user can have many posts
User.hasMany(Post, {
    foreignkey: 'user_id'
});
// This association states that a post can belong to one user, not many users 
Post.belongsTo(User, {
    foreignKey:'user_id'
});

module.exports = { User, Post };