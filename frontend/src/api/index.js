import request from "./ajax";

//
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
export const pushIp = (data) =>
  request({
    url: "/addReqCount",
    method: "get",
    params: data,
  });
export const getIpData = () =>
  request({
    url: "/getWeekReqSumary",
    method: "get",
  });
export const reqListOfWineries = () =>
  request({
    url: "/listOfWineries",
    method: "get",
  });
export const reqUser = () =>
  request({
    url: "/user",
    method: "get",
  });
