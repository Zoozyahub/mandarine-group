import React, { useState, useEffect } from 'react';
import { Editor, EditorState, RichUtils, convertToRaw, AtomicBlockUtils} from 'draft-js';
import 'draft-js/dist/Draft.css'; // импортируем стили
import { stateToHTML } from 'draft-js-export-html';
import axios from 'axios';

import  Post  from '../posts/Post'

import CustomSelect, { customSelect } from '../select/customSelect'

import ImageBlock from './ImageBlock'; // Подставьте правильный путь к вашему компоненту ImageBlock

import './PostConstructor.css';

import { useAuth } from '../../AuthContext';

function PostConstructor() {
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [blockType, setBlockType] = useState('unstyled');
  const [editorContent, setEditorContent] = useState(''); // Содержимое редактора

  const auth = useAuth();
  const { user } = auth;
  const userId = user.id;


  const convertEditorContentToHTML = (editorState) => {
    const contentState = editorState.getCurrentContent();
    return stateToHTML(contentState);
  };

  const toggleBlockType = (blockType) => {
    setBlockType(blockType);
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const modifyText = (command) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, command));
  };

  const getEditorContent = () => {
    const contentState = editorState.getCurrentContent();
    const rawContentState = convertToRaw(contentState);
    console.log(rawContentState); // Вывести содержимое в консоль
    const textArray = rawContentState.blocks.map((block) => block.text);
    const textContent = textArray.join('\n'); // Объединяем текст в одну строку
    setEditorContent(textContent); // Устанавливаем содержимое для отображения
    const postContentHTML = convertEditorContentToHTML(editorState);
    // Получаем текущую дату и время в формате "10.10.2023 12:00"
    const currentDate = new Date();
    let month = currentDate.getMonth() + 1
    if (month < 10){
      month = "0" + month
    } 
    const formattedDate = `${currentDate.getDate()}.${month}.${currentDate.getFullYear()} ${currentDate.getHours()}:${currentDate.getMinutes()}`;

    // Получаем выбранный уровень и его ID из элемента <select>
    const selectedLevelId = document.getElementById('selectLevel').value;
    const selectedLevel = subscriptions.find((level) => level.id == selectedLevelId);
    const levelDto = {id: selectedLevel.id, name: selectedLevel.name, description: selectedLevel.description, price: selectedLevel.price}
    console.log('выбран уровень ' + selectedLevel)
    const post = {
      content: postContentHTML,
      time: formattedDate,
      level: selectedLevel,
      user: user
    }

    console.log(post)
    axios.post('http://localhost:8080/api/posts/create', post)
    .then((response) => {
      // Обработка успешного ответа от сервера
      console.log('Пост успешно создан:', response.data);
    })
    .catch((error) => {
      // Обработка ошибки при создании поста
      console.error('Ошибка при создании поста:', error);
    });
  };


  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageSrc = e.target.result;

        // Создайте Entity для изображения
        const contentState = editorState.getCurrentContent();
        const contentStateWithEntity = contentState.createEntity('IMAGE', 'IMMUTABLE', { src: imageSrc });
        const entityKey = contentStateWithEntity.getLastCreatedEntityKey();

        // Вставьте изображение как блочный элемент
        const newEditorState = AtomicBlockUtils.insertAtomicBlock(editorState, entityKey, ' ');

        setEditorState(newEditorState);
      };
      reader.readAsDataURL(file);
    }
  };


  const blockRenderer = (contentBlock) => {
    if (contentBlock.getType() === 'atomic') {
      return {
        component: ImageBlock,
        editable: false,
        props: {
          contentState: editorState.getCurrentContent(),
        },
      };
    }
    return null;
  };

  const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const [subscriptions, setSubscriptions] = useState([]);

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


  return (
    <div className="constructor-container-container">
    <div className="constructor-container">
      <div className="constructor-options">
        <button id="bold" className="option-button-format" onClick={() => modifyText('BOLD')}>
          <i className="fa-solid fa-bold"></i>
        </button>
        <button id="italic" className="option-button-format" onClick={() => modifyText('ITALIC')}>
          <i className="fa-solid fa-italic"></i>
        </button>
        <button id="underline" className="option-button-format" onClick={() => modifyText('UNDERLINE')}>
          <i className="fa-solid fa-underline"></i>
        </button>
        <input
          type="file"
          id="imageInput"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
        <label htmlFor="imageInput" className="option-button-format">
          <i className="fa-regular fa-image"></i>
        </label>
        <select
              className="adv-option-button"
              value={blockType}
              onChange={(e) => toggleBlockType(e.target.value)}
            >
              <option value="unstyled">Обычный текст</option>
              <option value="header-one">Загловок 1</option>
              <option value="header-two">Загловок 2</option>
              <option value="header-three">Загловок 3</option>
              <option value="header-four">Загловок 4</option>
            </select>
      </div>
      <div id="text-input" className="const-text-input">
      <Editor
          editorState={editorState}
          onChange={setEditorState}
          blockRendererFn={blockRenderer} // Подключите функцию blockRenderer
        />
      </div>
      <select id="selectLevel">
          <option value="">Выберите уровень подписки</option>
            {subscriptions.map((subscriptions) => (
          <option key={subscriptions.id} value={subscriptions.id}>
            {subscriptions.name}
          </option>
          ))}
      </select>
      <button onClick={getEditorContent} className='const-button'>Опубликовать</button>
    </div>
    </div>
  );
}

export default PostConstructor;
