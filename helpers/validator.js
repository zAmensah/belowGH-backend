const Joi = require('joi');

exports.registerValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    phone: Joi.string().required(),
  });
  return schema.validate(data);
};

exports.loginValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

exports.forgotValidation = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required(),
  });
  return schema.validate(data);
};

exports.resetValidation = (data) => {
  const schema = Joi.object({
    password: Joi.string().required(),
  });
  return schema.validate(data);
};

exports.productValidation = (data) => {
  const schema = Joi.object({
    category: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.string().required(),
  });
  return schema.validate(data);
};

exports.reviewValidation = (data) => {
  const schema = Joi.object({
    description: Joi.string().required(),
    rating: Joi.string().required(),
  });
  return schema.validate(data);
};
