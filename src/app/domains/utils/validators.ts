import { AbstractControl } from '@angular/forms';

export class MyValidators {


  // static validPassword(control: AbstractControl) {
  //   const value = control.value;
  //   if (!containsNumber(value)) {
  //     return {invalid_password: true};
  //   }
  //   return null;
  // }

  static matchPasswords(control: AbstractControl) {
    const passwordField = control.get('password');
    const confirmPasswordField = control.get('confirmPassword');
    // if (!passwordField || !confirmPasswordField) {
    //   return null;
    // }

    const password: string | null = passwordField?.value;
    const confirmPassword = confirmPasswordField?.value;

    if (password!== confirmPassword) {
      return {match_password: true};
    }
    return null;
  }

}

// function containsNumber(value: string){
//   return value.split('').find(v => isNumber(v)) !== undefined;
// }


function isNumber(value: string){
  return !isNaN(parseInt(value, 10));
}
