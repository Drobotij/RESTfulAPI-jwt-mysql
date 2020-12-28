const express = require('express');
const morgan = require('morgan');
const pkg = require('../package.json');
const crearRoles = require('./libs/InitialSetup')
const app = express();
crearRoles();

app.use(morgan('dev'));
app.use(express.json());
app.set('port', process.env.PORT || 3000);
app.set('pkg', pkg);

app.get('/', (req, res) => {
    res.json({
        name: app.get('pkg').name,
        author: app.get('pkg').author,
        description: app.get('pkg').description,
        version: app.get('pkg').version
    })
});


app.use('/api/products', require('./routes/products.routes'));
app.use('/api/auth', require('./routes/auth.routes'));
//app.use(require('./routes/user.routes'));


module.exports = app;