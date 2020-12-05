import React, {useState} from 'react'

 
export const Login = (props) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [failed, setFailed] = useState('')

    async function handleSubmit(event) {
        event.preventDefault();
            await fetch('/api/login/', {
                method: 'POST',
                body: JSON.stringify({ username, password }),
                headers: { 'Content-Type': 'application/json' },
            })
            .then(res => res.json())
            .then(async (result) => {
                if (result.Login === 'Login Failed') {
                    setFailed(result.Login)
                    setTimeout(() => setFailed(''), 3000)
                } else {
                    await fetch('/home/posts')
                        .then(res => res.json())
                        .then(response => localStorage.setItem('following-posts', JSON.stringify(response.posts)))
                        .then(await fetch('/explore/posts')
                        .then(res => res.json())
                        .then(response => localStorage.setItem('explore-posts', JSON.stringify(response.explorePosts))))
                        .then(await fetch('/user/posts')
                        .then(res => res.json())
                        .then(response => localStorage.setItem('user-posts', JSON.stringify(response.userPosts))))
                        .then(async () => {
                            await fetch('/user/info')
                            .then(res => res.json())
                            .then(result => {
                                localStorage.setItem('user', JSON.stringify(result.user))
                            })
                            .then(async () => await localStorage.setItem('page', 'logged in'))
                            .then(() => props.setPage('logged in')) 
                        })

                }
            })
        }   

    return (
        <div className="row center">
            <h1>Welcome To Fun</h1>
            <h6 className="red-text">{failed}</h6>
            <form>
                <div className="row">
                    <div className="input-field col s6 offset-s3">
                        <input className="validate" type="text" id="username" onChange={(e) => setUsername(e.target.value)} placeholder="username"/>
                        <label htmlFor="username"></label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s6 offset-s3">
                        <input className="validate" type="password" id="password" onChange={(e) => setPassword(e.target.value)} placeholder="password" />
                        <label htmlFor="password"></label>
                    </div>
                </div>
                <button className="btn waves-effect waves-light" type="submit" name="login" onClick={(e) => handleSubmit(e)}>Login
                    <i className="material-icons right"></i>
                </button>
                <div className="div">
                    <button className="btn waves-effect waves-light orange" type="button" name="register" onClick={() => {
                        localStorage.setItem('page', 'register')
                        props.setPage('register')}}>Register
                        <i className="material-icons right"></i>
                    </button>
                </div>
            </form>
        </div>
    )
}
