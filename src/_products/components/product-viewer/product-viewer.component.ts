import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router} from '@angular/router';

import { Product } from '../../models/products.model';
import { Comment } from '../../models/comments.model';

import { Observable } from 'rxjs';

@Component({
  selector: 'product-viewer',
  templateUrl: './product-viewer.component.html',
  styleUrls: ['./product-viewer.component.css']
})
export class ProductViewerComponent implements OnInit {

  @Input() product: Product;
  @Input() comments: Observable<Comment[]>;
  @Output() isGoBack = new EventEmitter();
  @Output() comment = new EventEmitter();
  @Output() viewedProduct = new EventEmitter();

  commentsList: Comment[];
  commentHolder: Comment[] = [];

  charCount: number = 0;
  validComment: boolean = false;
  msg: string = "";

  @Output() selectedProduct = new EventEmitter();
  @Output() selectedProductQuantity = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit() {

    //check for products with no comments
    this.comments.subscribe(c => this.commentsList = c);
    for(let i = 0; i < this.commentsList.length; i++){
      if(this.commentsList[i].productId != this.product.id){ 
        this.commentHolder.push(this.commentsList[i]);
      }
    }

  }

  onAddToCart(product, quantity){
    let userOption = window.confirm("You are about to add " + quantity + " " + product.name + " to cart");
    if(userOption){
      this.selectedProductQuantity.emit(quantity);
      this.selectedProduct.emit(product);
    }
    
  }

  onGoBack(){
    this.isGoBack.emit(false);
    this.router.navigate(['/login/','home']);
  }

  onInput(comment){
    this.charCount = comment.length;
  }
  
  onAddComment(comment, product){
    if(comment.length >= 100){
      this.validComment = true;
      this.comment.emit(comment);
      this.viewedProduct.emit(product);
      window.alert("Your comment was added successfully");

    }else{
      this.validComment = false;
      this.msg = "Comment must contain at least 100 characters";
    }
  }

}
