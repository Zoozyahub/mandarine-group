import { useForm } from 'react-hook-form';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext.js';
import './Subscribe.css'
import { useLocation } from 'react-router-dom';

function Subscribe() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const auth = useAuth();
    const { user } = auth;
    const location = useLocation();
    const SubIdFromPath = location.pathname.split('/').pop();
  
    const onSubmit = async () => {
      axios
      .post(`http://localhost:8080/api/subscribe`, {
        userId: user.id,
        levelId: SubIdFromPath,
      })
      .then(() => {
        console.log("Подписка успешна");
      })
      .catch((error) => {
        console.error('Ошибка при подписке:', error);
      });
    } 

    const [rub, setRub] = useState(0);

    useEffect(() => {
      const fetchCost = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/levels/${SubIdFromPath}/cost`);
          setRub(response.data);
        } catch (error) {
          console.error('Ошибка при получении стоимости подписки:', error);
        }
      };
      fetchCost();
    }, [SubIdFromPath]);

  

  
    return (
      <div className='form-container-subscribe'>
        <div className='subs-info-text-div'><span className='subs-info-text'>К оплате </span><span className='subs-info-text'>{rub}</span><span className='subs-info-text'> Рублей </span></div>
        <form onSubmit={handleSubmit(onSubmit)} className='my-form' encType="multipart/form-data">
        <div className='form-group'>
          <label>Способ выплаты:</label>
          <select {...register('paymentMethod', { required: true })}>
            <option value="">Выберите способ оплаты</option>
            <option value="qiwi">Qiwi</option>
            <option value="creditCard">Кредитная карта</option>
          </select>
          {errors.paymentMethod && <span className='error'>Обязательное поле</span>}
        </div>
  
        {watch('paymentMethod') === 'qiwi' && (
          <div className='form-group'>
            <label>Номер телефона Qiwi:</label>
            <input
              className='style-label'
              {...register('phoneNumber', { required: true })}
            />
            {errors.phoneNumber && <span className='error'>Обязательное поле</span>}
          </div>
        )}
  
        {watch('paymentMethod') === 'creditCard' && (
          <div className='form-group'>
            <label>Номер карты:</label>
            <input
              className='style-label'
              {...register('cardNumber', { required: true })}
            />
            {errors.cardNumber && <span className='error'>Обязательное поле</span>}
            <label>Имя:</label>
            <input
              className='style-label'
              {...register('cardName', { required: true })}
            />
            {errors.cardName && <span className='error'>Обязательное поле</span>}
            <div className='date-cvv'>
            <label>Дата:</label>
            <input
            className='style-label-two'
              {...register('cardExpiry', { required: true })}
            />
            {errors.cardExpiry && <span className='error'>*</span>}
  
            <label>CVV:</label>
            <input
              className='style-label-two'
              {...register('cardCvv', { required: true })}
            />
            {errors.cardCvv && <span className='error'>*</span>}
            </div>
          </div>
        )}
  
        <button type="submit">Оформить подписку</button>
      </form>
      </div>
    );
}


export default Subscribe;


