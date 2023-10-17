import './CreaterReg.css'
import { useForm } from 'react-hook-form';
import defimg from './foto.png'
import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../AuthContext.js';

function CreaterReg() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const auth = useAuth();
  const { user } = auth;


  const onSubmit = async (data) => {
    const formData = new FormData();

    console.log('Form Data:', data);
    formData.append('author_name', data.name);
    formData.append('author_tags', data.tags);
    formData.append('author_description', data.description);
    // Прочитать и добавить байт-код аватара
    // formData.append('author_avatar', avatar);

    // Прочитать и добавить байт-код шапки
    // formData.append('author_header', header);
    formData.append('qiwi_wallet', data.phoneNumber !== undefined ? data.phoneNumber : null);
    formData.append('card_number', data.cardNumber !== undefined ? data.cardNumber : null);
    formData.append('card_name', data.cardName !== undefined ? data.cardName : null);
    formData.append('card_date', data.cardExpiry !== undefined ? data.cardExpiry : null);
    formData.append('card_cvv', data.cardCvv !== undefined ? data.cardCvv : null);


    console.log(666)
    console.log('в userheader name: ' + (user ? user.username : 'NONE'));

    if (avatar) {
      const avatarFormData = new FormData();
      avatarFormData.append('image', avatar);

      try {
        const response = await axios.post('https://api.imgbb.com/1/upload?key=ca72488ef8a4330409756ec29b5c03f8', avatarFormData);
        const imageUrl = response.data.data.url;

        // Добавление ссылки на аватар в formData
        formData.append('author_avatar', imageUrl);
      } catch (error) {
        console.error('Ошибка при загрузке аватара на ImgBB:', error);
        // Обработка ошибки загрузки аватара
      }
    }

    if (header) {
      const headerFormData = new FormData();
      headerFormData.append('image', header);

      try {
        const response = await axios.post('https://api.imgbb.com/1/upload?key=ca72488ef8a4330409756ec29b5c03f8', headerFormData);
        const imageUrl = response.data.data.url;

        // Добавление ссылки на шапку в formData
        formData.append('author_header', imageUrl);
      } catch (error) {
        console.error('Ошибка при загрузке шапки на ImgBB:', error);
        // Обработка ошибки загрузки шапки
      }
    }

    for (let pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }

    axios.put('http://localhost:8080/api/user/author', formDataToJson(formData))
    .then(response => {
      console.log(response.data);
      console.log(formDataToJson(formData))
      // Обработка успешной отправки формы
    })
    .catch(error => {
      console.log(error);
      // Обработка ошибки при отправке формы
    });
  
  // Преобразование FormData в JSON
  function formDataToJson(formData) {
    const jsonObject = {};
    formData.forEach((value, key) => {
      jsonObject[key] = value;
    });
    return jsonObject;
  }
  
  };


  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
  };

  const handleHeaderChange = (e) => {
    const file = e.target.files[0];
    setHeader(file);
  };

  const [avatar, setAvatar] = useState(null);
  const [header, setHeader] = useState(null);


  return (
    <div className='form-container'>
    <form onSubmit={handleSubmit(onSubmit)} className='my-form' encType="multipart/form-data">
      <div className='form-group'>
        <label>Имя:</label>
        <input
          className='style-label'
          {...register('name', { required: true })}
        />
        {errors.name && <span className='error'>Обязательное поле</span>}
      </div>

      <div className='form-group'>
        <label>Теги:</label>
        <input
          className='style-label'
          {...register('tags', { required: true })}
        />
        {errors.tags && <span className='error'>Обязательное поле</span>}
      </div>

      <div className='form-group'>
        <label>Расскажите о себе:</label>
        <textarea
          {...register('description', { required: true })}
        ></textarea>
        {errors.description && <span className='error'>Обязательное поле</span>}
      </div>

      <div className='input-group'>
        <div className='input-ultragroup'>
          <label>Добавить аватар:</label>
          {avatar && (
            <div>
              <span>Выбран файл: {avatar.name}</span>
            </div>
          )}
        </div>
        <label className='inp-img'>
          <img src={defimg} alt="Аватар" />
          <input
            className='input-file'
            type="file"
            {...register('avatar')}
            onChange={handleAvatarChange}
          />
        </label>
      </div>

      <div className='input-group'> 
        <div className='input-ultragroup'>
          <label>Добавить шапку:</label>
          {header && (
            <div>
              <span>Выбран файл: {header.name}</span>
            </div>
          )}
        </div>
        <label>
          <img src={defimg} alt="Аватар" />
          <input
            accept="image/*"
            className='input-file'
            type="file"
            {...register('header')}
            onChange={handleHeaderChange}
          />
        </label>
      </div>

      <div className='form-group'>
        <label>Способ выплаты:</label>
        <select {...register('paymentMethod', { required: true })}>
          <option value="">Выберите способ выплаты</option>
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

      <button type="submit">Отправить</button>
    </form>
    </div>
  );
};
  
  export default CreaterReg;
  