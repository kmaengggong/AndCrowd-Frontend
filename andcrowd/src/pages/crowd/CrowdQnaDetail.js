import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CrowdToolBar from "../../components/crowd/CrowdToolBar";

const CrowdQnaDetail = () => {
    const params = useParams();
    const crowdId = params.crowdId;
    const crowdQnaId = params.crowdQnaId;

    const navigate = useNavigate();

    const [crowdQna, setCrowdQna] = useState({});
    const [qnaReplies, setQnaReplies] = useState({});

    useEffect(() => {
        fetchData();
    }, [crowdId, crowdQnaId]);

    const fetchData = async () => {
        try {
            const qnaResponse = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}/`);
            if(qnaResponse.ok) {
                const qnaData = await qnaResponse.json();
                setCrowdQna(qnaData);
            }else {
                throw new Error(`Fetching and data failed with status ${qnaResponse.status}.`);
            }
            const qnaReplyResponse = await fetch(`/crowd/${crowdId}/qna/${crowdQnaId}/qnareply/all`);
            if(qnaReplyResponse.ok) {
                const qnaReplyData = await qnaReplyResponse.json();
                setCrowdReplyList(qnaReplyData);
            } else {
                throw new Error(`Fetching and data failed with status ${qnaReplyResponse.status}.`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const deleteCrowdQna = async (crowdId, crowdQnaId) => {
        try{
            await axios.delete(`/crowd/${crowdId}/qna/${crowdQnaId}/delete`);
            console.log("Deleted and with ID:",crowdQnaId);
            fetchData();
        } catch (error) {
            console.error("삭제 도중 에러발생:",error);
        }
    };

    const updateCrowdQna = (crowdId, crowdQnaId) => {
        navigate(`/crowd/${crowdId}/qna/${crowdQnaId}`);
    };

    const deleteReply = async (crowdId, crowdQnaId, qnaReplyId) => {
        try {
            await axios.delete(`/crowd/${crowdId}/qna/${crowdQnaId}/qnareply/${qnaReplyId}/delete`);
            console.log("Deleted and with ID:", crowdQnaId);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    }

    const updateReply = (crowdId, qnaReplyId) => {
        navigate();
    };

    const createReply = (crowdId, crowdQnaId) => {
        navigate(`/crowd/${crowdId}/qna`);
    };

    if(crowdQna.deleted === true) {
        alert("이 글은 삭제되었습니다.");
        window.location.href = `/crowd/${crowdId}/qna/all`;
    }

    return(
        <div>
            <CrowdToolBar crowdId={crowdId} />
            <div>
                <div>
                    <h4>제목: {crowdQna.qnaTitle}</h4>
                    <p>본문: {crowdQna.qnaContent}</p>
                    <br />
                    <button onClick={() => updateCrowdQna(crowdId, crowdQnaId)}>edit</button>
                    <button onClick={() => deleteCrowdQna(crowdId, crowdQnaId)}>delete</button>
                    <br />
                    <br />
                    <button onClick={() => createReply(crowdId, crowdQnaId)}>댓글</button>
                </div>
            </div>
            <hr />
            <hr />
            <div>
                {qnaReplies.length > 0 ? (
                    qnaReplies.map(comment => (
                        <div key={comment.qnaReplyId}>
                            <p>{comment.qnaReplyId}</p>
                            <p>{comment.qnaContent}</p>
                            <p>{comment.userId}</p>
                            <p>수정된 시간:{comment.updatedAt}</p>
                            <button onClick={() => updateReply(crowdId, comment.qnaReplyId)}>update</button>
                            <button onClick={() => deleteReply(crowdId, crowdQnaId, comment.qnaReplyId)}>delete</button>
                            <hr />
                        </div>
                    ))
                ) : (
                    <p>댓글이 없습니다.</p>
                )}
            </div>
        </div>
    );
};

export default CrowdQnaDetail;