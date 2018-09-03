import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Observable } from "rxjs";
import { Location } from "@angular/common";
import { Router } from "@angular/router";

import { Product } from "../../models/products.model";
@Component({
  selector: "dashboard-viewer",
  templateUrl: "./dashboard-viewer.component.html",
  styleUrls: ["./dashboard-viewer.component.css"]
})
export class DashboardViewerComponent implements OnInit {
  @Input()
  products: Observable<Product[]>;
  @Output()
  itemViewed = new EventEmitter();
  @Output()
  isItemViewed = new EventEmitter();

  //#region sorting options
  @Output()
  sortBy = new EventEmitter();
  //#endregion

  //#region filtering options
  @Output()
  filterGadget = new EventEmitter();
  @Output()
  filterClothing = new EventEmitter();
  @Output()
  filterMusic = new EventEmitter();
  @Output()
  filterMerchandise = new EventEmitter();
  @Output()
  filterAppliances = new EventEmitter();

  filterByGadget: boolean = true;
  filterByClothing: boolean = true;
  filterByMusic: boolean = true;
  filterByMerchandise: boolean = true;
  filterByAppliances: boolean = true;

  @Output()
  filterMinPrice = new EventEmitter();
  @Output()
  filterMaxPrice = new EventEmitter();

  filterByMinPrice: number = 0;
  filterByMaxPrice: number = 999999;
  //#endregion

  @Input()
  searchInput: string;

  isItemClicked: boolean;

  //actions for setting quantity
  @Output()
  addQuantity = new EventEmitter();
  @Output()
  subtractQuantity = new EventEmitter();

  //actions after add to cart
  @Output()
  selectedProduct = new EventEmitter();
  @Output()
  selectedProductQuantity = new EventEmitter();

  constructor(private location: Location, private router: Router) {}

  ngOnInit() {
   
  }

  add(p: Product) {
    this.addQuantity.emit(p);
  }

  subtract(p: Product) {
    this.subtractQuantity.emit(p);
  }

  onAddToCart(product, quantity) {
    let userOption = window.confirm(
      "You are about to add " + quantity + " " + product.name + " to cart"
    );
    if (userOption) {
      this.selectedProductQuantity.emit(quantity);
      this.selectedProduct.emit(product);
    }
  }

  onSelectItem(product: Product) {
    this.isItemClicked = true;
    this.isItemViewed.emit(this.isItemClicked);

    this.itemViewed.emit(product);
  }

  //#region sorting functions
  onNameAsc() {
    this.sortBy.emit("name_asc");
  }

  onNameDesc() {
    this.sortBy.emit("name_desc");
  }

  onPriceAsc() {
    this.sortBy.emit("price_asc");
  }

  onPriceDesc() {
    this.sortBy.emit("price_desc");
  }
  //#endregion

  //#region filtering price functions
  onFilter() {
    this.filterGadget.emit(this.filterByGadget);
    this.filterClothing.emit(this.filterByClothing);
    this.filterMusic.emit(this.filterByMusic);
    this.filterMerchandise.emit(this.filterByMerchandise);
    this.filterAppliances.emit(this.filterByAppliances);
    this.filterMinPrice.emit(this.filterByMinPrice);
    this.filterMaxPrice.emit(this.filterByMaxPrice);
  }
  //#endregion
}
