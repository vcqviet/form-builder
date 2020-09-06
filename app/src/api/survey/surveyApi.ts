import client from '../client';
import {CollectionResponse, Response, encode} from '../api';
import SurveyModel from '../../model/SurveyModel';
import SurveyFilter from '../../model/filter/SurveyFilter';

export const getSurvey = async (id: string): Promise<Response<SurveyModel>> => {
    return await client.get(`/survey/${id}`);
};

export const getSurveys = async (filter: SurveyFilter): Promise<CollectionResponse<SurveyModel>> => {
    return await client.get(`/surveys?filter=${encode(filter)}`);
};

export const putSurvey = async (payload: SurveyModel) => {
    return await client.put(`/survey/${payload.id}`, payload);
};

export const patchSurvey = async (payload: SurveyModel) => {
    return await client.patch(`/survey/${payload.id}`, payload);
};

export const deleteSurvey = async (payload: SurveyModel) => {
    return await client.delete(`/survey/${payload.id}`);
};
