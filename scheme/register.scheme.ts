
import * as zod from 'zod';

export const registerscheme = zod.object ({
    name: zod.string().nonempty('this field is required').min(3,'min 3 char').max(10,'max 10 char'),
    email:zod.string().nonempty('this field is required').email('this email is not valid'),
    password:zod.string().nonempty('this field is required').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/),
    rePassword:zod.string().nonempty('this field is required'),

phone:zod.string().nonempty('this field is required').regex(/^(\+2?)(01)[0-25]\d{8}$/)
}).refine((data)=>data.password == data.rePassword , {error:'passwords do not match',
    path: ['rePassword']
}  )
export type registerSchemeValidation =zod.infer<typeof registerscheme>