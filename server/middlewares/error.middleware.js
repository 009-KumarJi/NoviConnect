const errorMiddleware = (error, req, res, next) => {
  console.log(error);
  error.message ||= "Internal server error";
  error.statusCode ||= 500;

  return res.status(error.statusCode).json({
    success: false,
    message: error.message,
  });
};

const TryCatch = (passedFunction) => async (req, res, next) => {
  try {
    await passedFunction(req, res, next);
  } catch (error) {
    next(error);
  }
};

export {errorMiddleware, TryCatch};