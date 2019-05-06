const express = require('express');
const router = express.Router();
const admissionsByCountryOfCitiz = require('../models/admissionsByCountryOfCitiz');

router.get('/', async (req, res) => {
  let data = await admissionsByCountryOfCitiz.aggregate([
    {
      $group: {
        _id: '$EN_COUNTRY_OF_CITIZENSHIP'
      }
    }
  ]);

  count = await admissionsByCountryOfCitiz.aggregate([
    {
      $group: {
        _id: '$EN_COUNTRY_OF_CITIZENSHIP'
      }
    }
  ]);
  res.send(data);
  console.log('/api/admissionsByCountryOfCitiz' + ' response sent');
});

router.get('/top', async (req, res) => {
  let periods = req.query.periods.split(',');
  let data = await admissionsByCountryOfCitiz.aggregate([
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
        }
      }
    },
    {
      $group: {
        _id: '$EN_COUNTRY_OF_CITIZENSHIP',
        population: {
          $sum: '$TOTAL'
        }
      }
    },
    {
      $project: {
        _id: 0,
        country: '$_id',
        population: 1
      }
    },
    {
      $match: {
        population: {
          $gte: +req.query.min_population
        }
      }
    },
    {
      $sort: {
        population: -1
      }
    },
    {
      $limit: +req.query.count
    }
  ]);

  let metadata = await admissionsByCountryOfCitiz.aggregate([
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
        }
      }
    },
    {
      $group: {
        _id: '$EN_COUNTRY_OF_CITIZENSHIP',
        population: {
          $sum: '$TOTAL'
        }
      }
    },
    {
      $match: {
        population: {
          $gte: +req.query.min_population
        }
      }
    },
    {
      $group: {
        _id: 'metadata',
        populationTotal: {
          $sum: '$population'
        },
        populationMin: {
          $min: '$population'
        },
        populationMax: {
          $max: '$population'
        },
        countriesCount: {
          $sum: 1
        }
      }
    }
  ]);

  res.send([data, metadata[0]]);
});

module.exports = router;
