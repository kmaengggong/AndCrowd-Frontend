import axios from 'axios';

const userApi = axios.create({
  baseURL: '/user-info', // 사용자 정보 엔드포인트의 기본 URL
});

export const getUserNickname = async (userId) => {
  try {
    const response = await userApi.get(`/nickname/${userId}`);
    if (response.status === 200) {
      return response.data; // 닉네임 반환
    } else {
      throw new Error(`Failed to fetch user nickname with status ${response.status}`);
    }
  } catch (error) {
    console.error('Error fetching user nickname:', error);
    return ''; // 에러 발생 시 빈 문자열 반환
  }
};