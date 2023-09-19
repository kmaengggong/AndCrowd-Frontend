export const formatMoney = (price) => {
  const formattedPrice = (Math.round(price * 100) / 100).toLocaleString();
  return isNaN(formattedPrice) ? "0" : formattedPrice;
};// 금액 형식화

export function calculateAchievedRate(currentAmount, crowdGoal) {
  if (crowdGoal <= 0 || isNaN(currentAmount) || isNaN(crowdGoal)) {
    return 0;
  }

  const rate = (currentAmount / crowdGoal) * 100;
  return Math.min(rate, 100);
}; // 달성률 표시

export function calculateRaisedAmount(crowdGoal, currentAmount) {
  if (isNaN(crowdGoal) || isNaN(currentAmount) || crowdGoal < currentAmount) {
    return 0;
  }
  return crowdGoal - currentAmount;
}; // 모인 금액 형식화

export function countSponsors(crowdSponsor) {
  if (Array.isArray(crowdSponsor)) {
    return crowdSponsor.length;
  } else {
    return 0;
  }
}; // 후원자 수 카운트

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