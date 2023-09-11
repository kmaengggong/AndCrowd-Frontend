// import React from "react";
// import axios from "axios";
//
// const CancelPayment = ({ paymentType, paymentId, merchant_uid }) => {
//     const handleCancel = () => {
//         axios({
//             url: `http://localhost:8080/payment/cancel/${paymentType}/${paymentId}`,
//             method: "POST",
//             headers: {
//                 "Content-Type": "application/json",
//             },
//             data: {
//                 merchant_uid: merchant_uid,
//                 cancel_request_amount: "",
//                 reason: "결제취소"
//             }
//         })
//             .then(response => {
//                 console.log("환불 성공:", response.data);
//             })
//             .catch(error => {
//                 console.error("환불 실패:", error);
//             });
//     };
//
//     return (
//         <button onClick={handleCancel}>환불하기</button>
//     );
// };
//
// export default CancelPayment;
