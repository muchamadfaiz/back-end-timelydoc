import { Request, Response } from "express";
import prisma from "../utils.ts/prisma";
import { userDTO } from "../models/user.model";
import response from "../utils.ts/response";
import { hash } from "argon2";

type TRegister = {
  email: string;
  username: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  isActive: boolean;
};

export default {
  async register(req: Request, res: Response) {
    const payload = req.body as unknown as TRegister;

    try {
      await userDTO.validate(payload);

      const { password, confirmPassword, ...user } = payload;

      const hashedPassword = await hash(password);

      const result = await prisma.users.create({
        data: {
          ...user,
          password: hashedPassword,
        },
      });

      const { password: _, ...safeUser } = result;

      response.success(res, safeUser, "registration success!");
    } catch (error) {
      response.error(res, error, "registration failed!");
    }
  },
};
