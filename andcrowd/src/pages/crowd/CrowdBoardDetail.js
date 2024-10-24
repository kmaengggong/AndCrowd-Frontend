import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import CrowdToolBar from "../../components/crowd/CrowdToolBar";
import { GetUserId } from "../../components/user/GetUserId";
import { Button, Typography } from "@mui/material";
import "../../styles/crowd/CrowdBoardDetail.css";

const CrowdBoardDetail = () => {
    const params = useParams();
    const crowdId = params.crowdId;
    const crowdBoardId = params.crowdBoardId;

    const navigate = useNavigate();

    const [crowdBoard, setCrowdBoard] = useState({});
    const [boardUserId, setBoardUserId] = useState(null);
    const userId = GetUserId();

    useEffect(() => {
        fetchData();
    }, [crowdId, crowdBoardId]);

    const fetchData = async () => {
        try{
            const response = await fetch(`/crowd/${crowdId}/board/${crowdBoardId}`);
            if(response.ok) {
                const data = await response.json();
                console.log("응답데이터:", data);
                setCrowdBoard(data);
                setBoardUserId(data.userId);
            } else {
                console.error("빈 응답 데이터");
                throw new Error(`Fetching crowd data failed with status ${response.status}.`);
            }
        } catch (error){
            console.error("Error fetching Crowd data:", error);
            navigate("/NotFound");
        }
    }

    const deleteCrowdBoard = async (crowdId, crowdBoardId) => {
        try{
            await axios.delete(`/crowd/${crowdId}/board/${crowdBoardId}/delete`);
            console.log("Deleted crowdBoard with ID:", crowdBoardId);
            navigate(`/crowd/${crowdId}/board/all`);
        } catch (error) {
            console.error("Error in deleting crowdBoard:", error);
        }
    }

    const updateCrowdBoard = (crowdId, crowdBoardId) => {
        navigate(`/crowd/${crowdId}/board/${crowdBoardId}/update`);
    };

    const handleBoardList = (crowdId) => {
        navigate(`/crowd/${crowdId}/board/all`)
    }

    const formatDate = (dateTimeString) => {
        if (!dateTimeString) return ""; 
      
        const formattedString = dateTimeString.replace("T", " ");
      
        return formattedString;
    };

    return (
        <div>
            <CrowdToolBar crowdId={crowdId} />
            <div>
            <div id='board-detail-box'>
            <Typography id='crowd-board-tag-dt' >
                {crowdBoard.crowdBoardTag === 0 ? '새소식' : '공지사항'}
            </Typography>
            <Typography id='crowd-board-title-dt' >{crowdBoard.crowdBoardTitle}</Typography>
            <Typography id='crowd-board-updatedAt-dt' >
                {formatDate(crowdBoard.updatedAt)}
            </Typography>
            {/* 해당 글 작성자만 수정/삭제 가능 */}
            {userId === boardUserId && (
            <>
                <Typography id='board-detail-upde'
                onClick={() => updateCrowdBoard(crowdId, crowdBoardId)}
                >
                수정
                </Typography>
                <Typography id='board-detail-upde'
                onClick={() => deleteCrowdBoard(crowdId, crowdBoardId)}
                >
                삭제
                </Typography>
            </>
            )}
            </div>
            <hr id='crowd-board-line-dt'></hr>
            <div id='board-content-box'>
            <div id='crowd-board-content-dt' dangerouslySetInnerHTML={{ __html :  crowdBoard.crowdBoardContent  }}></div>
            </div>
            <hr id='crowd-board-line-dt'></hr>
            <br />
            <Button onClick={() => handleBoardList(crowdId)} variant="outlined" color="success">목록</Button>
            </div>
        </div>
    );
}

export default CrowdBoardDetail;
