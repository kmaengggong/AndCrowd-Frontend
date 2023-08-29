import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";

const CrowdPayment = () => {

    const { crowdId, rewardId } = useParams();
    const [reward, setReward] = useState(null);
    const [user, setUser] = useState(null);
    const [buyeraddr, setBuyeraddr] = useState("");
    const [userId, setUserId] = useState(null);

    // 회원정보를 불러오는 기능
    // JWT토큰 디코딩 하여 userId 추출
    const getUserIdFromToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.userId;
        } catch (error) {
            console.error("Failed to decode token", error);
            return null;
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("토큰이 유효하지 않습니다.");
            return;
        }
        const decodedUserId = getUserIdFromToken(token); // userId를 디코딩합니다.
        if (!decodedUserId) {
            console.error("userId를 찾을수 없습니다.");
            return;
        }

        setUserId(decodedUserId); // userId 상태를 갱신합니다.

        axios.get(`http://localhost:8080/user/${decodedUserId}`)
            .then(userData => {
                setUser(userData.data);
            })
            .catch(error => {
                console.error("찾는 유저가 없습니다.", error)
            });
    }, []);

    useEffect(() => {
        if (!userId) return; // userId가 null이면 요청하지 않습니다.

        axios.get(`http://localhost:8080/user/${userId}`)
            .then(userData => {
                setUser(userData.data);
            })
            .catch(error => {
                console.error("찾는 유저가 없습니다.", error)
            });
    }, [userId]);

    // 전달받은
    useEffect(() => {
        axios.get(`http://localhost:8080/user/${userId}`)
            .then(userData => {
                setUser(userData.data);
            })
            .catch(error => {
                console.error("찾는 유저가 없습니다.", error)
            });
    }, [userId]);

    // 결제할 상품정보를 불러오는 기능
    useEffect(() => {
        axios.get(`http://localhost:8080/crowd/${crowdId}/reward/${rewardId}`)
            .then(reward => {
                setReward(reward.data)
            })
            .catch(error => {
                console.error("없는 펀딩글입니다.", error);
            });
    }, [crowdId, rewardId]);

    // 상품결제하는 페이지(crowd) 정보를 불러오는 기능


    // 결제 기능
    const onClickPayment = () =>{
        // user crowd null 검사
        if (!user || !reward) {
            alert("유저나 상품 정보가 없습니다.");
            return;
        }

        //1. 가맹점 식별하기
        const { IMP } = window;
        IMP.init("imp43865534");

        const data = {
            pg: "kakaopay.{TC0ONETIME}", // 결제 API 명시
            pay_method: "card", // 결제수단
            merchant_uid: "1", // 결제번호
            name: reward.rewardTitle, // 상품명
            amount: reward.rewardAmount, // 금액
            buyer_email: user.userEmail, // 구매자 이메일
            buyer_name: user.userKorName, // 구매자 이름
            buyer_tel: user.userPhone, // 구매자 연락처
            buyer_addr: buyeraddr // 구매자 주소
        };

        IMP.request_pay(data, callback);
    }
    const callback = async (response) => {
        const {
            success,
            error_msg
        } = response;

        if(success){
            alert("결제성공");
            // 결제 성공 후 백엔드 서버에 결제 정보를 객체에 담아서 전송(userId, crowdId, rewardId, userName, userPhone, address)
            try {
                const serverResponse = await axios.post(`http://localhost:8080/successorder`, response);
                if(serverResponse.status === 200) {
                    alert("서버에 결제 정보 전송 완료!");
                } else {
                    alert("서버에 결제 정보 전송 실패");
                }
            } catch(error) {
                alert("서버에 결제 정보 전송 중 오류 발생");
            }
        }else {
            alert(`결제실패: ${error_msg}`);
        }
    };

    return (
        <div>
            {user && reward && (
                <div>
                    <h3>상품 정보</h3>
                    <p>상품명: {reward.rewardTitle}</p>
                    <p>금액: {reward.rewardAmount}</p>

                    <h3>구매자 정보</h3>
                    <div>
                        <label>이메일: </label>
                        <input
                            type="email"
                            value={user.userEmail}
                            onChange={(e) => setUser({...user, userEmail: e.target.value})}
                        />
                    </div>
                    <div>
                        <label>이름: </label>
                        <input
                            type="text"
                            value={user.userKorName}
                            onChange={(e) => setUser({...user, userKorName: e.target.value})}
                        />
                    </div>
                    <div>
                        <label>연락처: </label>
                        <input
                            type="tel"
                            value={user.userPhone}
                            onChange={(e) => setUser({...user, userPhone: e.target.value})}
                        />
                    </div>
                    <div>
                        <label>주소: </label>
                        <input
                            type="text"
                            value={buyeraddr}
                            onChange={(e) => setBuyeraddr(e.target.value)}
                        />
                    </div>
                </div>
            )}

            <button onClick={onClickPayment}>결제하기</button>
        </div>
    )
};

export default CrowdPayment;