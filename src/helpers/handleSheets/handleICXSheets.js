/* eslint-disable camelcase */
const { googleSheetRun } = require('../../spreadsheet-api/generateApi');

exports.SwitchICXSheets = (function_short_name) => {
  switch (function_short_name) {
    //* ******************ogt_1_corner********************//
    case 'IGV':
      return googleSheetRun(
        '1o_v_3wlZu1TWVwKQQN2EbpnHZXK1e2GapYM7OLEs6AI',
        'iGV EP Tracker',
      ).then((res) => res);

    case 'IGT':
      return googleSheetRun(
        '12LJ6HVv-cGRGPLVzRoSw93IANWDhMV8VK2U3lBptUu0',
        'iGTa EP Tracker',
      ).then((res) => res);

    default:
      break;
  }
};

exports.ConcatICXSheets = async () => {
  const igv = await googleSheetRun(
    '1o_v_3wlZu1TWVwKQQN2EbpnHZXK1e2GapYM7OLEs6AI',
    'iGV EP Tracker',
  );
  const igt = await googleSheetRun(
    '12LJ6HVv-cGRGPLVzRoSw93IANWDhMV8VK2U3lBptUu0',
    'iGTa EP Tracker',
  );

  return igv.concat(igt).filter((ep) => ep.EPName);
};
