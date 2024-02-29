import { constants } from "http2";

const statusCode = {
    OK: constants.HTTP_STATUS_OK,
    CREATED: constants.HTTP_STATUS_CREATED,
    NOT_FOUND: constants.HTTP_STATUS_NOT_FOUND,
    UNAUTHORIZED: constants.HTTP_STATUS_UNAUTHORIZED,
    FORBIDDEN: constants.HTTP_STATUS_FORBIDDEN,
    BAD_REQUEST: constants.HTTP_STATUS_BAD_REQUEST,
    UNPROCESSABLE_ENTITY: constants.HTTP_STATUS_UNPROCESSABLE_ENTITY,
    INTERNAL_ERROR: constants.HTTP_STATUS_INTERNAL_SERVER_ERROR,
};

export { statusCode };
