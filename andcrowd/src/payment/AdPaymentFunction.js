import React from "react";

const AdPaymentFunction = () => {

    const onClickPayment = () =>{
        /* 1. 가맹점 식별하기 */
        const { IMP } = window;
        IMP.init("imp43865534");

        const data = {
            pg: "kakaopay.{INIBillTst}",
            pay_method: "card",
            merchant_uid: "3",
            name: "광고1",
            amount: 1000000,
            buyer_email: "chosy0716@gmail.com",
            buyer_name: "조승연",
            buyer_tel: "010-1234-5678",
            buyer_addr: "서울특별시 강남구 신사동",
            buyer_postcode: "123456"
        };

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

        IMP.request_pay(data, callback);
    };

    return (
        <div>
            <button onClick={onClickPayment}>결제하기</button>
        </div>
    )
};

export default AdPaymentFunction;