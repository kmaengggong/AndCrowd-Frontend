import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import CrowdToolBar from "../../components/crowd/CrowdToolBar";
import { Typography } from "@mui/material";

const CrowdQnaList = () => {
    const params = useParams();
    const crowdId = params.crowdId;
    const [crowdQnaList, setCrowdQnaList] = useState([]);
    const [selectedQnaId, setSelectedQnaId] = useState(null);
    const [crowdReplyList, setCrowdReplyList] = useState({});

    const handleQnaClick = (crowdQnaId, crowdQna) => {
        if(selectedQnaId === crowdQnaId) {
            fetchReplyData(crowdId, crowdQnaId)
            setSelectedQnaId(null);
        } else {
            fetchReplyData(crowdId, crowdQnaId)
            setSelectedQnaId(crowdQnaId);
        }
    };
    useEffect(() => {
        fetchData();
    }, [crowdId]);

    const fetchData = async () => {
        try {
            const response = await fetch(`/crowd/${crowdId}/qna/all`);
            if(response.ok) {
                const data = await response.json();
                setCrowdQnaList(data);
            } else {
                throw new Error(`Fetching and data failed with status ${response.status}.`);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const fetchReplyData = async (crowdId, crowdQnaId) => {
        console.log("crowdQnaId: ", crowdQnaId);
        try {
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

    const formatDate = (dateTimeString) => {
        if (!dateTimeString) return ""; 
      
        const formattedString = dateTimeString.replace("T", " ");
      
        return formattedString;
    };
    
    return(
        <div>
            <CrowdToolBar crowdId={crowdId} />
            <h3>QnA를 자유롭게 올려보세요</h3>
            <div>
                {crowdQnaList.map((crowdQna) => (
                    <div key={crowdQna.crowdQnaId}>
                        <Typography display={"inline"}>
                            <div
                            onClick={() => handleQnaClick(crowdQna.crowdQnaId)}
                            style={{
                                cursor: 'pointer'
                            }}
                            >
                                {crowdQna.qnaTitle}
                            </div>
                        </Typography>
                        <Typography>{formatDate(crowdQna.updatedAt)}</Typography>
                        <hr />
                        {selectedQnaId === crowdQna.crowdQnaId && (
                            <div 
                            style={{
                                cursor: 'pointer'
                            }}>
                            <h2>{crowdQna.qnaContent}</h2>
                            </div>
                        )}
                        {selectedQnaId === crowdQna.crowdQnaId && (
                            <div>
                                <hr />
                                {crowdReplyList.length > 0 ? (
                                    crowdReplyList.map(comment => (
                                        <div key={comment.qnaReplyId}>
                                            <p>{comment.qnaReplyContent}</p>
                                            <p>{formatDate(comment.updatedAt)}</p>
                                        </div>
                                    ))
                                ) : (
                                    <p>답변이 없습니다.</p>
                                )}
                                <hr/>
                            </div>
                        )}
                    </div>
                ))}
            </div>
            <Link to={`/crowd/${crowdId}/qna/`}>글 작성</Link>
        </div>
    );
};

export default CrowdQnaList;