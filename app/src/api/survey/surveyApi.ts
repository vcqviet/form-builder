import client from '../client';
import {CollectionResponse, Response, encode} from '../api';
import SurveyModel from '../../model/SurveyModel';
import SurveyFilter from '../../model/filter/SurveyFilter';

export const getSurvey = async (id: string): Promise<Response<SurveyModel>> => {
    return await client.get(`/form-builder/${id}`);
};

export const getSurveys = async (filter: SurveyFilter): Promise<CollectionResponse<SurveyModel>> => {
    return await client.get(`/form-builders?filter=${encode(filter)}`);
};

export const putSurvey = async (payload: SurveyModel) => {
    return await client.put(`/form-builder/${payload.id}`, payload);
};

export const patchSurvey = async (payload: SurveyModel) => {
    return await client.patch(`/form-builder/${payload.id}`, payload);
};

export const deleteSurvey = async (payload: SurveyModel) => {
    return await client.delete(`/form-builder/${payload.id}`);
};
