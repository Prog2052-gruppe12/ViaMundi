import { z } from "zod";

export const formSchema = z
    .object({
        destination: z.string().min(1, "Velg et reisemål"),
        dateFrom: z.date(),
        dateTo: z.date(),
        travelers: z.coerce
            .number()
            .int("Antall må være et helt tall")
            .min(1, "Min 1 reisende")
            .max(10, "Maks 10 reisende"),
    })
    .refine((data) => !data.dateTo || !data.dateFrom || data.dateTo >= data.dateFrom, {
        message: "Sluttdato må være etter startdato",
        path: ["dateTo"],
    });
