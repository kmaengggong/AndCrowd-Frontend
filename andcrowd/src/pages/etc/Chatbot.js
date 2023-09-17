import React, { useState, useEffect } from 'react';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import '../../styles/etc/Chatbot.css'

function Chatbot() {
    const [connected, setConnected] = useState(false);
    const [message, setMessage] = useState('');
    const [messageList, setMessageList] = useState([]);
    const [stompClient, setStompClient] = useState(null);

    const connect = () => {
      if (!stompClient) {
        const socket = new SockJS('/ws');
        const client = Stomp.over(socket);
        client.connect({}, (frame) => {
          setConnected(true);
          setStompClient(client);
          console.log('Connected: ', frame);
          client.subscribe('/chatbot/public', (message) => {
            handleReceivedMessage("받은 메세지: " + message.body);
          });
        });
      }
    };

    useEffect(() => {
      connect();
    }, [stompClient]);

    const disconnect = () => {
      if (stompClient) {
        stompClient.disconnect();
      }
      setConnected(false);
      console.log("Disconnected");
    };

    const sendMessage = () => {
      const sentMessage = "보낸 메세지: " + message;
      handleSentMessage(sentMessage);
      stompClient.send("/app/sendMessage", {}, JSON.stringify(message));
      setMessage('');
    };

    const handleSentMessage = (sentMessage) => {
      setMessageList((prevMessages) => [...prevMessages, sentMessage]);
    };

    const handleReceivedMessage = (receivedMessage) => {
      setMessageList((prevMessages) => [...prevMessages, receivedMessage]);
    };

    return (
      <div id="main-content" className="container">
        <div className="row">
          <div className="col-md-6">
            <form className="form-inline" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="connect">웹소켓 연결:</label>
                <button id="connect" className="btn btn-default" onClick={connect}>연결</button>
                <button id="disconnect" className="btn btn-default" onClick={disconnect} disabled={!connected}>해제</button>
              </div>
            </form>
          </div>
          <div className="col-md-6">
            <form className="form-inline" onSubmit={(e) => e.preventDefault()}>
              <div className="form-group">
                <label htmlFor="msg">문의사항</label>
                <input type="text" id="msg" className="form-control" placeholder="내용을 입력하세요...." value={message} onChange={(e) => setMessage(e.target.value)} />
              </div>
              <button id="send" className="btn btn-default" onClick={sendMessage} disabled={!connected}>보내기</button>
            </form>
          </div>
        </div>
        <div className="row">
          <div className="col-md-12">
            <table id="conversation" className="table table-striped">
              <thead>
                <tr>
                  <th>메세지</th>
                </tr>
              </thead>
              <tbody id="communicate">
              {messageList.map((message, index) => {
              // "보낸 메세지:" 또는 "받은 메세지:" 부분을 제거한 메시지 표시
              const messageContent = message.replace(/(보낸 메세지:|받은 메세지:)/, '');

                return (
                    <tr key={index}>
                    <td className={message.startsWith("보낸 메세지:") ? "sent-message" : "received-message"}>
                        {messageContent}
                    </td>
                    </tr>
                );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
}

export default Chatbot;
