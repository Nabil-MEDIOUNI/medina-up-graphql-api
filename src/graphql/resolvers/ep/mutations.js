/* eslint-disable camelcase */
const { toLower } = require('lodash');
const { google } = require('googleapis');

const EP = require('../../../models/ep');
const { getArgumentInput } = require('../../../helpers/workWithObjects');
const { LNSTransporter } = require('../../../helpers/sendEmail');
const { newEP_LNS } = require('../../../helpers/sendEmail/view');

const { client } = require('../../../spreadsheet-api/auth-client');
const { reverseTransform } = require('../../../spreadsheet-api/transformApi');

const gsapi = google.sheets({ version: 'v4', auth: client });

module.exports.EPMutations = {
  createEP: async (_, { ep }) => {
    const newEP = await new EP({
      ...getArgumentInput(ep),
    }).save();

    const OGT1 = ['essted', 'esc', 'ensi', 'ineps', 'isd', 'ipsi'];
    const OGT2 = ['isamm', 'iscae', 'esen', 'flah', 'isbat'];
    const GTProduct = newEP.Product === 'Global Talent' || newEP.Product === 'Global Teacher';

    if (OGT1.includes(ep.EPUniversity) && GTProduct) {
      newEP.Dispatch = 'OGT 1';
    } else if (OGT2.includes(ep.EPUniversity) && GTProduct) {
      newEP.Dispatch = 'OGT 2';
    } else {
      newEP.Dispatch = 'OGV';
    }

    if (getArgumentInput(ep).Is_sign_up === 'booth signup') {
      const lowerEmail = toLower(newEP.EPEmail).replace(/\s/g, '');
      const mailOptions = {
        to: lowerEmail,
        subject: 'Filled out SU Mail',
        html: newEP_LNS(),
      };
      LNSTransporter.sendMail(mailOptions, (error) => {
        if (error) {
          newEP.save();
          console.log(error);
        } else {
          newEP.Sent_lns = 'sent';
          newEP.Status = 'Email_Sent';
          newEP.save();
        }
      });
    } else {
      newEP.Status = 'Not_Contacted';
      newEP.Sent_lns = 'not sent';
      newEP.save();
    }

    return newEP;
  },

  ExportEPSToSheet: async () => {
    const allEPS = await EP.find({});
    const resource = {
      values: reverseTransform(allEPS),
    };
    gsapi.spreadsheets.values.update({
      spreadsheetId: '1uczmCvjP6GedyMFW30sOMtgLhywghiNCjiD39tY5loo',
      range: 'Feuille 1!A1:Z1000',
      valueInputOption: 'USER_ENTERED',
      resource,
    }, (err, result) => {
      if (err) {
        // Handle error
        console.log(err);
      } else {
        console.log('%d cells updated.', result.updatedCells);
      }
    });

    return allEPS;
  },

  updateEP: async (_, { id, ep }) => {
    const getEP = await EP.findById(id);

    const OGT1 = ['essted', 'esc', 'ensi', 'ineps', 'isd', 'ipsi'];
    const OGT2 = ['isamm', 'iscae', 'esen', 'flah', 'isbat'];
    const GTProduct = getArgumentInput(ep).Product === 'Global Talent' || getArgumentInput(ep).Product === 'Global Teacher';

    if (OGT1.includes(getArgumentInput(ep).EPUniversity) && GTProduct) {
      getEP.Dispatch = 'OGT 1';
    } else if (OGT2.includes(ep.EPUniversity) && GTProduct) {
      getEP.Dispatch = 'OGT 2';
    } else {
      getEP.Dispatch = 'OGV';
    }
    getEP.save();

    EP.findByIdAndUpdate(
      id,
      {
        $set: {
          ...getArgumentInput(ep),
        },
      },
      { new: true },
    ).exec(async (err) => {
      if (err) throw new Error(err);
    });
    return EP.findById(id);
  },

  setEPManager: async (_, { id, personID }) => {
    const findEP = await EP.findById(id).populate('EPManager');
    findEP.EPManager = personID;
    findEP.save();

    return findEP;
  },

  setTeamResponsible: async (_, { id, personID }) => {
    const findEP = await EP.findById(id).populate('TeamResponsible');
    findEP.TeamResponsible = personID;
    findEP.save();

    return findEP;
  },

  setMultipleManagers: async (_, { ids, manager, teamResponsible }) => {
    for (let i = 0; i < ids.length; i++) {
      const getNotification = await EP.findById(ids[i]);
      if (manager) {
        getNotification.EPManager = manager;
      }
      if (teamResponsible) {
        getNotification.TeamResponsible = teamResponsible;
      }
      getNotification.save();
    }
    return EP.find({});
  },

  deleteEP: async (_, { id }) => {
    const deletedEP = await EP.findByIdAndDelete(id);

    if (!deletedEP) {
      throw new Error('EP does not exist!');
    }

    return deletedEP;
  },

  deleteMultipleEPs: async (_, { ids }) => {
    await EP.deleteMany(
      {
        _id: {
          $in: ids,
        },
      },
      (err, result) => {
        if (err) {
          console.log(err);
        } else {
          console.log(result);
        }
      },
    );

    return EP.find({}).populate('EPManager').populate('TeamResponsible');
  },

};
