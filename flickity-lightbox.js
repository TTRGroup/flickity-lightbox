/*!
 * Flickity lightbox v1.0.3
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

    this.options.lightbox = {
      open: this.options.lightbox.open || false,
      mainOpts: this.options.lightbox.mainOpts || {
        percentPosition: false,
        contain: true,
        pageDots: false
      },
      navOpts: this.options.lightbox.navOpts || {
        percentPosition: false,
        contain: true,
        pageDots: false
      }
    }

    //create new dom for lightbox
    var lightbox = document.createElement('div');
    lightbox.className = 'flickity-lightbox-container';
    var flktyClone = lightbox.appendChild(document.createElement('div'));
    var flktyCloneNav = lightbox.appendChild(document.createElement('div'));
    flktyClone.className = 'flickity-lightbox-main';
    flktyCloneNav.className = 'flickity-lightbox-nav';

    //create dom for lightbox metaData
    var metaData = lightbox.insertBefore(document.createElement('div'), flktyClone);
    metaData.className = 'flickity-lightbox-metadata';

    var title = metaData.appendChild(document.createElement('h2'));
    title.className = 'flickity-lightbox-title';
    title.textContent = this.cells[this.selectedIndex].element.getAttribute('data-title');

    var counter = metaData.appendChild(document.createElement('h4'));
    counter.className = 'flickity-lightbox-counter';
    counter.innerHTML = '<span class="selected-index">' + ((this.options.lightbox.mainOpts.initialIndex || 0) + 1) + '</span> of <span class="flickity-length">' + this.cells.length + '</span>'
    var selectedIndex = counter.querySelector('.selected-index');

    var captionContainer = lightbox.appendChild(document.createElement('div'));
    captionContainer.className = 'flickity-lightbox-caption';
    var caption = captionContainer.appendChild(document.createElement('p'));

    caption.textContent = this.cells[this.selectedIndex].element.getAttribute('data-caption');

    var closeBtn = lightbox.appendChild(document.createElement('div'));
    closeBtn.className = 'flickity-lightbox-close';
    closeBtn.innerHTML = '<div>X</div>';
    closeBtn.addEventListener('click', this.dispatchEvent.bind(this, 'lightboxClose'));

    lightbox.style.display = 'none';
    this.lightbox = {
      container: document.body.appendChild(lightbox),
      flktyClone: flktyClone,
      flktyCloneNav: flktyCloneNav,
      title: title,
      caption: caption,
      counter: selectedIndex
    };

    this.on( 'staticClick', this.openLightbox )
    if ( this.options.lightbox.open ) {
      this.openLightbox(null, null, null, 0)
    }
  })
};

Flickity.prototype.fillLightbox = function() {
  this.cells.forEach(function(cell) {
    var mainEl = cell.element.cloneNode(true);
    mainEl.style.position = null;
    mainEl.className = 'lightbox-cell-main';
    this.lightbox.flktyClone.appendChild(mainEl);

    var navEl = mainEl.cloneNode(true);
    navEl.className = 'lightbox-cell-nav';
    this.lightbox.flktyCloneNav.appendChild(navEl);
  }.bind(this));
}

Flickity.prototype.openLightbox = function(e, pointer, cellEl, cellIndex) {

  this.fillLightbox()

  this.lightbox.container.style.display = 'block';

  //init cloned flickity inside lightbox
  var flkty = new Flickity( this.lightbox.flktyClone, this.options.lightbox.mainOpts );

  //init flickity as nav for flickity inside lightbox
  this.options.lightbox.navOpts.asNavFor = this.lightbox.flktyClone;
  var flktyNav = new Flickity( this.lightbox.flktyCloneNav, this.options.lightbox.navOpts );

  flkty.on('cellSelect', function () {
    this.lightbox.title.textContent = flkty.cells[flkty.selectedIndex].element.getAttribute('data-title');
    this.lightbox.caption.textContent = flkty.cells[flkty.selectedIndex].element.getAttribute('data-caption');
    this.lightbox.counter.textContent = flkty.selectedIndex + 1;
  }.bind(this));

  this.on('lightboxClose', function() {
    this.lightbox.container.style.display = 'none';
    flkty.destroy()
    flktyNav.destroy()
  })
}

return Flickity;

}));
