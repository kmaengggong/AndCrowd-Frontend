import React from "react";

const Payment = () => {
    // 주문서 작성시 crowdDetail 화면에서 선택된 리워드 품목정보와
    // 현재 로그인한 User정보를 가져오는 기능 구현 필요

    const onClickPayment = () =>{
        /* 1. 가맹점 식별하기 */
        const { IMP } = window;
        IMP.init("imp43865534");

        const data = {
            pg: "kakaopay.{TC0ONETIME}",
            pay_method: "card",
            merchant_uid: "ORD20180131-0000012",
            name: "노르웨이 회전 의자",
            amount: 1000,
            buyer_email: "chosy0716@gmail.com",
            buyer_name: "홍길동",
            buyer_tel: "010-4242-4242",
            buyer_addr: "서울특별시 강남구 신사동",
            buyer_postcode: "01181"
        };

        IMP.request_pay(data, callback);
    }
    const callback = (response) => {
        const {
            success,
            error_msg
        } = response;

        if(success){
            alert("결제성공");
        }else {
            alert(`결제실패: ${error_msg}`);
        }
    };

    return (
        <div>
            <button onClick={onClickPayment}>결제하기</button>
        </div>
    )
};

export default Payment;