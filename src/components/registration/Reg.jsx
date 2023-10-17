import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import './Reg.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../AuthContext.js';

const LoginForm = () => {
  const { register, handleSubmit, watch, formState: { errors } } = useForm({ mode: 'onChange' });
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate(); // Хук useNavigate для навигации
  const auth = useAuth(); // Получение функции login из контекста авторизации
  const { login } = auth;

  const onSubmit = async (data) => {
    try {
      let response;
      if (isRegistering) {
        response = await axios.post('http://localhost:8080/register', data);
      } else {
        response = await axios.post('http://localhost:8080/login', data);
        auth.login(response.data); // Обновляем состояние пользователя в контексте
        await navigate('/'); // Дождитесь завершения обновления
        window.location.reload();
      }
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  


  const handleRegisterClick = () => {
    setIsRegistering(true);
  };

  const confirmPassword = watch('confirmPassword');

  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit(onSubmit)} className="form">
        {/* Общие поля для регистрации и входа */}
        <div className="form-group">
          <label className='in-form-test'>Логин</label>
          <input className='input-styled' type="text" placeholder="Логин" {...register('username', { required: true, shouldUnregister: true })} />
          {errors.username && errors.username.type === 'required' && <span className='error-msg'>Поле "Логин" обязательно для заполнения</span>}
        </div>
        <div className="form-group">
        <label className='in-form-test'>Пароль</label>
          <input className='input-styled' type="password" placeholder="Пароль" {...register('password', { required: true, shouldUnregister: true })} />
          {errors.password && errors.password.type === 'required' && <span className='error-msg'>Поле "Пароль" обязательно для заполнения</span>}
        </div>

        {isRegistering ? (
          <>
            {/* Поля только для регистрации */}
            <div className="form-group">
              <label className='in-form-test'>Подтвердите пароль</label>
              <input className='input-styled' type="password" placeholder="Подтвердите Пароль" {...register('confirmPassword', { required: true, shouldUnregister: true })} />
              {errors.confirmPassword && errors.confirmPassword.type === 'required' && <span>Поле "Пароль" обязательно для заполнения</span>}
              {confirmPassword && confirmPassword !== watch('password') && <span className='error-msg'>Пароли не совпадают</span>}
            </div>
            <div className="form-group">
              <label className='in-form-test'>Адрес электронной почты</label>
              <input className='input-styled' type="email" placeholder="Почта" {...register('email', { required: true, pattern: emailPattern, shouldUnregister: true })} />
              {errors.email && errors.email.type === 'required' && <span className='error-msg'>Поле "Почта" обязательно для заполнения</span>}
              {errors.email && errors.email.type === 'pattern' && <span className='error-msg'>Некорректный адрес электронной почты</span>}
            </div>
            <div className="form-group2">
              <label>
                <input className='check-input' type="checkbox" {...register('agreement', { required: true, shouldUnregister: true })} />
                Я согласен на обработку данных
              </label>
              {errors.agreement && errors.agreement.type === 'required' && <span className='error-msg'>*</span>}
            </div>
          </>
        ) : (
          <>
            {/* Вопрос "Зарегистрироваться?" */}
            <button type="button" onClick={handleRegisterClick}>
              Зарегистрироваться?
            </button>
          </>
        )}

        {/* Кнопки для входа и регистрации */}
        {!isRegistering ? (
          <button type="submit">Войти</button>
        ) : (
          <>
            <button type="button" onClick={() => setIsRegistering(false)}>
              Назад
            </button>
            <button type="submit" disabled={confirmPassword !== watch('password') || Object.keys(errors).length > 0}>
              Зарегистрироваться
            </button>
          </>
        )}
      </form>
    </div>
  );
};

export default LoginForm;
