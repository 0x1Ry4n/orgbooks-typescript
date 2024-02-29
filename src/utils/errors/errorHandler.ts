import { Prisma } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
import { statusCode, CustomError } from "@/utils";

const handlePrismaError = (err: any): CustomError => {
    switch (err.code) {
        case 'P2002':
            // handling duplicate key errors
            return new CustomError(`Duplicate field value: ${err.meta!.target}`, statusCode.BAD_REQUEST);
        case 'P2014':
            // handling invalid id errors
            return new CustomError(`Invalid ID: ${err.meta!.target}`, statusCode.BAD_REQUEST);
        case 'P2003':
            // handling invalid data errors
            return new CustomError(`Invalid input data: ${err.meta!.target}`, statusCode.BAD_REQUEST);
        default:
            // handling all other errors
            return new CustomError(`Something went wrong: ${err.message}`, statusCode.INTERNAL_ERROR);
    }
};

const errorHandler = (err: any, req: Request, res: Response, next?: NextFunction) => {
    err.statusCode = err.statusCode || 500; 
    err.status = err.status || 'error'; 

    let error = { ...err };

    error.message = err.message;
    
    if (err instanceof Prisma.PrismaClientKnownRequestError) {
      console.log("handlePrismaError")
      error = handlePrismaError(err);
    }

    res.status(error.status).json({
        success: false,
        error: {
            name: error?.name,
            message: error.message
        },
    });
};

export { errorHandler, handlePrismaError }