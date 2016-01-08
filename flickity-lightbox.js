/*!
 * Flickity lightbox v1.0.0
 * enables lightbox option for Flickity
 */

/*jshint browser: true, strict: true, undef: true, unused: true */

( function( window, factory ) {
  /*global define: false, module: false, require: false */
  'use strict';
  // universal module definition
  if ( typeof define == 'function' && define.amd ) {
    // AMD
    define( [
      'flickity/js/index'
    ], function( Flickity ) {
      return factory( window, Flickity );
    });
  } else if ( typeof exports == 'object' ) {
    // CommonJS
    module.exports = factory(
      window,
      require('flickity')
    );
  } else {
    // browser global
    window.Flickity = factory(
      window,
      window.Flickity
    );
  }

}( window, function factory( window, Flickity ) {
'use strict';

Flickity.createMethods.push('_createLightbox');

Flickity.prototype._createLightbox = function() {
  this.on('activate', function() {
    if ( !this.options.lightbox ) {
      return;
    }
    this.on('staticClick', this.openLightbox)
    if (this.options.lightbox === 'open') {
      this.openLightbox(null, null, null, 0)
    }
  })
};

Flickity.prototype.openLightbox = function(e, pointer, cellEl, cellIndex) {

  //create new dom for lightbox
  var lightbox = document.createElement('div');
  lightbox.className = 'flickity-lightbox-container';
  var flktyClone = lightbox.appendChild(document.createElement('div'));
  var flktyCloneNav = lightbox.appendChild(document.createElement('div'));
  flktyClone.classList.add('flickity-lightbox-main')
  flktyCloneNav.classList.add('flickity-lightbox-nav')

  this.cells.forEach(function(cell) {
    var mainEl = cell.element.cloneNode(true);
    mainEl.style.position = null;
    mainEl.className = 'lightbox-cell-main';
    flktyClone.appendChild(mainEl);

    var navEl = mainEl.cloneNode(true);
    navEl.className = 'lightbox-cell-nav';
    flktyCloneNav.appendChild(navEl);
  });

  this.lightbox = document.body.appendChild(lightbox);

  //init cloned flickity inside lightbox
  var flkty = new Flickity( flktyClone, {
    percentPosition: false,
    contain: true,
    initialIndex: cellIndex,
    pageDots: false
  });

  //init flickity as nav for flickity inside lightbox
  var flktyNav = new Flickity( flktyCloneNav, {
    percentPosition: false,
    contain: true,
    asNavFor: flktyClone,
    initialIndex: cellIndex,
    pageDots: false
  });

  //create dom for lightbox metaData
  var metaData = lightbox.insertBefore(document.createElement('div'), flktyClone)
  metaData.className = 'flickity-lightbox-metadata'

  var title = metaData.appendChild(document.createElement('h2'));
  title.className = 'flickity-lightbox-title';
  title.textContent = this.cells[this.selectedIndex].element.getAttribute('data-title');

  var counter = metaData.appendChild(document.createElement('h4'));
  counter.className = 'flickity-lightbox-counter';
  counter.innerHTML = '<span class="selected-index">' + (cellIndex + 1) + '</span> of <span class="flickity-length">' + flkty.cells.length + '</span>'
  var selectedIndex = counter.querySelector('.selected-index');

  var captionContainer = lightbox.appendChild(document.createElement('div'));
  var caption = captionContainer.appendChild(document.createElement('p'));
  caption.textContent = this.cells[this.selectedIndex].element.getAttribute('data-caption');

  var closeBtn = lightbox.appendChild(document.createElement('div'));
  closeBtn.className = 'flickity-lightbox-close';
  closeBtn.innerHTML = '<button>close</button>';
  closeBtn.addEventListener('click', this.closeLightbox.bind(this));

  flkty.on('cellSelect', function () {
    title.textContent = this.cells[this.selectedIndex].element.getAttribute('data-title');
    caption.textContent = this.cells[this.selectedIndex].element.getAttribute('data-caption');
    selectedIndex.textContent = this.selectedIndex + 1;
  });
}

Flickity.prototype.closeLightbox = function() {
  this.lightbox.parentNode.removeChild(this.lightbox)
};

return Flickity;

}));
