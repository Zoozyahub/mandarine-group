import './RightPanel.css'
import DefaultAvatar from './avatar.png'
import { useScrollbar  } from '../hooks/use-scrollbar';
import { Link } from 'react-router-dom';
import { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext.js';


const RightPanel = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const auth = useAuth();
  const { user, isLoggedIn, loading } = auth;

  useEffect(() => {
    // Проверьте, залогинен ли пользователь, прежде чем делать запрос
    if (isLoggedIn && user) {
      // Создайте запрос на сервер, чтобы получить список подписок пользователя
      axios
        .get(`http://localhost:8080/api/follow/allFollows?userId=${user.id}`)
        .then((response) => {
          setSubscriptions(response.data);
        })
        .catch((error) => {
          console.error('Ошибка при получении списка подписок:', error);
        });
    }
  }, [isLoggedIn, user]);


  const recomendations = [
    {
        id: 1,
        name: 'Имя пользователя 1',
        avatar: DefaultAvatar,
        theme: 'Тема 1'
    },
    {
        id: 2,
        name: 'Имя пользователя 2',
        avatar: DefaultAvatar,
        theme: 'тема 2'
    },
    {
        id: 3,
        name: 'Имя пользователя 3',
        avatar: DefaultAvatar,
        theme: 'Тема 3'
      },
    ]


    const hasScroll = subscriptions.length > 5;
    const subscriptionsWrapper = useRef(null)
    useScrollbar(subscriptionsWrapper, hasScroll);

    if (loading) {
      // Отображаем индикатор загрузки, пока данные пользователя загружаются
      return <div>Loading...</div>;
  }

    return (
    <div className='RightMenu'>
       <span className='SubTxt'>Подписки</span>
    <div style={{height: hasScroll ? '290px' : 'auto'}} ref={subscriptionsWrapper} className='all-subs-div'>
    <ul>
        {subscriptions.map((user) => ( 
        <Link to={`author/${user.id}`}>  
        <li key={user.id}>
        <img src={user.author_avatar} alt='Аватар' />
        <div className='Subscribtions'>
          <span>{user.author_name}</span>
          <span>{user.author_tags}</span>
        </div>
        </li>
        </Link>
        ))}
    </ul>
    </div>
    <span className='SubTxt'>Рекомендации</span>
    <ul>
        {recomendations.map((user) => (  
        <li key={user.id}>
        <img src={user.avatar} alt='Аватар' />
        <div className='Subscribtions'>
          <span>{user.name}</span>
          <span>{user.theme}</span>
        </div>
        </li>
        ))}
    </ul>
    </div>
    )
  }
  
  export default RightPanel;