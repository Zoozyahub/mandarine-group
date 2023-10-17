import './UserHeader.css'
import namechange from './name-change.png'
import { useRef, useState, useEffect } from 'react';
import { useScrollbar  } from '../hooks/use-scrollbar';
import { Link, useLocation } from 'react-router-dom'
import Post from '../posts/Post'

import { useAuth } from '../../AuthContext.js';
import axios from 'axios';


const UserHeader = () => {
  const auth = useAuth();
  const { user, isLoggedIn, loading } = auth;
  console.log(isLoggedIn);

  const location = useLocation();
  const userIdFromPath = location.pathname.split('/').pop();
  const isCurrentUserPage = isLoggedIn && user.id.toString() === userIdFromPath;
  console.log('id ' + userIdFromPath + ' , is current profile ' + isCurrentUserPage);

  const [show, setShow] = useState(user);

  // Создаем состояние, чтобы отслеживать, был ли запрос уже выполнен
  const [hasRequestedUserInfo, setHasRequestedUserInfo] = useState(false);

  const [subscriptions, setSubscriptions] = useState([]);

  const hasScroll = subscriptions.length > 3;
  const subWrapper = useRef(null);
  useScrollbar(subWrapper, hasScroll);

  useEffect(() => {
      if (!isCurrentUserPage && !hasRequestedUserInfo) {
        axios
          .get(`http://localhost:8080/api/user/${userIdFromPath}`)
          .then((response) => {
            console.log(response.data);
            setShow(response.data);
            setHasRequestedUserInfo(true);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    }, [isCurrentUserPage, userIdFromPath, hasRequestedUserInfo]);

    useEffect(() => {
      // Выполните GET-запросы к вашему API для получения данных пользователя и подписок
      const getUserInfo = axios.get(`http://localhost:8080/api/user/${userIdFromPath}`);
      const getUserSubscriptions = axios.get(`http://localhost:8080/api/levels/view?userId=${userIdFromPath}`);
      
      Promise.all([getUserInfo, getUserSubscriptions])
        .then(([userInfoResponse, subscriptionsResponse]) => {
          console.log(userInfoResponse.data);
          console.log(subscriptionsResponse.data);

          setShow(userInfoResponse.data);
          setSubscriptions(subscriptionsResponse.data);
        })
        .catch((error) => {
          console.error('Ошибка при получении данных:', error);
        });
    }, [userIdFromPath]);
    
    const [posts, setPosts] = useState([]);

    useEffect(() => {
      axios
        .get(`http://localhost:8080/api/posts/allposts?userId=${userIdFromPath}`)
        .then((response) => {
          setPosts(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }, [userIdFromPath]);

    const sortedPosts = posts.sort((a, b) => {
      const dateA = new Date(a.time);
      const dateB = new Date(b.time);
      return dateB - dateA;
    });

  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (isLoggedIn && user && user.id !== userIdFromPath) {
      axios
        .get(`http://localhost:8080/api/follow/isFollowing?followerId=${user.id}&followingId=${userIdFromPath}`)
        .then((response) => {
          console.log("Подписан или нет: " + response.data)
          setIsFollowing(response.data);
        })
        .catch((error) => {
          console.error('Ошибка при получении информации о подписке:', error);
        });
    }
  }, [isLoggedIn, user, userIdFromPath]);
  
  const handleFollowClick = () => {
    if (isLoggedIn) {
      console.log("Подписан пользователь или нет " + isFollowing)
      console.log("Лог того кто подписывается " + user.id)
      console.log("Лог того на кого подписываются " + show.id)
      
      if (isFollowing) {
        // Если пользователь уже подписан, отправляем DELETE-запрос для отписки
        axios
          .delete(`http://localhost:8080/api/follow`, {
            data: {
              followerId: user.id,
              followingId: show.id,
            }
          })
          .then(() => {
            setIsFollowing(false);
          })
          .catch((error) => {
            console.error('Ошибка при отписке:', error);
          });
      } else {
        // Если пользователь не подписан, отправляем POST-запрос для подписки
        axios
          .post(`http://localhost:8080/api/follow`, {
            followerId: user.id,
            followingId: show.id,
          })
          .then(() => {
            setIsFollowing(true);
          })
          .catch((error) => {
            console.error('Ошибка при подписке:', error);
          });
      }
    }
  };
  
  console.log(sortedPosts)

  if (loading) {
      // Отображаем индикатор загрузки, пока данные пользователя загружаются
      return <div>Loading...</div>;
  }

  // Проверяем, что данные загрузились, прежде чем обращаться к ним
  if (!show || !subscriptions) {
      return <div>No data available</div>;
  }

    

    return (
    <div className="container">
        <div className="user-header">
            <div className="user-username-div"><span className='user-username'>{show.author_name}</span>
            <img src={namechange} className='name-change'/>
            </div>
            <img className="user-header-image" src={show.author_header} alt="Header" />
        </div>
        <div className="user-block">
            <img className="user-avatar" src={show.author_avatar} alt="User Avatar" />
            <div className="user-details">
                <div className="user-text-details">
                <span className="followers">1280</span>
                <span className="followers-text">Подписчиков</span>
                <span className='sys-about'>Об авторе:</span>
                <span className='descprition'>{show.author_description}</span>
                </div>
                <button className='follow-button' onClick={handleFollowClick}>{isFollowing ? 'Не Отслеживать' : 'Отслеживать'}</button>
            </div>
        </div>
        <div className='under-header'>
        <div className='under-header-content'>
        <div className='write-post'>
            <span className='lenta-text'> Лента </span>
            <div className='wrire-post-text-div'>
            {isCurrentUserPage && (    
            <Link to='/write'>
            <span className='wrire-post-text'>Написать пост</span>
            </Link>)}
            </div>
        </div>
        <div>
        {sortedPosts.map((post) => (
          <Post key={post.id} time={post.time} name={show.author_name} ava={show.author_avatar} level={post.level} current={isCurrentUserPage}>
            <div dangerouslySetInnerHTML={{ __html: post.content}} />
          </Post>
            ))}
        </div>
        </div>
        <div style={{ height: hasScroll ? '570px' : 'auto' }} ref={subWrapper} className='subscribtions-block'>
        <ul className='subs-list'>
        {subscriptions.map((level) => (
        <li key={level.id}>
        <div className='Subscriptions'>
          <span className='level-name'>{level.name}</span>
          <span className='level-price'>{level.price} Руб / мес.</span>
          <span className='level-desc'>{level.description}</span>
          <Link to={`subscribe/${encodeURIComponent(level.id)}`}><button className='subs-button'>Подписаться</button></Link>
        </div>
        </li>
        ))}
        </ul>
        {isCurrentUserPage && (  
        <Link to='subscribeedit'><button className='subs-button'>Редактировать подписки</button></Link>)}
        </div>
        </div>
    </div>
    )
  }
  
  export default UserHeader;