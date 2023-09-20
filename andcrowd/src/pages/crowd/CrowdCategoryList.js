import axios from "axios";
import React, { useEffect, useState } from "react";

const categoriesData = [
    {
        name: '0',
        text: '전체'
    },
    {
        name: '1',
        text: '문화 예술'
    },
    {
        name: '2',
        text: '액티비티 스포츠'
    },
    {
        name: '3',
        text: '테크 가전'
    },
    {
        name: '4',
        text: '푸드'
    },
    {
        name: '5',
        text: '언어'
    },
    {
        name: '6',
        text: '여행'
    },
    {
        name: '7',
        text: '반려동물'
    },
    {
        name: '8',
        text: '기타'
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
        <div>
            <div style={{ display: "flex", gap: "8px" }}>
            {categoriesData.map((category) => (
            <button
                key={category.name}
                onClick={() => handleCategoryClick(category)}
                style={{
                padding: "8px 16px",
                background: selectedCategory === category ? "white" : "#00D337",
                color: "black",
                border: "none",
                borderRadius: "20px",
                cursor: "pointer",
                }}
            >
                {category.text}
            </button>
            ))}
            </div>
            {selectedCategory && (
                <div>
                {/* <h2>Selected Category: {selectedCategory.text}</h2> */}
                <p
                    type="text"
                    placeholder="New Category Name"
                    onChange={(e) => handleCategorySelect(e.target.value)}
                />
                </div>
            )}
        </div>
    );
};
    
export default CrowdCategoryList;