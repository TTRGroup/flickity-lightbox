
var flkty;
setTimeout(test, 500); //simulate imagesLoaded

function test() {

  var imagesGallery = document.querySelector('#images'); //img elments


  flkty = new Flickity( imagesGallery, {
    cellAlign: 'left',
    lightbox: {
      // open: true,
      header: {
        // dataTarget: 'h1',
        html: '<div class="custom">heyO: {} </div>'
      },
      // main: {
      //   initialIndex: 2
      // },
      close: {
        // html: '<h1>CLOSE IT</h1>'
      }
    }
  });

  console.log(flkty)
  console.log(flkty.lightbox)

  //
  // var emptyLightbox = Flickity.prototype.initLightbox({})
  //
  //
  // var imageCells = imagesGallery.querySelectorAll('img')
  // Array.prototype.forEach.call(imageCells, function(cell, index) {
  //   cell.addEventListener('click', function() {
  //     emptyLightbox.openLightbox(imageCells, index)
  //   })
  // })
}



// var testJson = '[{"url": "https://d2r8g4a6gdnaur.cloudfront.net/pages/006.JPG?mtime=20150604144940"} ,{"url": "https://d2r8g4a6gdnaur.cloudfront.net/pages/09_Schenck-Governors-Island-2013_11_06-DSC_4274.jpg?mtime=20150518100234"} ,{"url": "https://d2r8g4a6gdnaur.cloudfront.net/pages/11th-St-1.png?mtime=20150728140947"} ,{"url": "https://d2r8g4a6gdnaur.cloudfront.net/pages/11th-St-2.png?mtime=20150728141026"} ,{"url": "https://d2r8g4a6gdnaur.cloudfront.net/pages/11th-St-3.png?mtime=20150728140956"} ,{"url": "https://d2r8g4a6gdnaur.cloudfront.net/pages/14477248246_be63236234_o.jpg?mtime=20150602124408"} ,{"url": "https://d2r8g4a6gdnaur.cloudfront.net/pages/172577283.mp4?mtime=20150927101337"} ,{"url": "https://d2r8g4a6gdnaur.cloudfront.net/pages/2015DS34.403.jpg?mtime=20150924085916"} ,{"url": "https://d2r8g4a6gdnaur.cloudfront.net/pages/2015DS34.408.jpg?mtime=20150909105455"}]'
