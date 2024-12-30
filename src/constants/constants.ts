//Constants for mongoose filters
export const COACH = 'coach';
export const USER = 'user';
export const USER_EXISTS = 'Username already exists';
export const DB_ERROR = 'database error';
export const ERROR = 'error';

//Constants for mongoose filters
export const SERVER_ERROR = '500. InternalServerError';
export const USER_NOT_FOUND = 'User was not found';
export const TOKEN_EXPIRED = '401. Token has been expired';
export const INVALID_PASSWORD =
  'password must be longer than or equal to 8 characters';
export const PASSWORDS_NOT_MATCHED =
  'password and confirmPassword does not match';
export const RETURN_TOKEN = '200, Returns access token and roles of users.';
export const USER_SIGNED_UP = '200, Signed Up successfully';
export const INVALID_USER_INFO = '400, User credentials missing or wrong! ';
export const PASSWORD_CHANGED = '200, Password Changed successfully!';
export const USER_DETAILS = '200, Returns user details from token';
export const UNAUTHRIZED = '401, says you Unauthorized';
export const FORBIDDEN_REQUEST = '403, Says Forbidden request';
export const RETURN_USER_ID = '201, Returns user id and success message';
export const VALIDATION_EXCEPTION = '400. ValidationException';
export const RETURN_JWT_TOKEN = '201, returns new jwt tokens';
export const SUCCESS_MESSAGE = '201, returns Success message';
export const SUCCESSFULLY_SAVED = 'Successfully Saved';
export const SUCCESSFULLY_DELETED = 'Successfully Deleted';
export const DATA_NOT_FOUND = 'Data not found';
export const DATA_FOUND = 'Data found';
export const DATA_DELETED = 'Data deleted successfully';
export const ARCHIVED_SUCCESSFULLY = 'Product Archived successfully';
export const DATA_UPDATED = 'Updated Successfully';
export const DATA_POSTED = 'View inserted successfully';
export const INTERNAL_SERVER_ERROR = 'internal server error';
export const USER_NOT_EXIST = 'No user exist please enter correct email';
export const EMAIL_SENT = 'Email sent please have a look.';
export const BAD_REQUEST = 'Bad Request'
export const FOLLOWED = 'Successfully Followed';
export const UN_FOLLOWED = 'Successfully Unfollowed';
export const UNDEFINED = 'Undefined';
export const ANSWER = 'Answer';
export const RESULT_STORED = 'Result Stored Successfully';
export const SUBSCRIBED = 'Subscribed Successfully';
export const PAYMENT_NOT_SUCCESSFULLY = 'Payment Not done Successfully';
export const PAYMENT_SUCCESSFULLY = 'Payment done Successfully';
export const PAYMENT_UPDATED_DEFAULT = 'Payment method successfully set as default';
export const FEEDBACK_SUCCESSFULLY = 'Feedback Successfully Saved';
export const FEEDBACK_UN_SUCCESSFULLY = 'Feedback Not Saved';