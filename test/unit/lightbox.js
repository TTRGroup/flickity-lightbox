
var flkty;

document.addEventListener('DOMContentLoaded', test)

function test() {

  //gallery of imgs
  var imagesGallery = document.querySelector('#images');
  flkty = new Flickity( imagesGallery, {
    lightbox: true,
    percentPosition: false,
    contain: true
  });


  //gallery with background images
  var backgroundImagesGallery = document.querySelector('#background-images');
  flkty = new Flickity( backgroundImagesGallery, {
    lightbox: {
      // open: true,
      mainOpts: {
        pageDots: true
      }
    },
    contain: true
  });
}
