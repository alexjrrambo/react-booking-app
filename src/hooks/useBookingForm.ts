import { zodResolver } from "@hookform/resolvers/zod";
import { bookingSchema, type BookingFormData } from "@utils/validation/bookingSchema";
import { useForm } from "react-hook-form";

export function useBookingForm() {
  return useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      bookingGuestName: "",
      bookingProperty: "",
      bookingDates: { from: undefined, to: undefined },
    },
  });
}
