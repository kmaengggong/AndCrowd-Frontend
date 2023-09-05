import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Test from './pages/Test';
import NotFound from './pages/NotFound';
import CrowdBoardList from './pages/crowd/CrowdBoardList';
import CrowdBoardDeltail from "./pages/crowd/CrowdBoardDeltail";
import CrowdBoardInsert from "./pages/crowd/CrowdBoardInsert";
import CrowdBoardUpdate from "./pages/crowd/CrowdBoardUpdate";
import Login from './pages/Login';
import AndList from './pages/AndList';
import AndDetail from './pages/and/AndDetail';
import AndQna from './pages/and/AndQna';
import AndQnaDetail from './pages/and/AndQnaDetail';
import AndCreate from './pages/and/AndCreate';
import AndUpdate from './pages/and/AndUpdate';
import AndQnaCreate from './pages/and/AndQnaCreate';
import AndQnaUpdate from './pages/and/AndQnaUpdate';
import AndScroll from './pages/and/AndScroll';
import AndReplyUpdate from './pages/and/AndReplyUpdate';
import AndReplyCreate from './pages/and/AndReplyCreate';
import AndApplicant from './pages/and/AndApplicant';
import AndApplicantCreate from './pages/and/AndApplicantCreate';
import AndApplicantUpdate from './pages/and/AndApplicantUpdate';
import AndApplicantDetail from './pages/and/AndApplicantDetail';
import AndBoard from './pages/and/AndBoard';
import AndBoardDetail from './pages/and/AndBoardDetail';
import AndBoardCreate from './pages/and/AndBoardCreate';
import AndBoardUpdate from './pages/and/AndBoardUpdate';
import AndRole from './pages/and/AndRole';
import AndRoleDetail from './pages/and/AndRoleDetail';
import AndRoleCreate from './pages/and/AndRoleCreate';
import AndRoleUpdate from './pages/and/AndRoleUpdate';
import AndMember from './pages/and/AndMember';
import AndMemberDetail from './pages/and/AndMemberDetail';
import AndMemberCreate from './pages/and/AndMemberCreate';
import AndMemberUpdate from './pages/and/AndMemberUpdate';
import Signup from './pages/Signup';
import ChatPage from './pages/chat/ChatPage';
import AndChat from './pages/and/AndChat';
import ChatroomUpdate from './pages/chat/ChatroomUpdate';
import CrowdPayment from './payment/CrowdPayment';
import AdPayment from "./payment/AdPayment";
import MyPage from './pages/MyPage';
import ScrollToTop from './components/ScrollToTop';
import AndApplicantAdmin from './pages/and/AndApplicantAdmin';

const sections = [
  { title: '홈', url: '/' },
  { title: '모임', url: '/and/list' },
  { title: '펀딩', url: '/crowd/list' },
  { title: '팀소개', url: '/team' },
  { title: '도움말', url: '/help' },
];

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const maxWidth = Math.min(1320, windowWidth * 0.7); // 최대 너비를 1320px 또는 창 너비의 90% 중 작은 값으로 설정

  return (
    <div className='App'>
      <div className="wrapper" style={{ maxWidth: `${maxWidth}px` }}>
        <Header title="&Crowd" sections={sections} />
        <div className="main-content">
          <ScrollToTop></ScrollToTop>
          <Routes>
            <Route path="/user/1/and" element={<Test />} />
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/and/list" element={<AndList />} />
            <Route path="/and/scroll" element={<AndScroll />} />
            <Route path="/and/:andId" element={<AndDetail />} />
            <Route path="/and/:andId/update" element={<AndUpdate />} />
            <Route path="/and/create" element={<AndCreate />} />
            <Route path="/and/:andId/qna/list" element={<AndQna />} />
            <Route path="/and/:andId/qna/create" element={<AndQnaCreate />} />
            <Route path="/and/:andId/qna/:andQnaId" element={<AndQnaDetail />} />
            <Route path="/and/:andId/qna/:andQnaId/update" element={<AndQnaUpdate />} />
            <Route path="/and/:andId/qna/reply/:andQnaId/:andQnaReplyId/update" element={<AndReplyUpdate />} />
            <Route path="/and/:andId/qna/reply/:andQnaId/create" element={<AndReplyCreate />} />
            <Route path="/and/:andId/applicant/list" element={<AndApplicant />} />
            <Route path="/and/:andId/applicant/create" element={<AndApplicantCreate />} />
            <Route path="/and/:andId/applicant/:andApplyId/update" element={<AndApplicantUpdate />} />
            <Route path="/and/:andId/applicant/:andApplyId" element={<AndApplicantDetail />} />
            <Route path="/and/:andId/applicant/:andApplyId/admin" element={<AndApplicantAdmin />} />
            <Route path="/and/:andId/board/list" element={<AndBoard />} />
            <Route path="/and/:andId/board/create" element={<AndBoardCreate />} />
            <Route path="/and/:andId/board/:andBoardId" element={<AndBoardDetail />} />
            <Route path="/and/:andId/board/:andBoardId/update" element={<AndBoardUpdate />} />
            <Route path="/and/:andId/role/list" element={<AndRole />} />
            <Route path="/and/:andId/role/create" element={<AndRoleCreate />} />
            <Route path="/and/:andId/role/:andRoleId" element={<AndRoleDetail />} />
            <Route path="/and/:andId/role/:andRoleId/update" element={<AndRoleUpdate />} />
            <Route path="/and/:andId/member/list" element={<AndMember />} />
            <Route path="/and/:andId/member/create" element={<AndMemberCreate />} />
            <Route path="/and/:andId/member/:memberId" element={<AndMemberDetail />} />
            <Route path="/and/:andId/member/:memberId/update" element={<AndMemberUpdate />} />
            <Route path="/and/create" element={<AndCreate />} />
            <Route path="/and/:andId/chat" element={<AndChat />} />
            <Route path="/and/:andId/chat/room/:roomId/name-update" element={<ChatroomUpdate />} />
            <Route path="/crowd/:crowdId/board/:crowdBoardId/update" element={<CrowdBoardUpdate />} />
            <Route path="/crowd/:crowdId/board/all" element={<CrowdBoardList />} />
            <Route path="/crowd/:crowdId/board/:crowdBoardId" element={<CrowdBoardDeltail />} />
            <Route path="/crowd/:crowdId/insert" element={<CrowdBoardInsert />} />
            <Route path="/crowd/:crowdId/reward/:rewardId/payment" element={<CrowdPayment />} />
            <Route path="/ad/payment" element={<AdPayment />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/crowd/list" element={<Login />} />
            <Route path="/crowd/create" element={<Login />} />
            <Route path="/team" element={<Login />} />
            <Route path="/help" element={<Login />} />
            <Route path="*" element={<NotFound />} />
            <Route path='/chat' element={<ChatPage />} />
          </Routes>
        </div>
      </div>
      <Footer></Footer>
    </div>
  );
}

export default App;
