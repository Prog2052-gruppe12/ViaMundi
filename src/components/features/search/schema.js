import { z } from "zod";

export const formSchema = z
    .object({
        destination: z.string().min(1, "Velg et reisemål"),
        dateFrom: z.coerce.date().optional(),
        dateTo: z.coerce.date().optional(),
        travelers: z.coerce
            .number()
            .int("Antall må være et helt tall")
            .min(1, "Velg reisende")
            .max(10, "Velg reisende"),
    })
    // Required checks FIRST
    .superRefine((data, ctx) => {
        if (!data.dateFrom) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["dateFrom"],
                message: "Velg en startdato",
            });
            return;
        }

        if (!data.dateTo) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["dateTo"],
                message: "Velg en sluttdato",
            });
            return;
        }

        // Only compare after both exist
        if (data.dateTo < data.dateFrom) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                path: ["dateTo"],
                message: "Sluttdato må være etter startdato",
            });
        }
    });

