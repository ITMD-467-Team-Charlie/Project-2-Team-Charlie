'use strict';
exports.successResponse = function resp(res, msg) {
  const data = {
    status: 1,
    message: msg
  };
  return res.status(200).json(data);
};

exports.successResponseWithData = function resp(res, msg, data) {
  const resData = {
    status: 'success',
    message: msg,
    data
  };
  return res.status(200).json(resData);
};

exports.ErrorResponse = function resp(res, msg) {
  const data = {
    status: 0,
    message: msg
  };
  return res.status(500).json(data);
};

exports.notFoundResponse = function resp(res, msg) {
  const data = {
    status: 0,
    message: msg
  };
  return res.status(404).json(data);
};

exports.validationErrorWithData = function resp(res, msg, data) {
  const resData = {
    status: 0,
    message: msg,
    data
  };
  return res.status(400).json(resData);
};

exports.unauthorizedResponse = function resp(res, msg) {
  const data = {
    status: 0,
    message: msg
  };
  return res.status(401).json(data);
};
