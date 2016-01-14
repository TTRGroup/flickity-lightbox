
var flkty;
setTimeout(test, 500); //simulate imagesLoaded

function test() {

  var imagesGallery = document.querySelector('#images'); //img elments
  flkty = new Flickity( imagesGallery, {
    cellAlign: 'left',
    lightbox: {
      headerOpts: {
        html: '<h1>Title: {dataTarget} </h1>',
        // disableCounter: true
      },
      footerOpts: {
        html: '<div>Static text written around {dataTarget} text</div>',
        // dataTarget: 'span'
      }
    }
  });


  // var backgroundImagesGallery = document.querySelector('#background-images'); //bg images
  // flkty = new Flickity( backgroundImagesGallery, {
  //   cellAlign: 'left',
  //   lightbox: {
  //     open: false,
  //     headerOpts: { // .flickity-lightbox-header
  //       counter: true,
  //       html: '<h2 class="flickity-lightbox-title">Title</h2><h4 class="flickity-lightbox-counter"><span class="selected-index">0</span> of <span class="flickity-length">0</span></h4>',
  //       disable: false
  //     },
  //     mainOpts: { // .flickity-lightbox-main
  //       //any flickity options
  //     },
  //     navOpts: { // .flickity-lightbox-nav
  //       //any flickity options
  //     },
  //     captionOpts: { // .flickity-lightbox-caption
  //       html: '<p>Caption</p>',
  //       disable: false
  //     },
  //     closeOpts: { // .flickity-lightbox-close
  //       html: '<div>X</div>',
  //       disable: false
  //     }
  //   }
  // });
}
