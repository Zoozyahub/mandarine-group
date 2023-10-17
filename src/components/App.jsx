import 'overlayscrollbars/overlayscrollbars.css';
import {Routes, Route} from 'react-router-dom'

import { AuthProvider } from '../AuthContext';

import './App.css';
import Header from './header/Header';
import Home from '../pages/Home'
import Profile from '../pages/Profile'
import AuthorRegistration from '../pages/AuthorRegistration'
import UserRegistration from '../pages/UserRegistration'

import PostConstructor from './constructor/PostConstructor';
import Subscribe from './subscribe/Subscribe';
import SubscribeEdit from './subscribe/SubscribeEdit';

import Statistic from './stats/Statistic';


function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path='/' element={<Layout />}>
          <Route index element={<Home />} />
          <Route path='login' element={<UserRegistration />} />
          <Route path='beauthor' element={<AuthorRegistration />} />
          <Route path="author/:author_name" element={<Profile />} />
          <Route path="write" element={<PostConstructor/>}/>
          <Route path="author/:author_name/subscribe/:sub_id" element={<Subscribe/>}/>
          <Route path="author/:author_name/subscribeedit" element={<SubscribeEdit/>}/>
          <Route path='stats' element={<Statistic/>}/>
        </Route>
      </Routes>
    </AuthProvider>
  );
}

const Layout = ({ children }) => {
  return (
    <>
      <Header />
      {children}
    </>
  );
};

export default App;


