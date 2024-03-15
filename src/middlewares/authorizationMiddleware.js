export let isAuthorized = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.user.role))
      return next(new Error("user is not authorized", { cause: 401 }));
    return next();
  };
};
