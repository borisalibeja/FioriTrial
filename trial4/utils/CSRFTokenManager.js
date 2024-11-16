sap.ui.define([], function () {
    let csrfToken = null;

    return {
        setToken: function (token) {
            csrfToken = token;
        },
        getToken: function () {
            return csrfToken;
        }
    };
});
