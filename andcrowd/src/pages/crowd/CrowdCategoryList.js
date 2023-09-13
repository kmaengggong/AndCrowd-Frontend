import axios from "axios";
import React, { useEffect, useState } from "react";

const CrowdCategoryList = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, SetSelectedCategory] = useState(null);

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

    const handleCategoryClick = (category) => {
        selectedCategory(category);
    };

    const handleCategoryUpdate = (updatedCategoryName) => {
        // 선택한 카테고리 업데이트
        if(selectedCategory) {
            axios.put(`/crowdCategory/${crowdCategoryId}/update`, { crowdCategoryName: updatedCategoryName })
            .then(() => {
                // 업데이트 후, 카테고리 리스트를 다시 불러와 업데이트 된 데이터 표시
                axios.get(`/crowdCategory/all`)
                .then((response) => {
                    setCategories(response.data);
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

    return(
        <div>
            <ul>
                {categories.map((category) => (
                <li
                    key={category.crowdCategoryId}
                    onClick={() => handleCategoryClick(category)}
                >
                    {category.crowdCategoryName}
                </li>
                ))}
            </ul>
            {selectedCategory && (
                <div>
                <h2>Selected Category: {selectedCategory.crowdCategoryName}</h2>
                <input
                    type="text"
                    placeholder="New Category Name"
                    onChange={(e) => handleCategoryUpdate(e.target.value)}
                />
                </div>
            )}
        </div>
    );
};

export default CrowdCategoryList;