import { Request, Response } from "express";
import response from "../utils/response";
import prisma from "../utils/prisma";
import { getDayInIndo } from "../utils/helper";
import { scheduleDTO } from "../models/schedule.model";

/**
 * Example body
 * {
  "doctor_id": 1,
  "day": "Senin",
  "time_start": "14:00",
  "time_finish": "18:00",
  "quota": 10,
  "status": true,
  "date_range": {
    "start": "2025-05-01",
    "end": "2025-05-20"
  }
}
 */

type TStore = {
  doctor_id: number;
  day: string;
  quota: string;
  time_start: string;
  time_finish: string;
  date_range: {
    start: string;
    finish: string;
  };
};

export default {
  async create(req: Request, res: Response) {
    const payload = req.body as TStore;
    try {
      await scheduleDTO.validate(payload);

      const { doctor_id, day, quota, time_start, time_finish, date_range } = payload;

      const doctor = await prisma.doctors.findUnique({
        where: { id: doctor_id },
      });

      if (!doctor) {
        return response.notFound(res, "Doctor is not found");
      }

      const start = new Date(date_range.start);
      console.log("", start);
      const finish = new Date(date_range.finish);
      console.log("", finish);

      let current = new Date(start);
      const bulkSchedules: any[] = [];

      while (current <= finish) {
        const hari = getDayInIndo(current);

        if (hari === day) {
          const existingSchedules = await prisma.schedules.findMany({
            where: {
              doctor_id,
              date: current,
            },
          });

          const isConflict = existingSchedules.some((item) => {
            return time_start < item.time_finish && time_finish > item.time_start;
          });

          if (!isConflict) {
            bulkSchedules.push({
              doctor_id,
              day,
              quota,
              time_start,
              time_finish,
              date: new Date(current),
              status: true,
            });
          }
        }

        current.setDate(current.getDate() + 1);
      }

      console.log(bulkSchedules.length);

      const result = await prisma.schedules.createMany({
        data: bulkSchedules,
      });

      return response.success(res, result, "success create schedules");
    } catch (error) {
      return response.error(res, error, "failed create schedules");
    }
  },

  async findAll(req: Request, res: Response) {
    try {
      const result = await prisma.schedules.findMany({
        include: { doctor: true },
      });
      return response.success(res, result, "success get all schedules");
    } catch (error) {
      return response.error(res, error, "failed find all schedules");
    }
  },
};
