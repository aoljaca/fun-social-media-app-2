import React, { useState, useEffect } from 'react';
import './App.css';
import {Register} from './components/Register'
import {Header} from './components/Header'
import {LoggedIn} from './components/LoggedIn'
import { ToPost } from './components/ToPost';
import {Login} from './components/Login'
import { Explore } from './components/Explore';
import { ExploreHeader } from './components/ExploreHeader';
import { ProfileHeader } from './components/ProfileHeader';
import {User} from './components/User'
import M from "materialize-css";

export default function App() {
  const [page, setPage] = useState('login');
  const [posts, setPosts] = useState('')
  const [refresh, setRefresh] = useState('')
  const [userPost, setUserPost] = useState('')
  const follow = 'follow'
  const page1 = localStorage.getItem('page') || ''
  let posts1 = localStorage.getItem('following-posts') || []
  const user = localStorage.getItem('user')
  const posts2 = localStorage.getItem('explore-posts') || []
  const posts3 = localStorage.getItem('user-posts') || []
  
  async function updateHome() {
    await fetch('/home/posts')
      .then(res => res.json())
      .then(response => localStorage.setItem('following-posts', JSON.stringify(response.posts)))
      .then(await fetch('/explore/posts')
      .then(res => res.json())
      .then(response => localStorage.setItem('explore-posts', JSON.stringify(response.explorePosts))))
      .then(await fetch('/user/posts')
      .then(res => res.json())
      .then(response => localStorage.setItem('user-posts', JSON.stringify(response.userPosts))))
      .then(setTimeout(() => {
        setRefresh(refresh === 'refresh' ? '' : 'refresh')
      }, 250))
  }

  useEffect(() => {
    
    setRefresh(refresh === 'refresh' ? '' : 'refresh')

  }, [posts1]);

  useEffect(() => {
      var elems = document.querySelectorAll('.sidenav');
      M.Sidenav.init(elems);
  });


  if (page1 === 'login' || page1 === '') {
    return (
      <div className="container center-align">
        <Login setPage={setPage} setPosts={setPosts}/>
      </div>
    )
  } else if (page1 === 'register') {
    return (
      <div className="container center-align">
        <Register setPage={setPage}/>
      </div>
    )
  } else if (page1 === 'logged in') {
    return (
      <div className="container center-align">
        <div className="header">
          <Header setPage={setPage} setRefresh={setRefresh}/>
        </div>
        <ToPost setRefresh={setRefresh}/>
        <LoggedIn update={updateHome} setUserPost={setUserPost} posts={JSON.parse(posts1)} setPage={setPage} refresh= {refresh} setRefresh={setRefresh}/>
      </div>
    )
  } else if (page1 === 'explore') {
    return (
      <div className="container center-align">
        <div className="header">
          <ExploreHeader setPage={setPage} setRefresh={setRefresh} />
        </div>
        <Explore explorePosts={posts2} update={updateHome} setUserPost={setUserPost} follow={follow} refresh= {refresh} setRefresh={setRefresh} setPage={setPage}/>
      </div>
    )
  } else if (page1 === 'profile') {
    return (
      <div className="container center-align">
        <div className="header">
          <ProfileHeader setPage={setPage} setRefresh={setRefresh}/>
        </div>
        <LoggedIn update={updateHome} posts={JSON.parse(posts3)} setUserPost={setUserPost} setPage={setPage} refresh={refresh} setRefresh={setRefresh} follow={follow}/>
      </div>
    )
  } else if (page1 === 'user') {
    return (
      <div className="container center-align">
        <div className="header">
          <ProfileHeader setPage={setPage} setRefresh={setRefresh}/>
        </div>
        <div className="user">
          <User userPost={userPost} setPage={setPage} setUserPost={setUserPost} refresh={refresh} follow={follow} update={updateHome}/>
        </div> 
      </div>
    )
  }

}
