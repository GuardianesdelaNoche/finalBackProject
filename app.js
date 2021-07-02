const express = require('express')
const app = express()
const port = 3000
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');


/**
 * API URL
 */

app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.use('/api-doc',            swaggerUi.serve, swaggerUi.setup(swaggerDocument));



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {

  // validation error
  if(err.array) {
    const errorInfo = err.array({onlyFirstError: true})[0];
    err.message = `Not valid - ${errorInfo.param} ${errorInfo.msg}`;
    err.status = 422;
  }
  

  res.status(err.status || 500);
   
;  if(isApiRequest(req))
  {
    return res.json ({error: err.message});
  }

  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.render('error');

});

function isApiRequest(req){
  
  return req.originalUrl.indexOf('/api/') === 0 ;
}


module.exports = app;

