# reqWrapper
ajax wrapper for handling all types of POST (form-encoded,json,multipart) and GET request without jquery

# Installation
```sh
$ bower install reqWrapper
```

# Usage

**GET Request**

`request.get(url, <URL_QUERY_PARAMS>)`

```javascript
request.get('<YOUR_API_URL>', null)
   .success(function(response, xhr){
       console.log(response);
   })
   .error(function(message, xhr){
       console.log(message);
   })
   .always(function(){
       console.log('always');
   }).execute();
```


**POST (form-urlencoded) Request**

`request.post(url, <POST_PARAMS>, <URL_QUERY_PARAMS>)`

```javascript
request.post('<YOUR_API_URL>', {
        "username" : "droidninja",
        "password" : "password"
    }, null)
    .success(function(response, xhr){
        console.log(generateFootfallPerDayJson(response));

    })
    .error(function(message, xhr){
        console.log(message);
    })
    .always(function(){
        console.log('always');
    }).execute();
```


**POST (application/json) Request**

```javascript
request.post('<YOUR_API_URL>', {
        "username" : "droidninja",
        "password" : "password"
    }, null)
    .isJsonType()
    .success(function(response, xhr){
        console.log(generateFootfallPerDayJson(response));

    })
    .error(function(message, xhr){
        console.log(message);
    })
    .always(function(){
        console.log('always');
    }).execute();
```


**POST (multipart-formdata) Request**

```javascript
var fileObj = document.getElementById("myFileField").files[0];

request.post('<YOUR_API_URL>', {
                profilePic: fileObj,
                userId: 9
            }, null)
            .setHeaders({
                "X-Access-Token" : "<SET_HEADERS_IF_ANY>"
            })
            .isMultipartType()
            .success(function(response, xhr){
                console.log(response);
            })
            .error(function(message, xhr){
                console.log(message);
            })
            .always(function(){
                console.log('always');
            }).execute();
```

You can include `setHeaders()` with any type of request to set custom headers.

