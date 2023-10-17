import React, { useState } from 'react';
import './SubscribeEdit.css';
import axios from 'axios';
import { useEffect } from 'react';
import { useAuth } from '../../AuthContext.js';

const SubscribeEdit = () => {
  const auth = useAuth(); // Получение информации о пользователе из контекста авторизации
  const { user, loading } = auth;

  const [subscriptions, setSubscriptions] = useState([]);
  
  const userId = user.id; // Замените на реальный идентификатор пользователя

  useEffect(() => {
    // Выполните GET-запрос к вашему API для получения подписок по user_id
    axios.get(`http://localhost:8080/api/levels/view?userId=${userId}`)
      .then((response) => {
        console.log(response.data);
        setSubscriptions(response.data);
      })
      .catch((error) => {
        console.error('Ошибка при получении подписок:', error);
      });
  }, [userId]);

  
  const updateSubscriptions = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/levels/update', subscriptions, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('Ошибка при отправке запроса:', error);
    }
  };

  const handleSave = (index, data) => {
    const updatedSubscriptions = [...subscriptions];
    updatedSubscriptions[index] = data;
    setSubscriptions(updatedSubscriptions);
  };

  const handleDelete = (index) => {
    const updatedSubscriptions = subscriptions.filter((_, i) => i !== index);
    setSubscriptions(updatedSubscriptions);
  };

  const handleAdd = () => {
    setSubscriptions([
      ...subscriptions,
      {
        id: subscriptions.length + 1,
        name: '',
        price: '',
        description: '',
      },
    ]);
  };

  return (
    <div className='edit-sub-container'>
      <form className='edit-sub-form'>
        {subscriptions.map((subscription, index) => (
          <div key={subscription.id} className='jopa'>
            <input
              type='text'
              className='input-styled-sub'
              value={subscription.name}
              onChange={(e) => handleSave(index, { ...subscription, name: e.target.value })}
              placeholder='Level'
            />
            <input
              type='text'
              className='input-styled-sub-rub'
              value={subscription.price}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/[^0-9]/g, '');
                handleSave(index, { ...subscription, price: onlyDigits });
              }}
              placeholder='Price'
              pattern='[0-9]*'
            />
            <span>Рублей/месяц</span>
            <textarea
              className='input-styled-sub'
              value={subscription.description}
              onChange={(e) => handleSave(index, { ...subscription, description: e.target.value })}
              placeholder='Description'
            />
            <button
              type='button'
              onClick={() => handleDelete(index)}
              className='edit-button-styled'
            >
              Удалить
            </button>
          </div>
        ))}
        <button
          type='button'
          onClick={handleAdd}
          className='edit-button-styled2'
        >
          +
        </button>
        <button
          type='button'
          onClick={updateSubscriptions}
          className='edit-button-styled3'
        >
          Применить изменения
        </button>
      </form>
    </div>
  );
};

export default SubscribeEdit;
