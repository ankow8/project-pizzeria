import {select, classNames, settings, templates} from '../settings.js';
import utils from '../utils.js';
import CartProduct from './CartProduct.js';

class Cart {
  constructor(element){
    const thisCart = this;
    thisCart.products = [];
    thisCart.getElements(element);
    //console.log('newCart: ', thisCart);
    thisCart.initActions();
  }

  getElements(element){
    const thisCart = this;

    thisCart.dom = {};
    thisCart.dom.wrapper = element;
    thisCart.dom.toggleTrigger = thisCart.dom.wrapper.querySelector(select.cart.toggleTrigger);
    thisCart.dom.productList = thisCart.dom.wrapper.querySelector(select.cart.productList);
    thisCart.dom.deliveryFee = thisCart.dom.wrapper.querySelector(select.cart.deliveryFee);
    thisCart.dom.subtotalPrice = thisCart.dom.wrapper.querySelector(select.cart.subTotalPrice);
    thisCart.dom.totalPrice = thisCart.dom.wrapper.querySelectorAll(select.cart.totalPrice);
    thisCart.dom.totalNumber = thisCart.dom.wrapper.querySelector(select.cart.totalNumber);
    thisCart.dom.form = thisCart.dom.wrapper.querySelector(select.cart.form);
    thisCart.dom.address = thisCart.dom.wrapper.querySelector(select.cart.address);
    thisCart.dom.phone = thisCart.dom.wrapper.querySelector(select.cart.phone);
    //console.log(thisCart.dom);
  }

  initActions(){
    const thisCart = this;
    thisCart.dom.toggleTrigger.addEventListener('click', function(){
      thisCart.dom.wrapper.classList.toggle(classNames.cart.wrapperActive);
    });
    thisCart.dom.productList.addEventListener('updated', function(){
      thisCart.update();
    });
    thisCart.dom.productList.addEventListener('remove', function(){
      thisCart.remove(event.detail.cartProduct);
    });
    thisCart.dom.form.addEventListener('submit', function(event){
      event.preventDefault();
      thisCart.sendOrder();
    });
  }

  add(menuProduct){
    const thisCart = this;
    //console.log('adding product', menuProduct);

    /* generate HTML based on template */
    const generatedHTML = templates.cartProduct(menuProduct);
    //console.log(generatedHTML);

    /* create element using utils.createElementFromHTML */
    const generatedDOM = utils.createDOMFromHTML(generatedHTML);

    /* add element to thisCart.dom.productList */
    thisCart.dom.productList.appendChild(generatedDOM);

    thisCart.products.push(new CartProduct(menuProduct, generatedDOM));
    //console.log('thisCart.products', thisCart.products);

    thisCart.update();
  }

  update(){
    const thisCart = this;
    thisCart.deliveryFee = settings.cart.defaultDeliveryFee;
    thisCart.totalNumber = 0;
    thisCart.subtotalPrice = 0;

    if(thisCart.totalNumber == 0){
      thisCart.deliveryFee == 0;
    }

    for(let element of thisCart.products){
      thisCart.totalNumber += element.amount;
      thisCart.subtotalPrice += element.price;
    }

    thisCart.totalPrice = thisCart.subtotalPrice + thisCart.deliveryFee;

    thisCart.dom.deliveryFee.innerHTML = thisCart.deliveryFee;
    thisCart.dom.subtotalPrice.innerHTML = thisCart.subtotalPrice;
    thisCart.dom.totalNumber.innerHTML = thisCart.totalNumber;
    for(let price of thisCart.dom.totalPrice){
      price.innerHTML = thisCart.totalPrice;
    }
    //thisCart.dom.totalPrice.innerHTML = thisCart.totalPrice;
    //console.log('TotalNumber:', thisCart.totalNumber);
    //console.log('TotalSubtotalprice:', thisCart.subtotalPrice);
    //console.log('TotalPrice:', thisCart.totalPrice);

  }

  remove(removedProduct){
    const thisCart = this;

    removedProduct.dom.wrapper.remove();

    const indexOfRemovedProduct = thisCart.products.indexOf(removedProduct);
    thisCart.products.splice(indexOfRemovedProduct, 1);

    thisCart.update();

    //console.log('removedProduct', thisCart.products);

  }

  sendOrder(){
    const thisCart = this,
      url = settings.db.url + '/' + settings.db.orders,
      payload = {
        address: thisCart.dom.address.value,
        phone: thisCart.dom.phone.value,
        totalPrice: thisCart.totalPrice,
        subtotalPrice: thisCart.subtotalPrice,
        totalNumber: thisCart.totalNumber,
        deliveryFee: thisCart.deliveryFee,
        products: [],
      };
    for(let prod of thisCart.products){
      payload.products.push(prod.getData());
    }
    //console.log('payload:', payload);

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };

    fetch(url, options)
      .then(function(response){
        return response.json();
      }).then(function(parsedResponse){
        console.log('parsedResponse', parsedResponse);
      });


  }

}

export default Cart;
