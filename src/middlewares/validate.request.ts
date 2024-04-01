import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";
import {
  logError,
  schemaValidationErrorParser,
} from "../utils/errors/errors.utils";

const validate =
  (schema: AnyZodObject) =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      schema.parse({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      return next();
    } catch (error: any) {
      logError(error);
      return res.status(400).json(schemaValidationErrorParser(error));
    }
  };

export default validate;
