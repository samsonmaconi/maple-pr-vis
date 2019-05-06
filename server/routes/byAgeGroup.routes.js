const express = require('express');
const router = express.Router();
const admissionsByDestProv_agegrp = require('../models/admissionsByDestProv_agegrp');

router.get('/ageGroupPopulation', async (req, res) => {
  let periods = req.query.periods.split(',');
  let provinces = req.query.provinces.split(',');
  let data = await admissionsByDestProv_agegrp.aggregate([
    {
      $addFields: {
        PERIOD: {
          $concat: [
            {
              $toString: '$EN_YEAR'
            },
            '-',
            '$EN_QUARTER'
          ]
        }
      }
    },
    {
      $match: {
        PERIOD: {
          $in: periods
        },
        EN_PROVINCE_TERRITORY: {
          $in: provinces
        }
      }
    },
    {
      $group: {
        _id: '$EN_AGE',
        population: {
          $sum: '$TOTAL'
        }
      }
    },
    {
      $sort: {
        _id: 1
      }
    }
  ]);

  let metadata = await admissionsByDestProv_agegrp.aggregate([
    {
      $addFields: {
        PERIOD: {
          $concat: [
            {
              $toString: '$EN_YEAR'
            },
            '-',
            '$EN_QUARTER'
          ]
        }
      }
    },
    {
      $match: {
        PERIOD: {
          $in: periods
        },
        EN_PROVINCE_TERRITORY: {
          $in: provinces
        }
      }
    },
    {
      $group: {
        _id: '$EN_AGE',
        population: {
          $sum: '$TOTAL'
        }
      }
    },
    {
      $sort: {
        _id: 1
      }
    },
    {
      $group: {
        _id: 'metadata',
        total_population: {
          $sum: '$population'
        }
      }
    }
  ]);

  res.send([data, metadata]);
});

module.exports = router;
