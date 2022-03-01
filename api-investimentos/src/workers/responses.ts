const Responses = {
    _Define(statusCode = 502, data = {}) {
        return {
            statusCode,
            data,
        };
    }
};

export default Responses;
