exports.unnecessaryData = (data, string) => data.then((res) => res.filter((o) => !Object.keys(o).some((k) => o[k].includes(string))));

exports.objectIsEmpty = (args) => Object.keys(args).length === 0 && args.constructor === Object;

exports.getArgumentInput = (inputName) => JSON.parse(JSON.stringify(inputName, null, 2));
