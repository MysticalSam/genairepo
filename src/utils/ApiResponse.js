// This is a custom API Response class to handle API responses.
// It has a constructor that takes in a statusCode, data, and message.
// The constructor sets the statusCode, data, and message properties.
// The success property is set to true if the statusCode is less than 400.
// The ApiResponse class is exported so it can be used in other parts of the application.
// Example usage:
// const apiResponse = new ApiResponse(200, { data: 'some data' }

class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}
module.exports = ApiResponse