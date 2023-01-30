"use strict";
if (process.env.NODE_ENV === 'production') {
    module.exports = {
        "MONGO_USER": "jpetrov",
        "MONGO_PASSWORD": "9rRd6cpHBndVNenc",
        "MONGO_DB": "main",
        "MONGO_PRODUCTION": true,
        "MONGO_FULL": "mongodb+srv://{{MONGO_USER}}:{{MONGO_PASSWORD}}@shlk-db.vyq1kxk.mongodb.net/{{MONGO_DB}}?retryWrites=true&w=majority",
        "APP_SESSION_SECRET": 'MKGt&w8q3nGEc$2A1ga7Zz3zDhLQqBNPjR7$DKK5%iw7zlB$qKDo8c&y',
        "web": {
            "client_id": "652965437671-7sp6dqu6phcnj0dvtv3i5h5f9flicoed.apps.googleusercontent.com",
            "project_id": "share-link-cc",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_secret": "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",
            "redirect_uris": [
                "https://shlk.cc/oauth/google/callback"
            ],
            "javascript_origins": [
                "https://shlk.cc"
            ]
        }
    };
}
else {
    module.exports = {
        "MONGO_USER": "jpetrov",
        "MONGO_PASSWORD": "9rRd6cpHBndVNenc",
        "MONGO_DB": "test",
        "MONGO_PRODUCTION": false,
        "MONGO_FULL": "mongodb+srv://{{MONGO_USER}}:{{MONGO_PASSWORD}}@shlk-db.vyq1kxk.mongodb.net/{{MONGO_DB}}?retryWrites=true&w=majority",
        "APP_SESSION_SECRET": 'MKGt&w8q3nGEc$2A1ga7Zz3zDhLQqBNPjR7$DKK5%iw7zlB$qKDo8c&y',
        "web": {
            "client_id": "652965437671-7sp6dqu6phcnj0dvtv3i5h5f9flicoed.apps.googleusercontent.com",
            "project_id": "share-link-cc",
            "auth_uri": "https://accounts.google.com/o/oauth2/auth",
            "token_uri": "https://oauth2.googleapis.com/token",
            "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
            "client_secret": "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",
            "redirect_uris": [
                "http://localhost:8002/oauth/google/callback"
            ],
            "javascript_origins": [
                "http://localhost"
            ]
        }
    };
}
//# sourceMappingURL=config.js.map