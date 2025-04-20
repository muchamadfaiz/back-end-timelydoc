import { Request, Response } from "express";
import * as Yup from "yup";

type TRegister = {
  email: string;
  username: string;
  full_name: string;
  password: string;
  confirm_password: string;
  is_active: boolean;
};

const registerValidateSchema = Yup.object({
  email: Yup.string().required(),
  username: Yup.string().required(),
  full_name: Yup.string().required(),
  password: Yup.string().required(),
  confirm_password: Yup.string()
    .required()
    .oneOf([Yup.ref("password")], "Password is not match"),
});

export default {
  async register(req: Request, res: Response) {
    const { email, username, full_name, password, confirm_password } = req.body as unknown as TRegister;

    try {
      await registerValidateSchema.validate({
        email,
        username,
        full_name,
        password,
        confirm_password,
      });

      res.status(200).json({
        message: "success registration",
        data: {
          full_name,
          username,
          email,
        },
      });
    } catch (error) {
      const err = error as unknown as Error;
      res.status(400).json({
        message: err.message,
        data: null,
      });
    }
  },
};
