import { FormControl } from '@angular/forms';

export interface ValidationResult {
    [key: string]: boolean;
}

export class PasswordValidator {

    public static strong(control: FormControl): ValidationResult {
        let hasNumber = /\d/.test(control.value);
        let hasUpper = /[A-Z]/.test(control.value);
        let hasLower = /[a-z]/.test(control.value);
        let hasAppropriateLength = control.value.length >= 8
        // console.log('Num, Upp, Low', hasNumber, hasUpper, hasLower);
        const valid = hasNumber && hasUpper && hasLower && hasAppropriateLength || !control.value;
        if (!valid) {
            if (!hasAppropriateLength) {
                return { tooShort: true }
            }
            if (!hasUpper) {
                return { missingUpper: true }
            }
            if (!hasLower) {
                return { missingLower: true }
            }
            if (!hasNumber) {
                return { missingNumber: true }
            }
        }
        return null;
    }
}