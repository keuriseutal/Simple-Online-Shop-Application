import { Component, OnInit, ChangeDetectionStrategy } from "@angular/core";

import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import * as fromStore from "../../store";
import * as fromUserStore from "../../../_users/store";

import { Product } from "../../models/products.model";
import { Item } from "../../models/items.model";

import { User } from "../../../_users/models/users.model";
import { Comment } from "../../models/comments.model";

@Component({
  selector: "dashboard",
  templateUrl: "./dashboard.component.html",
  styleUrls: ["./dashboard.component.css"]
})
export class DashboardComponent implements OnInit {
  products$: Observable<Product[]>;
  //#region for dashboard-viewer
  //sorting
  sort: string = "name_asc";
  //filtering
  orderByGadget: boolean = true;
  orderByClothing: boolean = true;
  orderByMusic: boolean = true;
  orderByMerchandise: boolean = true;
  orderByAppliances: boolean = true;
  orderByMinPrice: number = 0;
  orderByMaxPrice: number = 999999;
  //#endregion
  searchInput: string = "";

  //#region for product-viewer
  comments$: Observable<Comment[]>;

  product: Product;
  isItemViewed: boolean;

  comment: Comment;
  viewedProduct: Product;
  loggedUser: User = JSON.parse(localStorage.getItem("loggedUser"));

  date: string;
  //#endregion

  quantity: number;

  cart$: Observable<Item[]>;
  cart: Item[];
  constructor(
    private store: Store<fromStore.ProductsState>,
    private userStore: Store<fromUserStore.UsersState>,
    private cartStore: Store<fromStore.CartsState>
  ) {}

  ngOnInit() {
    this.getProducts();
  }

  setAsLoggedOut(event) {
    let user = this.loggedUser;
    user.isLoggedIn = false;
    this.store.dispatch(new fromUserStore.UpdateUser(user));

    console.log("logged Out: " + user["uname"] + user["isLoggedIn"]);
    localStorage.removeItem("loggedUser");
  }

  onSearchInput(event: string) {
    this.searchInput = event;
    console.log(this.searchInput);
    this.getProducts();
  }

  addQuantity(product: Product) {
    let newProduct: Product = {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      img: product.img,
      quantity: product.quantity + 1,
      stock: product.stock,
      status: product.status,
      details: product.details
    };

    this.store.dispatch(new fromStore.UpdateProduct(newProduct)); 
  }

  subtractQuantity(product: Product) {
    let newProduct: Product = {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      img: product.img,
      quantity: product.quantity - 1,
      stock: product.stock,
      status: product.status,
      details: product.details
    };

    this.store.dispatch(new fromStore.UpdateProduct(newProduct));
  }

  getSelectedProductQuantity(event: number) {
    this.quantity = event;
  }

  addToCart(event: Product) {
    this.cart$ = this.cartStore
      .select(fromStore.getAllCart)
      .pipe(map(cart => cart.filter(c => this.loggedUser["id"] == c.userId)));
    this.cartStore.dispatch(new fromStore.GetCart());

    let product: Product = JSON.parse(JSON.stringify(event));

    //update product stock quantity
    //product.stock -= this.quantity * 1;
    product.quantity = this.quantity * 1;
    //if(product.stock == 0){
    //  product.status = "Sold Out";
    //}
    this.store.dispatch(new fromStore.UpdateProduct(product));

    //add product to cart
    //-----get cart of current user
    this.cart$.subscribe(c => (this.cart = c));
    
    if (this.cart.length == 0) {
      let newCart: Item = {
        id: parseInt(this.loggedUser["id"].toString() + product.id.toString()),
        total: this.quantity * product.price,
        userId: this.loggedUser["id"],
        name: product.name,
        price: product.price,
        category: product.category,
        img: product.img,
        quantity: product.quantity,
        stock: product.stock,
        status: "In Cart",
        details: product.details
      };
      this.cartStore.dispatch(new fromStore.AddProductToCart(newCart));
    }
    for (let i = 0; i < this.cart.length; i++) {
      if (
        this.cart[i].id ==
        parseInt(this.loggedUser["id"].toString() + product.id.toString())
      ) {
        //update quantity of product if it already exists in cart
        product.quantity == this.cart[i].quantity + this.quantity * 1;
        let newCart: Item = {
          id: this.cart[i].id,
          total: this.cart[i].total + this.quantity * product.price,
          userId: this.loggedUser["id"],
          name: this.cart[i].name,
          price: this.cart[i].price,
          category: this.cart[i].category,
          img: this.cart[i].img,
          quantity: this.cart[i].quantity + product.quantity,
          stock: this.cart[i].stock,
          status: this.cart[i].status,
          details: this.cart[i].details
        };

        this.cartStore.dispatch(new fromStore.UpdateProductInCart(newCart));
      } //end if product already exists in user's cart
      else if (
        this.cart[i].id !=
        parseInt(this.loggedUser["id"].toString() + product.id.toString())
      ) {
        
        let newCart: Item = {
          id: parseInt(
            this.loggedUser["id"].toString() + product.id.toString()
          ),
          total: this.cart[i].total + this.quantity * product.price,
          userId: this.loggedUser["id"],
          name: product.name,
          price: product.price,
          category: product.category,
          img: product.img,
          quantity: product.quantity,
          stock: product.stock,
          status: "In Cart",
          details: product.details
        };
        this.cartStore.dispatch(new fromStore.AddProductToCart(newCart));
      } //end if product does not exist in user's cart
    } //end LOOP
    window.alert(
      this.quantity + " " + product.name + " was successfully added to cart"
    );
  }

  getProducts() {
    //console.log(this.searchInput);
    switch (this.sort) {
      case "name_asc":
        //#region filter if name_asc
        //filter by everything
        if (
          this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        p.category == "Merchandise" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything except appliances
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        p.category == "Merchandise" ||
                        (p.category == "Music" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filter by everything except appliances and clothing
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Gadget" ||
                        p.category == "Merchandise" ||
                        (p.category == "Music" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filer by everything  except appliances and gadget
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Merchandise" ||
                        (p.category == "Music" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filter by everything  except appliances and clothing
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Merchandise" ||
                        p.category == "Gadget" ||
                        (p.category == "Music" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filter by everything  except appliances and merch
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        (p.category == "Music" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filter by everything  except gadget and music
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Appliances" ||
                        (p.category == "Merchandise" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filer by everything  except appliances and music
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        (p.category == "Merchandise" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filer by everything  except clothing and merch
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Gadget" ||
                        (p.category == "Music" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filer by everything  except music and merch
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Gadget" ||
                        (p.category == "Clothing" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filer by everything  except clothing and music
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Gadget" ||
                        (p.category == "Merchandise" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filer by everything  except gadget and merch
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Music" ||
                        (p.category == "Clothing" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filter by everything  except music and clothing and gadget
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Merchandise" ||
                        (p.category == "Appliances" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filter by everything  except music and merch and gadget
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        (p.category == "Appliances" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filter by everything  except music and clothing and merch
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Gadget" ||
                        (p.category == "Appliances" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filter by everything  except music and merchandise and gadget
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        (p.category == "Appliances" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filter by everything  except appliances and clothing and gadget
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Merchandise" ||
                        (p.category == "Music" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filter by everything  except appliances and clothing and merch
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Gadget" ||
                        (p.category == "Music" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filter by everything except appliances and clothing and music
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Gadget" ||
                        (p.category == "Merchandise" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filter by everything except gadget and clothing and merch
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Music" ||
                        (p.category == "Appliances" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filter by everything  except appliances and gadget and merch
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        (p.category == "Music" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filter by everything   except appliances and gadget and music
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        (p.category == "Merchandise" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filter by everything  except appliances and merch and music
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        (p.category == "Gadget" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filter by everything except clothing
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Gadget" ||
                        p.category == "Merchandise" ||
                        (p.category == "Music" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filter by everything except gadget
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Clothing" ||
                        p.category == "Merchandise" ||
                        (p.category == "Music" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filter by everything excpet merch
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        (p.category == "Music" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filter by everything except music
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        (p.category == "Merchandise" &&
                          p.name.includes(this.searchInput)))
                  )
              )
            );

          //filter by appliances
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == "Appliances" &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by clothing
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == "Clothing" &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by gadget
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == "Gadget" &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by merch
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == "Merchandise" &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by music
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == "Music" &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //no category filter
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == null &&
                      p.name.includes(this.searchInput)
                  )
              )
            );
        }
        //#endregion
        break;

      case "name_desc":
        //#region filter if name_desc
        //filter by everything
        if (
          this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        p.category == "Merchandise" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything except appliances
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        p.category == "Merchandise" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything except appliances and clothing
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Gadget" ||
                        p.category == "Merchandise" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filer by everything  except appliances and gadget
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Merchandise" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except appliances and clothing
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Merchandise" ||
                        p.category == "Gadget" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except appliances and merch
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except gadget and music
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Appliances" ||
                        p.category == "Merchandise") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filer by everything  except appliances and music
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        p.category == "Merchandise") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filer by everything  except clothing and merch
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Gadget" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filer by everything  except music and merch
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Gadget" ||
                        p.category == "Clothing") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filer by everything  except clothing and music
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Gadget" ||
                        p.category == "Merchandise") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filer by everything  except gadget and merch
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Music" ||
                        p.category == "Clothing") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except music and clothing and gadget
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Merchandise" ||
                        p.category == "Appliances") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except music and merch and gadget
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Appliances") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except music and clothing and merch
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Gadget" || p.category == "Appliances") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except music and merchandise and gadget
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Appliances") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except appliances and clothing and gadget
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Merchandise" || p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except appliances and clothing and merch
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Gadget" || p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything except appliances and clothing and music
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Gadget" || p.category == "Merchandise") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything except gadget and clothing and merch
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Music" || p.category == "Appliances") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except appliances and gadget and merch
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" || p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything   except appliances and gadget and music
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Merchandise") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except appliances and merch and music
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" || p.category == "Gadget") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything except clothing
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Gadget" ||
                        p.category == "Merchandise" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything except gadget
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Clothing" ||
                        p.category == "Merchandise" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything excpet merch
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything except music
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        p.category == "Merchandise") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by appliances
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == "Appliances" &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by clothing
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == "Clothing" &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by gadget
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == "Gadget" &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by merch
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == "Merchandise" &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by music
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == "Music" &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //no category filter
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByNameDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == null &&
                      p.name.includes(this.searchInput)
                  )
              )
            );
        }
        //#endregion
        break;

      case "price_asc":
        //#region filter if price_asc
        //filter by everything
        if (
          this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        p.category == "Merchandise" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything except appliances
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        p.category == "Merchandise" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything except appliances and clothing
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Gadget" ||
                        p.category == "Merchandise" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filer by everything  except appliances and gadget
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Merchandise" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except appliances and clothing
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Merchandise" ||
                        p.category == "Gadget" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except appliances and merch
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except gadget and music
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Appliances" ||
                        p.category == "Merchandise") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filer by everything  except appliances and music
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        p.category == "Merchandise") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filer by everything  except clothing and merch
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Gadget" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filer by everything  except music and merch
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Gadget" ||
                        p.category == "Clothing") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filer by everything  except clothing and music
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Gadget" ||
                        p.category == "Merchandise") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filer by everything  except gadget and merch
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Music" ||
                        p.category == "Clothing") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except music and clothing and gadget
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Merchandise" ||
                        p.category == "Appliances") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except music and merch and gadget
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Appliances") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except music and clothing and merch
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Gadget" || p.category == "Appliances") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except music and merchandise and gadget
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Appliances") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except appliances and clothing and gadget
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Merchandise" || p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except appliances and clothing and merch
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Gadget" || p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything except appliances and clothing and music
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Gadget" || p.category == "Merchandise") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything except gadget and clothing and merch
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Music" || p.category == "Appliances") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except appliances and gadget and merch
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" || p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything   except appliances and gadget and music
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Merchandise") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except appliances and merch and music
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" || p.category == "Gadget") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything except clothing
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Gadget" ||
                        p.category == "Merchandise" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything except gadget
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Clothing" ||
                        p.category == "Merchandise" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything excpet merch
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything except music
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        p.category == "Merchandise") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by appliances
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == "Appliances" &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by clothing
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == "Clothing" &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by gadget
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == "Gadget" &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by merch
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == "Merchandise" &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by music
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == "Music" &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //no category filter
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceAsc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == null &&
                      p.name.includes(this.searchInput)
                  )
              )
            );
        }
        //#endregion
        break;

      case "price_desc":
        //#region filter if price_desc
        //filter by everything
        if (
          this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        p.category == "Merchandise" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything except appliances
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        p.category == "Merchandise" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything except appliances and clothing
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Gadget" ||
                        p.category == "Merchandise" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filer by everything  except appliances and gadget
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Merchandise" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except appliances and clothing
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Merchandise" ||
                        p.category == "Gadget" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except appliances and merch
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except gadget and music
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Appliances" ||
                        p.category == "Merchandise") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filer by everything  except appliances and music
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        p.category == "Merchandise") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filer by everything  except clothing and merch
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Gadget" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filer by everything  except music and merch
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Gadget" ||
                        p.category == "Clothing") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filer by everything  except clothing and music
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Gadget" ||
                        p.category == "Merchandise") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filer by everything  except gadget and merch
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Music" ||
                        p.category == "Clothing") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except music and clothing and gadget
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Merchandise" ||
                        p.category == "Appliances") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except music and merch and gadget
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Appliances") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except music and clothing and merch
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Gadget" || p.category == "Appliances") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except music and merchandise and gadget
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Appliances") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except appliances and clothing and gadget
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Merchandise" || p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except appliances and clothing and merch
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Gadget" || p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything except appliances and clothing and music
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Gadget" || p.category == "Merchandise") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything except gadget and clothing and merch
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Music" || p.category == "Appliances") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except appliances and gadget and merch
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" || p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything   except appliances and gadget and music
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" ||
                        p.category == "Merchandise") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything  except appliances and merch and music
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Clothing" || p.category == "Gadget") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything except clothing
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Gadget" ||
                        p.category == "Merchandise" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything except gadget
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Clothing" ||
                        p.category == "Merchandise" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything excpet merch
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        p.category == "Music") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by everything except music
        } else if (
          this.orderByAppliances &&
          this.orderByClothing &&
          this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      (p.category == "Appliances" ||
                        p.category == "Clothing" ||
                        p.category == "Gadget" ||
                        p.category == "Merchandise") &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by appliances
        } else if (
          this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == "Appliances" &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by clothing
        } else if (
          !this.orderByAppliances &&
          this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == "Clothing" &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by gadget
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == "Gadget" &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by merch
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == "Merchandise" &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //filter by music
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == "Music" &&
                      p.name.includes(this.searchInput)
                  )
              )
            );

          //no category filter
        } else if (
          !this.orderByAppliances &&
          !this.orderByClothing &&
          !this.orderByGadget &&
          !this.orderByMerchandise &&
          !this.orderByMusic
        ) {
          this.products$ = this.store
            .select(fromStore.getAllProducts)
            .pipe(
              map(products =>
                products
                  .sort(this.sortByPriceDesc)
                  .filter(
                    p =>
                      p.price <= this.orderByMaxPrice &&
                      this.orderByMinPrice <= p.price &&
                      p.category == null &&
                      p.name.includes(this.searchInput)
                  )
              )
            );
        }
        //#endregion
        break;
    }

    this.store.dispatch(new fromStore.GetProducts());
  }

  //#region sorting functions
  sortByNameAsc(a: Product, b: Product) {
    if (a.name < b.name) return -1;
    if (a.name > b.name) return 1;
    return 0;
  }

  sortByNameDesc(a: Product, b: Product) {
    if (a.name > b.name) return -1;
    if (a.name < b.name) return 1;
    return 0;
  }

  sortByPriceAsc(a: Product, b: Product) {
    if (a.price < b.price) return -1;
    if (a.price > b.price) return 1;
    return 0;
  }

  sortByPriceDesc(a: Product, b: Product) {
    if (a.price > b.price) return -1;
    if (a.price < b.price) return 1;
    return 0;
  }
  //#endregion

  //#region for dashboard-viewer
  sortBy(event: string) {
    this.sort = event;
    this.getProducts();
  }

  byGadget(event: boolean) {
    this.orderByGadget = event;
    this.getProducts();
  }

  byClothing(event: boolean) {
    this.orderByClothing = event;
    this.getProducts();
  }

  byMusic(event: boolean) {
    this.orderByMusic = event;
    this.getProducts();
  }

  byMerchandise(event: boolean) {
    this.orderByMerchandise = event;
    this.getProducts();
  }

  byAppliances(event: boolean) {
    this.orderByAppliances = event;
    this.getProducts();
  }

  byMinPrice(event: number) {
    this.orderByMinPrice = event;
    this.getProducts();
  }

  byMaxPrice(event: number) {
    this.orderByMaxPrice = event;
    this.getProducts();
  }
  //#endregion

  //#region for product-viewer
  getDate() {
    let date = new Date(Date.now());
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let min = date.getMinutes();
    let sec = date.getSeconds();

    return (
      month.toString() +
      "/" +
      day.toString() +
      "/" +
      date.getFullYear().toString() +
      " " +
      hour.toString() +
      ":" +
      min.toString() +
      ":" +
      sec.toString()
    );
  }

  viewItem(event: Product) {
    this.product = event;

    this.comments$ = this.store.select(fromStore.getAllComments);
    this.store.dispatch(new fromStore.GetComments());
  }

  checkIfViewed(event: boolean) {
    this.isItemViewed = event;
  }

  goBack(event: boolean) {
    this.isItemViewed = event;
  }

  addComment(comment: string) {
    this.date = this.getDate();

    this.comment = {
      id: 0,
      productId: this.product.id,
      msg: comment,
      author: this.loggedUser.uname,
      date: this.date
    };

    this.store.dispatch(new fromStore.AddComment(this.comment));
  }

  getProduct(product: Product) {
    this.viewedProduct = product;
  }
  //#endregion
}
