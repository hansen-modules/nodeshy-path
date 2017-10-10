exports.options = {
  path: process.env.PATH.split(';'),
  exts: process.env.PATHEXT.toLowerCase().split(';'),
  
  /**
   * Remove file extensions when appending to scope.
   * @type {Boolean}
   */
  trimFileExtensions: true,

  /**
   * Convert file name alias to lowercase.
   * @type {Boolean}
   */
  lowercaseFileNames: true,

  /**
   * Can be a function taking a string and returning the file name alias,
   * or `false` to use default settings.
   * 
   * @type {Function|falsey}
   */
  fileNameFunction: false,

};

function loadPath(_options = {}) {
  const scope = {};
  const options = Object.assign({}, expots.options, _options);
  
  for (let entry of options.path) {
    try {
      const files = fs.readdirSync(entry);
      for (let file of files) {
        file = file.toLowerCase();
        if (options.exts.some(e => file.endsWith(e))) { // jshint ignore:line
          addToPath(scope, entry, file, options);
          console.log(file);
        }
      }
    } catch (e) {}
  }
  return scope;
}

/**
 * add specific
 */
function addToPath(scope, path, file, options) {
  let realPath = path + separator + file;

  if (options.fileNameFunction) {
    file = options.fileNameFunction(file);
  } else {
    if (options.trimFileExtensions) {
      file = file.substring(0, file.lastIndexOf('.'));
    }
    if (options.lowercaseFileNames) {
      file = file.toLowerCase();
    }
  }

  // due to how path's order works (left-to-right, first takes precedence)
  // we should not replace if it appears twice.
  if (!(file in scope)) {
    scope[file] = makePathFunc(realPath);
  }
}