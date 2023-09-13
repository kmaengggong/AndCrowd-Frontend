import { Container } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const CrowdSponsor = () => {
    const params = useParams();
    const crowdId = params.crowdId;
    const sponsorId = params.sponsorId;
    const [sponsors, setSponsors] = useState([]);
    useEffect(() => {
        fetchData();
    },[crowdId]);

    const fetchData = async () => {
        try{
            const response = await fetch(`/crowd/${crowdId}/sponsor/all`);
            if(response.ok) {
                const data = await response.json();
                setSponsors(data);
            } else {
                throw new Error(`Fetching AndMember data failed with status ${response.status}.`);
            }
        } catch(error) {
            console.error(error);
        }
    };

    return(
        <Container>
            {/*  */}
            <h1></h1>
        </Container>
    );
};

export default CrowdSponsor;