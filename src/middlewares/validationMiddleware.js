export let validation = (schema) => {
  return (req, res, next) => {
    let data = { ...req.body, ...req.params, ...req.query };
    let validationResult = schema.validate(data, { abortEarly: false });
    if (validationResult.error) {
      let errorMessages = validationResult.error.details.map((errorMessage) => {
        return errorMessage.message;
      });
      return next(new Error(errorMessages, { cause: 400 }));
    }
    return next();
  };
};
