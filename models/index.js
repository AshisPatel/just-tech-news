const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');
const Comment = require('./Comment');

// Create associations - States that one user can have many posts
User.hasMany(Post, {
    foreignkey: 'user_id'
});
// This association states that a post can belong to one user, not many users 
Post.belongsTo(User, {
    foreignKey:'user_id'
});

// Many-to-many relationship because one post can have many votes and one user can vote on many posts 
// This connects the post and user models together
User.belongsToMany(Post, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'user_id'
});

Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

// Connect post to vote model and user to vote model
Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

User.hasMany(Vote, {
    foreignKey: 'user_id'
});

Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

// Connect Comment to post & user model 

// A comment has a specific post and user
Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

Comment.belongsTo(Post, {
    foreignKey: 'post_id'
});

// A user can have multiple comments
User.hasMany(Comment, {
    foreignKey: 'user_id'
});

// A post can have multiple comments
Post.hasMany(Comment, {
    foreignKey: 'post_id'
});


module.exports = { User, Post, Vote, Comment };