import z from "zod";

export const RequestShiftMessageValidate = z.object({
  shiftRequestId: z
    .string()
    .uuid("this id format is invalid")
    .min(1, "Shift request ID is required"),
  startDate: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  endDate: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  deadline: z.string().min(1, "Deadline is required"),
});
export type RequestShiftMessageType = z.infer<
  typeof RequestShiftMessageValidate
>;

export const ConfirmShiftMessageValidate = z.object({
  shiftRequestId: z
    .string()
    .uuid("this id format is invalid")
    .min(1, "Shift request ID is required"),
  startDate: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
  endDate: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
    message: "Invalid date format",
  }),
});
export type ConfirmShiftMessageType = z.infer<
  typeof ConfirmShiftMessageValidate
>;
