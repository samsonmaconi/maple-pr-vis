import { Injectable, EventEmitter } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  dataReady;

  periods = [];
  selectedPeriods = [];
  provinces = [];
  selectedProvinces = [];

  topCountryCount = 20; // top 20
  topCountriesData;
  totalPopulationData;
  genderRatioData;
  ageGroupRatioData;
  qoqPopulationData;

  periodsChanged: EventEmitter<any> = new EventEmitter();
  provincesChanged: EventEmitter<any> = new EventEmitter();
  updateCountriesBarchart: EventEmitter<any> = new EventEmitter();
  updateQoqHorizBarchart: EventEmitter<any> = new EventEmitter();
  updateCanadaMap: EventEmitter<any> = new EventEmitter();

  constructor(private http: HttpClient) {}

  init() {
    this.dataReady = new Promise(async (resolve, reject) => {
      await this.getAvailablePeriods();
      await this.getAvailableProvinces();
      resolve();
    });

    this.totalPopulationData = Observable.create(obs => {
      this.periodsChanged.subscribe(async e => {
        const data = await this.loadTotalPopulationData();
        obs.next(data);
      });

      this.updateCanadaMap.subscribe(async e => {
        const data = await this.loadTotalPopulationData();
        obs.next(data);
      });
    });

    this.topCountriesData = Observable.create(obs => {
      this.periodsChanged.subscribe(async e => {
        const data = await this.loadTopCountriesData();
        obs.next(data);
      });

      this.updateCountriesBarchart.subscribe(async e => {
        const data = await this.loadTopCountriesData();
        obs.next(data);
      });
    });

    this.qoqPopulationData = Observable.create(obs => {
      this.periodsChanged.subscribe(async e => {
        const data = await this.loadQoqPopulationData();
        obs.next(data);
      });

      this.provincesChanged.subscribe(async e => {
        const data = await this.loadQoqPopulationData();
        obs.next(data);
      });

      this.updateQoqHorizBarchart.subscribe(async e => {
        const data = await this.loadQoqPopulationData();
        obs.next(data);
      });
    });

    this.genderRatioData = Observable.create(obs => {
      this.periodsChanged.subscribe(async e => {
        const data = await this.loadGenderRatioData();
        obs.next(data);
      });

      this.provincesChanged.subscribe(async e => {
        const data = await this.loadGenderRatioData();
        obs.next(data);
      });
    });

    this.ageGroupRatioData = Observable.create(obs => {
      this.periodsChanged.subscribe(async e => {
        const data: any = await this.loadAgeGroupRatioData();

        const formattedData = this.formatAgeGroupData(data);

        obs.next([formattedData, data[1]]);
      });

      this.provincesChanged.subscribe(async e => {
        const data = await this.loadAgeGroupRatioData();

        const formattedData = this.formatAgeGroupData(data);

        obs.next([formattedData, data[1]]);
      });
    });
  }

  async getAvailablePeriods() {
    const result: any = await this.http
      .get('/api/byGender/periods')
      .toPromise();

    this.periods = [];
    result.forEach(element => {
      this.periods.push(element._id);
    });

    this.selectedPeriods = this.periods.map(() => '');
  }

  async getAvailableProvinces() {
    const result: any = await this.http
      .get('/api/byGender/provinces')
      .toPromise();

    this.provinces = [];
    result.forEach(element => {
      this.provinces.push(element._id);
    });

    this.selectedProvinces = this.provinces.map(() => '');
  }

  loadTopCountriesData() {
    return this.http
      .get(
        '/api/byCountry/top?periods=' +
          (this.selectedPeriods.join(',').replace(/,/g, '') === ''
            ? this.periods.join(',')
            : this.selectedPeriods.join(',')) +
          '&min_population=1' +
          '&count=' +
          this.topCountryCount
      )
      .toPromise();
  }

  loadQoqPopulationData() {
    return this.http
      .get(
        '/api/byGender/qoqPopulation?periods=' +
          (this.selectedPeriods.join(',').replace(/,/g, '') === ''
            ? this.periods.join(',')
            : this.selectedPeriods.join(',')) +
          '&provinces=' +
          (this.selectedProvinces.join(',').replace(/,/g, '') === ''
            ? this.provinces.join(',')
            : this.selectedProvinces.join(','))
      )
      .toPromise();
  }

  loadTotalPopulationData() {
    return this.http
      .get(
        '/api/byGender/totalPopulation?periods=' +
          (this.selectedPeriods.join(',').replace(/,/g, '') === ''
            ? this.periods.join(',')
            : this.selectedPeriods.join(','))
      )
      .toPromise();
  }

  loadGenderRatioData() {
    return this.http
      .get(
        '/api/byGender/genderPopulation?periods=' +
          (this.selectedPeriods.join(',').replace(/,/g, '') === ''
            ? this.periods.join(',')
            : this.selectedPeriods.join(',')) +
          '&provinces=' +
          (this.selectedProvinces.join(',').replace(/,/g, '') === ''
            ? this.provinces.join(',')
            : this.selectedProvinces.join(','))
      )
      .toPromise();
  }

  loadAgeGroupRatioData() {
    return this.http
      .get(
        '/api/byAgeGroup/ageGroupPopulation?periods=' +
          (this.selectedPeriods.join(',').replace(/,/g, '') === ''
            ? this.periods.join(',')
            : this.selectedPeriods.join(',')) +
          '&provinces=' +
          (this.selectedProvinces.join(',').replace(/,/g, '') === ''
            ? this.provinces.join(',')
            : this.selectedProvinces.join(','))
      )
      .toPromise();
  }

  formatAgeGroupData(data) {
    let formattedData = [];
    const formattedDataTemplate = [
      { axis: 'Ages 0-14', value: 0 },
      { axis: 'Ages 15-29', value: 0 },
      { axis: 'Ages 30-44', value: 0 },
      { axis: 'Ages 45-59', value: 0 },
      { axis: 'Ages 60-74', value: 0 },
      { axis: 'Ages 75+', value: 0 }
    ];

    const totalPopulation = data[1][0].total_population;

    if (totalPopulation > 0) {
      data[0].forEach(d => {
        switch (d._id) {
          case '0 to 14 years old':
            formattedData.push({
              axis: 'Ages 0-14',
              value: d.population / totalPopulation
            });
            break;
          case '15 to 29 years old':
            formattedData.push({
              axis: 'Ages 15-29',
              value: d.population / totalPopulation
            });
            break;
          case '30 to 44 years old':
            formattedData.push({
              axis: 'Ages 30-44',
              value: d.population / totalPopulation
            });
            break;
          case '45 to 59 years old':
            formattedData.push({
              axis: 'Ages 45-59',
              value: d.population / totalPopulation
            });
            break;
          case '60 to 74 years old':
            formattedData.push({
              axis: 'Ages 60-74',
              value: d.population / totalPopulation
            });
            break;
          case '75 years old or more':
            formattedData.push({
              axis: 'Ages 75+',
              value: d.population / totalPopulation
            });
            break;

          default:
            break;
        }
      });
    } else {
      formattedData = formattedDataTemplate;
    }

    formattedData.forEach(a => {
      formattedDataTemplate.forEach(b => {
        if (a.axis === b.axis) {
          b.value = a.value;
        }
      });
    });

    return formattedDataTemplate;
  }
}
