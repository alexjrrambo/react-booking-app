import { z } from "zod";

export const bookingSchema = z.object({
  bookingGuestName: z.string().min(3, "Guest name must have at least 3 characters."),
  bookingProperty: z.string().nonempty("Property is required."),
  bookingDates: z.object({
    from: z.date(),
    to: z.date(),
  }).refine((selectedDates) => Boolean(selectedDates.from && selectedDates.to)),
});

export type BookingFormData = z.infer<typeof bookingSchema>;
