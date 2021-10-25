import Result from './result.helper';
import { isCelebrateError } from 'celebrate';

const handleError = (err, req, res, next) => {
  if (isCelebrateError(err)) {
    const joi = err.details.get('body');
    const errors = joi.details.map(({ message, context }) => {
      const { key } = context;
      return { message: message.replace(/[""]/g, ''), key };
    });
    return Result.error(res, {
      type: 'Validate error',
      message: errors[0].message,
      key: errors[0].key,
    });
  }
  return Result.error(res, { message: err.message }, 500);
};

export default handleError;
