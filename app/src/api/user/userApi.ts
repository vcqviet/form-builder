import UserModel from '../../model/UserModel';
import client from '../client';
import {CollectionResponse, Response, encode} from '../api';
import UserFilter from '../../model/filter/UserFilter';
import PasswordChangeModel from "../../model/PasswordChangeModel";

export const getUser = async (id: string): Promise<Response<UserModel>> => {
    return await client.get(`/user/${id}`);
};

export const getUsers = async (filter: UserFilter): Promise<CollectionResponse<UserModel>> => {
    return await client.get(`/users?filter=${encode(filter)}`);
};

export const putUser = async (payload: UserModel) => {
    return await client.put(`/user/${payload.id}`, payload);
};

export const patchUser = async (payload: UserModel) => {
    return await client.patch(`/user/${payload.id}`, payload);
};

export const deleteUser = async (payload: UserModel) => {
    return await client.delete(`/user/${payload.id}`);
};

export const changePassword = async (payload: PasswordChangeModel) => {
  return await client.patch(`/user/${payload.id}/change-password`, payload);
};

export const adminGeneratePassword = async (payload: any) => {
    return await client.patch(`/user/${payload.id}/generate-password`, payload);
};