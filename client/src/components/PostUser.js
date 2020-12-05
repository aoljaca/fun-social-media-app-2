import React, {useState, useEffect} from 'react'

export const PostUser = (props) => {
    let post = props.post
    let post_id = post._id
    let post_user = post.user._id
    let items = []
    let user_id = JSON.parse(JSON.parse(localStorage.getItem('user')))._id
    let user = JSON.parse(JSON.parse(localStorage.getItem('user')))
    const [color, setColor] = useState(props.color)
    const [body, setBody] = useState('')
    const [comments, setComments] = useState([])
    const [deleted, setDeleted] = useState('')
    const [refresh, setRefresh] = useState('')
    const following = props.is_following
    const button_class = props.following 
   
    useEffect(() => {
        async function fetchData() {
            await fetch('/get/comments', {
                method: 'POST',
                body: JSON.stringify({ post_id }),
                headers: { 'Content-Type': 'application/json' },
            })
            .then(res => res.json())
            .then((response) => setComments(JSON.parse(response.comments)))
        }
            fetchData()  
    }, [refresh, post_id, deleted]);

    async function handleDelete(comment_id) {
        await fetch('/comment/delete', {
            method: 'POST',
            body: JSON.stringify({ comment_id }),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(setDeleted(deleted === '' ? 'deleted' : ''))
    }

    for (let i=0; i < comments.length; i++) {
        let comment = comments[i]
        let time = comment.timeStamp
        items.push(<div className="comment" key={comment._id}>
            <h6 className="comment_body each">{comment.body}</h6>
            <h6 className="each">{comment.user.username}</h6>
            <h6 className="each">{time}</h6>
            <button type="button" className="btn-small comment_trash red darken-3" onClick={() => handleDelete(comment._id)}><i className="fa fa-trash" aria-hidden="true"></i></button>
        </div>)
    }
    async function handleLike() {
        await fetch('/post/like/', {
            method: 'POST',
            body: JSON.stringify({ post }),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.json())
        .then(response => {
            if (response.message === 'white') {
                props.post.likes -= 1
            } else {
                props.post.likes += 1
            }
            setColor(response.message)
        })
    }

    async function handleComment() {
        if (body !== '') {
            await fetch('/post/comment/', {
                method: 'POST',
                body: JSON.stringify({ body, post_id: post._id }),
                headers: { 'Content-Type': 'application/json' },
            })
            .then(setBody(''))
            .then(setRefresh(refresh === '' ? 'refresh' : ''))
        }
    }

    async function handleDeletePost() {
        await fetch('/delete/post', {
            method: 'Delete',
            body: JSON.stringify({ post_id }),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(() => {
            props.update()
            props.setRefresh(props.refresh === 'refresh' ? '' : 'refresh')
        })
    }

    let button 
    if (post_user === user_id) {
        button = <button type="button" className="btn-small comment_trash red darken-3" onClick={handleDeletePost}><i className="fa fa-trash" aria-hidden="true"></i></button>
    }

    return (
        <div className="row iw">
            <div className="col s12 m6 offset-m3 ij">
                <div className="card grey darken-4 darken-1 ij">
                    <div className="card-content white-text">
                        <div className="flex-top">
                            <h6 className="username_container"><a href="/#" className="username" onClick={() => {
                                localStorage.setItem('page', 'user')
                                localStorage.setItem('userPost', JSON.stringify(post.user))
                                props.setPage('user')
                                props.setPosts('')
                            }}>{post.user.username}</a></h6>
                            {button}
                        </div>
        
                        <h5 className="post_body">{post.body}</h5>
                        <h6>{post.createdAt}</h6>
                    </div>
                    <div className="card-action">
                        <button className={color} id= "like" type="button" onClick={handleLike}><i className="fas fa-heart fa-lg"></i></button><span id="like-color">{props.post.likes}</span>
                        <textarea name="comment" id="comment" className="white" value={body} placeholder="comment" onChange={(e) => setBody(e.target.value)}></textarea>
                        <button type="button" className="btn-small" onClick={handleComment}>Comment</button>
                    </div>
                    <div className="card-action">
                        {items}
                    </div>
                </div>
            </div>
        </div>
    )
}
