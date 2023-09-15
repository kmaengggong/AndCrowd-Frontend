import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jwtDecode from "jwt-decode";
import { GetUserId } from "../components/user/GetUserId";
import { GetUserInfo } from "../components/user/GetUserInfo";

// 현재시간을 얻어와서 HHMMSS 현태로 변환해주는 코드
const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return hours + minutes + seconds;
}
const CrowdPaymentFunction = () => {

    //테스트용 더미
    // const reward = {
    //     rewardTitle: "상품1",
    //     rewardAmount: 1000000
    // }
    //
    // let buyerEmail = "chosy0716@kakao.com";
    // let buyerName = "조승연";
    // let buyerAddr = "비트캠프 강남";
    // let buyerTel = "010-0000-0000";
    // let userId = 1;

    const { crowdId, rewardId } = useParams();

    const [reward, setReward] = useState(null);
    const [userInfo, setUserInfo] = useState(null);
    const [paymentData, setPaymentData] = useState(null);

    const [buyerEmail, setBuyerEmail] = useState("");
    const [buyerName, setBuyerName] = useState("");
    const [buyerTel, setBuyerTel] = useState("");
    const [buyerAddr, setBuyerAddr] = useState("");

    const [userId, setUserId] = useState("");

    // 회원정보를 불러오는 기능
    useEffect(() => {
        setUserId(GetUserId());
    }, []);

    useEffect(() => {
        if(userId !== null){
            GetUserInfo(userId, setUserInfo);
        }
    }, [userId]);

    // 결제할 상품정보를 불러오는 기능
    useEffect(() => {
        axios.get(`http://localhost:8080/crowd/${crowdId}/reward/${rewardId}`)
            .then(reward => {
                setReward(reward.data)
            })
            .catch(error => {
                console.error("없는 리워드입니다.", error);
            });
    }, [crowdId, rewardId]);


    // 결제 기능
    const onClickPayment = () =>{
        // user reward null 검사
        if (!userInfo || !reward) {
            alert("유저나 상품 정보가 없습니다.");
            return;
        }

        //가맹점 식별하기
        const { IMP } = window;
        IMP.init("imp43865534"); // 상점 아이디 입력

        // 결제정보 입력
        const data = {
            pg: "kakaopay.{TC0ONETIME}", // 결제사 명시
            pay_method: "card", // 결제수단
            merchant_uid: getCurrentTime() + userId, // 결제번호  (시간 + userId)
            name: reward.rewardTitle, // 상품명
            amount: reward.rewardAmount, // 금액
            buyer_email: buyerEmail, // 구매자 이메일
            buyer_name: buyerName, // 구매자 이름
            buyer_tel: buyerTel, // 구매자 연락처
            buyer_addr: buyerAddr // 구매자 주소
        };

        // 백서버로 결제내역을 전송하기 위한 data객체 저장
        setPaymentData(data);
        
        IMP.request_pay(data, callback.bind(null, data));
    }

    const callback = async (paymentData,response) => {
        const {
            success,
            error_msg
        } = response;
        let orderDetails;
        if(paymentData) {
            // CrowdOrderDetails에 전송할 데이터를 객체화함
            orderDetails = {
                crowdId: crowdId,
                isDeleted: false,
                purchaseAddress: paymentData.buyer_addr,
                purchaseName: paymentData.buyer_name,
                purchasePhone: paymentData.buyer_tel,
                purchaseStatus: "결제완료",
                rewardId: rewardId,
                userId: userId
            };
        }else {
            alert("서버로 전송할 결제내역이 없습니다.")
            return;
        }
        if(success){
            alert("결제성공");
            // 결제 성공 후 백엔드 서버에 결제 정보를 전송(userId, crowdId, rewardId, userName, userPhone, address)
            try {
                const serverResponse = await axios.post(`http://localhost:8080/crowd_order/successorder`, orderDetails);
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
            <h1>결제</h1>
            {userInfo && reward && (
                <div>
                    <h3>상품 정보</h3>
                    <p>상품명: {reward.rewardTitle}</p>
                    <p>금액: {reward.rewardAmount}</p>

                    <h3>구매자 정보</h3>
                    <div>
                        <label>이메일: </label>
                        <input
                            type="email"
                            value={buyerEmail}
                            onChange={(e) => setBuyerEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>이름: </label>
                        <input
                            type="text"
                            value={buyerName}
                            onChange={(e) => setBuyerName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>연락처: </label>
                        <input
                            type="tel"
                            value={buyerTel}
                            onChange={(e) => setBuyerTel(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>주소: </label>
                        <input
                            type="text"
                            value={buyerAddr}
                            onChange={(e) => setBuyerAddr(e.target.value)}
                        />
                    </div>
                </div>
            )}

            <button onClick={onClickPayment}>결제하기</button>
        </div>
    )
};

export default CrowdPaymentFunction;