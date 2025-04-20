import * as Yup from "yup";

const validatePassword = Yup.string()
  .required()
  .min(6, "Password must be at least 6 characters")
  .test("at-least-one-uppercase-letter", "Contains at least one uppercase letter", (value) => {
    if (!value) return false;
    const regex = /^(?=.*[A-Z])/;
    return regex.test(value);
  })
  .test("at-least-one-number", "Contains at least one uppercase letter", (value) => {
    if (!value) return false;
    const regex = /^(?=.*\d)/;
    return regex.test(value);
  });
const validateConfirmPassword = Yup.string()
  .required()
  .oneOf([Yup.ref("password"), ""], "Password not match");

export const userDTO = Yup.object({
  fullName: Yup.string().required(),
  username: Yup.string().required(),
  email: Yup.string().email().required(),
  password: validatePassword,
  confirmPassword: validateConfirmPassword,
});
