import React, {useEffect, useState, useRef} from 'react'

export const ToPost = (props) => {
    const [body, setBody] = useState('')
    const [posted, setPosted] = useState('')
    let user1 = {name: 'wrong'}
    
    const unmounted = useRef(false);
    useEffect(() => {
      return () => { unmounted.current = true }
    }, []);
    async function handleSubmit() {
        await fetch('/post', {
            method: 'POST',
            body: JSON.stringify({ body }),
            headers: { 'Content-Type': 'application/json' },
        })
            .then(setTimeout(function() {
                setBody('')
            }, 500))
            .then(setPosted('Posted view in "My Posts"'))
            .then(async () => {
                await fetch('/user/posts')
                .then(res => res.json())
                .then(response => localStorage.setItem('user-posts', JSON.stringify(response.userPosts)))
            })
            .then(props.setRefresh('done'))
            .then(setTimeout(function() {
                if (!unmounted.current) {
                    setPosted('')
                }
            }, 5000))
    }
    // figure out where reload for following is and updated it or rerender
    if (localStorage.getItem('user') != 'undefined') {
        user1 = JSON.parse(localStorage.getItem('user')) || {'name': 'hey'}
        user1 = JSON.parse(user1)
    }
    return (
        <div className="row">
            <br/>
            <div className="col s12 m6 offset-m3 l4 offset-l4">
                <div className="card blue-grey darken-1">
                    <div className="card-content white-text blue">
                         <h6>{user1.name}</h6>
                    </div>
                    <div className="card-action">
                        <textarea name="post" id="post" className="white" placeholder="post" rows="4" value={body} onChange={(e) => setBody(e.target.value)}></textarea>
                        <h4>{posted}</h4>
                    </div>
                    <div className="card-action">
                        <button className="btn" type="button" onClick={handleSubmit}>Post</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
