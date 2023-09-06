import React from "react";
import Carousel from "react-material-ui-carousel";
import {Paper, Button} from '@mui/material';

const CrowdMainImg = () => {

    return(
        <Carousel>
            <Paper>1</Paper>
            <Paper>2</Paper>
            <Paper>3</Paper>
        </Carousel>
        // <div className="slideImg">
        //     <Carousel className="imgList">
        //         {Slide.map((item,i)=>(
        //             <Paper className="mainImg" key={ListItem.id}><img src={item.imgAddress} alt="" /></Paper>
        //         ))}
        //     </Carousel>
        // </div>
    );
};

export default CrowdMainImg;