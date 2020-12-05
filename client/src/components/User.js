import React, {useState, useEffect} from 'react'
import {PostUser} from './PostUser'

export const User = (props) => {
    let user = localStorage.getItem('userPost') || ''
    user = JSON.parse(user)
    const user_id = user._id
    const [posts, setPosts] = useState('')
    const [refresh, setRefresh] = useState('')
    const [following, setFollowing] = useState('')
    const [followers, setFollowers] = useState('')

    async function handlePosts() {
        if (posts === '') {
            await fetch('/search/posts/', {
                method: 'POST',
                body: JSON.stringify({ user_id }),
                headers: { 'Content-Type': 'application/json' },
            })
            .then(res => res.json())
            .then(response => setPosts(JSON.parse(response.posts)))
        } else {
            setPosts('')
        }
    }

    // useEffect(() => {
    //     handlePosts()
    // }, []);

    let items = []
    if (posts !== '') {
        for (let i=0; i < posts.length; i++) {
            let follow = false
            if (props.follow) {
                follow = true
            }
            let post = posts[i]
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
            items.push(<PostUser key={i} setPosts={setPosts} update={props.update} refresh={refresh} setRefresh={setRefresh} is_following={is_following} post={post} setUserPost={props.setUserPost} setPage={props.setPage} follow={follow} color={color} following={following}/>)
        }
    }
    async function handleFollow() {
        if (following === '') {
            await fetch('/find/followers/', {
                method: 'POST',
                body: JSON.stringify({ user_id }),
                headers: { 'Content-Type': 'application/json' },
            })
            .then(res => res.json())
            .then(response => setFollowing(JSON.parse(response.user)))
        } else {
            setFollowing('')
        }
    }

    async function handleFollowers() {
        if (followers === '') {
            await fetch('/find/followers/', {
                method: 'POST',
                body: JSON.stringify({ user_id }),
                headers: { 'Content-Type': 'application/json' },
            })
            .then(res => res.json())
            .then(response => setFollowers(JSON.parse(response.user)))
        } else {
            setFollowers('')
        }
    }

    let following_array = []
    if (following !== '') {
        if (following[0].following.length === 0) {
            following_array.push(
                <div className="card black darken-1">
                    <div className="card-content profile white-text">
                        <h6>Not Following Anyone</h6>
                    </div>
                </div>)
        }
        for (let i=0; i < following[0].following.length; i++) {
            let user = following[0].following[i]
            following_array.push(
            <div className="card black darken-1">
                <div className="card-content profile white-text">
                    <h6 className="username_container"><a href="/#" className="username" onClick={() => {
                        setFollowing('')
                        localStorage.setItem('page', 'user')
                        localStorage.setItem('userPost', JSON.stringify(user))
                        props.setPage('user')
                    }}>{user.username}</a></h6>
                </div>
            </div>)
        }
    }

    let followers_array = []
    if (followers !== '') {
        if (followers[0].followers.length === 0) {
            followers_array.push(
                <div className="card black darken-1">
                    <div className="card-content profile white-text">
                        <h6>No followers</h6>
                    </div>
                </div>)
        }
        for (let i=0; i < followers[0].followers.length; i++) {
            let user = followers[0].followers[i]
            followers_array.push(
            <div className="card black darken-1">
                <div className="card-content profile white-text">
                    <h6 className="username_container"><a href="/#" className="username" onClick={() => {
                        setFollowing('')
                        localStorage.setItem('page', 'user')
                        localStorage.setItem('userPost', JSON.stringify(user))
                        props.setPage('user')
                    }}>{user.username}</a></h6>
                </div>
            </div>)
        }
    }
    return (
        <div>
            <div className="row main">
                <div className="col s12 m6 offset-m3 l4 offset-l4">
                    <div className="card blue-grey darken-1">
                        <div className="card-content profile white-text">
                            <span className="card-title">{user.name}</span>
                            <p>{user.username}</p>
                        </div>
                        <div className="card-content profile white-text user-flex">
                            <button className="btn first" onClick={handlePosts}>Posts</button>
                            {items}
                            <button className="btn second" onClick={handleFollow}>Following</button>
                            {following_array}
                            <button className="btn last" onClick={handleFollowers}>Followers</button>
                            {followers_array}
                        </div>
                        <div className="card-action">
                            
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
