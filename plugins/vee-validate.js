import { extend } from 'vee-validate';
import { required, email, min, max } from 'vee-validate/dist/rules';

extend('required', {
  ...required,
  message: 'This field is required',
});

extend('email', {
  ...email,
  message: 'This field must be a valid email',
});

extend('min', {
  ...min,
  message: 'The password is to short',
});

extend('max', {
  ...max,
  message: 'The password is to long',
});

extend('password', {
  params: ['target'],
  validate(value, { target }) {
    return value === target;
  },
  message: 'Password does not match',
});
