import './Post.css';
import logo from './logo.png';
import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../AuthContext.js';


const LikeButton = () => {
  const [likesAmount, setLikesAmount] = useState(29);
  const [isLiked, setIsLiked] = useState(false);

  const handleLikeClick = () => {
    setIsLiked((prevIsLiked) => !prevIsLiked);
    setLikesAmount((prevLikesAmount) =>
      isLiked ? prevLikesAmount - 1 : prevLikesAmount + 1
    );
  };

  return (
    <div className={`LikeButton ${isLiked ? "liked" : ""}`} onClick={handleLikeClick}>
        <div className="Heart-bg">
                <div className="Heart-icon"></div>
            </div>
        <div className="Likes-amount">{likesAmount}</div>
    </div>
  );
};

function Post({ children, time, name, ava, level, current=false}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const auth = useAuth();
  const { user, isLoggedIn, loading } = auth;

  const handleToggleExpand = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const date = time.split(' ')[0]
  const times = time.split(' ')[1]


  useEffect(() => {
    if (user && level) {
      axios
        .post(`http://localhost:8080/api/subscribe/exist`, {
          userId: user.id,
          levelId: level.id,
        })
        .then((response) => {
          const isSubscribed = response.data;
          setIsSubscribed(isSubscribed);
        })
        .catch((error) => {
          console.error('Ошибка при проверке подписки:', error);
        });
    }
  }, [user, level]);
  
  
  



  return (
    <div className={`Post ${isExpanded ? "expanded" : ""}`}>
        <div className='TopPostInfo'>
            <div className='UserPostInfo'>
                <img src={ava} className='PostAvatar'></img>
                <div>
                <Link className='UserNamePost' to="/profile">{name}</Link>
                <span className='ThemePost'>{level.name}</span>
                </div>
            </div>
            <div className='DatePostInfo'>
                <span>{times}</span>
                <span>{date}</span>
            </div>
        </div>
        <div className='PostContent'>
                   {isSubscribed || current ? (
               children
             ) : (
               <div>
                 <p>Для просмотра этого контента необходимо оформить подписку.</p>
               </div>
             )}
        </div>
        <div className='BottomPostInfo'>
            <div className='ReactionsOnPost'>
                <LikeButton/> 
            </div>
            <div className='LogoInPost'>
            <button className='moreButton' onClick={handleToggleExpand}>
            {isExpanded ? "Скрыть" : "Подробнее"}
          </button>
                <img src={logo}></img>
            </div>
        </div>
    </div>
  );
}


export default Post;