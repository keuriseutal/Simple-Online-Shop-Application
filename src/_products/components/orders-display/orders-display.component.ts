import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Item } from "../../models/items.model";

@Component({
  selector: 'orders-display',
  templateUrl: './orders-display.component.html',
  styleUrls: ['./orders-display.component.css']
})
export class OrdersDisplayComponent implements OnInit {

  @Input() orders$: Observable<Item[]>;

  constructor() { }

  ngOnInit() {
  }

  getTotal() {
    let orders: Item[];
    this.orders$.subscribe(o => orders = o);
    let productTotal: number = 0;
    for (let i = 0; i < orders.length; ++i) {
      productTotal += orders[i].price * orders[i].quantity;
    }
    
    return productTotal;
  }

}
