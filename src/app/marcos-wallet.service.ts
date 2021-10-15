import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

interface BitCoinRate {
  time: {
    updated: string;
  };
  bpi: {
    USD: {
      rate_float: number;
    };
    BRL: {
      rate_float: number;
    };
    EUR: {
      rate_float: number;
    };
  };
}

@Injectable()
export class MarcosWalletService {
  constructor(private http: HttpClient) {
    this.updateBitCoinRate();
    setInterval(() => {
      this.updateBitCoinRate();
    }, 60000);
  }

  bitCoinList: Array<BitCoinRate> = [];
  bitCoinListEUR: Array<BitCoinRate> = [];

  dataUSD: number;
  dataBRL: number;
  dataEUR: number;

  saldo: number = 0;

  getSaldo() {
    return this.saldo;
  }

  adicionar(brValue: number) {
    let len = this.bitCoinList.length;
    if (this.bitCoinList.length > 0) {
      let btc = brValue / this.bitCoinList[len - 1].bpi.BRL.rate_float;
      this.saldo += btc;
    }
  }

  remover(brValue: number) {
    let len = this.bitCoinList.length;
    if (this.bitCoinList.length > 0) {
      let btc = brValue / this.bitCoinList[len - 1].bpi.BRL.rate_float;
      this.saldo -= btc;
    }
  }

  getDataBRL() {
    let len = this.bitCoinList.length;
    if (len > 0) {
      return this.saldo * this.bitCoinList[len - 1].bpi.BRL.rate_float;
    } else {
      return 0;
    }
  }

  getDataEUR() {
    let len = this.bitCoinListEUR.length;
    if (len > 0) {
      return this.saldo * this.bitCoinListEUR[len - 1].bpi.EUR.rate_float;
    } else {
      return 0;
    }
  }

  getDataUSD() {
    let len = this.bitCoinList.length;
    if (len > 0) {
      return this.saldo * this.bitCoinList[len - 1].bpi.USD.rate_float;
    } else {
      return 0;
    }
  }

  diffBRL: number = 0;
  diffUSD: number = 0;
  diffEUR: number = 0;

  updateBitCoinRate() {
    this.http
      .get<BitCoinRate>('https://api.coindesk.com/v1/bpi/currentprice/BRL.json')
      .subscribe((data) => {
        if (this.bitCoinList.length > 0) {
          let len = this.bitCoinList.length;
          this.diffBRL =
            data.bpi.BRL.rate_float -
            this.bitCoinList[len - 1].bpi.BRL.rate_float;
          let lenu = this.bitCoinList.length;
          this.diffUSD =
            data.bpi.USD.rate_float -
            this.bitCoinList[lenu - 1].bpi.USD.rate_float;
        }
        this.bitCoinList.push(data);
        this.dataBRL = data.bpi.BRL.rate_float;
        this.dataUSD = data.bpi.USD.rate_float;
      });
    this.http
      .get<BitCoinRate>('https://api.coindesk.com/v1/bpi/currentprice/EUR.json')
      .subscribe((data) => {
        if (this.bitCoinListEUR.length > 0) {
          let len = this.bitCoinListEUR.length;
          this.diffEUR =
            data.bpi.EUR.rate_float -
            this.bitCoinListEUR[len - 1].bpi.EUR.rate_float;
        }
        this.bitCoinListEUR.push(data);
        this.dataEUR = data.bpi.EUR.rate_float;
      });
  }
}
