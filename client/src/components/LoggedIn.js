import React, {useState} from 'react'
import {Post} from './Post'

export const LoggedIn = (props) => {
    let follow = false
    if (props.follow) {
        follow = true
    }
    const posts = JSON.parse(props.posts)
    const user = JSON.parse(JSON.parse(localStorage.getItem('user')))
    const [refresh, setRefresh] = useState('')
    return (
        <>
            {posts.map((post, indx) => {
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
                    following = 'btn-small red j'
                    is_following = 'Following'
                } else {
                    following = 'btn-small j'
                    is_following = "Follow"
                }
                return <Post key={indx} update={props.update} refresh={refresh} setRefresh={setRefresh} is_following={is_following} post={post} setUserPost={props.setUserPost} setPage={props.setPage} follow={follow} color={color} following={following}/>
            })}
        </>
    )
}
