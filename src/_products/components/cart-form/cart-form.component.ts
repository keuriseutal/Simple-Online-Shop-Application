import { Component, OnInit, Input, Output, EventEmitter, TemplateRef } from "@angular/core";
import { Location } from "@angular/common";
import { Observable } from "rxjs";
import { Item } from "../../models/items.model";
//bootstrap
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal/bs-modal-ref.service';
import { Product } from "../../models/products.model";
@Component({
  selector: "cart-form",
  templateUrl: "./cart-form.component.html",
  styleUrls: ["./cart-form.component.css"]
})
export class CartFormComponent implements OnInit {
  modalRef: BsModalRef;


  @Input()
  cart$: Observable<Item[]>;
  @Output()
  removedProduct = new EventEmitter();
  @Output()
  cartTotal = new EventEmitter();
  @Output()
  item = new EventEmitter();
  @Output()
  quantity = new EventEmitter();
  @Output()
  checkOut = new EventEmitter();
  @Output()
  submitCart = new EventEmitter();
  cart: Item[];

  isCheckOut: boolean = false;

  pName: string;
  pImg: string;
  pPrice: number
  pCategory: string;
  pDetails: string;
  constructor(private modalService: BsModalService,private location: Location) {}

  ngOnInit() {
    this.cart$.subscribe(c => (this.cart = c));
  }

  openModal(template: TemplateRef<any>, product: Product) {
    this.modalRef = this.modalService.show(template);
    this.pName = product.name;
    this.pImg = product.img;
    this.pPrice = product.price;
    this.pCategory = product.category;
    this.pDetails = product.details;
  }

  onGoBack() {
    this.location.back();
  }

  getTotal() {
    let productTotal: number = 0;
    for (let i = 0; i < this.cart.length; ++i) {
      productTotal += this.cart[i].price * this.cart[i].quantity;
    }
    this.cartTotal.emit(productTotal);

    return productTotal;
  }

  onRemoveFromCart(product) {
    let userOption = window.confirm(
      "You are about to remove " + product.name + " from cart"
    );
    if (userOption) {
      this.removedProduct.emit(product);
    }
  }

  updateProductQuantity(item, quantity){
    this.item.emit(item);
    this.quantity.emit(quantity);
    this.getTotal();
  }

  onCheckOut() {
    //update total
    let userOption = window.confirm("You are about to check out");
    if (userOption) {
      this.isCheckOut = true;
      this.checkOut.emit();
      this.getTotal();
    }
  }

  onSubmit() {
    this.isCheckOut = false;
    let userOption = window.confirm("You are about to submit your order");
    if(userOption){
      this.submitCart.emit();
    }
  }
}
