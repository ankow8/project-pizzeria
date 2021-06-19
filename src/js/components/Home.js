import {select, templates, classNames} from '../settings.js';
import {app} from '../app.js';

class Home {
  constructor(element){
    const thisHome = this;

    thisHome.render(element);
    thisHome.initWidget();
  }

  render(element){
    const thisHome = this;

    const generatedHTML = templates.homeWidget();

    thisHome.dom = {};
    thisHome.dom.wrapper = element;
    thisHome.dom.wrapper.innerHTML = generatedHTML;
    thisHome.dom.services = thisHome.dom.wrapper.querySelector(select.containerOf.homeService);
    thisHome.dom.services.order = thisHome.dom.wrapper.querySelector(select.home.serviceOrder);
    thisHome.dom.services.table = thisHome.dom.wrapper.querySelector(select.home.serviceTable);
    //thisHome.dom.carousel = thisHome.dom.wrapper.querySelector(select.containerOf.homeCarousel);
    //thisHome.dom.gallery = thisHome.dom.wrapper.querySelector(select.containerOf.homeGallery);
  }

  initWidget(){
    const thisHome = this;

    thisHome.dom.services.order.addEventListener('click', function(){
      app.activatePage(classNames.home.order);
    });

    thisHome.dom.services.table.addEventListener('click', function(){
      app.activatePage(classNames.home.table);
    });

  }
}

export default Home;
