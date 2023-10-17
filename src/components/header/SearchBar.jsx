import React, { useState, useEffect, useRef } from 'react';
import DefaultAvatar from './avatar.png';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SearchBar = () => {
  const [authors, setAuthors] = useState([]);  
  const [searchText, setSearchText] = useState('');
  const [filteredAuthors, setFilteredAuthors] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    const text = e.target.value;
    setSearchText(text);

    const filtered = authors.filter((author) =>
      author.authorName.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredAuthors(filtered);
  };

  const handleInputBlur = () => {
    // Устанавливаем флаг фокуса в false с небольшой задержкой
    setTimeout(() => {
      setIsFocused(false);
    }, 100);
  };

  useEffect(() => {
    // Если элемент потерял фокус и список не пустой, очищаем результаты поиска
    if (!isFocused && filteredAuthors.length > 0) {
      setFilteredAuthors([]);
    }
  }, [isFocused, filteredAuthors]);

  useEffect(() => {
    // Проверяем, если текст не пустой и фокус на элементе
    if (searchText && isFocused) {
      // Выполняем запрос на сервер с текстом поиска
      axios.get(`http://localhost:8080/api/search?query=${searchText}`)
        .then((response) => {
          // Здесь предполагается, что сервер вернет массив авторов в response.data
          // Обновляем filteredAuthors с полученными авторами
          console.log(response.data);
          setFilteredAuthors(response.data)
        })
        .catch((error) => {
          console.error('Ошибка при выполнении запроса на сервер:', error);
        });
    } else {
      // Если поле пустое или элемент потерял фокус, очищаем результаты поиска
      setAuthors([]);
    }
  }, [searchText, isFocused]);

  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search..."
        value={searchText}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        onFocus={() => setIsFocused(true)} // Устанавливаем флаг, что элемент в фокусе
        ref={inputRef} // Привязываем ref к элементу input
        className='search-input'
      />
      {filteredAuthors.length > 0 && isFocused && (
        <div className="search-results">
          {filteredAuthors.map((author) => (
            <Link to={`author/${author.id}`}
            onClick={() => console.log(author.id)}>
            <div key={author.id} className="search-result-au">
              <img src={author.author_avatar} alt="Author Avatar" className='image-search'/>
              <div className="author-info-search">
                <span className="author-name-search">{author.author_name}</span>
              </div>
            </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
