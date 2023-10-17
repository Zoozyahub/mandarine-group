import './Statistic.css'
import { useState } from 'react';

const initialSubscriptions = [
  {
    id: 1,
    Level: 'Начинающий',
    Price: '50',
    Desc: 'Открывает доступ к половине контента',
    subscribers: '10'
  },
  {
    id: 2,
    Level: 'Средний',
    Price: '150',
    Desc: 'Открывает доступ ко всему контенту',
    subscribers: '10'
  },
  {
    id: 3,
    Level: 'Лучший',
    Price: '300',
    Desc: 'Просто так aaaaaaaaaa aaaaaaaaaaaaa aaaaaaaa aaaaaaaa a aaaaaaaa aaaaaaaaaaa aaaaaaaaaa aaaaaaa aaaaaaaa',
    subscribers: '12',
  },
  {
    id: 4,
    Level: 'Awesome',
    Price: '600',
    Desc: 'Просто так',
    subscribers: '0'
  },
  {
    id: 5,
    Level: 'diklol',
    Price: '300',
    Desc: 'Просто так',
    subscribers: '2'
  },
];

function Statistic() {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);

  // Вычисляем общее количество подписчиков
  const totalSubscribers = subscriptions.reduce((acc, subscription) => acc + parseInt(subscription.subscribers, 10), 0);

  // Вычисляем общую сумму за всех подписчиков
  const totalRevenue = subscriptions.reduce((acc, subscription) => acc + (parseInt(subscription.Price, 10) * parseInt(subscription.subscribers, 10)), 0);

  return (
    <div className='stats-container-2'>
    <div className='stats-container'>
      <span className='subscription-text-stats'> Статистика по подпискам: </span> 
      {subscriptions.map((subscription) => (
        <div key={subscription.id} className='subscription-stas-div'>
          <div className='subscription-details'>
            <span className='subscription-level-stats'>{subscription.Level}</span>
            <span className='subscription-price-stats'>{subscription.Price} р / мес.</span>
            <p/>
            <span className='subscription-subscribers-stats'>{subscription.subscribers} подписчиков</span>
            <p/>
          </div>
          <div className='subscription-revenue'>
            <span className='subscription-total-revenue-stats'>Доход за месяц {parseInt(subscription.Price, 10) * parseInt(subscription.subscribers, 10)}р</span>
          </div>
        </div>
      ))}
      </div>
      <div>
      <span className='subscription-text-stats'> Общая статистика: </span> 
      <div className='total-stats'>
        <span className='subscription-price-stats'>{totalSubscribers} подписчиков</span>
        <span className='subscription-price-stats'>{totalRevenue}р в месяц</span>
      </div>
      </div>
    </div>
  );
}

export default Statistic;
