'use strict';

const i18n = require('i18n');
const path = require('path');

i18n.configure({
  locales: ['en', 'es'],
  directory: path.join(__dirname, '..', 'locales'),
  defaultLocale: 'en',
  autoReload: true, // watch for changes in JSON files to reload locale on updates - defaults to false
  syncFiles: true, // sync locale information across all files - defaults to false
  header: 'accept-language' || 'Accept-Language',
  queryParameter: 'lang',
});

// por si usamos i18n en scripts
i18n.setLocale('en');

module.exports = i18n;
