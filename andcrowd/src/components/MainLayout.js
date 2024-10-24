import Footer from './Footer';
import Header from './Header';
import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <>
      <Header />
      
      
      <Outlet />
    </>
  );
};
export default MainLayout;