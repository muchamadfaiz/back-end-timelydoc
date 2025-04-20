import * as Yup from "yup";

const validateTime = Yup.string()
  .required()
  .matches(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)");

const validateQuota = Yup.number()
  .required()
  .positive("Quota must be greater than 0")
  .integer("Quota must be an integer");

const validateDay = Yup.string()
  .required()
  .oneOf(["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"], "Day must be a valid weekday");

const validateAfterStart = validateTime.test(
  "is-after-start",
  "Finish time must be after start time",
  function (value) {
    const { time_start } = this.parent;
    return time_start && value ? time_start < value : true;
  }
);

export const scheduleDTO = Yup.object({
  doctor_id: Yup.number().required(),
  day: validateDay,
  time_start: validateTime,
  time_finish: validateAfterStart,
  quota: validateQuota,
  status: Yup.boolean().default(true),
  date_range: Yup.object({
    start: Yup.string().required(),
    end: Yup.string().required(),
  }).required(),
});
