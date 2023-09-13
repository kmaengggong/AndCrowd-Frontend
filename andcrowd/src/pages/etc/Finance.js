export const formatMoney = price =>
  (Math.round(price * 100) / 100).toLocaleString(); // 금액 형식화

// export const getAchievedRate = (achievedAmount, goalAmount) =>
//   Math.round((achievedAmount / goalAmount) * 100); // 목표금액 달성률

export const getDaysBetweenDate = (publishedAt, crowdEndDate) => {
  const start = new Date(publishedAt);
  const end = new Date(crowdEndDate);
  const now = new Date(); // 현재 날짜와 시간 불러오기

  // 만약 현재 날짜가 종료일보다 이전이라면 음수 값을 반환하지 않도록 처리
  if (now < end) {
    const dDay = end.getTime() - start.getTime();
    const diff = Math.floor(dDay / (1000 * 60 * 60 * 24));
    return diff;
  } else {
    return 0; // 현재 날짜가 종료일보다 이후면 0을 반환하여 마감으로 표시
  }
}; // 펀딩일수 계산 함수

export function calculateAchievedRate(currentAmount, crowdGoal) {
    if (crowdGoal <= 0) {
      return 0; // 총 금액이 0 이하일 경우 0을 반환하여 나누기 오류를 방지합니다.
    }
    
    const rate = (currentAmount / crowdGoal) * 100;
    return Math.min(rate, 100); // 최대값을 100으로 제한합니다.
}// 달성률 구하는 함수

export function calculateRaisedAmount(crowdGoal, currentAmount) {
    if (crowdGoal < currentAmount) {
      return 0; // 현재 모인 금액이 목표 금액을 초과하는 경우 0으로 반환
    }
    return crowdGoal - currentAmount;
}

export function countSponsors(crowdSponsor) {
    if (Array.isArray(crowdSponsor)) {
        return crowdSponsor.length;
    } else {
        return 0; // 배열이 아닌 경우 후원자가 없다고 가정
    }
} // 후원자 수 카운트