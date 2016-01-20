
var flkty;
setTimeout(test, 500); //simulate imagesLoaded

function test() {

  var imagesGallery = document.querySelector('#images'); //img elments


  // flkty = new Flickity( imagesGallery, {
  //   cellAlign: 'left',
  //   lightbox: {
  //     // open: true,
  //     header: {
  //       // dataTarget: 'h1',
  //       html: '<div class="custom">heyO: {} </div>'
  //     },
  //     // main: {
  //     //   initialIndex: 2
  //     // },
  //     close: {
  //       // html: '<h1>CLOSE IT</h1>'
  //     }
  //   }
  // });


  var emptyLightbox = Flickity.prototype.initLightbox({
    close: {
      html: '<h1>CLOSE IT</h1>'
    },
    header: {
      html: '<h2>this is it: {}</h2>'
    }
  })


  var imageCells = imagesGallery.querySelectorAll('img')
  Array.prototype.forEach.call(imageCells, function(cell, index) {
    cell.addEventListener('click', function() {
      emptyLightbox.openLightbox(imageCells, index)
    })
  })
}
