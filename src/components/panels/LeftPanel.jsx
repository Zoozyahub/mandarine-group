import React from 'react';
import './LeftPanel.css';
import Author from './Author.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../../AuthContext.js';

const LeftPanel = ({ isAuthor }) => {
  const auth = useAuth(); // Получение информации о пользователе из контекста авторизации
  const {user, isLoggedIn} = auth;

  return (
    <div className='LeftMenu'>
      <div className='BeAuthor'>
        {user && user.is_author ? (
          <Link to={`/author/${encodeURIComponent(user.id)}`}> {/* Замените на путь к профилю автора */}
            <img src={user.author_avatar} alt="Author Profile" className='author-img-left'/>
          </Link>
        ) : (
          <Link to='/beauthor'> {/* Путь для неавторов */}
            <img src={Author} alt="Be an Author" />
          </Link>
        )}
      </div>
      <div className='Liked'>
        <a href='/'>
          <span>Понравившееся</span>
        </a>
      </div>
    </div>
  );
};

export default LeftPanel;
