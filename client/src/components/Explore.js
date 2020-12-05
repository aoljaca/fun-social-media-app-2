import React from 'react'
import {Post} from './Post'

export const Explore = (props) => {
    let follow = false
    if (props.follow) {
        follow = true
    }
    let explorePosts = JSON.parse(props.explorePosts)
    explorePosts = JSON.parse(explorePosts)
    const user = JSON.parse(JSON.parse(localStorage.getItem('user')))
    return (
        <>
            {explorePosts.map((post, indx) => {
                const liked = post.whoLiked
                const user_follows = user.following
                let color;
                let following;
                let is_following;
                if (liked.includes(user._id)) {
                    color = 'red'
                } else {
                    color = 'white'
                }
                if (user_follows.includes(post.user._id)) {
                    following = 'btn-small red'
                    is_following = 'Following'
                } else {
                    following = 'btn-small'
                    is_following = "Follow"
                }
                return <Post key={indx} setUserPost={props.setUserPost} setPage={props.setPage} update={props.update} refresh={props.refresh} setRefresh={props.setRefresh} is_following={is_following} post={post} follow={follow} color={color} following={following}/>
            })}
        </>
    )
}
