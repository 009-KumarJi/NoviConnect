import {body, check, param, validationResult} from "express-validator";
import {ErrorHandler} from "./utility.js";

const validateHandler = (req, res, next) => {
  const errors = validationResult(req); // Finds the validation errors in this request and wraps them in an object with handy functions
  const errorMessage = errors.array().map((error) => error.msg).join(", ");

  if (errors.isEmpty()) return next();
  next(new ErrorHandler(errorMessage, 400));
};
const registerValidator = () => [
  body("name", "Enter name!").notEmpty(),
  body("username", "Enter username!").notEmpty(),
  body("password", "Enter password!").notEmpty(),
  body("dob", "Enter date of birth!").notEmpty(),
  body("bio", "Enter bio!").notEmpty(),
  body("email", "Enter email address!").isEmail(),
  check("avatar", "Upload Avatar!").notEmpty()
];
const loginValidator = () => [
  body("username", "Enter username!").notEmpty(),
  body("password", "Enter password!").notEmpty(),
];
const newGroupChatValidator = () => [
  body("name", "Enter name!").notEmpty(),
  body("members")
    .notEmpty().withMessage("Add members to the group!")
    .isArray({min: 2, max: 100}).withMessage("Add at least 2 members! and Max 100 members allowed!"),
];
const addMembersValidator = () => [
  body("members")
    .notEmpty().withMessage("Add members to the group!")
    .isArray({min: 1, max: 97}).withMessage("Add at least 1 members!"),
  body("ChatId", "ChatId not found in request!").notEmpty(),
];
const removeMemberValidator = () => [
  body("UserId", "UserId not found in request!").notEmpty(),
  body("ChatId", "ChatId not found in request!").notEmpty(),
];
const sendAttachmentsValidator = () => [
  body("ChatId", "ChatId not found in request!").notEmpty(),
  check("files")
    .notEmpty().withMessage("Upload attachments!")
    .isArray({min: 1, max: 5}).withMessage("Upload at least 1 attachment! and Max 5 attachments allowed!"),
];
const chatIdValidator = () => [
  param("ChatId", "ChatId not found in request!").notEmpty(),
];
const renameGroupValidator = () => [
  param("ChatId", "ChatId not found in request!").notEmpty(),
  body("name", "Enter a name for GC!").notEmpty()
];
const sendRequestValidator = () => [
  body("ReceiverId", "ReceiverId for request not found in HTTP request!").notEmpty()
];
const acceptRequestValidator = () => [
  body("requestId", "requestId for request not found in HTTP request!").notEmpty(),
  body("status")
    .notEmpty().withMessage("Status for request not found in HTTP request!")
    .isBoolean().withMessage("Status must be a boolean value!")
];

export {
  validateHandler,
  registerValidator,
  loginValidator,
  newGroupChatValidator,
  addMembersValidator,
  removeMemberValidator,
  sendAttachmentsValidator,
  chatIdValidator,
  renameGroupValidator,
  sendRequestValidator,
  acceptRequestValidator
};

// Path: server/utils/validators.js