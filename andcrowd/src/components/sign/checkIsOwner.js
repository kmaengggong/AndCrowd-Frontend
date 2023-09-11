import { GetUserId } from "../user/getUserId"

export const checkIsOwner = async (userId) => {
    if(userId === await GetUserId()) return true;
    return false;
}