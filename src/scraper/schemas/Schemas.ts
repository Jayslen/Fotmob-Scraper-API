import z from 'zod'
import { LEAGUES_AVAILABLE } from '../config'
import { preprocessRoundString } from '../utils/parseRoundString'

const LEAGUES = LEAGUES_AVAILABLE.map((l) => l.acrom)

const MatchSchema = z.object({
  league: z
    .enum(LEAGUES)
    .refine((val) => LEAGUES_AVAILABLE.some((l) => l.acrom === val), {
      message: 'Invalid league'
    })
    .transform((val) => {
      return LEAGUES_AVAILABLE.find((l) => l.acrom === val)!
    }),
  season: z
    .string()
    .length(9)
    .regex(/^\d{4}-\d{4}$/),
  round: z.preprocess(preprocessRoundString, z.int().min(1).max(38)).optional(),
  from: z.preprocess(preprocessRoundString, z.int().min(1).max(38)).default(1),
  to: z.preprocess(preprocessRoundString, z.int().min(1).max(38)).default(38)
})

export function ValidateMatchSchema(input: unknown) {
  return z.safeParse(MatchSchema, input)
}
