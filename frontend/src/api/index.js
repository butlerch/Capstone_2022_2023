import request from "./ajax";


export const addOrDelFavite = (data) =>
    request({
        url: "/addOrCancelFavWineries",
        method: "post",
        data,
    });
export const reqFavite = (data) =>
    request({
        url: "/listFavWineries",
        method: "get",
        params: data,
    });
export const addOrDelQualities = (data) =>
    request({
        url: "/addOrCancelFavQualities",
        method: "post",
        data,
    });
export const reqQualities = (data) =>
    request({
        url: "/listFavQualities",
        method: "get",
        params: data,
    });

export const search = (data) =>
    request({
        url: "/search",
        method: "get",
        params: data,
    });
