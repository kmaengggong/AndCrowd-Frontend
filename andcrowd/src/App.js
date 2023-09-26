import './App.css';
import {React, useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { IsLoginProvider, useIsLoginState } from './context/isLoginContext';
import PublicRoute from './components/route/PublicRoute';
import PrivateRoute from './components/route/PrivateRoute';
import SignRoute from './components/route/SignRoute';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Test from './pages/Test';
import NotFound from './pages/etc/NotFound';
import Login from './pages/user/Login';
import Signup from './pages/user/Signup';
import MyPage from './pages/user/MyPage';
import CrowdBoardList from './pages/crowd/CrowdBoardList';
import CrowdBoardDetail from "./pages/crowd/CrowdBoardDetail";
import CrowdBoardInsert from "./pages/crowd/CrowdBoardInsert";
import CrowdBoardUpdate from "./pages/crowd/CrowdBoardUpdate";
import AndList from './pages/AndList';
import AndDetail from './pages/and/AndDetail';
import AndQna from './pages/and/AndQna';
import AndQnaDetail from './pages/and/AndQnaDetail';
import AndCreate1 from './pages/and/AndCreate1';
import AndCreate from './pages/and/AndCreate';
import AndCreatePage2 from './pages/and/AndCreatePage2';
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
import ChatPage from './pages/chat/ChatPage';
import AndChat from './pages/and/AndChat';
import ChatroomUpdate from './pages/chat/ChatroomUpdate';
import AndCreateImg from './components/and/AndCreateImg';
import ScrollToTop from './components/ScrollToTop';
import AndApplicantAdmin from './pages/and/AndApplicantAdmin';
import { NaverLoginCallback } from './components/sign/NaverLoginCallback';
import AndManage from './pages/and/AndManage';
import CrowdDetail from './pages/crowd/CrowdDetail';
import CrowdList from './pages/CrowdList';
import CrowdCreate from './pages/crowd/CrowdCreate';
import LoginRoute from './components/route/LoginRoute';
import UserInfoEdit from './pages/user/UserInfoEdit';
import Logout from './components/sign/Logout';
import UserPasswordChange from './pages/user/UserPasswordChange';
import FindIdOrPassword from './pages/user/FindIdOrPassword';
import FindId from './pages/user/FindId';
import FindPassword from './pages/user/FindPassword';
import ProfileImgEdit from './pages/user/ProfileImgEdit';
import MakerPage from './pages/user/MakerPage';
import MyPageCardsDetailPage from './pages/user/MyPageCardsDetailPage';
import Team from './pages/etc/Team';
import Help from './pages/etc/Help';
import CrowdReward from './pages/crowd/CrowdReward';
import CrowdQnaList from './pages/crowd/CrowdQnaList';
import CrowdQnaCreate from './pages/crowd/CrowdQnaCreate';
import CrowdUpdate from './pages/crowd/CrowdUpdate';
import CrowdQnaUpdate from './pages/crowd/CrowdQnaUpdate';
import CrowdQnaDetail from './pages/crowd/CrowdQnaDetail';
import CrowdReplyUpdate from './pages/crowd/CrowdReplyUpdate';
import CrowdReplyCreate from './pages/crowd/CrowdReplyCreate';
import CrowdRewardCreate from './pages/crowd/CrowdRewardCreate';
import AdminSignup from './pages/user/admin/AdminSignup';
import AdminRoute from './components/route/AdminRoute';
import AdminMain from './pages/user/admin/AdminMain';
import Infoboard from './pages/etc/Infoboard';
import InfoboardDetail from './pages/etc/InfoboardDetail';
import CrowdPayment from './components/payment/CrowdPayment';
import CrowdRewardPayment from './components/payment/CrowdRewardPayment';
import Search from './pages/etc/Search';
import CallBackFromOAuth from './components/sign/oauth2/CallBackFromOAuth';
import CrowdCreateImg from './components/crowd/CrowdCreateImg';
import Chatbot from './pages/etc/Chatbot';
import CrowdCreate1 from './pages/crowd/CrowdCreate1';
import CrowdCreate2 from './pages/crowd/CrowdCreate2';
import OrderDetail from './pages/user/OrderDetail';
import UserInfo from './pages/user/UserInfo';
import HelpChatbot from './pages/etc/HelpChatbot';
import ContactSupportRoundedIcon from '@mui/icons-material/ContactSupportRounded';
import CrowdManage from './pages/crowd/CrowdManage';
import MainLayout from './components/MainLayout';
import CrowdRewardUpdate from './pages/crowd/CrowdRewardUpdate';
import CrowdOrderDetail from './pages/payment/CrowdOrderDetail';

function App() {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const ADMIN = process.env.REACT_APP_ADMIN_SIGN_UP_URL;

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // 챗봇 모달창 관리
  const [isChatbotModalOpen, setIsChatbotModalOpen] = useState(false);
  const isLogin = useIsLoginState();

  const openChatbotModal = () => {
    if(!isLogin){
      alert("챗봇은 로그인 후 사용 가능합니다.")
    } else{
    setIsChatbotModalOpen(true);
    }
  };

  const closeChatbotModal = () => {
    setIsChatbotModalOpen(false);
  };

  const maxWidth = Math.min(1320, windowWidth * 0.7); 

  return (
    <IsLoginProvider>
    <div className='App'>
    <Routes>
        <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            </Route>
            </Routes>
      <div className="wrapper" style={{ maxWidth: `${maxWidth}px` }}>
        
        <div className="main-content">
          <ScrollToTop></ScrollToTop>
          <Routes>
            <Route path="/logout" element={<Logout />} />
            <Route element={<MainLayout />}>
            <Route path="/infoboard/list" element={<Infoboard />} />
            <Route path="/infoboard/:infoId" element={<InfoboardDetail />} />
            <Route path="/callback/from/:token" element={<CallBackFromOAuth />} />
            </Route>
            {/* 로그인되지 않은 상태에서만 접근 가능 */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/oauth/redirected/naver/*" element={<NaverLoginCallback />} />
              <Route path="/findIdOrPassword" element={<FindIdOrPassword />} />
              <Route path="/findId" element={<FindId />} />
              <Route path="/findPassword" element={<FindPassword />} />
              <Route path={`/${ADMIN}`} element={<AdminSignup />} />
            </Route>
            
            {/* 토큰 재발급을 위한 로그인 판별 - 로그인 유뮤 상관x*/}
            <Route element={<LoginRoute />}>
              {/* 누구라도 접근 가능 */}
              {/* Etc */}
              <Route element={<MainLayout />}>
              <Route path="/team" element={<Team />} />
              <Route path="/help" element={<Help />} />
              <Route path='/chat' element={<ChatPage />} />
              {/* <Route path='/chat' element={<ChatPage />} /> */}
              <Route path="/test" element={<Test />} />

              {/* And 관련 */}
              <Route path="/and/list" element={<AndList />} />
              <Route path="/and/scroll" element={<AndScroll />} />
              <Route path="/and/:andId" element={<AndDetail />} />
              <Route path="/and/:andId/qna/list" element={<AndQna />} />
              <Route path="/and/:andId/board/list" element={<AndBoard />} />

              {/* Crowd 관련 */}
              <Route path="/crowd/list" element={<CrowdList />} />
              <Route path="/crowd/:crowdId/board/all" element={<CrowdBoardList />} />
              <Route path="/crowd/detail/:crowdId" element={<CrowdDetail />} />
              <Route path="/crowd/:crowdId" element={<CrowdDetail />} />
              <Route path="/crowd/:crowdId/reward/all" element={<CrowdReward />} /> {/* 추가 */}
              <Route path="/crowd/:crowdId/qna/all" element={<CrowdQnaList />} /> {/* 추가 */}
              <Route path='/crowd/:crowdId/qna/' element={<CrowdQnaCreate />} /> {/* 추가 */}
              <Route path='/crowd/:crowdId/qna/:crowdQnaId/' element={<CrowdQnaDetail />} /> {/* 추가 */}
              <Route path='/crowd/:crowdId/board' element={<CrowdBoardInsert />} /> {/* 추가 */}
              <Route path='/crowd/:crowdId/qna/:crowdQnaId/qnareply' element={<CrowdReplyCreate/>} /> {/* 추가 */}
              
              </Route>

              {/* 로그인된 유저만 접근 가능 */}
              <Route element={<PrivateRoute />}>
              <Route element={<MainLayout />}>
                {/* User 관련 */}
                <Route path="/user/:userId/maker" element={<MakerPage />} />
                <Route path="/user/:userId/order" element={<OrderDetail />} />
                <Route path="/user/:userId/info" element={<UserInfo />} />

                {/* 비밀번호 확인을 통해 접근 가능 */}
                <Route element={<SignRoute />}>
                  <Route path="/user/:userId/profileImgEdit" element={<ProfileImgEdit />} />
                  <Route path="/user/:userId/update" element={<UserInfoEdit />} />
                  <Route path="/user/:userId/passwordChange" element={<UserPasswordChange />} />
                </Route>

                {/* And 관련 */}
                <Route path="/and/create1" element={<AndCreate1 />} />
                <Route path="/and/:andId/create" element={<AndCreatePage2 />} />
                <Route path="/and/:andId/img/create" element={<AndCreateImg />} />
                <Route path="/and/:andId/update" element={<AndUpdate />} />
                <Route path="/and/:andId/qna/create" element={<AndQnaCreate />} />
                <Route path="/and/:andId/create/editer" element={<AndCreate />} />
                <Route path="/and/:andId/qna/reply/:andQnaId/create" element={<AndReplyCreate />} />
                <Route path="/and/:andId/applicant/create" element={<AndApplicantCreate />} />
                <Route path="/and/:andId/board/create" element={<AndBoardCreate />} />
                <Route path="/and/:andId/board/:andBoardId/update" element={<AndBoardUpdate />} />
                <Route path="/and/:andId/member/create" element={<AndMemberCreate />} />
                <Route path="/and/:andId/member/:memberId/update" element={<AndMemberUpdate />} />
                <Route path="/and/:andId/role/create" element={<AndRoleCreate />} />
                <Route path="/and/:andId/role/update" element={<AndRoleUpdate />} />
                <Route path='/search/:searchKeyword' element={<Search />} />
                <Route path="/and/:andId/qna/:andQnaId" element={<AndQnaDetail />} />
                <Route path="/and/:andId/qna/:andQnaId/update" element={<AndQnaUpdate />} />
                <Route path="/and/:andId/qna/reply/:andQnaId/:andQnaReplyId/update" element={<AndReplyUpdate />} />
                <Route path="/and/:andId/applicant/list" element={<AndApplicant />} />
                <Route path="/and/:andId/applicant/:andApplyId/update" element={<AndApplicantUpdate />} />
                <Route path="/and/:andId/applicant/:andApplyId" element={<AndApplicantDetail />} />
                <Route path="/and/:andId/applicant/:andApplyId/admin" element={<AndApplicantAdmin />} />
                <Route path="/and/:andId/board/:andBoardId" element={<AndBoardDetail />} />
                <Route path="/and/:andId/role/list" element={<AndRole />} />
                <Route path="/and/:andId/role/:andRoleId" element={<AndRoleDetail />} />
                <Route path="/and/:andId/manage" element={<AndManage />} />
                <Route path="/and/:andId/member/list" element={<AndMember />} />
                <Route path="/and/:andId/member/:memberId" element={<AndMemberDetail />} />
                <Route path="/and/:andId/chat" element={<AndChat />} />
                <Route path="/and/:andId/chat/room/:roomId/name-update" element={<ChatroomUpdate />} />

                {/* Etc */}
                <Route path='/chatbot' element={<Chatbot />} />

                {/* User 관련 */}
                <Route path="/user/:userId" element={<MyPage />} />
                <Route path="/user/:userId/detail/:type" element={<MyPageCardsDetailPage />} />
                
                {/* Crowd 관련 */}
                <Route path="/crowd/:crowdId/board/:crowdBoardId" element={<CrowdBoardDetail />} />
                <Route path="/crowd/:crowdId/manage" element={<CrowdManage />} />
                <Route path="/crowd/:crowdId/reward" element={<CrowdRewardCreate />} /> {/* 추가 */}
                <Route path="/crowd/:crowdId/reward/update" element={<CrowdRewardUpdate />} />
                <Route path="/order/:merchantUid" element={<CrowdOrderDetail />} />
                <Route path='/crowd/:crowdId/qna/' element={<CrowdQnaCreate />} /> {/* 추가 */}
                <Route path='/crowd/:crowdId/qna/:crowdQnaId/' element={<CrowdQnaDetail />} /> {/* 추가 */}
                <Route path='/crowd/:crowdId/board' element={<CrowdBoardInsert />} /> {/* 추가 */}
                <Route path='/crowd/:crowdId/qna/:crowdQnaId/qnareply' element={<CrowdReplyCreate/>} /> {/* 추가 */}
                <Route path="/crowd/create1" element={<CrowdCreate1 />} />
                <Route path="/crowd/:crowdId/create2" element={<CrowdCreate2 />} />
                <Route path="/crowd/:crowdId/img/create" element={<CrowdCreateImg />} /> {/* 추가 */}
                <Route path="/crowd/:crowdId/create/editor" element={<CrowdCreate />} />
                <Route path="/crowd/:crowdId/board/:crowdBoardId/update" element={<CrowdBoardUpdate />} />
                <Route path="/crowd/:crowdId/insert" element={<CrowdBoardInsert />} />
                <Route path="/crowd/:crowdId/payment" element={<CrowdPayment />} />
                <Route path="/crowd/:crowdId/reward/:rewardId/payment" element={<CrowdRewardPayment />}/>
                <Route path='/crowd/:crowdId/update' element={<CrowdUpdate />} /> {/* 추가 */}
                <Route path='/crowd/:crowdId/qna/:crowdQnaId/update' element={<CrowdQnaUpdate />} /> {/* 추가 */}
                <Route path='/crowd/:crowdId/qna/:crowdQnaId/qnareply/:qnaReplyId' element={<CrowdReplyUpdate />} /> {/* 추가 */}
              </Route>
              </Route>
            </Route>
            {/* 관리자 유저만 접근 가능 */}
            <Route element={<AdminRoute />}>
            <Route element={<MainLayout />}>
              <Route path="/iamtheadmin" element={<AdminMain />} />
            </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <div>
            <button id="chatbot" onClick={openChatbotModal}> <ContactSupportRoundedIcon sx={{ width: "30px", height: "30px", pr: "2px", pl: "2px" }}/></button>
              {isChatbotModalOpen && (
              <HelpChatbot onClose={closeChatbotModal}/>
              )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
    </IsLoginProvider>
  );
}

export default App;