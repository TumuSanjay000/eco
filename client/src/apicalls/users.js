import { axiosInstance } from "./axiosInstance";

export const RegisterUser = async(payload)=>{
    try{
        const responce = await axiosInstance.post("/api/users/register",payload);
        return responce.data;
    } catch(error){
        return error.message
    }
}


export const LoginUser = async(payload)=>{
    try{
        const responce = await axiosInstance.post("/api/users/login",payload);
        return responce.data;
    } catch(error){
        return error.message
    }
}

export const GetCurrentUser = async()=>{
    try{
        const responce = await axiosInstance.get("/api/users/get-current-user");
        return responce.data;
    } catch(error){
        return error.message
    }
}