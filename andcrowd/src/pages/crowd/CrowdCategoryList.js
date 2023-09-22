import axios from "axios";
import React, { useEffect, useState } from "react";
import cat0 from '../../category/all.png';
import cat1 from '../../category/art.png';
import cat2 from '../../category/sports.png';
import cat3 from '../../category/gadgets.png';
import cat4 from '../../category/bibimbap.png';
import cat5 from '../../category/languages.png';
import cat6 from '../../category/traveling.png';
import cat7 from '../../category/pets.png';
import cat8 from '../../category/etc.png';

const categoriesData = [
    {
        name: '0',
        text: '전체',
        img: cat0
    },
    {
        name: '1',
        text: '문화/예술',
        img: cat1
    },
    {
        name: '2',
        text: '액티비티',
        img: cat2
    },
    {
        name: '3',
        text: '테크/가전',
        img: cat3
    },
    {
        name: '4',
        text: '푸드',
        img: cat4
    },
    {
        name: '5',
        text: '언어',
        img: cat5
    },
    {
        name: '6',
        text: '여행',
        img: cat6
    },
    {
        name: '7',
        text: '반려동물',
        img: cat7
    },
    {
        name: '8',
        text: '기타',
        img: cat8
    },
];

const CrowdCategoryList = ({ onCategorySelect }) => {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState({});

    useEffect(() => {
        // 카테고리 데이터를 불러오기 요청
        axios.get(`/crowdCategory/all`)
        .then((response) => {
            setCategories(response.data);
        })
        .catch((error) => {
            console.error("카테고리 데이터를 가져오는 중 오류: ", error);
        });
    },[]);

    const handleCategorySelect = (updatedCategoryName) => {
        // 선택한 카테고리 업데이트
        if (selectedCategory) {
          const categoryId = selectedCategory.crowdCategoryId;
          axios
            .put(`/crowdCategory/${categoryId}/update`, {
              crowdCategoryName: updatedCategoryName,
            })
            .then(() => {
              // 업데이트 후, 카테고리 리스트를 다시 불러와 업데이트 된 데이터 표시
              axios
                .get(`/crowdCategory/all`)
                .then((response) => {
                  setCategories(response.data);
                  setSelectedCategory(null); // 업데이트 후 선택한 카테고리 초기화
                })
                .catch((error) => {
                  console.error("카테고리 데이터를 가져오는 중 오류: ", error);
                });
            })
            .catch((error) => {
              console.error("카테고리 업데이트 중 오류:", error);
            });
        }
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        onCategorySelect(category.name);
    };

    // const handleCategoryUpdate = (updatedCategoryName) => {
    //     // 선택한 카테고리 업데이트
    //     if (selectedCategory) {
    //       axios.put(`/crowdCategory/${selectedCategory.crowdCategoryId}/update`, { crowdCategoryName: updatedCategoryName })
    //         .then(() => {
    //           // 업데이트 후, 카테고리 리스트를 다시 불러와 업데이트 된 데이터 표시
    //           axios.get(`/crowdCategory/all`)
    //             .then((response) => {
    //               setCategories(response.data);
    //               setSelectedCategory(null); // 업데이트 후 선택한 카테고리 초기화
    //             })
    //             .catch((error) => {
    //               console.error("카테고리 데이터를 가져오는 중 오류: ", error);
    //             });
    //         })
    //         .catch((error) => {
    //           console.error("카테고리 업데이트 중 오류:", error);
    //         });
    //     }
    // }; 수정되었을때 불러오는 자료
    
    return (
        <div style={{ display: "flex", alignItems: "center", width: "85%", flexWrap: "wrap" }}>
        {categoriesData.map((category) => (
        <button
            key={category.name}
            onClick={() => handleCategoryClick(category)}
            style={{
            background: selectedCategory === category ? "#f7f7f7" : "none",
            color: "black",
            border: "none",
            borderRadius: "20px",
            cursor: "pointer",
            display: "flex",  
            flexDirection: "column", 
            alignItems: "center", 
            margin: "0.3vw",
            width: "9%",
            minWidth: "65px",
            }}
        >
            <img id='cat-img' src={category.img} alt="icon" />
            <p style={{marginBottom: "0", marginTop: "3px"}}>{category.text}</p>
        </button>
        ))}
        </div>
    );
};
    
export default CrowdCategoryList;
