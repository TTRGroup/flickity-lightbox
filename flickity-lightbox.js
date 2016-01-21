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

    this.initLightbox(this.options.lightbox);

    this.on( 'staticClick', function( e, pointer, cellEl, cellIndex ) {
      this.openLightbox( this.getCellElements(), cellIndex )
    }.bind(this));

    if ( this.options.lightbox.open ) {
      this.openLightbox( this.getCellElements(), cellIndex )
    }
  })
};

Flickity.prototype._resolveLightboxOptions = function(opts) {
  if (!opts) {
    return;
  }
  return {
    open:              opts.open                                  || false,
    counter: {
      position:        opts.counter && opts.counter.position      || 'header',
      dataTarget:      opts.counter && opts.counter.dataTarget    || 'h4',
      disable:         opts.counter && opts.counter.disable       || false
    },
    header: {
      html:            opts.header && opts.header.html,
      dataTarget:      opts.header && opts.header.dataTarget      || 'span',
      disable:         opts.header && opts.header.disable         || false
    },
    main: opts.main || {
      percentPosition: false,
      contain:         true,
      pageDots:        false
    },
    nav: opts.nav || {
      percentPosition: false,
      contain:         true,
      pageDots:        false
    },
    footer: {
    html:              opts.footer && opts.footer.html,
      dataTarget:      opts.footer && opts.footer.dataTarget      || 'span',
      disable:         opts.footer && opts.footer.disable         || false
    },
    close: {
    html:              opts.close && opts.close.html              || '<div>X</div>',
      disable:         opts.close && opts.close.disable           || false
    }
  };
}

Flickity.prototype.initLightbox = function(userOpts) {
  var opts = this._resolveLightboxOptions(userOpts);

  //create new dom for lightbox
  var lightbox = document.createElement('div');
  lightbox.className = 'flickity-lightbox-container';
  var flktyCloneContainer = lightbox.appendChild(document.createElement('div'));
  var flktyCloneNavContainer = lightbox.appendChild(document.createElement('div'));
  flktyCloneContainer.className = 'flickity-lightbox-main';
  flktyCloneNavContainer.className = 'flickity-lightbox-nav';

  //create dom for lightbox header
  if (!opts.header.disable) {
    var header = lightbox.insertBefore(document.createElement('div'), flktyCloneContainer);
    header.className = 'flickity-lightbox-header';
    header.innerHTML = buildStaticMarkup(opts.header);
    var headerTarget = header.querySelector('.data-target');
  }

  //create dom for lightbox footer container
  if (!opts.footer.disable) {
    var footer = lightbox.appendChild(document.createElement('div'));
    footer.className = 'flickity-lightbox-footer';
    footer.innerHTML = buildStaticMarkup(opts.footer);
    var footerTarget = footer.querySelector('.data-target');
  }

  //create dom for counter (default position is in header)
  var counter = document.createElement(opts.counter.dataTarget);
  counter.className = 'flickity-lightbox-counter';
  counter.innerHTML = '<span class="flickity-lightbox-selected-index">' + ((opts.main.initialIndex || 0) + 1) + '</span> <span class="flickity-lightbox-counter-words">of</span> <span class="flickity-length"></span>'
  var selectedIndex = counter.querySelector('.flickity-lightbox-selected-index');

  if (opts.counter.position === 'header') { //default position
    header.appendChild(counter);
  } else if (opts.counter.position === 'footer') {
    footer.appendChild(counter);
  }

  if (!opts.close.disable) {
    var closeBtn = lightbox.appendChild(document.createElement('div'));
    closeBtn.className = 'flickity-lightbox-close';
    closeBtn.innerHTML = opts.close.html;
  }

  lightbox.style.display = 'none';

  var lightboxRefs = {
    container: document.body.appendChild(lightbox),
    flktyClone: flktyCloneContainer,
    flktyCloneNav: flktyCloneNavContainer,
    header: headerTarget,
    footer: footerTarget,
    counter: selectedIndex,
    close: closeBtn
  };

  function buildStaticMarkup(opts) {
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

  var instance = this.options ? this : new Flickity(document.createElement('div'), {lightbox: opts});
  if (this.options) {
    instance.options.lightbox = opts;
  }
  instance.lightboxRefs = lightboxRefs;
  closeBtn.addEventListener('click', instance.dispatchEvent.bind(instance, 'lightboxClose'));
  return instance;
}

Flickity.prototype.openLightbox = function(galleryCells, cellIndex) {
  //generate content inside .flickity-lightbox-main and .flickity-lightbox-nav
  this._fillLightbox(galleryCells);
  var counterLength = document.querySelector('.flickity-length');
  counterLength.textContent = galleryCells.length;
  this.lightboxRefs.container.style.display = 'block';

  //init cloned flickity inside lightbox
  this.options.lightbox.main.initialIndex = this.options.lightbox.main.initialIndex || cellIndex;
  var flkty = new Flickity( this.lightboxRefs.flktyClone, this.options.lightbox.main );

  //init flickity as nav for flickity inside lightbox
  this.options.lightbox.nav.asNavFor = '.flickity-lightbox-main';
  this.options.lightbox.nav.initialIndex = this.options.lightbox.main.initialIndex || cellIndex;
  var flktyNav = new Flickity( this.lightboxRefs.flktyCloneNav, this.options.lightbox.nav );

  //update bindings
  flkty.on( 'lightboxUpdate', function() {
    if (!this.options.lightbox.header.disable) {
      this.lightboxRefs.header.innerHTML = flkty.cells[flkty.selectedIndex].element.getAttribute('data-header');
      if (!this.options.lightbox.counter.disable) {
        this.lightboxRefs.counter.innerHTML = flkty.selectedIndex + 1;
      }
    }

    if (!this.options.lightbox.footer.disable) {
      this.lightboxRefs.footer.innerHTML = flkty.cells[flkty.selectedIndex].element.getAttribute('data-footer');
    }
  }.bind(this));

  flkty.dispatchEvent( 'lightboxUpdate' );
  flkty.on( 'cellSelect', this.dispatchEvent.bind( flkty, 'lightboxUpdate' ));

  this.on( 'lightboxClose', function() {
    this.lightboxRefs.container.style.display = 'none';
    this.options.lightbox.main.initialIndex = null;
    this.options.lightbox.nav.initialIndex = null;
    this.options.lightbox.nav.asNavFor = null;
    this.lightboxRefs.close.removeEventListener('click', this.dispatchEvent)
    this.removeNavSelectedElement();
    flkty.destroy();
    flktyNav.destroy();

    var lightboxContentMain = document.querySelector('.flickity-lightbox-main')
    var lightboxContentNav = document.querySelector('.flickity-lightbox-nav')
    lightboxContentMain.innerHTML = '';
    lightboxContentNav.innerHTML = '';
  });
}

Flickity.prototype._fillLightbox = function(galleryCells) {
  var source = galleryCells.response ? galleryCells.response : galleryCells;

  if (typeof source === 'string') {
    try {
      var data = JSON.parse(galleryCells)
      source = [];
      data.forEach(function(asset) {
        var img = document.createElement('img')
        img.src = asset.url;
        source.push(img);
      });

    } catch(e) {
      console.error(e)
    }
  }

  Array.prototype.forEach.call(source, function(cell) {
    var mainEl = cell.cloneNode(true);
    mainEl.style.position = null;
    mainEl.className = 'lightbox-cell-main';
    this.lightboxRefs.flktyClone.appendChild(mainEl);

    var navEl = mainEl.cloneNode(true);
    navEl.className = 'lightbox-cell-nav';
    this.lightboxRefs.flktyCloneNav.appendChild(navEl);
  }.bind(this));
}

return Flickity;

}));
