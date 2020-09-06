export interface Response<T> {
    data: T;
}
export interface CollectionResponse<T> {
    data: [T];
}
export const encode = (component: object): string => {
    return encodeURIComponent(JSON.stringify(component));
};