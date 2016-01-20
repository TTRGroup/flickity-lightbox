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

    //set default options or user-defined options
    this.options.lightbox = {
      open: this.options.lightbox.open || false,
      counter: {
        position: this.options.lightbox.counter && this.options.lightbox.counter.position      || 'header',
        dataTarget: this.options.lightbox.counter && this.options.lightbox.counter.dataTarget  || 'h4',
        disable: this.options.lightbox.counter && this.options.lightbox.counter.disable        || false
      },
      header: {
        html:     this.options.lightbox.header && this.options.lightbox.header.html,
        dataTarget: this.options.lightbox.header && this.options.lightbox.header.dataTarget           || 'span',
        disable:  this.options.lightbox.header && this.options.lightbox.header.disable                || false
      },
      main: this.options.lightbox.main || {
        percentPosition: false,
        contain: true,
        pageDots: false
      },
      nav: this.options.lightbox.nav || {
        percentPosition: false,
        contain: true,
        pageDots: false
      },
      footer: {
        html: this.options.lightbox.footer && this.options.lightbox.footer.html,
        dataTarget: this.options.lightbox.footer && this.options.lightbox.footer.dataTarget || 'span',
        disable: this.options.lightbox.footer && this.options.lightbox.footer.disable       || false
      },
      close: {
        html: this.options.lightbox.close && this.options.lightbox.close.html         || '<div>X</div>',
        disable: this.options.lightbox.close && this.options.lightbox.close.disable   || false
      }
    };

    //create new dom for lightbox
    var lightbox = document.createElement('div');
    lightbox.className = 'flickity-lightbox-container';
    var flktyClone = lightbox.appendChild(document.createElement('div'));
    var flktyCloneNav = lightbox.appendChild(document.createElement('div'));
    flktyClone.className = 'flickity-lightbox-main';
    flktyCloneNav.className = 'flickity-lightbox-nav';

    //create dom for lightbox header
    if (!this.options.lightbox.header.disable) {
      var header = lightbox.insertBefore(document.createElement('div'), flktyClone);
      header.className = 'flickity-lightbox-header';
      header.innerHTML = fillContainer(this.options.lightbox.header);
      var headerTarget = header.querySelector('.data-target');
    }

    //create dom for lightbox footer container
    if (!this.options.lightbox.footer.disable) {
      var footer = lightbox.appendChild(document.createElement('div'));
      footer.className = 'flickity-lightbox-footer';
      footer.innerHTML = fillContainer(this.options.lightbox.footer);
      var footerTarget = footer.querySelector('.data-target');
    }

    //create dom for counter (default position is in header)
    var counter = document.createElement(this.options.lightbox.counter.dataTarget);
    counter.className = 'flickity-lightbox-counter';
    counter.innerHTML = '<span class="flickity-lightbox-selected-index">' + ((this.options.lightbox.main.initialIndex || 0) + 1) + '</span> <span class="flickity-lightbox-counter-words">of</span> <span class="flickity-length">' + this.cells.length + '</span>'
    var selectedIndex = counter.querySelector('.flickity-lightbox-selected-index');

    if (this.options.lightbox.counter.position === 'header') { //default position
      header.appendChild(counter);
    } else if (this.options.lightbox.counter.position === 'footer') {
      footer.appendChild(counter);
    }

    if (!this.options.lightbox.close.disable) {
      var closeBtn = lightbox.appendChild(document.createElement('div'));
      closeBtn.className = 'flickity-lightbox-close';
      closeBtn.innerHTML = this.options.lightbox.close.html;
      closeBtn.addEventListener('click', this.dispatchEvent.bind(this, 'lightboxClose'));
    }

    lightbox.style.display = 'none';
    this.lightbox = {
      container: document.body.appendChild(lightbox),
      flktyClone: flktyClone,
      flktyCloneNav: flktyCloneNav,
      header: headerTarget,
      footer: footerTarget,
      counter: selectedIndex
    };

    this.on( 'staticClick', this.openLightbox )
    if ( this.options.lightbox.open ) {
      this.openLightbox(null, null, null, 0)
    }
  })

  function fillContainer(opts) {
    var dataTargetStr = '<' + opts.dataTarget + ' class="data-target">' + '</' + opts.dataTarget + '>';

    if (!opts.html) {
      return dataTargetStr;
    } else if (opts.html && opts.html.indexOf('{') > 0) {
      var preText = opts.html.slice(0, opts.html.indexOf('{'));
      var postText = opts.html.slice(opts.html.indexOf('}') + 1);
      return preText + dataTargetStr + postText;
    } else if (opts.html) {
      console.error('Please provide a "{}" inside any custom html strings passed to flickity-lightbox options')
      return false;
    }
  }
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
  //generate content inside .flickity-lightbox-main and .flickity-lightbox-nav
  this.fillLightbox();
  this.lightbox.container.style.display = 'block';

  //init cloned flickity inside lightbox
  this.options.lightbox.main.initialIndex = this.options.lightbox.main.initialIndex || cellIndex;
  var flkty = new Flickity( this.lightbox.flktyClone, this.options.lightbox.main );

  //init flickity as nav for flickity inside lightbox
  this.options.lightbox.nav.asNavFor = this.lightbox.flktyClone;
  this.options.lightbox.nav.initialIndex = this.options.lightbox.main.initialIndex || cellIndex;
  var flktyNav = new Flickity( this.lightbox.flktyCloneNav, this.options.lightbox.nav );

  //update bindings
  flkty.on( 'lightboxUpdate', function() {
    if (!this.options.lightbox.header.disable) {
      this.lightbox.header.innerHTML = flkty.cells[flkty.selectedIndex].element.getAttribute('data-header');
      if (!this.options.lightbox.counter.disable) {
        this.lightbox.counter.innerHTML = flkty.selectedIndex + 1;
      }
    }

    if (!this.options.lightbox.footer.disable) {
      this.lightbox.footer.innerHTML = flkty.cells[flkty.selectedIndex].element.getAttribute('data-footer');
    }

  }.bind(this));

  flkty.dispatchEvent('lightboxUpdate');
  flkty.on( 'cellSelect', this.dispatchEvent.bind( flkty, 'lightboxUpdate' ));

  this.on( 'lightboxClose', function() {
    this.lightbox.container.style.display = 'none';
    flkty.destroy();
    flktyNav.destroy();
  });
}

return Flickity;

}));
