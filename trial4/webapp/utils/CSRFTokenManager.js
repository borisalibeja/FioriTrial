sap.ui.define([], function () {
    let csrfToken = null;

    return {
        setToken: function (token) {
            if (token && typeof token === "string" && token.trim() !== "") {
                csrfToken = token;
                console.log("CSRF Token set successfully.");
            } else {
                console.warn("Invalid CSRF token. Token not set.");
            }
        },

        getToken: function () {
            if (!csrfToken) {
                console.warn("CSRF Token is not available. Please fetch it first.");
            }
            return csrfToken;
        },

        hasToken: function () {
            return csrfToken !== null && csrfToken.trim() !== "";
        },

        clearToken: function () {
            csrfToken = null;
            console.log("CSRF Token cleared.");
        }
    };
});
