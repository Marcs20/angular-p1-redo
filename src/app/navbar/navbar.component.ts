import { Component, OnInit } from '@angular/core';
import { MarcosWalletService } from '../marcos-wallet.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(public BitCoin: MarcosWalletService) {}

  ngOnInit() {}
}
