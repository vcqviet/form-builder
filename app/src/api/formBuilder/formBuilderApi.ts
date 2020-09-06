import client from '../client';
import {CollectionResponse, Response, encode} from '../api';
import FormBuilderModel from '../../model/FormBuilderModel';
import FormBuilderFilter from '../../model/filter/FormBuilderFilter';

export const getFormBuilder = async (id: string): Promise<Response<FormBuilderModel>> => {
    return await client.get(`/form-builder/${id}`);
};

export const getFormBuilders = async (filter: FormBuilderFilter): Promise<CollectionResponse<FormBuilderModel>> => {
    return await client.get(`/form-builders?filter=${encode(filter)}`);
};

export const putFormBuilder = async (payload: FormBuilderModel) => {
    return await client.put(`/form-builder/${payload.id}`, payload);
};

export const patchFormBuilder = async (payload: FormBuilderModel) => {
    return await client.patch(`/form-builder/${payload.id}`, payload);
};

export const deleteFormBuilder = async (payload: FormBuilderModel) => {
    return await client.delete(`/form-builder/${payload.id}`);
};