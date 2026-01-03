import * as zod from 'zod';

export const loginscheme = zod.object ({
   
    email:zod.string().nonempty('this field is required').email('this email is not valid'),
    password:zod.string().nonempty('this field is required').regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/),
   
})
export type loginSchemeValidation =zod.infer<typeof loginscheme>