'use strict';

const fs = require('fs');
const path = require('path');
const basename = path.basename(__filename);

const guards = {};

fs.readdirSync(__dirname)
    .filter((file: any) => {
        return (
            file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".ts"
        );
    })
    .forEach((file: any) => {
        const guard = require(path.join(__dirname, file));
        if (guard.name) {
            guards[guard.name] = guard;
        }
    });

module.exports = guards;