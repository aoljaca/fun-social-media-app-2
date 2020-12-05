const express = require('express')
const router = express.Router()
const passport = require('passport')
const User = require('../models/User')
const bcrypt = require('bcrypt')
const Posts = require('../models/Posts')
const Comment = require('../models/Comment')
const moment = require('moment')


router.get('/api', (req, res) => {
    res.send({ Login: 'Login Failed' });
})

router.get('/user', (req, res) => {
    res.send({ Login: 'Login' });
})

router.get('/user/info', (req, res) => {
    res.send({user: JSON.stringify(req.user)})
})

router.post('/post', async (req, res) => {
    const body = req.body.body
    const user = req.user.id
    const newPost = {
        user,
        body
    }
    await Posts.create(newPost)
    res.send({message: 'Post updated'})
})

router.get('/logout', (req, res) => {
    req.logout()
    res.send({message: 'logged out'})
})

router.get('/follow', async (req, res) => {
    await User.update({_id: req.user.id}, {
        $set: {
            followers: req.user.id
        }
    })
    res.send(JSON.stringify({message: 'followed'}))
})

router.get('/home/posts', async (req, res) => {
    let posts = await Posts.find({
        'user': { $in: req.user.following }
    }).sort({ createdAt: 'ascending' }).populate('user').populate('comments')
    posts = JSON.parse(JSON.stringify(posts))
    for (let i = 0; i < posts.length; i++) {
        posts[i].createdAt = moment(posts[i].createdAt).format('MMM Do YY')
    }
    res.send({posts: JSON.stringify(posts)})
})

router.post('/comment/delete', async (req, res) => {
    await Comment.deleteOne({_id: req.body.comment_id})
    res.send({message: 'comment deleted'})
})

router.get('/explore/posts', async (req, res) => {
    let explorePosts = await Posts.find({
        'user': { $nin: req.user.following }
    }).sort({ createdAt: 'ascending' }).populate('user').populate('comments')
    explorePosts = JSON.parse(JSON.stringify(explorePosts))
    for (let i = 0; i < explorePosts.length; i++) {
        explorePosts[i].createdAt = moment(explorePosts[i].createdAt).format('MMM Do YY')
    }
    res.send({explorePosts: JSON.stringify(explorePosts)})
})

router.post('/post/like', async (req, res) => {
    const post = await Posts.find({_id: req.body.post._id})
    if (post[0].whoLiked.includes(req.user.id)) {
        await Posts.updateOne({_id: req.body.post._id}, {$pull: {whoLiked: req.user.id}})
        await Posts.updateOne({_id: req.body.post._id}, {$inc: {likes: -1}})
        res.send({message: "white"})
    } else {
        await Posts.updateOne({_id: req.body.post._id}, {$inc: {likes: 1}})
        await Posts.updateOne({_id: req.body.post._id}, {$push: {whoLiked: req.user.id}})
        res.send({message: "red"})
    }
})

router.post('/follow', async (req, res) => {
    const user_id = req.body.user_id
    const to_follow = req.body.follow_user
    const user = await User.find({_id: user_id})
    if (user[0].following.includes(to_follow)) {
        await User.updateOne({_id: user_id}, {$pull: {following: to_follow}})
        res.send({messasge: 'unfollow'})
    } else {
        await User.updateOne({_id: user_id}, {$push: {following: to_follow}})
        res.send({message: "white"})
    }
})

router.post('/get/comments', async (req, res) => {
    const post_id = req.body.post_id
    let comments = await Comment.find({postID: post_id})
    .sort({ createdAt: 'ascending' })
    .populate('user')
    comments = JSON.parse(JSON.stringify(comments))
    for (let i = 0; i < comments.length; i++) {
        comments[i].timeStamp = moment(comments[i].createdAt).fromNow()
    }
    res.send({comments: JSON.stringify(comments)})
})

router.post('/post/comment', async (req, res) => {
    const body = req.body.body
    const user = req.user.id
    const post_id = req.body.post_id
    const newComment = {
        user,
        body,
        postID: post_id
    }
    await Comment.create(newComment)
    res.send({message: 'comment created'})
})

router.get('/user/posts', async (req, res) => {
    let userPosts = await Posts.find({user: req.user.id})
        .sort({createdAt: 'ascending'})
        .populate('user')
    userPosts = JSON.parse(JSON.stringify(userPosts))
    for (let i = 0; i < userPosts.length; i++) {
        userPosts[i].createdAt = moment(userPosts[i].createdAt).format('MMM Do YY')
    }
    res.send({userPosts: JSON.stringify(userPosts)})
})

router.post('/search/posts', async (req, res) => {
    const id = req.body.user_id
    let posts = await Posts.find({user: id})
        .sort({createdAt: 'ascending'})
        .populate('user')
    posts = JSON.parse(JSON.stringify(posts))
    for (let i = 0; i < posts.length; i++) {
        posts[i].createdAt = moment(posts[i].createdAt).format('MMM Do YY')
    }
    res.send({posts: JSON.stringify(posts)})
})

router.post('/find/followers', async (req, res) => {
    const id = req.body.user_id
    const user = await User.find({_id: id})
    .populate('following')
    .populate('followers')
    res.send({user: JSON.stringify(user)})
})

router.delete('/delete/post', async (req, res) => {
    const post_id = req.body.post_id
    await Posts.deleteOne({_id: post_id})
    res.send({message: 'deleted'})
})

router.post('/api/register', (req, res) => {
    const {username, password, name} = req.body
    if (username === '' || password === '' || name === '' ) {
       res.send({message: 'enter all fields'})
    } else {
        User.findOne({username: username}).then(async (user) => {
            if (user) {
                res.send({message: 'Username already taken'})
            } else {
                const newUser = new User({
                    username,
                    password,
                    name
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash
                        newUser
                            .save()
                            .then(() => {
                                res.send({message: 'Account Created'})
                            })
                    })
                })
            }
        })
    }
})

router.post('/api/login', 
  passport.authenticate('local', { failureRedirect: '/api',
    successRedirect: '/user'}),
  function(req, res) {
    res.redirect('/');
});

module.exports = router