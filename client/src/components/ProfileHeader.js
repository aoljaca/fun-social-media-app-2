import React from 'react'

export const ProfileHeader = (props) => {

    async function handleSubmit() {
        await fetch('/logout')
        .then(localStorage.setItem('page', 'login'))
        .then(localStorage.setItem('user', JSON.stringify(undefined)))
        .then(localStorage.setItem('userPost', ''))
        .then(props.setRefresh('login'))
        .then(props.setPage('login'))
    }

    async function handleHome() {
        localStorage.setItem('page', 'logged in')
        props.setPage('logged in')
    }

    async function handleProfile() {
        localStorage.setItem('page', 'explore')
        props.setPage('explore')
    }

    return (
        <div>
            <nav>
                <div className="nav-wrapper black">
                    <a href="#!" className="brand-logo">Fun</a>
                    <a href="#" data-target="mobile-demo" className="sidenav-trigger"><i className="fas fa-bars"></i></a>
                    <ul className="right hide-on-med-and-down">
                        <li><a href="/#" onClick={handleSubmit}>Logout</a></li>
                        <li><a href="/#" onClick={handleHome}>Home</a></li>
                        <li><a href="/#" onClick={handleProfile}>Explore</a></li>
                    </ul>
                </div>
            </nav>
            <ul className="sidenav" id="mobile-demo">
                <li><a href="/#" onClick={handleSubmit}>Logout</a></li>
                <li><a href="/#" onClick={handleHome}>Home</a></li>
                <li><a href="/#" onClick={handleProfile}>Explore</a></li>
            </ul>
        </div>
    )
}
