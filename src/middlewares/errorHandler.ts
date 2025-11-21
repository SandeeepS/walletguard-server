import type { NextFunction, Request, Response } from "express";

interface CustomError extends Error {
  message: string;
  statusCode?: number;
}

const errorHandlerMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Error: ", err.message);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.json({
    statusCode,
    success: false,
    message: message,
  });
};

export default errorHandlerMiddleware;
