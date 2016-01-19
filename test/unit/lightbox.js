
var flkty;
setTimeout(test, 500); //simulate imagesLoaded

function test() {

  var imagesGallery = document.querySelector('#images'); //img elments
  flkty = new Flickity( imagesGallery, {
    cellAlign: 'left',
    lightbox: {
      header: {
        // dataTarget: 'h1',
        html: '<div class="custom">heyO: {} </div>'
      },
      close: {
        // html: '<h1>CLOSE IT</h1>'
      }
    }
  });
}
