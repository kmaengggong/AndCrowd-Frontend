import { Box, Button, TextField } from "@mui/material";
<<<<<<< HEAD
import { useEffect, useState } from "react";
import { GetUserId } from "../user/GetUserId";
import { GetUserInfo } from "../user/GetUserInfo";
=======
import { useEffect, useRef, useState } from "react";
>>>>>>> 34363abd6e3245f294f9f020e147fa609e8bc4e4
import { useParams } from "react-router-dom";
import { GetUserId } from "../user/GetUserId";
import { GetUserInfo } from "../user/GetUserInfo";

const CrowdRewardPayment = () => {
    const pg = {
        card: 'html5_inicis',
        kakao: 'kakaopay.TC0ONETIME'
    }
    const pay_method = {
        card: 'card',
        kakao: 'kakaopay'
    }

    const params = useParams();
    const crowdId = params.crowdId;
    const rewardId = params.rewardId;
    const [reward, setReward] = useState([]);
    const [userId, setUserId] = useState(null);
    const [userInfo, setUserInfo] = useState([]);
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [paymentData, setPaymentData] = useState(null);
    const merchantUid = useRef(null);

    useEffect(() => {
        const fetchRewards = () => {
            try{
                fetch(`/crowd/${crowdId}/reward/${rewardId}`)
                .then(res => {
                    return res.json();
                }).then(data => {
                    setReward(data);
                })
            } catch(error){
                console.error(error);
            }
        };

        fetchRewards();
        setUserId(GetUserId());
    }, []);

    useEffect(() => {
        if(userId !== null){
            GetUserInfo(userId, setUserInfo);
        }
    }, [userId]);

    useEffect(() => {
        if(phone.length === 10){
            setPhone(phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3'));
        }
        if(phone.length === 13){
            setPhone(phone.replace(/-/g, '').replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3'));
        }
    }, [phone]);

    const onChangePhone = (event) => {
        event.preventDefault();
        const regex = /^[0-9\b -]{0,13}$/;
        if(regex.test(event.target.value)){
            setPhone(event.target.value);
        }
    }

    const onChangeAddress = (event) => {
        event.preventDefault();
        setAddress(event.currentTarget.value);
    };

    const onClickPaymentButton = (type, event) => {
        event.preventDefault();
        const {IMP} = window;
        IMP.init("imp61051146");  // 가맹점번호

        const merchant_uid = `crowd_${new Date().getTime()}_userId`;
        merchantUid.current = merchant_uid;

        const data = {
            pg: pg[type], // 결제사
            pay_method: pay_method[type],  // 결제수단
            merchant_uid: merchant_uid,  // 결제번호 (crowd_ + 현재시간 + userId)
            name: reward.rewardTitle,  // 상품명
            amount: reward.rewardAmount,  // 금액
            buyer_email: userInfo.userEmail,  // 구매자 이메일
            buyer_name: userInfo.userKorName,  // 구매자 이름
            buyer_tel: userInfo.userPhone ? userInfo.userPhone : phone,  // 구매자 연락처
            buyer_addr: address  // 구매자 주소
        };

        setPaymentData(data);

        IMP.request_pay(data, callback.bind(null, data));
    };

    const callback = async (paymentData, res) => {
        const {success, error_msg, paid_amount} = res;

        if(!paymentData){
            alert("서버로 전송할 결제내역이 없습니다. 다시 시도해주세요.");
            return;
        }
        if(success){
            alert("결제 성공!");
<<<<<<< HEAD
            console.log(orderDetails);
            try{

            } catch(error){
                alert("서버에 ")
            }
        }
        else{
            alert("결제를 실패하였습니다. 다시 시도 해주세요.");
=======
            try{
                await fetch(`/crowd_order/successorder`, {
                    method: "POST",
                    headers:{
                        'Content-Type':"application/json; text=utf-8"
                    },
                    body:JSON.stringify({
                        crowdId: crowdId,
                        isDeleted: false,
                        purchaseAddress: paymentData.buyer_addr,
                        purchaseName: paymentData.buyer_name,
                        purchasePhone: paymentData.buyer_tel,
                        purchaseStatus: "결제완료",
                        merchantUid: merchantUid.current,
                        rewardId: rewardId,
                        userId: userId,
                        purchaseAmount: paid_amount
                    }),
                }).then(res => {
                    console.log(res);
                })
            } catch(error){
                console.error(error);
            }
        }
        else{
            alert("결제 실패!");
>>>>>>> 34363abd6e3245f294f9f020e147fa609e8bc4e4
            console.log(error_msg);
        }
    }

    return(
        <>
        {userInfo.length !== 0 ?
        <Box
            sx={{mt:7}}
        >
            <TextField
                disabled
                required
                fullWidth
                label="이메일"
                defaultValue={userInfo.userEmail}
                sx={{mb:2}}
            />
            <TextField
                disabled
                required
                fullWidth
                label="이름"
                defaultValue={userInfo.userKorName}
                sx={{mb:2}}
            />
            {userInfo.userPhone ?
            <TextField
            disabled
            required
            fullWidth
            label="전화번호"
            defaultValue={userInfo.userPhone}
            sx={{mb:2}}
            />
            :
            <TextField
                required
                fullWidth
                label="전화번호"
                onChange={onChangePhone}
                value={phone}
                sx={{mb:2}}
            />
            }
            <TextField
                required
                fullWidth
                label="주소"
                value={address}
                onChange={onChangeAddress}
                sx={{mb:2}}
            />
            <Button
                fullWidth
                variant="contained"
                onClick={(e) => {onClickPaymentButton("kakao", e)}}
            >
                카카오페이 결제
            </Button>
            <Button
                fullWidth
                variant="contained"
                onClick={(e) => onClickPaymentButton("card", e)}
            >
                카드 결제
            </Button>
        </Box>
        :
        <>로딩</>
        }
        </>
    );
};

export default CrowdRewardPayment;