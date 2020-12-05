import React, {useState} from 'react'

export const Register = (props) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const [color, setColor] = useState('')
    async function handleSubmit(e) {
        e.preventDefault()
        await fetch('/api/register', {
          method: 'POST',
          body: JSON.stringify({ username, password, name }),
          headers: { 'Content-Type': 'application/json' },
        })
        .then((res) => res.json())
        .then(result => {
            if (result.message === 'Username already taken') {
                e.target[0].value = ''
                setColor('red-text')
                setError(result.message)
                setUsername('create username')
            } else if (result.message === 'Account Created') {
                e.target[0].value = ''
                e.target[1].value = ''
                e.target[2].value = ''
                setColor('green-text')
                setError(result.message)
                setTimeout(function(){ 
                    localStorage.setItem('page', 'login')
                    props.setPage('login')}, 3000);
            } else {
                setColor('red-text')
                e.target[0].value = ''
                e.target[2].value = ''
                setError(result.message)
                setTimeout(function(){ setColor('hide') }, 3000);
            }
        })
    }

    return (
        <div className="row center">
            <h1>Register!</h1>
            <h6 className={color}>{error}</h6>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    <div className="input-field col s6 offset-s3">
                        <input className="validate" type="text" id="username" onChange={(e) => setUsername(e.target.value)} placeholder='create username'/>
                        <label htmlFor="username"></label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s6 offset-s3">
                        <input className="validate" type="password" id="password" onChange={(e) => setPassword(e.target.value)} placeholder='create password'/>
                        <label htmlFor="password"></label>
                    </div>
                </div>
                <div className="row">
                    <div className="input-field col s6 offset-s3">
                        <input className="validate" type="text" id="name" onChange={(e) => setName(e.target.value)} placeholder='enter name' />
                    </div>
                </div>
                <button className="btn waves-effect waves-light orange" type="submit" name="register">Submit
                    <i className="material-icons right"></i>
                </button>
                <div>
                <button className="btn waves-effect waves-light" type="button" onClick={() => props.setPage('login')} name="login">Go To Login
                    <i className="material-icons right"></i>
                </button>
                </div>
            </form>
        </div>
    )
}
