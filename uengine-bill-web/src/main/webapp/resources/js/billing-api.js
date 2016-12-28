/**
 * Created by Seungpil Park on 2016. 9. 6..
 */
var uBilling = function (host, port) {
    this.host = host;
    this.port = port;
    this.schema = 'http';

    $(document).ajaxSend(function (e, xhr, options) {
        var token = localStorage.getItem('access_token');
        var organizationId = localStorage.getItem('organization_id');
        xhr.setRequestHeader('Authorization', token);
        xhr.setRequestHeader('X-organization-id', organizationId);
    });
};
uBilling.prototype = {
    getFormData: function (form) {
        var formData = form.serializeArray();
        var loginFormObject = {};
        $.each(formData,
            function (i, v) {
                loginFormObject[v.name] = v.value;
            });
        return loginFormObject;
    },
    logout: function () {
        localStorage.removeItem('access_token');
        localStorage.removeItem('organization_id');
    },

    login: function (data) {
        var username = data.username;
        var password = data.password;
        var scope = data.scope;
        var deferred = $.Deferred();
        var promise = $.ajax({
            type: "POST",
            url: "/rest/v1/access_token",
            data: 'username=' + username + '&password=' + password + '&scope=' + scope,
            contentType: "application/x-www-form-urlencoded",
            dataType: "json"
        });
        promise.done(function (response) {
            if (response['access_token']) {
                console.log('login success');
                var token = response['access_token'];
                localStorage.setItem("access_token", token);
                deferred.resolve(token);
            } else {
                console.log('login failed');
                localStorage.removeItem("access_token");
                deferred.reject();
            }
        });
        promise.fail(function (request, status, errorThrown) {
            console.log('login failed', errorThrown, request.responseText);
            localStorage.removeItem("access_token");
            deferred.reject();
        });
        promise.always(function () {

        });
        return deferred.promise();
    },
    validateToken: function () {
        console.log('Validating token...');
        var token = localStorage.getItem("access_token");
        var deferred = $.Deferred();
        var promise = $.ajax({
            type: "GET",
            url: "/rest/v1/token_info?access_token=" + token,
            dataType: "json",
            async: false
        });
        promise.done(function (response) {
            console.log('Validating token success');
            deferred.resolve(response);
        });
        promise.fail(function (request, status, errorThrown) {
            console.log('Validating token failed', errorThrown, request.responseText);
            deferred.reject();
        });
        promise.always(function () {

        });
        return deferred.promise();
    }
}
;
uBilling.prototype.constructor = uBilling;