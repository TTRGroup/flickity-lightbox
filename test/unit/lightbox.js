
var flkty;
setTimeout(test, 500); //simulate imagesLoaded

function test() {

  var imagesGallery = document.querySelector('#images'); //img elments
  flkty = new Flickity( imagesGallery, {
    cellAlign: 'left',
    lightbox: {
      open: true,
      header: {
        // dataTarget: 'h1',
        html: '<div class="custom">heyO: {} </div>'
      },
      main: {
        initialIndex: 2
      },
      close: {
        // html: '<h1>CLOSE IT</h1>'
      }
    }
  });
}
