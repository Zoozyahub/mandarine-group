import './Header.css';
import { ReactComponent as HomeIcon } from './Home-icon.svg'; // Импорт SVG-иконки
import Logo from './main.png';
import DefaultAvatar from './avatar.png';

import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../AuthContext.js';
import SearchBar from './SearchBar';


const Header = () => {
  const auth = useAuth(); // Получение информации о пользователе из контекста авторизации
  const { isLoggedIn, user, logout } = auth;

  const fakeAuthors = [
    { id: 1, authorName: 'Автор 1', theme: 'Тема 1', avatar: 'avatar1.jpg' },
    { id: 2, authorName: 'Автор 2', theme: 'Тема 1', avatar: 'avatar2.jpg' },
    { id: 3, authorName: 'Автор 3', theme: 'Тема 1', avatar: 'avatar3.jpg' },
    // Добавьте больше фейковых авторов, если нужно
  ];
  

  return (
    <>
      <div className='HeaderWraper'>
        <header className='Header'>
          <div className='Home'>
            <Link className='homeButton' to='/'>
              <HomeIcon className='HomeIcon' />
            </Link>
          </div>
          <div className='Logo'>
            <img src={Logo} alt='Main Image' />
          </div>
          <div className='input-and-avatar'>
          <SearchBar/>
          <div className='Login'>
            {isLoggedIn ? (
              <>
                <span className='Username'>{user.username}</span>
              </>
            ) : (
              <Link className='LoginText' to='/login'>
                Login
              </Link>
            )}
            <img src={DefaultAvatar} className='Avatar' />
            {isLoggedIn ? (  <button onClick={logout} className='loguot-button'><i class="fa-solid fa-right-from-bracket"></i></button>) : (<></>)}
          </div>
          </div>
        </header>
      </div>
      <Outlet />
    </>
  );
};

export default Header;

