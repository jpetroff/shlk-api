"use strict";
if (process.env.NODE_ENV === 'production') {
    module.exports = {
        "MONGO_USER": "jpetrov",
        "MONGO_PASSWORD": "9rRd6cpHBndVNenc",
        "MONGO_DB": "main",
        "MONGO_PRODUCTION": true,
        "MONGO_FULL": "mongodb+srv://{{MONGO_USER}}:{{MONGO_PASSWORD}}@shlk-db.vyq1kxk.mongodb.net/{{MONGO_DB}}?retryWrites=true&w=majority"
    };
}
else {
    module.exports = {
        "MONGO_USER": "jpetrov",
        "MONGO_PASSWORD": "9rRd6cpHBndVNenc",
        "MONGO_DB": "test",
        "MONGO_PRODUCTION": false,
        "MONGO_FULL": "mongodb+srv://{{MONGO_USER}}:{{MONGO_PASSWORD}}@shlk-db.vyq1kxk.mongodb.net/{{MONGO_DB}}?retryWrites=true&w=majority"
    };
}
//# sourceMappingURL=mongo_creds.js.map