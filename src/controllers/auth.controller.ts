import { Request, Response } from "express";
import prisma from "../utils/prisma";
import { userDTO } from "../models/user.model";
import response from "../utils/response";
import { hash, verify } from "argon2";
import jwt from "jsonwebtoken";

type TRegister = {
  email: string;
  username: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  isActive: boolean;
};

type TLogin = {
  email: string;
  password: string;
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
          isActive: true,
          password: hashedPassword,
          roles_id: 1,
        },
      });

      const { password: _, isActive, ...safeUser } = result;

      return response.success(res, safeUser, "registration success!");
    } catch (error) {
      return response.error(res, error, "registration failed!");
    }
  },

  async login(req: Request, res: Response) {
    const payload = req.body as TLogin;

    try {
      const user = await prisma.users.findUnique({
        where: { email: payload.email },
      });

      if (!user) {
        return response.error(res, null, "Invalid username or password", 401);
      }
      const validPassword = await verify(user!.password, payload.password);

      if (!validPassword) {
        return response.error(res, null, "Invalid username or password", 401);
      }

      const token = jwt.sign({ userId: user!.id, username: user!.username }, process.env.JWT_SECRET as string, {
        expiresIn: "1h",
      });

      return response.success(res, { token }, "Login successful!");
    } catch (error) {
      response.error(res, error, "Login failed!");
    }
  },
};
