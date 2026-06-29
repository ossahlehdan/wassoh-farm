import { z } from 'zod'

export const depenseSchema = z.object({
  amount: z.string().refine((val) => {
    const num = Number(val)
    return !isNaN(num) && num > 0
  }, 'Le montant doit être supérieur à 0'),
  label: z.string().min(1, 'Le libellé est requis').max(255),
  category: z.string().min(1, 'La catégorie est requise'),
  note: z.string().optional().nullable(),
  date: z.string().min(1, 'La date est requise'),
})

export type DepenseFormData = z.infer<typeof depenseSchema>
