const Joi = require("joi");

exports.userValidation = (data) => {
  const schema = Joi.object({
    fullname: Joi.string()
      .min(3)
      .message("Ism kamida 3 ta belgidan iborat bo'lishi zarur")
      .max(50)
      .pattern(new RegExp("^[a-zA-Z ]{3,50}$"))
      .message("Ismda faqat quyidagi belgilar mumkin: A-z")
      .required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(6)
      .message("Parol 6 ta belgidan ko'p bo'lishi zarur")
      .required(),
  });
  return schema.validate(data);
};
