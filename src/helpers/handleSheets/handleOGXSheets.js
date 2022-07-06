/* eslint-disable camelcase */
const { toLower } = require('lodash');
const { googleSheetRun } = require('../../spreadsheet-api/generateApi');

exports.SwitchTLsSheets = (TLFullName) => {
  switch (toLower(TLFullName).replace(/\s/g, '')) {
    //* ******************ogt_1_corner********************//
    case 'hamzaboubaker':
      return googleSheetRun(
        '1kzRlcYRy6p6u0amJyv773k8d75q1auyv7aYpNibYt3M',
        'Team Hamza boubaker',
      ).then((res) => res);
    case 'youssefgaras':
      return googleSheetRun(
        '1Xcsu2GzHDX7xeeZy-IZDIKzCnjlJrqyi8tNS641l-lg',
        'Team Youssef garas',
      ).then((res) => res);
      //* ******************ogt_1_corner********************//

    //* ******************ogt_2_corner********************//
    case 'eyabey':
      return googleSheetRun(
        '11eMo49wlk9JjwmnIq_Nh3D2KHQVXm4Le_7bdHi5CLz4',
        'Team Eya Bey',
      ).then((res) => res);
    case 'chaymachhidi':
      return googleSheetRun(
        '15Cf4IGYVHEeoGOuXqt4NdPFU1a-ddI8HFA2vtDtv0f8',
        'Team Chayma Chhidi',
      ).then((res) => res);
    case 'chaimadridi':
      return googleSheetRun(
        '1f1hQK5iwWISMNsNWOpRh-E1IlzqEwu6bnQH0wF4X5Ow',
        'Team Chaima dridi',
      ).then((res) => res);
      //* ******************ogt_2_corner********************//

    //* ******************ogv_corner********************//
    case 'imenmeimri':
      return googleSheetRun(
        '16vdAJImftbyUhLfcLwh0_JDvj-KqVgKGpP87u2mZ2lo',
        'Team Imen Meimri',
      ).then((res) => res);
    case 'inesnakhli':
      return googleSheetRun(
        '15a91XT1R2NyOc5nZvWCQD0vwYZL9sVmbEPAbUAjspcs',
        'Team Ines Nakhli',
      ).then((res) => res);
    case 'mariemdridi':
      return googleSheetRun(
        '15YzrtKY_YtBAdxVMq0ZtRhftk5uZX4SXgfBaTbY0_jo',
        'Team Mariem Dridi',
      ).then((res) => res);
    case 'ghadabousnina':
      return googleSheetRun(
        '1Ews-2iKNSj0f6OYXZTFa4L3-lxNFc3-DFKEXsahe3nE',
        'Team Ghada Bousnina',
      ).then((res) => res);
    case 'ferielsahbi':
      return googleSheetRun(
        '1qzfg5JWUDqSmdAEMZxNL4oK2y3E18hQBsKwjsBxv3nU',
        'Team Feriel Sahbi',
      ).then((res) => res);
    //* ******************ogv_corner********************//
    default:
      break;
  }
};

exports.SwitchDepartmentsSheets = (product) => {
  switch (product) {
    //* ******************ogt_1_corner********************//
    case 'OGT_1':
      return googleSheetRun(
        '1XwizCk37LONpjuTGXMKXwOcEw6R1Z2kevzZt-FMnGL8',
        'oGT 1 CORNER',
      ).then((res) => res.filter(({ TeamResponsible }) => !TeamResponsible));
      //* ******************ogt_1_corner********************//

    //* ******************ogt_2_corner********************//
    case 'OGT_2':
      return googleSheetRun(
        '1tLEPNIDYUbKoANZo2WyIG6GFscqqVPwpcCoTrd65o3U',
        'oGT 2 CORNER',
      ).then((res) => res.filter(({ TeamResponsible }) => !TeamResponsible));
      //* ******************ogt_2_corner********************//

    //* ******************ogv_1_corner********************//
    case 'OGV':
      return googleSheetRun(
        '1l0NYtyYJJB9z1emAahQDaa1ASnRCslXkOSSkOC98Qzg',
        'oGV Corner',
      ).then((res) => res.filter(({ TeamResponsible }) => !TeamResponsible));
      //* ******************ogv_1_corner********************//

    default:
      break;
  }
};

exports.ConcatTLsSheets = (product) => {
  if (product === 'OGT_1') {
    return googleSheetRun(
      '1kzRlcYRy6p6u0amJyv773k8d75q1auyv7aYpNibYt3M',
      'Team Hamza boubaker',
    ).then(async (res) => res.concat(
      await googleSheetRun(
        '1Xcsu2GzHDX7xeeZy-IZDIKzCnjlJrqyi8tNS641l-lg',
        'Team Youssef garas',
      ),
    ));
  }
  if (product === 'OGT_2') {
    return googleSheetRun(
      '11eMo49wlk9JjwmnIq_Nh3D2KHQVXm4Le_7bdHi5CLz4',
      'Team Eya Bey',
    ).then(async (res) => res.concat(
      await googleSheetRun(
        '15Cf4IGYVHEeoGOuXqt4NdPFU1a-ddI8HFA2vtDtv0f8',
        'Team Chayma Chhidi',
      ),
      await googleSheetRun(
        '1f1hQK5iwWISMNsNWOpRh-E1IlzqEwu6bnQH0wF4X5Ow',
        'Team Chaima dridi',
      ),
    ));
  }
  if (product === 'OGV') {
    return googleSheetRun(
      '1qzfg5JWUDqSmdAEMZxNL4oK2y3E18hQBsKwjsBxv3nU',
      'Team Feriel Sahbi',
    ).then(async (res) => res.concat(
      await googleSheetRun(
        '1Ews-2iKNSj0f6OYXZTFa4L3-lxNFc3-DFKEXsahe3nE',
        'Team Ghada Bousnina',
      ),
      await googleSheetRun(
        '16vdAJImftbyUhLfcLwh0_JDvj-KqVgKGpP87u2mZ2lo',
        'Team Imen Meimri',
      ),
      await googleSheetRun(
        '15a91XT1R2NyOc5nZvWCQD0vwYZL9sVmbEPAbUAjspcs',
        'Team Ines Nakhli',
      ),
      await googleSheetRun(
        '15YzrtKY_YtBAdxVMq0ZtRhftk5uZX4SXgfBaTbY0_jo',
        'Team Mariem Dridi',
      ),
    ));
  }
};
