import React, {useState, useEffect} from "react";
import axios from "axios";
import jwtDecode from "jwt-decode";
import {useParams} from "react-router-dom";

// 현재시간을 얻어와서 HHMMSS 현태로 변환해주는 코드
const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');

    return hours + minutes + seconds;
}


const AdPaymentFunction = () => {

    // // 테스트용 더미
    // const ad = {
    //     adName: "더미광고1",
    //     adPrice: 1000000
    // }
    //
    // let buyerEmail = "chosy0716@kakao.com";
    // let buyerName = "조승연";
    // let buyerTel = "010-0000-0000";
    // let userId = 1;

    let { projectType, projectId } = useParams();

        if (projectType === 'crowd') {
            projectType = 1;
        } else if (projectType === 'and') {
            projectType = 0;
        }


    const [ad, setAd] = useState(null);
    const [user, setUser] = useState(null);
    const [paymentData, setPaymentData] = useState(null);

    const [buyerEmail, setBuyerEmail] = useState("");
    const [buyerName, setBuyerName] = useState("");
    const [buyerTel, setBuyerTel] = useState("");
    const [buyerAddr, setBuyerAddr] = useState("");
    const [adId, setAdId] = useState("");
    const [adList, setAdList] = useState("");

    const [userId, setUserId] = useState("");

    // 회원정보를 불러오는 기능
    // JWT토큰 디코딩 하여 userId 추출
    const getUserIdFromToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.userId;
        } catch (error) {
            console.error("토큰 디코딩에 실패했습니다.", error);
            return null;
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            console.error("토큰이 유효하지 않습니다.");
            return;
        }
        const decodedUserId = getUserIdFromToken(token); // userId를 디코딩
        if (!decodedUserId) {
            console.error("userId를 찾을수 없습니다.");
            return;
        }

        setUserId(decodedUserId); // userId 상태를 갱신

        axios.get(`http://localhost:8080/user/${decodedUserId}`)
            .then(userData => {
                setUser(userData.data);
                setBuyerEmail(userData.data.userEmail);
                setBuyerName(userData.data.userKorName);
                setBuyerTel(userData.data.userPhone);
            })
            .catch(error => {
                console.error("찾는 유저가 없습니다.", error)
            });
    }, []);

    // 전체 광고 리스트를 불러오는 기능
    useEffect(() => {
        axios.get(`http://localhost:8080/ad/all`)
            .then(response => {
                setAdList(response.data);
            })
            .catch(error => {
                console.error("광고 목록을 가져오는데 실패했습니다.", error);
            });
    }, []);

    // 광고 선택에 따른 Id값 업데이트
    const handleAdSelect = (e) => {
        setAdId(e.target.value);
    };

    // 결제할 광고를 불러오는 기능
    useEffect(() => {
        axios.get(`http://localhost:8080/ad/${adId}`)
            .then(ad => {
                setAd(ad.data)
            })
            .catch(error => {
                console.error("없는 광고옵션 입니다.", error);
            });
    }, [adId]);

    const onClickPayment = () =>{
        // user ad null 검사
        if (!user || !ad) {
            alert("유저나 상품 정보가 없습니다.");
            return;
        }

        // 가맹점 식별하기
        const { IMP } = window;
        IMP.init("imp43865534");

        // 결제정보 입력
        const data = {
            pg: "kakaopay.{TC0ONETIME}", // 결제사 명시
            pay_method: "card", // 결제수단
            merchant_uid: getCurrentTime() + userId, // 결제번호
            name: ad.adName, // 상품명
            amount: ad.adPrice, // 금액
            buyer_email: buyerEmail, // 구매자 이메일
            buyer_name: buyerName, // 구매자 이름
            buyer_tel: buyerTel, // 구매자 연락처
        };

        // 백서버로 결제내역을 전송하기 위한 data객체 저장
        setPaymentData(data);

        IMP.request_pay(data, callback.bind(null, data));
    };

    const callback = async (paymentData, response) => {
        const {
            success,
            error_msg
        } = response;
        let adDetails;
        if(paymentData) {
            // adPayment에 전송할 데이터를 객체화함
            adDetails = {
                adId: adId,
                adPaymentStatus: 1,
                projectId: projectId,
                projectType: projectType,
                userId: userId
            };
        }else {
            alert("서버로 전송할 결제내역이 없습니다.")
            return;
        }
        if(success){
            alert("결제성공");
            // 결제 성공 후 백엔드 서버에 결제 정보를 전송
            try {
                const serverResponse = await axios.post(`http://localhost:8080/ad/payment/insert`, adDetails);
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
            <select onChange={handleAdSelect}>
                {adList.map(adItem => (
                    <option key={adItem.id} value={adItem.id}>{adItem.adName}</option>
                ))}
            </select>
            <button onClick={onClickPayment}>결제하기</button>
        </div>
    )
};

export default AdPaymentFunction;