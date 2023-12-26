// To Handle all async functions

// asyncHandler is a middleware function that wraps the request handler function and catches any errors 
// that occur during the execution of the request handler function. It returns a new function that can be 
// used as a middleware in the Express application.

const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err))
    }
}

module.exports = asyncHandler;