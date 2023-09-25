import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import '../../styles/etc/Chatbot.css'
import TextField from '@mui/material/TextField';
import SendIcon from '@mui/icons-material/Send';
import IconButton from '@mui/material/IconButton';
import { Button, List, ListItem, Modal, ModalDialog, ModalClose } from '@mui/joy';
import { GetUserId } from '../../components/user/GetUserId';

const HelpChatbot = ( {onClose} ) => {
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState('');
  const [messageList, setMessageList] = useState([]);
  const [stompClient, setStompClient] = useState(null);
  const [layout, setLayout] = useState(undefined);
  const [sendOk, setSendOk] = useState(false);

  const userId = GetUserId(); // 현재 로그인 중인 사용자 id

  const connect = () => {
    if (stompClient) {
        stompClient.disconnect();
        setStompClient(null); // stompClient를 null로 초기화
    }
  
    const socket = new SockJS('/ws');
    const client = Stomp.over(socket);
    client.connect({}, (frame) => {
    setConnected(true);
    setStompClient(client);
    console.log('Connected: ', frame);
    client.subscribe(`/chatbot/${userId}`, (message) => {
        handleReceivedMessage("받은 메세지: " + message.body);
    });
    sendHelloMessage(client);
    });
  };

  const sendHelloMessage = (client) => {
    console.log("안녕메세지 전송")
    if (client) {
      const hello = "안녕"
      client.send(`/app/sendMessage/${userId}`, {}, JSON.stringify(hello));
    }
  };
  const disconnect = () => {
    if (stompClient) {
      stompClient.disconnect();
    }
    setConnected(false);
    setMessageList([]);
  };

  const sendMessage = () => {
    // 빈 문자열 검사
    if (message.trim() === '') {
      return;
    }

    if (connected && sendOk) {
    const sentMessage = "보낸 메세지: " + message;
    handleSentMessage(sentMessage);
    stompClient.send(`/app/sendMessage/${userId}`, {}, JSON.stringify(message));
    setMessage('');
    }
  };

  const handleSentMessage = (sentMessage) => {
    setMessageList((prevMessages) => [...prevMessages, sentMessage]);
  };

  const handleReceivedMessage = (receivedMessage) => {
    setMessageList((prevMessages) => [...prevMessages, receivedMessage]);
    setSendOk(true);
  };

  const messageListRef = useRef(null);

  useEffect(() => {
    // 새로운 메시지가 추가될 때 스크롤을 아래로 내립니다.
    if (messageListRef.current) {
      messageListRef.current.scrollTop = messageListRef.current.scrollHeight;
    }
  }, [messageList]);

  useEffect(() => {
    setLayout('center');
    connect();
  }, []);

  return (
    <>
      {/* <Button
        variant="outlined"
        color="neutral"
        id="connect"
        className="btn btn-default"
        onClick={() => {
          setLayout('center');
          connect();
        }}
      >
        챗봇 연결
      </Button> */}
      <Modal
        open={!!layout}
        onClose={() => {
          setLayout(undefined);
          disconnect(); // 모달이 닫힐 때 연결 종료
          onClose();
        }}
      >
        <ModalDialog layout={layout}
                sx={{
                    minHeight: "70vh",
                    maxHeight: "70vh",
                    minWidth: "50vh",
                    maxWidth: "50vh",
                  }}
          >
          <ModalClose />
          <h2>챗봇</h2>
          <List ref={messageListRef}
            sx={{
              overflowY: 'scroll',
              mx: 'calc(-1 * var(--ModalDialog-padding))',
              px: 'var(--ModalDialog-padding)',
            }}
          >
            {messageList.map((message, index) => {
              // "보낸 메세지:" 또는 "받은 메세지:" 부분을 제거한 메시지 표시
              const messageContent = message.replace(/(보낸 메세지:|받은 메세지:)/, '');
              const isSentMessage = message.startsWith("보낸 메세지:");

              return (
                <ListItem
                  key={index}
                  sx={{
                    mx: 'calc(-1 * var(--ModalDialog-padding))',
                    px: 'var(--ModalDialog-padding)',
                    display:'flex',
                    justifyContent: isSentMessage ? 'flex-end' : '',
                    borderRadius: isSentMessage ? '0 4 4 4' : '4 0 0 0',
                  }}
                >
                    <div className={isSentMessage ? "sent-message" : "received-message"}>
                        {messageContent}
                    </div>
                </ListItem>
              );
            })}
          </List>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField sx={{ flex: 1 }} color='success' variant="standard" placeholder="문의 내용을 입력해주세요" value={message} onChange={(e) => setMessage(e.target.value)} />
            <IconButton sx={{ marginLeft: '8px' }} color='success' onClick={sendMessage} disabled={!connected && !sendOk}><SendIcon /></IconButton>
          </div>
        </ModalDialog>
      </Modal>
    </>
  );
}

export default HelpChatbot;
