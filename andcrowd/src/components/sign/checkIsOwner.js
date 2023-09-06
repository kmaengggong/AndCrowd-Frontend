import { GetUserId } from "../user/GetUserId"

export const checkIsOwner = async (userId) => {
    if(userId === await GetUserId()) return true;
    return false;
}