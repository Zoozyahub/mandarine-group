import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Post from '../components/posts/Post';
import LeftPanel from '../components/panels/LeftPanel';
import RightPanel from '../components/panels/RightPanel';
import './Home.css';
import { useAuth } from '../AuthContext.js';

function Home() {
  const [userSubscriptionPosts, setUserSubscriptionPosts] = useState([]);
  const auth = useAuth();
  const { user, isLoggedIn } = auth;

  const userId = isLoggedIn ? user.id : 0; // Замените на актуальный userId

  useEffect(() => {
    if (isLoggedIn) {
      // Отправляем GET-запрос на контроллер для получения постов пользователя
      axios
        .get(`http://localhost:8080/api/posts/userSubscriptions?userId=${userId}`)
        .then((response) => {
          setUserSubscriptionPosts(response.data); // Устанавливаем полученные посты в состояние
        })
        .catch((error) => {
          console.error('Ошибка при получении постов пользователя:', error);
        });
    }
  }, [isLoggedIn, userId]);

  const sortedPosts = userSubscriptionPosts.sort((a, b) => {
    const dateA = new Date(a.time);
    const dateB = new Date(b.time);
    return dateB - dateA;
  });

  console.log("посты " + userSubscriptionPosts)
  return (
    <div className='post-in-center'>
      <LeftPanel />
      {/* Маппим полученные посты пользователя и передаем каждый пост компоненту Post */}
      <div>
      {sortedPosts.map((post) => (
        <Post
          key={post.id}
          time={post.time}
          name={post.user.author_name}
          ava={post.user.author_avatar}
          level={post.level}
        >
        <div dangerouslySetInnerHTML={{ __html: post.content}} />
        </Post>
      ))}
      </div>
      <RightPanel />
    </div>
  );
}

export default Home;
