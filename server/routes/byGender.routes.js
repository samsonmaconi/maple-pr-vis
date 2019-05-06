const express = require('express');
const router = express.Router();
const admissionsByDestProv_gender = require('../models/admissionsByDestProv_gender');

router.get('/periods', async (req, res) => {
  console.log(req.query);
  let data = await admissionsByDestProv_gender.aggregate([
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
      $group: {
        _id: '$PERIOD'
      }
    },
    {
      $sort: {
        _id: 1
      }
    }
  ]);

  res.send(data);
});

router.get('/provinces', async (req, res) => {
  console.log(req.query);
  let data = await admissionsByDestProv_gender.aggregate([
    {
      $group: {
        _id: '$EN_PROVINCE_TERRITORY'
      }
    },
    {
      $match: {
        $expr: { $ne: ['Province/territory not stated', '$_id'] }
      }
    },
    {
      $sort: {
        _id: 1
      }
    }
  ]);

  res.send(data);
});

router.get('/genderPopulation', async (req, res) => {
  let periods = req.query.periods.split(',');
  let provinces = req.query.provinces.split(',');
  let data = await admissionsByDestProv_gender.aggregate([
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
        _id: {
          province: '$EN_PROVINCE_TERRITORY',
          gender: '$EN_GENDER'
        },
        population: {
          $sum: '$TOTAL'
        }
      }
    },
    {
      $sort: {
        '_id.province': 1,
        '_id.gender': 1
      }
    }
  ]);

  let metadata = await admissionsByDestProv_gender.aggregate([
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
        _id: {
          province: '$EN_PROVINCE_TERRITORY',
          gender: '$EN_GENDER'
        },
        population: {
          $sum: '$TOTAL'
        }
      }
    },
    {
      $sort: {
        '_id.province': 1,
        '_id.gender': 1
      }
    },
    {
      $group: {
        _id: '$_id.gender',
        populationTotal: {
          $sum: '$population'
        }
      }
    }
  ]);

  res.send([data, metadata]);
});

router.get('/totalPopulation', async (req, res) => {
  let periods = req.query.periods.split(',');
  let data = await admissionsByDestProv_gender.aggregate([
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
        _id: '$EN_PROVINCE_TERRITORY',
        population: {
          $sum: '$TOTAL'
        }
      }
    },
    {
      $match: {
        $expr: { $ne: ['Province/territory not stated', '$_id'] }
      }
    },
    {
      $project: {
        _id: 0,
        province: '$_id',
        population: 1
      }
    },
    {
      $sort: {
        province: 1
      }
    }
  ]);

  let metadata = await admissionsByDestProv_gender.aggregate([
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
        _id: '$EN_PROVINCE_TERRITORY',
        population: {
          $sum: '$TOTAL'
        }
      }
    },
    {
      $match: {
        $expr: { $ne: ['Province/territory not stated', '$_id'] }
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
        provincesCount: {
          $sum: 1
        }
      }
    }
  ]);

  res.send([data, metadata[0]]);
});

router.get('/qoqPopulation', async (req, res) => {
  let periods = req.query.periods.split(',');
  let provinces = req.query.provinces.split(',');
  let data = await admissionsByDestProv_gender.aggregate([
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
        _id: {
          year: '$EN_YEAR',
          quarter: '$EN_QUARTER'
        },
        population: {
          $sum: '$TOTAL'
        }
      }
    },
    {
      $group: {
        _id: '$_id.year',
        data: {
          $push: {
            k: '$_id.quarter',
            v: '$population'
          }
        },
        total: {
          $sum: '$population'
        }
      }
    },
    {
      $project: {
        _id: 0,
        year: '$_id',
        quarter: {
          $arrayToObject: '$data'
        },
        total: 1
      }
    },
    {
      $sort: {
        year: 1
      }
    }
  ]);

  let metadata = await admissionsByDestProv_gender.aggregate([
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
        _id: {
          year: '$EN_YEAR',
          quarter: '$EN_QUARTER'
        },
        population: {
          $sum: '$TOTAL'
        }
      }
    },
    {
      $group: {
        _id: '$_id.year',
        data: {
          $push: {
            k: '$_id.quarter',
            v: '$population'
          }
        },
        total: {
          $sum: '$population'
        }
      }
    },
    {
      $project: {
        _id: 0,
        year: '$_id',
        quarter: {
          $arrayToObject: '$data'
        },
        total: 1
      }
    },
    {
      $sort: {
        year: 1
      }
    },
    {
      $group: {
        _id: 'metadata',
        populationTotal: {
          $sum: '$total'
        },
        populationMin: {
          $min: '$total'
        },
        populationMax: {
          $max: '$total'
        },
        yearsCount: {
          $sum: 1
        }
      }
    }
  ]);

  res.send([data, metadata[0]]);
});

module.exports = router;
