import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export class RegisterValidator {

    static match(controlName: string, matchingControlName: string): ValidatorFn{
        return (group: AbstractControl) : ValidationErrors | null => {
            const control = group.get(controlName);
            const matchingControl = group.get(matchingControlName);

            if(!control || !matchingControl)
                return { controlNotFound: false };

            const error = control.value === matchingControl.value ? null : { noMatch: true };

            matchingControl.setErrors(error);

            return error;
        }
    }

    static noWhiteSpaceOnly(): ValidatorFn{
        return(control: AbstractControl): ValidationErrors | null => {
            if(typeof control.value === 'string'){
                const isWhiteSpaceOnly = (control.value ?? '').trim().length === 0;
                return isWhiteSpaceOnly? { whiteSpace: true } : null;
            }

            return null;
        }
    }
}
