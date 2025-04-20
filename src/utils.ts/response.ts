import { Prisma } from "@prisma/client";
import { Response } from "express";
import * as Yup from "yup";
export default {
  success(res: Response, data: any, message: string) {
    res.status(200).json({
      meta: {
        status: 200,
        message,
      },
      data,
    });
  },
  error(res: Response, error: unknown, message: string) {
    if (error instanceof Yup.ValidationError) {
      return res.status(400).json({
        meta: {
          status: 400,
          message,
        },
        data: {
          [`${error.path}`]: error.errors[0],
        },
      });
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return res.status(400).json({
        meta: {
          status: 409,
          message: `${error.meta?.target} already exist`,
        },
        data: null,
      });
    }

    res.status(500).json({
      meta: {
        status: 500,
        message,
      },
      data: error,
    });
    console.log(error);
  },

  notFound(res: Response, message: string = "not found") {
    res.status(404).json({
      meta: {
        status: 404,
        message,
      },
      data: null,
    });
  },
};
