
    Polymer('core-selection', {
      /**
       * If true, multiple selections are allowed.
       *
       * @attribute multi
       * @type boolean
       * @default false
       */
      multi: false,
      ready: function() {
        this.clear();
      },
      clear: function() {
        this.selection = [];
      },
      /**
       * Retrieves the selected item(s).
       * @method getSelection
       * @returns Returns the selected item(s). If the multi property is true,
       * getSelection will return an array, otherwise it will return 
       * the selected item or undefined if there is no selection.
      */
      getSelection: function() {
        return this.multi ? this.selection : this.selection[0];
      },
      /**
       * Indicates if a given item is selected.
       * @method isSelected
       * @param {any} item The item whose selection state should be checked.
       * @returns Returns true if `item` is selected.
      */
      isSelected: function(item) {
        return this.selection.indexOf(item) >= 0;
      },
      setItemSelected: function(item, isSelected) {
        if (item !== undefined && item !== null) {
          if (isSelected) {
            this.selection.push(item);
          } else {
            var i = this.selection.indexOf(item);
            if (i >= 0) {
              this.selection.splice(i, 1);
            }
          }
          this.fire("core-select", {isSelected: isSelected, item: item});
        }
      },
      /**
       * Set the selection state for a given `item`. If the multi property
       * is true, then the selected state of `item` will be toggled; otherwise
       * the `item` will be selected.
       * @method select
       * @param {any} item: The item to select.
      */
      select: function(item) {
        if (this.multi) {
          this.toggle(item);
        } else if (this.getSelection() !== item) {
          this.setItemSelected(this.getSelection(), false);
          this.setItemSelected(item, true);
        }
      },
      /**
       * Toggles the selection state for `item`.
       * @method toggle
       * @param {any} item: The item to toggle.
      */
      toggle: function(item) {
        this.setItemSelected(item, !this.isSelected(item));
      }
    });
  ;


    Polymer('core-selector', {

      /**
       * Gets or sets the selected element.  Default to use the index
       * of the item element.
       *
       * If you want a specific attribute value of the element to be
       * used instead of index, set "valueattr" to that attribute name.
       *
       * Example:
       *
       *     <core-selector valueattr="label" selected="foo">
       *       <div label="foo"></div>
       *       <div label="bar"></div>
       *       <div label="zot"></div>
       *     </core-selector>
       *
       * In multi-selection this should be an array of values.
       *
       * Example:
       *
       *     <core-selector id="selector" valueattr="label" multi>
       *       <div label="foo"></div>
       *       <div label="bar"></div>
       *       <div label="zot"></div>
       *     </core-selector>
       *
       *     this.$.selector.selected = ['foo', 'zot'];
       *
       * @attribute selected
       * @type Object
       * @default null
       */
      selected: null,

      /**
       * If true, multiple selections are allowed.
       *
       * @attribute multi
       * @type boolean
       * @default false
       */
      multi: false,

      /**
       * Specifies the attribute to be used for "selected" attribute.
       *
       * @attribute valueattr
       * @type string
       * @default 'name'
       */
      valueattr: 'name',

      /**
       * Specifies the CSS class to be used to add to the selected element.
       *
       * @attribute selectedClass
       * @type string
       * @default 'core-selected'
       */
      selectedClass: 'core-selected',

      /**
       * Specifies the property to be used to set on the selected element
       * to indicate its active state.
       *
       * @attribute selectedProperty
       * @type string
       * @default ''
       */
      selectedProperty: '',

      /**
       * Specifies the attribute to set on the selected element to indicate
       * its active state.
       *
       * @attribute selectedAttribute
       * @type string
       * @default 'active'
       */
      selectedAttribute: 'active',

      /**
       * Returns the currently selected element. In multi-selection this returns
       * an array of selected elements.
       * Note that you should not use this to set the selection. Instead use
       * `selected`.
       *
       * @attribute selectedItem
       * @type Object
       * @default null
       */
      selectedItem: null,

      /**
       * In single selection, this returns the model associated with the
       * selected element.
       * Note that you should not use this to set the selection. Instead use
       * `selected`.
       *
       * @attribute selectedModel
       * @type Object
       * @default null
       */
      selectedModel: null,

      /**
       * In single selection, this returns the selected index.
       * Note that you should not use this to set the selection. Instead use
       * `selected`.
       *
       * @attribute selectedIndex
       * @type number
       * @default -1
       */
      selectedIndex: -1,

      /**
       * Nodes with local name that are in the list will not be included
       * in the selection items.  In the following example, `items` returns four
       * `core-item`'s and doesn't include `h3` and `hr`.
       *
       *     <core-selector excludedLocalNames="h3 hr">
       *       <h3>Header</h3>
       *       <core-item>Item1</core-item>
       *       <core-item>Item2</core-item>
       *       <hr>
       *       <core-item>Item3</core-item>
       *       <core-item>Item4</core-item>
       *     </core-selector>
       *
       * @attribute excludedLocalNames
       * @type string
       * @default ''
       */
      excludedLocalNames: '',

      /**
       * The target element that contains items.  If this is not set
       * core-selector is the container.
       *
       * @attribute target
       * @type Object
       * @default null
       */
      target: null,

      /**
       * This can be used to query nodes from the target node to be used for
       * selection items.  Note this only works if `target` is set
       * and is not `core-selector` itself.
       *
       * Example:
       *
       *     <core-selector target="{{$.myForm}}" itemsSelector="input[type=radio]"></core-selector>
       *     <form id="myForm">
       *       <label><input type="radio" name="color" value="red"> Red</label> <br>
       *       <label><input type="radio" name="color" value="green"> Green</label> <br>
       *       <label><input type="radio" name="color" value="blue"> Blue</label> <br>
       *       <p>color = {{color}}</p>
       *     </form>
       *
       * @attribute itemsSelector
       * @type string
       * @default ''
       */
      itemsSelector: '',

      /**
       * The event that would be fired from the item element to indicate
       * it is being selected.
       *
       * @attribute activateEvent
       * @type string
       * @default 'tap'
       */
      activateEvent: 'tap',

      /**
       * Set this to true to disallow changing the selection via the
       * `activateEvent`.
       *
       * @attribute notap
       * @type boolean
       * @default false
       */
      notap: false,

      defaultExcludedLocalNames: 'template',

      observe: {
        'selected multi': 'selectedChanged'
      },

      ready: function() {
        this.activateListener = this.activateHandler.bind(this);
        this.itemFilter = this.filterItem.bind(this);
        this.excludedLocalNamesChanged();
        this.observer = new MutationObserver(this.updateSelected.bind(this));
        if (!this.target) {
          this.target = this;
        }
      },

      /**
       * Returns an array of all items.
       *
       * @property items
       */
      get items() {
        if (!this.target) {
          return [];
        }
        var nodes = this.target !== this ? (this.itemsSelector ?
            this.target.querySelectorAll(this.itemsSelector) :
                this.target.children) : this.$.items.getDistributedNodes();
        return Array.prototype.filter.call(nodes, this.itemFilter);
      },

      filterItem: function(node) {
        return !this._excludedNames[node.localName];
      },

      excludedLocalNamesChanged: function() {
        this._excludedNames = {};
        var s = this.defaultExcludedLocalNames;
        if (this.excludedLocalNames) {
          s += ' ' + this.excludedLocalNames;
        }
        s.split(/\s+/g).forEach(function(n) {
          this._excludedNames[n] = 1;
        }, this);
      },

      targetChanged: function(old) {
        if (old) {
          this.removeListener(old);
          this.observer.disconnect();
          this.clearSelection();
        }
        if (this.target) {
          this.addListener(this.target);
          this.observer.observe(this.target, {childList: true});
          this.updateSelected();
        }
      },

      addListener: function(node) {
        Polymer.addEventListener(node, this.activateEvent, this.activateListener);
      },

      removeListener: function(node) {
        Polymer.removeEventListener(node, this.activateEvent, this.activateListener);
      },

      /**
       * Returns the selected item(s). If the `multi` property is true,
       * this will return an array, otherwise it will return
       * the selected item or undefined if there is no selection.
       */
      get selection() {
        return this.$.selection.getSelection();
      },

      selectedChanged: function() {
        // TODO(ffu): Right now this is the only way to know that the `selected`
        // is an array and was mutated, as opposed to newly assigned.
        if (arguments.length === 1) {
          this.processSplices(arguments[0]);
        } else {
          this.updateSelected();
        }
      },

      updateSelected: function() {
        this.validateSelected();
        if (this.multi) {
          this.clearSelection(this.selected)
          this.selected && this.selected.forEach(function(s) {
            this.setValueSelected(s, true)
          }, this);
        } else {
          this.valueToSelection(this.selected);
        }
      },

      validateSelected: function() {
        // convert to an array for multi-selection
        if (this.multi && !Array.isArray(this.selected) &&
            this.selected != null) {
          this.selected = [this.selected];
        // use the first selected in the array for single-selection
        } else if (!this.multi && Array.isArray(this.selected)) {
          var s = this.selected[0];
          this.clearSelection([s]);
          this.selected = s;
        }
      },

      processSplices: function(splices) {
        for (var i = 0, splice; splice = splices[i]; i++) {
          for (var j = 0; j < splice.removed.length; j++) {
            this.setValueSelected(splice.removed[j], false);
          }
          for (var j = 0; j < splice.addedCount; j++) {
            this.setValueSelected(this.selected[splice.index + j], true);
          }
        }
      },

      clearSelection: function(excludes) {
        this.$.selection.selection.slice().forEach(function(item) {
          var v = this.valueForNode(item) || this.items.indexOf(item);
          if (!excludes || excludes.indexOf(v) < 0) {
            this.$.selection.setItemSelected(item, false);
          }
        }, this);
      },

      valueToSelection: function(value) {
        var item = this.valueToItem(value);
        this.$.selection.select(item);
      },

      setValueSelected: function(value, isSelected) {
        var item = this.valueToItem(value);
        if (isSelected ^ this.$.selection.isSelected(item)) {
          this.$.selection.setItemSelected(item, isSelected);
        }
      },

      updateSelectedItem: function() {
        this.selectedItem = this.selection;
      },

      selectedItemChanged: function() {
        if (this.selectedItem) {
          var t = this.selectedItem.templateInstance;
          this.selectedModel = t ? t.model : undefined;
        } else {
          this.selectedModel = null;
        }
        this.selectedIndex = this.selectedItem ?
            parseInt(this.valueToIndex(this.selected)) : -1;
      },

      valueToItem: function(value) {
        return (value === null || value === undefined) ?
            null : this.items[this.valueToIndex(value)];
      },

      valueToIndex: function(value) {
        // find an item with value == value and return it's index
        for (var i=0, items=this.items, c; (c=items[i]); i++) {
          if (this.valueForNode(c) == value) {
            return i;
          }
        }
        // if no item found, the value itself is probably the index
        return value;
      },

      valueForNode: function(node) {
        return node[this.valueattr] || node.getAttribute(this.valueattr);
      },

      // events fired from <core-selection> object
      selectionSelect: function(e, detail) {
        this.updateSelectedItem();
        if (detail.item) {
          this.applySelection(detail.item, detail.isSelected);
        }
      },

      applySelection: function(item, isSelected) {
        if (this.selectedClass) {
          item.classList.toggle(this.selectedClass, isSelected);
        }
        if (this.selectedProperty) {
          item[this.selectedProperty] = isSelected;
        }
        if (this.selectedAttribute && item.setAttribute) {
          if (isSelected) {
            item.setAttribute(this.selectedAttribute, '');
          } else {
            item.removeAttribute(this.selectedAttribute);
          }
        }
      },

      // event fired from host
      activateHandler: function(e) {
        if (!this.notap) {
          var i = this.findDistributedTarget(e.target, this.items);
          if (i >= 0) {
            var item = this.items[i];
            var s = this.valueForNode(item) || i;
            if (this.multi) {
              if (this.selected) {
                this.addRemoveSelected(s);
              } else {
                this.selected = [s];
              }
            } else {
              this.selected = s;
            }
            this.asyncFire('core-activate', {item: item});
          }
        }
      },

      addRemoveSelected: function(value) {
        var i = this.selected.indexOf(value);
        if (i >= 0) {
          this.selected.splice(i, 1);
        } else {
          this.selected.push(value);
        }
      },

      findDistributedTarget: function(target, nodes) {
        // find first ancestor of target (including itself) that
        // is in nodes, if any
        while (target && target != this) {
          var i = Array.prototype.indexOf.call(nodes, target);
          if (i >= 0) {
            return i;
          }
          target = target.parentNode;
        }
      },

      selectIndex: function(index) {
        var item = this.items[index];
        if (item) {
          this.selected = this.valueForNode(item) || index;
          return item;
        }
      },

      /**
       * Selects the previous item. This should be used in single selection only.
       *
       * @method selectPrevious
       * @param {boolean} wrapped if true and it is already at the first item,
       *                  wrap to the end
       * @returns the previous item or undefined if there is none
       */
      selectPrevious: function(wrapped) {
        var i = wrapped && !this.selectedIndex ?
            this.items.length - 1 : this.selectedIndex - 1;
        return this.selectIndex(i);
      },

      /**
       * Selects the next item.  This should be used in single selection only.
       *
       * @method selectNext
       * @param {boolean} wrapped if true and it is already at the last item,
       *                  wrap to the front
       * @returns the next item or undefined if there is none
       */
      selectNext: function(wrapped) {
        var i = wrapped && this.selectedIndex >= this.items.length - 1 ?
            0 : this.selectedIndex + 1;
        return this.selectIndex(i);
      }

    });
  ;

(function() {

window.CoreStyle = window.CoreStyle || {
  g: {},
  list: {},
  refMap: {}
};

Polymer('core-style', {
  /**
   * The `id` property should be set if the `core-style` is a producer
   * of styles. In this case, the `core-style` should have text content
   * that is cssText.
   *
   * @attribute id
   * @type string
   * @default ''
   */


  publish: {
    /**
     * The `ref` property should be set if the `core-style` element is a 
     * consumer of styles. Set it to the `id` of the desired `core-style`
     * element.
     *
     * @attribute ref
     * @type string
     * @default ''
     */
    ref: ''
  },

  // static
  g: CoreStyle.g,
  refMap: CoreStyle.refMap,

  /**
   * The `list` is a map of all `core-style` producers stored by `id`. It 
   * should be considered readonly. It's useful for nesting one `core-style`
   * inside another.
   *
   * @attribute list
   * @type object
   * @default {map of all `core-style` producers}
   */
  list: CoreStyle.list,

  // if we have an id, we provide style
  // if we have a ref, we consume/require style
  ready: function() {
    if (this.id) {
      this.provide();
    } else {
      this.registerRef(this.ref);
      if (!window.ShadowDOMPolyfill) {
        this.require();
      }  
    }
  },

  // can't shim until attached if using SD polyfill because need to find host
  attached: function() {
    if (!this.id && window.ShadowDOMPolyfill) {
      this.require();
    }
  },

  /****** producer stuff *******/

  provide: function() {
    this.register();
    // we want to do this asap, especially so we can do so before definitions
    // that use this core-style are registered.
    if (this.textContent) {
      this._completeProvide();
    } else {
      this.async(this._completeProvide);
    }
  },

  register: function() {
    var i = this.list[this.id];
    if (i) {
      if (!Array.isArray(i)) {
        this.list[this.id] = [i];
      }
      this.list[this.id].push(this);
    } else {
      this.list[this.id] = this;  
    }
  },

  // stamp into a shadowRoot so we can monitor dom of the bound output
  _completeProvide: function() {
    this.createShadowRoot();
    this.domObserver = new MutationObserver(this.domModified.bind(this))
        .observe(this.shadowRoot, {subtree: true, 
        characterData: true, childList: true});
    this.provideContent();
  },

  provideContent: function() {
    this.ensureTemplate();
    this.shadowRoot.textContent = '';
    this.shadowRoot.appendChild(this.instanceTemplate(this.template));
    this.cssText = this.shadowRoot.textContent;
  },

  ensureTemplate: function() {
    if (!this.template) {
      this.template = this.querySelector('template:not([repeat]):not([bind])');
      // move content into the template
      if (!this.template) {
        this.template = document.createElement('template');
        var n = this.firstChild;
        while (n) {
          this.template.content.appendChild(n.cloneNode(true));
          n = n.nextSibling;
        }
      }
    }
  },

  domModified: function() {
    this.cssText = this.shadowRoot.textContent;
    this.notify();
  },

  // notify instances that reference this element
  notify: function() {
    var s$ = this.refMap[this.id];
    if (s$) {
      for (var i=0, s; (s=s$[i]); i++) {
        s.require();
      }
    }
  },

  /****** consumer stuff *******/

  registerRef: function(ref) {
    //console.log('register', ref);
    this.refMap[this.ref] = this.refMap[this.ref] || [];
    this.refMap[this.ref].push(this);
  },

  applyRef: function(ref) {
    this.ref = ref;
    this.registerRef(this.ref);
    this.require();
  },

  require: function() {
    var cssText = this.cssTextForRef(this.ref);
    //console.log('require', this.ref, cssText);
    if (cssText) {
      this.ensureStyleElement();
      // do nothing if cssText has not changed
      if (this.styleElement._cssText === cssText) {
        return;
      }
      this.styleElement._cssText = cssText;
      if (window.ShadowDOMPolyfill) {
        this.styleElement.textContent = cssText;
        cssText = WebComponents.ShadowCSS.shimStyle(this.styleElement,
            this.getScopeSelector());
      }
      this.styleElement.textContent = cssText;
    }
  },

  cssTextForRef: function(ref) {
    var s$ = this.byId(ref);
    var cssText = '';
    if (s$) {
      if (Array.isArray(s$)) {
        var p = [];
        for (var i=0, l=s$.length, s; (i<l) && (s=s$[i]); i++) {
          p.push(s.cssText);
        }
        cssText = p.join('\n\n');
      } else {
        cssText = s$.cssText;
      }
    }
    if (s$ && !cssText) {
      console.warn('No styles provided for ref:', ref);
    }
    return cssText;
  },

  byId: function(id) {
    return this.list[id];
  },

  ensureStyleElement: function() {
    if (!this.styleElement) {
      this.styleElement = window.ShadowDOMPolyfill ? 
          this.makeShimStyle() :
          this.makeRootStyle();
    }
    if (!this.styleElement) {
      console.warn(this.localName, 'could not setup style.');
    }
  },

  makeRootStyle: function() {
    var style = document.createElement('style');
    this.appendChild(style);
    return style;
  },

  makeShimStyle: function() {
    var host = this.findHost(this);
    if (host) {
      var name = host.localName;
      var style = document.querySelector('style[' + name + '=' + this.ref +']');
      if (!style) {
        style = document.createElement('style');
        style.setAttribute(name, this.ref);
        document.head.appendChild(style);
      }
      return style;
    }
  },

  getScopeSelector: function() {
    if (!this._scopeSelector) {
      var selector = '', host = this.findHost(this);
      if (host) {
        var typeExtension = host.hasAttribute('is');
        var name = typeExtension ? host.getAttribute('is') : host.localName;
        selector = WebComponents.ShadowCSS.makeScopeSelector(name, 
            typeExtension);
      }
      this._scopeSelector = selector;
    }
    return this._scopeSelector;
  },

  findHost: function(node) {
    while (node.parentNode) {
      node = node.parentNode;
    }
    return node.host || wrap(document.documentElement);
  },

  /* filters! */
  // TODO(dfreedm): add more filters!

  cycle: function(rgb, amount) {
    if (rgb.match('#')) {
      var o = this.hexToRgb(rgb);
      if (!o) {
        return rgb;
      }
      rgb = 'rgb(' + o.r + ',' + o.b + ',' + o.g + ')';
    }

    function cycleChannel(v) {
      return Math.abs((Number(v) - amount) % 255);
    }

    return rgb.replace(/rgb\(([^,]*),([^,]*),([^,]*)\)/, function(m, a, b, c) {
      return 'rgb(' + cycleChannel(a) + ',' + cycleChannel(b) + ', ' 
          + cycleChannel(c) + ')';
    });
  },

  hexToRgb: function(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
  }

});


})();
;


  (function() {
    
    var SKIP_ID = 'meta';
    var metaData = {}, metaArray = {};

    Polymer('core-meta', {
      
      /**
       * The type of meta-data.  All meta-data with the same type with be
       * stored together.
       * 
       * @attribute type
       * @type string
       * @default 'default'
       */
      type: 'default',
      
      alwaysPrepare: true,
      
      ready: function() {
        this.register(this.id);
      },
      
      get metaArray() {
        var t = this.type;
        if (!metaArray[t]) {
          metaArray[t] = [];
        }
        return metaArray[t];
      },
      
      get metaData() {
        var t = this.type;
        if (!metaData[t]) {
          metaData[t] = {};
        }
        return metaData[t];
      },
      
      register: function(id, old) {
        if (id && id !== SKIP_ID) {
          this.unregister(this, old);
          this.metaData[id] = this;
          this.metaArray.push(this);
        }
      },
      
      unregister: function(meta, id) {
        delete this.metaData[id || meta.id];
        var i = this.metaArray.indexOf(meta);
        if (i >= 0) {
          this.metaArray.splice(i, 1);
        }
      },
      
      /**
       * Returns a list of all meta-data elements with the same type.
       * 
       * @property list
       * @type array
       * @default []
       */
      get list() {
        return this.metaArray;
      },
      
      /**
       * Retrieves meta-data by ID.
       *
       * @method byId
       * @param {String} id The ID of the meta-data to be returned.
       * @returns Returns meta-data.
       */
      byId: function(id) {
        return this.metaData[id];
      }
      
    });
    
  })();
  
;

    Polymer('core-transition', {
      
      type: 'transition',

      /**
       * Run the animation.
       *
       * @method go
       * @param {Node} node The node to apply the animation on
       * @param {Object} state State info
       */
      go: function(node, state) {
        this.complete(node);
      },

      /**
       * Set up the animation. This may include injecting a stylesheet,
       * applying styles, creating a web animations object, etc.. This
       *
       * @method setup
       * @param {Node} node The animated node
       */
      setup: function(node) {
      },

      /**
       * Tear down the animation.
       *
       * @method teardown
       * @param {Node} node The animated node
       */
      teardown: function(node) {
      },

      /**
       * Called when the animation completes. This function also fires the
       * `core-transitionend` event.
       *
       * @method complete
       * @param {Node} node The animated node
       */
      complete: function(node) {
        this.fire('core-transitionend', null, node);
      },

      /**
       * Utility function to listen to an event on a node once.
       *
       * @method listenOnce
       * @param {Node} node The animated node
       * @param {string} event Name of an event
       * @param {Function} fn Event handler
       * @param {Array} args Additional arguments to pass to `fn`
       */
      listenOnce: function(node, event, fn, args) {
        var self = this;
        var listener = function() {
          fn.apply(self, args);
          node.removeEventListener(event, listener, false);
        }
        node.addEventListener(event, listener, false);
      }

    });
  ;


(function () {

// create some basic transition styling data.
var transitions = CoreStyle.g.transitions = CoreStyle.g.transitions || {};
transitions.duration = '500ms';
transitions.heroDelay = '50ms';
transitions.scaleDelay = '500ms';
transitions.cascadeFadeDuration = '250ms';

Polymer('core-transition-pages',{

  publish: {
    /**
     * This class will be applied to the scope element in the `prepare` function.
     * It is removed in the `complete` function. Used to activate a set of CSS
     * rules that need to apply before the transition runs, e.g. a default opacity
     * or transform for the non-active pages.
     *
     * @attribute scopeClass
     * @type string
     * @default ''
     */
    scopeClass: '',

    /**
     * This class will be applied to the scope element in the `go` function. It is
     * remoived in the `complete' function. Generally used to apply a CSS transition
     * rule only during the transition.
     *
     * @attribute activeClass
     * @type string
     * @default ''
     */
    activeClass: '',

    /**
     * Specifies which CSS property to look for when it receives a `transitionEnd` event
     * to determine whether the transition is complete. If not specified, the first
     * transitionEnd event received will complete the transition.
     *
     * @attribute transitionProperty
     * @type string
     * @default ''
     */
    transitionProperty: ''
  },

  /**
   * True if this transition is complete.
   *
   * @attribute completed
   * @type boolean
   * @default false
   */
  completed: false,

  prepare: function(scope, options) {
    this.boundCompleteFn = this.complete.bind(this, scope);
    if (this.scopeClass) {
      scope.classList.add(this.scopeClass);
    }
  },

  go: function(scope, options) {
    this.completed = false;
    if (this.activeClass) {
      scope.classList.add(this.activeClass);
    }
    scope.addEventListener('transitionend', this.boundCompleteFn, false);
  },

  setup: function(scope) {
    if (!scope._pageTransitionStyles) {
      scope._pageTransitionStyles = {};
    }

    var name = this.calcStyleName();
    
    if (!scope._pageTransitionStyles[name]) {
      this.installStyleInScope(scope, name);
      scope._pageTransitionStyles[name] = true;
    }
  },

  calcStyleName: function() {
    return this.id || this.localName;
  },

  installStyleInScope: function(scope, id) {
    if (!scope.shadowRoot) {
      scope.createShadowRoot().innerHTML = '<content></content>';
    }
    var root = scope.shadowRoot;
    var scopeStyle = document.createElement('core-style');
    root.insertBefore(scopeStyle, root.firstChild);
    scopeStyle.applyRef(id);
  },

  complete: function(scope, e) {
    // TODO(yvonne): hack, need to manage completion better
    if (e.propertyName !== 'box-shadow' && (!this.transitionProperty || e.propertyName.indexOf(this.transitionProperty) !== -1)) {
      this.completed = true;
      this.fire('core-transitionend', this, scope);
    }
  },

  // TODO(sorvell): ideally we do this in complete.
  ensureComplete: function(scope) {
    scope.removeEventListener('transitionend', this.boundCompleteFn, false);
    if (this.scopeClass) {
      scope.classList.remove(this.scopeClass);
    }
    if (this.activeClass) {
      scope.classList.remove(this.activeClass);
    }
  }

});

})();

;

(function() {

  var webkitStyles = '-webkit-transition' in document.documentElement.style
  var TRANSITION_CSSNAME = webkitStyles ? '-webkit-transition' : 'transition';
  var TRANSFORM_CSSNAME = webkitStyles ? '-webkit-transform' : 'transform';
  var TRANSITION_NAME = webkitStyles ? 'webkitTransition' : 'transition';
  var TRANSFORM_NAME = webkitStyles ? 'webkitTransform' : 'transform';

  var hasShadowDOMPolyfill = window.ShadowDOMPolyfill;

  Polymer('hero-transition',{

    go: function(scope, options) {
      var props = [
        'border-radius',
        'width',
        'height',
        TRANSFORM_CSSNAME
      ];

      var duration = options && options.duration || 
          (CoreStyle.g.transitions.heroDuration || 
          CoreStyle.g.transitions.duration);

      scope._heroes.forEach(function(h) {
        var d = h.h0.hasAttribute('hero-delayed') ? CoreStyle.g.transitions.heroDelay : '';
        var wt = [];
        props.forEach(function(p) {
          wt.push(p + ' ' + duration + ' ' + options.easing + ' ' + d);
        });

        h.h1.style[TRANSITION_NAME] = wt.join(', ');
        h.h1.style.borderRadius = h.r1;
        h.h1.style[TRANSFORM_NAME] = '';
      });

      this.super(arguments);

      if (!scope._heroes.length) {
        this.completed = true;
      }
    },

    prepare: function(scope, options) {
      this.super(arguments);
      var src = options.src, dst = options.dst;

      if (scope._heroes && scope._heroes.length) {
        this.ensureComplete(scope);
      } else {
        scope._heroes = [];
      }

      // FIXME(yvonne): basic support for nested pages.
      // Look for heroes in the light DOM and one level of shadow DOM of the src and dst,
      // and also in src.selectedItem or dst.selectedItem, then transform the dst hero to src
      var ss = '[hero]';
      var h$ = this.findAllInShadows(src, ss);
      if (src.selectedItem) {
        hs$ = this.findAllInShadows(src.selectedItem, ss);
        hsa$ = [];
        // De-duplicate items
        Array.prototype.forEach.call(hs$, function(hs) {
          if (h$.indexOf(hs) === -1) {
            hsa$.push(hs);
          }
        })
        h$ = h$.concat(hsa$);
      }

      for (var i=0, h0; h0=h$[i]; i++) {
        var v = h0.getAttribute('hero-id');
        var ds = '[hero][hero-id="' + v + '"]';
        var h1 = this.findInShadows(dst, ds);

        if (!h1 && dst.selectedItem) {
          h1 = this.findInShadows(dst.selectedItem, ds);
        }

        // console.log('src', src);
        // console.log('dst', dst, dst.selectedItem);
        // console.log(v, h0, h1);
        if (v && h1) {
          var c0 = getComputedStyle(h0);
          var c1 = getComputedStyle(h1);
          var h = {
            h0: h0,
            b0: h0.getBoundingClientRect(),
            r0: c0.borderRadius,
            h1: h1,
            b1: h1.getBoundingClientRect(),
            r1: c1.borderRadius
          };

          var dl = h.b0.left - h.b1.left;
          var dt = h.b0.top - h.b1.top;
          var sw = h.b0.width / h.b1.width;
          var sh = h.b0.height / h.b1.height;

          // h.scaley = h.h0.hasAttribute('scaley');
          // if (!h.scaley && (sw !== 1 || sh !== 1)) {
          //   sw = sh = 1;
          //   h.h1.style.width = h.b0.width + 'px';
          //   h.h1.style.height = h.b0.height + 'px';
          // }

          // Also animate the border-radius for the circle-to-square transition
          if (h.r0 !== h.r1) {
            h.h1.style.borderRadius = h.r0;
          }

          // console.log(h);

          h.h1.style[TRANSFORM_NAME] = 'translate(' + dl + 'px,' + dt + 'px)' + ' scale(' + sw + ',' + sh + ')';
          h.h1.style[TRANSFORM_NAME + 'Origin'] = '0 0';

          scope._heroes.push(h);
        }
      }

    },

    // carefully look into ::shadow with polyfill specific hack
    findInShadows: function(node, selector) {
      return node.querySelector(selector) || (hasShadowDOMPolyfill ? 
          queryAllShadows(node, selector) :
          node.querySelector('::shadow ' + selector));
    },

    findAllInShadows: function(node, selector) {
      if (hasShadowDOMPolyfill) {
        var nodes = node.querySelectorAll(selector).array();
        var shadowNodes = queryAllShadows(node, selector, true);
        return nodes.concat(shadowNodes);
      } else {
        return node.querySelectorAll(selector).array().concat(node.shadowRoot ? node.shadowRoot.querySelectorAll(selector).array() : []);
      }
    },

    ensureComplete: function(scope) {
      this.super(arguments);
      if (scope._heroes) {
        scope._heroes.forEach(function(h) {
          h.h1.style[TRANSITION_NAME] = '';
          h.h1.style[TRANSFORM_NAME] = '';
        });
        scope._heroes = [];
      }
    },

    complete: function(scope, e) {
      // if (e.propertyName === TRANSFORM_CSSNAME) {
        var done = false;
        scope._heroes.forEach(function(h) {
          if (h.h1 === e.path[0]) {
            done = true;
          }
        });

        if (done) {
          this.super(arguments);
        }
      // }
    }

  });

  
  // utility method for searching through shadowRoots.
  function queryShadow(node, selector) {
    var m, el = node.firstElementChild;
    var shadows, sr, i;
    shadows = [];
    sr = node.shadowRoot;
    while(sr) {
      shadows.push(sr);
      sr = sr.olderShadowRoot;
    }
    for(i = shadows.length - 1; i >= 0; i--) {
      m = shadows[i].querySelector(selector);
      if (m) {
        return m;
      }
    }
    while(el) {
      m = queryShadow(el, selector);
      if (m) {
        return m;
      }
      el = el.nextElementSibling;
    }
    return null;
  }

  function _queryAllShadows(node, selector, results) {
    var el = node.firstElementChild;
    var temp, sr, shadows, i, j;
    shadows = [];
    sr = node.shadowRoot;
    while(sr) {
      shadows.push(sr);
      sr = sr.olderShadowRoot;
    }
    for (i = shadows.length - 1; i >= 0; i--) {
      temp = shadows[i].querySelectorAll(selector);
      for(j = 0; j < temp.length; j++) {
        results.push(temp[j]);
      }
    }
    while (el) {
      _queryAllShadows(el, selector, results);
      el = el.nextElementSibling;
    }
    return results;
  }

  queryAllShadows = function(node, selector, all) {
    if (all) {
      return _queryAllShadows(node, selector, []);
    } else {
      return queryShadow(node, selector);
    }
  };

})();
;


  Polymer('core-animated-pages',Polymer.mixin({

    eventDelegates: {
      'core-transitionend': 'transitionEnd'
    },

    /**
     * A space-delimited string of transitions to use when switching between pages in this element.
     * The strings are `id`s of `core-transition-pages` elements included elsewhere. See the
     * individual transition's document for specific details.
     *
     * @attribute transitions
     * @type string
     * @default ''
     */
    transitions: '',

    selected: 0,

    /**
     * The last page selected. This property is useful to dynamically set transitions based
     * on incoming and outgoing pages.
     *
     * @attribute lastSelected
     * @type Object
     * @default null
     */
    lastSelected: null,

    registerCallback: function() {
      this.tmeta = document.createElement('core-transition');
    },

    created: function() {
      this._transitions = [];
      this.transitioning = [];
    },

    attached: function() {
      this.resizerAttachedHandler();
    },

    detached: function() {
      this.resizerDetachedHandler();
    },

    transitionsChanged: function() {
      this._transitions = this.transitions.split(' ');
    },

    _transitionsChanged: function(old) {
      if (this._transitionElements) {
        this._transitionElements.forEach(function(t) {
          t.teardown(this);
        }, this);
      }
      this._transitionElements = [];
      this._transitions.forEach(function(transitionId) {
        var t = this.getTransition(transitionId);
        if (t) {
          this._transitionElements.push(t);
          t.setup(this);
        }
      }, this);
    },

    getTransition: function(transitionId) {
      return this.tmeta.byId(transitionId);
    },

    selectionSelect: function(e, detail) {
      this.updateSelectedItem();
      // Wait to call applySelection when we run the transition
    },

    applyTransition: function(src, dst) {
      if (this.animating) {
        this.cancelAsync(this.animating);
        this.animating = null;
      }

      Polymer.flush();

      if (this.transitioning.indexOf(src) === -1) {
        this.transitioning.push(src);
      }
      if (this.transitioning.indexOf(dst) === -1) {
        this.transitioning.push(dst);
      }
      // force src, dst to display 
      src.setAttribute('animate', '');
      dst.setAttribute('animate', '');
      //
      var options = {
        src: src,
        dst: dst,
        easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
      };

      // fire an event so clients have a chance to do something when the
      // new page becomes visible but before it draws.
      this.fire('core-animated-pages-transition-prepare');

      //
      // prepare transition
      this._transitionElements.forEach(function(transition) {
        transition.prepare(this, options);
      }, this);
      //
      // force layout!
      src.offsetTop;

      //
      // apply selection
      this.applySelection(dst, true);
      this.applySelection(src, false);
      //
      // start transition
      this._transitionElements.forEach(function(transition) {
        transition.go(this, options);
      }, this);

      if (!this._transitionElements.length) {
        this.complete();
      } else {
        this.animating = this.async(this.complete.bind(this), null, 5000);
      }
    },

    complete: function() {
      if (this.animating) {
        this.cancelAsync(this.animating);
        this.animating = null;
      }

      this.transitioning.forEach(function(t) {
        t.removeAttribute('animate');
      });
      this.transitioning = [];

      this._transitionElements.forEach(function(transition) {
        transition.ensureComplete(this);
      }, this);

      this.fire('core-animated-pages-transition-end');
    },
    
    transitionEnd: function(e) {
      if (this.transitioning.length) {
        var completed = true;
        this._transitionElements.forEach(function(transition) {
          if (!transition.completed) {
            completed = false;
          }
        });
        if (completed) {
          this.job('transitionWatch', function() {
            this.complete();
          }, 100);
        }
      }
    },

    selectedChanged: function(old) {
      this.lastSelected = old;
      this.super(arguments);
    },

    selectedItemChanged: function(oldItem) {
      this.super(arguments);

      if (!oldItem) {
        this.applySelection(this.selectedItem, true);
        this.async(this.notifyResize);
        return;
      }

      if (this.hasAttribute('no-transition') || !this._transitionElements || !this._transitionElements.length) {
        this.applySelection(oldItem, false);
        this.applySelection(this.selectedItem, true);
        this.notifyResize();
        return;
      }

      if (oldItem && this.selectedItem) {
        // TODO(sorvell): allow bindings to update first?
        var self = this;
        Polymer.flush();
        Polymer.endOfMicrotask(function() {
          self.applyTransition(oldItem, self.selectedItem);
          self.notifyResize();
        });
      }
    },

    resizerShouldNotify: function(el) {
      // Only notify descendents of selected item
      while (el && (el != this)) {
        if (el == this.selectedItem) {
          return true;
        }
        el = el.parentElement || (el.parentNode && el.parentNode.host);
      }
    }

  }, Polymer.CoreResizer));

;

    (function() {

      function toNumber(value, allowInfinity) {
        return (allowInfinity && value === 'Infinity') ? Number.POSITIVE_INFINITY : Number(value);
      };

      Polymer('core-animation',{
       /**
        * Fired when the animation completes.
        *
        * @event core-animation-finish
        */

       /**
        *
        * Fired when the web animation object changes.
        *
        * @event core-animation-change
        */

        publish: {

          /**
           * One or more nodes to animate.
           *
           * @property target
           * @type HTMLElement|Node|Array<HTMLElement|Node>
           */
          target: {value: null, reflect: true},

          /**
           * Animation keyframes specified as an array of dictionaries of
           * &lt;css properties&gt;:&lt;array of values&gt; pairs. For example,
           *
           * @property keyframes
           * @type Object
           */
          keyframes: {value: null, reflect: true},

          /**
           * A custom animation function. Either provide this or `keyframes`. The signature
           * of the callback is `EffectsCallback(timeFraction, target, animation)`
           *
           * @property customEffect
           * @type Function(number, Object, Object)
           */
          customEffect: {value: null, reflect: true},

          /**
           * Controls the composition behavior. If set to "replace", the effect overrides
           * the underlying value for the target. If set the "add", the effect is added to
           * the underlying value for the target. If set to "accumulate", the effect is
           * accumulated to the underlying value for the target.
           *
           * In cases such as numbers or lengths, "add" and "accumulate" produce the same
           * value. In list values, "add" is appending to the list, while "accumulate" is
           * adding the individual components of the list.
           *
           * For example, adding `translateX(10px)` and `translateX(25px)` produces
           * `translateX(10px) translateX(25px)` and accumulating produces `translateX(35px)`.
           *
           * @property composite
           * @type "replace"|"add"|"accumulate"
           * @default "replace"
           */
          composite: {value: 'replace', reflect: true},

          /**
           * Animation duration in milliseconds, "Infinity", or "auto". "auto" is
           * equivalent to 0.
           *
           * @property duration
           * @type number|"Infinity"
           * @default "auto"
           */
          duration: {value: 'auto', reflect: true},

          /**
           * Controls the effect the animation has on the target when it's not playing.
           * The possible values are "none", "forwards", "backwards", "both" or "auto".
           *
           * "none" means the animation has no effect when it's not playing.
           *
           * "forwards" applies the value at the end of the animation after it's finished.
           *
           * "backwards" applies the value at the start of the animation to the target
           * before it starts playing and has no effect when the animation finishes.
           *
           * "both" means "forwards" and "backwards". "auto" is equivalent to "none".
           *
           * @property fill
           * @type "none"|"forwards"|"backwards"|"both"|"auto"
           * @default "auto"
           */
          fill: {value: 'auto', reflect: true},

          /**
           * A transition timing function. The values are equivalent to the CSS
           * counterparts.
           *
           * @property easing
           * @type string
           * @default "linear"
           */
          easing: {value: 'linear', reflect: true},

          /**
           * The number of milliseconds to delay before beginning the animation.
           *
           * @property delay
           * @type Number
           * @default 0
           */
          delay: {value: 0, reflect: true},

          /**
           * The number of milliseconds to wait after the animation finishes. This is
           * useful, for example, in an animation group to wait for some time before
           * beginning the next item in the animation group.
           *
           * @property endDelay
           * @type number
           * @default 0
           */
          endDelay: {value: 0, reflect: true},

          /**
           * The number of iterations this animation should run for.
           *
           * @property iterations
           * @type Number|'Infinity'
           * @default 1
           */
          iterations: {value: 1, reflect: true},

          /**
           * Number of iterations into the animation in which to begin the effect.
           * For example, setting this property to 0.5 and `iterations` to 2 will
           * cause the animation to begin halfway through the first iteration but still
           * run twice.
           *
           * @property iterationStart
           * @type Number
           * @default 0
           */
          iterationStart: {value: 0, reflect: true},

          /**
           * (not working in web animations polyfill---do not use)
           *
           * Controls the iteration composition behavior. If set to "replace", the effect for
           * every iteration is independent of each other. If set to "accumulate", the effect
           * for iterations of the animation will build upon the value in the previous iteration.
           *
           * Example:
           *
           *    // Moves the target 50px on the x-axis over 5 iterations.
           *    <core-animation iterations="5" iterationComposite="accumulate">
           *      <core-animation-keyframe>
           *        <core-animation-prop name="transform" value="translateX(10px)"></core-animation-prop>
           *      </core-animation-keyframe>
           *    </core-animation>
           *
           * @property iterationComposite
           * @type "replace"|"accumulate"
           * @default false
           */
          iterationComposite: {value: 'replace', reflect: true},

          /**
           * The playback direction of the animation. "normal" plays the animation in the
           * normal direction. "reverse" plays it in the reverse direction. "alternate"
           * alternates the playback direction every iteration such that even iterations are
           * played normally and odd iterations are reversed. "alternate-reverse" plays
           * even iterations in the reverse direction and odd iterations in the normal
           * direction.
           *
           * @property direction
           * @type "normal"|"reverse"|"alternate"|"alternate-reverse"
           * @default "normal"
           */
          direction: {value: 'normal', reflect: true},

          /**
           * A multiplier to the playback rate to the animation.
           *
           * @property playbackRate
           * @type number
           * @default 1
           */
          playbackRate: {value: 1, reflect: true},

          /**
           * If set to true, play the animation when it is created or a property is updated.
           *
           * @property autoplay
           * @type boolean
           * @default false
           */
          autoplay: {value: false, reflect: true}

        },

        animation: false,

        observe: {
          target: 'apply',
          keyframes: 'apply',
          customEffect: 'apply',
          composite: 'apply',
          duration: 'apply',
          fill: 'apply',
          easing: 'apply',
          iterations: 'apply',
          iterationStart: 'apply',
          iterationComposite: 'apply',
          delay: 'apply',
          endDelay: 'apply',
          direction: 'apply',
          playbackRate: 'apply',
          autoplay: 'apply'
        },

        ready: function() {
          this.apply();
        },

        /**
         * Plays the animation. If the animation is currently paused, seeks the animation
         * to the beginning before starting playback.
         *
         * @method play
         * @return AnimationPlayer The animation player.
         */
        play: function() {
          this.apply();
          if (this.animation && !this.autoplay) {
            this.player = document.timeline.play(this.animation);
            this.player.onfinish = this.animationFinishHandler.bind(this);
            return this.player;
          }
        },

        /**
         * Stops the animation and clears all effects on the target.
         *
         * @method cancel
         */
        cancel: function() {
          if (this.player) {
            this.player.cancel();
          }
        },

        /**
         * Seeks the animation to the end.
         *
         * @method finish
         */
        finish: function() {
          if (this.player) {
            this.player.finish();
          }
        },

        /**
         * Pauses the animation.
         *
         * @method pause
         */
        pause: function() {
          if (this.player) {
            this.player.pause();
          }
        },

        /**
         * @method hasTarget
         * @return boolean True if `target` is defined.
         */
        hasTarget: function() {
          return this.target !== null;
        },

        /**
         * Creates a web animations object based on this object's properties, and
         * plays it if autoplay is true.
         *
         * @method apply
         * @return Object A web animation.
         */
        apply: function() {
          this.animation = this.makeAnimation();
          if (this.autoplay && this.animation) {
            this.play();
          }
          return this.animation;
        },

        makeSingleAnimation: function(target) {
          // XXX(yvonne): for selecting all the animated elements.
          target.classList.add('core-animation-target');
          return new Animation(target, this.animationEffect, this.timingProps);
        },

        makeAnimation: function() {
          if (!this.target) {
            return null;
          }
          var animation;
          if (Array.isArray(this.target)) {
            var array = [];
            this.target.forEach(function(t) {
              array.push(this.makeSingleAnimation(t));
            }.bind(this));
            animation = new AnimationGroup(array);
          } else {
            animation = this.makeSingleAnimation(this.target);
          }
          return animation;
        },

        animationChanged: function() {
          // Sending 'this' with the event so you can always get the animation object
          // that fired the event, due to event retargetting in shadow DOM.
          this.fire('core-animation-change', this);
        },

        targetChanged: function(old) {
          if (old) {
            old.classList.remove('core-animation-target');
          }
        },

        get timingProps() {
          var props = {};
          var timing = {
            delay: {isNumber: true},
            endDelay: {isNumber: true},
            fill: {},
            iterationStart: {isNumber: true},
            iterations: {isNumber: true, allowInfinity: true},
            duration: {isNumber: true},
            playbackRate: {isNumber: true},
            direction: {},
            easing: {}
          };
          for (t in timing) {
            if (this[t] !== null) {
              var name = timing[t].property || t;
              props[name] = timing[t].isNumber && this[t] !== 'auto' ?
                  toNumber(this[t], timing[t].allowInfinity) : this[t];
            }
          }
          return props;
        },

        get animationEffect() {
          var props = {};
          var frames = [];
          var effect;
          if (this.keyframes) {
            frames = this.keyframes;
          } else if (!this.customEffect) {
            var children = this.querySelectorAll('core-animation-keyframe');
            if (children.length === 0 && this.shadowRoot) {
              children = this.shadowRoot.querySelectorAll('core-animation-keyframe');
            }
            Array.prototype.forEach.call(children, function(c) {
              frames.push(c.properties);
            });
          }
          if (this.customEffect) {
            effect = this.customEffect;
          } else {
            // effect = new KeyframeEffect(frames, this.composite);
            effect = frames;
          }
          return effect;
        },

        animationFinishHandler: function() {
          this.fire('core-animation-finish');
        }

      });
    })();
  ;

    Polymer('core-animation-keyframe',{
      publish: {
        /**
         * An offset from 0 to 1.
         *
         * @property offset
         * @type Number
         */
        offset: {value: null, reflect: true}
      },
      get properties() {
        var props = {};
        var children = this.querySelectorAll('core-animation-prop');
        Array.prototype.forEach.call(children, function(c) {
          props[c.name] = c.value;
        });
        if (this.offset !== null) {
          props.offset = this.offset;
        }
        return props;
      }
    });
  ;

    Polymer('core-animation-prop',{
      publish: {
        /**
         * A CSS property name.
         *
         * @property name
         * @type string
         */
        name: {value: '', reflect: true},

        /**
         * The value for the CSS property.
         *
         * @property value
         * @type string|number
         */
        value: {value: '', reflect: true}
      }
    });
  ;

    (function() {

      var ANIMATION_GROUPS = {
        'par': AnimationGroup,
        'seq': AnimationSequence
      };

      Polymer('core-animation-group',{

        publish: {
          /**
           * If target is set, any children without a target will be assigned the group's
           * target when this property is set.
           *
           * @property target
           * @type HTMLElement|Node|Array|Array<HTMLElement|Node>
           */

          /**
           * For a `core-animation-group`, a duration of "auto" means the duration should
           * be the specified duration of its children. If set to anything other than
           * "auto", any children without a set duration will be assigned the group's duration.
           *
           * @property duration
           * @type number
           * @default "auto"
           */
          duration: {value: 'auto', reflect: true},

          /**
           * The type of the animation group. 'par' creates a parallel group and 'seq' creates
           * a sequential group.
           *
           * @property type
           * @type String
           * @default 'par'
           */
          type: {value: 'par', reflect: true}
        },

        typeChanged: function() {
          this.apply();
        },

        targetChanged: function() {
          // Only propagate target to children animations if it's defined.
          if (this.target) {
            this.doOnChildren(function(c) {
              c.target = this.target;
            }.bind(this));
          }
        },

        durationChanged: function() {
          if (this.duration && this.duration !== 'auto') {
            this.doOnChildren(function(c) {
              // Propagate to children that is not a group and has no
              // duration specified.
              if (!c.type && (!c.duration || c.duration === 'auto')) {
                c.duration = this.duration;
              }
            }.bind(this));
          }
        },

        doOnChildren: function(inFn) {
          var children = this.children;
          if (!children.length) {
            children = this.shadowRoot ? this.shadowRoot.childNodes : [];
          }
          Array.prototype.forEach.call(children, function(c) {
            // TODO <template> in the way
            c.apply && inFn(c);
          }, this);
        },

        makeAnimation: function() {
          return new ANIMATION_GROUPS[this.type](this.childAnimations, this.timingProps);
        },

        hasTarget: function() {
          var ht = this.target !== null;
          if (!ht) {
            this.doOnChildren(function(c) {
              ht = ht || c.hasTarget();
            }.bind(this));
          }
          return ht;
        },

        apply: function() {
          // Propagate target and duration to child animations first.
          this.durationChanged();
          this.targetChanged();
          this.doOnChildren(function(c) {
            c.apply();
          });
          return this.super();
        },

        get childAnimationElements() {
          var list = [];
          this.doOnChildren(function(c) {
            if (c.makeAnimation) {
              list.push(c);
            }
          });
          return list;
        },

        get childAnimations() {
          var list = [];
          this.doOnChildren(function(c) {
            if (c.animation) {
              list.push(c.animation);
            }
          });
          return list;
        }
      });

    })();
  ;


  Polymer('core-collapse', {

    /**
     * Fired when the `core-collapse`'s `opened` property changes.
     * 
     * @event core-collapse-open
     */

    /**
     * Fired when the target element has been resized as a result of the opened
     * state changing.
     * 
     * @event core-resize
     */

    /**
     * The target element that will be opened when the `core-collapse` is 
     * opened. If unspecified, the `core-collapse` itself is the target.
     *
     * @attribute target
     * @type Object
     * @default null
     */
    target: null,

    /**
     * If true, the orientation is horizontal; otherwise is vertical.
     *
     * @attribute horizontal
     * @type boolean
     * @default false
     */
    horizontal: false,

    /**
     * Set opened to true to show the collapse element and to false to hide it.
     *
     * @attribute opened
     * @type boolean
     * @default false
     */
    opened: false,

    /**
     * Collapsing/expanding animation duration in second.
     *
     * @attribute duration
     * @type number
     * @default 0.33
     */
    duration: 0.33,

    /**
     * If true, the size of the target element is fixed and is set
     * on the element.  Otherwise it will try to 
     * use auto to determine the natural size to use
     * for collapsing/expanding.
     *
     * @attribute fixedSize
     * @type boolean
     * @default false
     */
    fixedSize: false,
    
    /**
     * By default the collapsible element is set to overflow hidden. This helps
     * avoid element bleeding outside the region and provides consistent overflow
     * style across opened and closed states. Set this property to true to allow 
     * the collapsible element to overflow when it's opened.
     *
     * @attribute allowOverflow
     * @type boolean
     * @default false
     */
    allowOverflow: false,

    created: function() {
      this.transitionEndListener = this.transitionEnd.bind(this);
    },
    
    ready: function() {
      this.target = this.target || this;
    },

    domReady: function() {
      this.async(function() {
        this.afterInitialUpdate = true;
      });
    },

    detached: function() {
      if (this.target) {
        this.removeListeners(this.target);
      }
    },

    targetChanged: function(old) {
      if (old) {
        this.removeListeners(old);
      }
      if (!this.target) {
        return;
      }
      this.isTargetReady = !!this.target;
      this.classList.toggle('core-collapse-closed', this.target !== this);
      this.toggleOpenedStyle(false);
      this.horizontalChanged();
      this.addListeners(this.target);
      // set core-collapse-closed class initially to hide the target
      this.toggleClosedClass(true);
      this.update();
    },

    addListeners: function(node) {
      node.addEventListener('transitionend', this.transitionEndListener);
    },

    removeListeners: function(node) {
      node.removeEventListener('transitionend', this.transitionEndListener);
    },

    horizontalChanged: function() {
      this.dimension = this.horizontal ? 'width' : 'height';
    },

    openedChanged: function() {
      this.update();
      this.fire('core-collapse-open', this.opened);
    },

    /**
     * Toggle the opened state.
     *
     * @method toggle
     */
    toggle: function() {
      this.opened = !this.opened;
    },

    setTransitionDuration: function(duration) {
      var s = this.target.style;
      s.transition = duration ? (this.dimension + ' ' + duration + 's') : null;
      if (duration === 0) {
        this.async('transitionEnd');
      }
    },

    transitionEnd: function() {
      if (this.opened && !this.fixedSize) {
        this.updateSize('auto', null);
      }
      this.setTransitionDuration(null);
      this.toggleOpenedStyle(this.opened);
      this.toggleClosedClass(!this.opened);
      this.asyncFire('core-resize', null, this.target);
    },

    toggleClosedClass: function(closed) {
      this.hasClosedClass = closed;
      this.target.classList.toggle('core-collapse-closed', closed);
    },
    
    toggleOpenedStyle: function(opened) {
      this.target.style.overflow = this.allowOverflow && opened ? '' : 'hidden';
    },

    updateSize: function(size, duration, forceEnd) {
      this.setTransitionDuration(duration);
      this.calcSize();
      var s = this.target.style;
      var nochange = s[this.dimension] === size;
      s[this.dimension] = size;
      // transitonEnd will not be called if the size has not changed
      if (forceEnd && nochange) {
        this.transitionEnd();
      }
    },

    update: function() {
      if (!this.target) {
        return;
      }
      if (!this.isTargetReady) {
        this.targetChanged(); 
      }
      this.horizontalChanged();
      this[this.opened ? 'show' : 'hide']();
    },

    calcSize: function() {
      return this.target.getBoundingClientRect()[this.dimension] + 'px';
    },

    getComputedSize: function() {
      return getComputedStyle(this.target)[this.dimension];
    },

    show: function() {
      this.toggleClosedClass(false);
      // for initial update, skip the expanding animation to optimize
      // performance e.g. skip calcSize
      if (!this.afterInitialUpdate) {
        this.transitionEnd();
        return;
      }
      if (!this.fixedSize) {
        this.updateSize('auto', null);
        var s = this.calcSize();
        if (s == '0px') {
          this.transitionEnd();
          return;
        }
        this.updateSize(0, null);
      }
      this.async(function() {
        this.updateSize(this.size || s, this.duration, true);
      });
    },

    hide: function() {
      this.toggleOpenedStyle(false);
      // don't need to do anything if it's already hidden
      if (this.hasClosedClass && !this.fixedSize) {
        return;
      }
      if (this.fixedSize) {
        // save the size before hiding it
        this.size = this.getComputedSize();
      } else {
        this.updateSize(this.calcSize(), null);
      }
      this.async(function() {
        this.updateSize(0, this.duration);
      });
    }

  });

;

    Polymer('core-media-query', {

      /**
       * The Boolean return value of the media query
       *
       * @attribute queryMatches
       * @type Boolean
       * @default false
       */
      queryMatches: false,

      /**
       * The CSS media query to evaulate
       *
       * @attribute query
       * @type string
       * @default ''
       */
      query: '',
      ready: function() {
        this._mqHandler = this.queryHandler.bind(this);
        this._mq = null;
      },
      queryChanged: function() {
        if (this._mq) {
          this._mq.removeListener(this._mqHandler);
        }
        var query = this.query;
        if (query[0] !== '(') {
          query = '(' + this.query + ')';
        }
        this._mq = window.matchMedia(query);
        this._mq.addListener(this._mqHandler);
        this.queryHandler(this._mq);
      },
      queryHandler: function(mq) {
        this.queryMatches = mq.matches;
        this.asyncFire('core-media-change', mq);
      }
    });
  ;


  Polymer('core-drawer-panel', {

    /**
     * Fired when the narrow layout changes.
     *
     * @event core-responsive-change
     * @param {Object} detail
     * @param {boolean} detail.narrow true if the panel is in narrow layout.
     */
     
    /**
     * Fired when the selected panel changes.
     * 
     * Listening for this event is an alternative to observing changes in the `selected` attribute.
     * This event is fired both when a panel is selected and deselected.
     * The `isSelected` detail property contains the selection state.
     * 
     * @event core-select
     * @param {Object} detail
     * @param {boolean} detail.isSelected true for selection and false for deselection
     * @param {Object} detail.item the panel that the event refers to
     */

    publish: {

      /**
       * Width of the drawer panel.
       *
       * @attribute drawerWidth
       * @type string
       * @default '256px'
       */
      drawerWidth: '256px',

      /**
       * Max-width when the panel changes to narrow layout.
       *
       * @attribute responsiveWidth
       * @type string
       * @default '640px'
       */
      responsiveWidth: '640px',

      /**
       * The panel that is being selected. `drawer` for the drawer panel and
       * `main` for the main panel.
       *
       * @attribute selected
       * @type string
       * @default null
       */
      selected: {value: null, reflect: true},

      /**
       * The panel to be selected when `core-drawer-panel` changes to narrow
       * layout.
       *
       * @attribute defaultSelected
       * @type string
       * @default 'main'
       */
      defaultSelected: 'main',

      /**
       * Returns true if the panel is in narrow layout.  This is useful if you
       * need to show/hide elements based on the layout.
       *
       * @attribute narrow
       * @type boolean
       * @default false
       */
      narrow: {value: false, reflect: true},

      /**
       * If true, position the drawer to the right.
       *
       * @attribute rightDrawer
       * @type boolean
       * @default false
       */
      rightDrawer: false,

      /**
       * If true, swipe to open/close the drawer is disabled.
       *
       * @attribute disableSwipe
       * @type boolean
       * @default false
       */
      disableSwipe: false,
      
      /**
       * If true, ignore `responsiveWidth` setting and force the narrow layout.
       *
       * @attribute forceNarrow
       * @type boolean
       * @default false
       */
      forceNarrow: false,
      
      /**
       * If true, swipe from the edge is disable.
       *
       * @attribute disableEdgeSwipe
       * @type boolean
       * @default false
       */
      disableEdgeSwipe: false
    },

    eventDelegates: {
      trackstart: 'trackStart',
      trackx: 'trackx',
      trackend: 'trackEnd',
      down: 'downHandler',
      up: 'upHandler',
      tap: 'tapHandler'
    },

    // Whether the transition is enabled.
    transition: false,

    // How many pixels on the side of the screen are sensitive to edge swipes and peek.
    edgeSwipeSensitivity: 15,

    // Whether the drawer is peeking out from the edge.
    peeking: false,

    // Whether the user is dragging the drawer interactively.
    dragging: false,

    // Whether the browser has support for the transform CSS property.
    hasTransform: true,

    // Whether the browser has support for the will-change CSS property.
    hasWillChange: true,
    
    // The attribute on elements that should toggle the drawer on tap, also 
    // elements will automatically be hidden in wide layout.
    toggleAttribute: 'core-drawer-toggle',

    created: function() {
      this.hasTransform = 'transform' in this.style;
      this.hasWillChange = 'willChange' in this.style;
    },

    domReady: function() {
      // to avoid transition at the beginning e.g. page loads
      // NOTE: domReady is already raf delayed and delaying another frame
      // ensures a layout has occurred.
      this.async(function() {
        this.transition = true;
      });
    },

    /**
     * Toggles the panel open and closed.
     *
     * @method togglePanel
     */
    togglePanel: function() {
      this.selected = this.isMainSelected() ? 'drawer' : 'main';
    },

    /**
     * Opens the drawer.
     *
     * @method openDrawer
     */
    openDrawer: function() {
      this.selected = 'drawer';
    },

    /**
     * Closes the drawer.
     *
     * @method closeDrawer
     */
    closeDrawer: function() {
      this.selected = 'main';
    },

    queryMatchesChanged: function() {
      this.narrow = this.queryMatches || this.forceNarrow;
      if (this.narrow) {
        this.selected = this.defaultSelected;
      }
      this.setAttribute('touch-action', this.swipeAllowed() ? 'pan-y' : '');
      this.fire('core-responsive-change', {narrow: this.narrow});
    },
    
    forceNarrowChanged: function() {
      this.queryMatchesChanged();
    },

    swipeAllowed: function() {
      return this.narrow && !this.disableSwipe;
    },
    
    isMainSelected: function() {
      return this.selected === 'main';
    },

    startEdgePeek: function() {
      this.width = this.$.drawer.offsetWidth;
      this.moveDrawer(this.translateXForDeltaX(this.rightDrawer ?
          -this.edgeSwipeSensitivity : this.edgeSwipeSensitivity));
      this.peeking = true;
    },

    stopEdgePeak: function() {
      if (this.peeking) {
        this.peeking = false;
        this.moveDrawer(null);
      }
    },

    downHandler: function(e) {
      if (!this.dragging && this.isMainSelected() && this.isEdgeTouch(e)) {
        this.startEdgePeek();
      }
    },

    upHandler: function(e) {
      this.stopEdgePeak();
    },
    
    tapHandler: function(e) {
      if (e.target && this.toggleAttribute && 
          e.target.hasAttribute(this.toggleAttribute)) {
        this.togglePanel();
      }
    },

    isEdgeTouch: function(e) {
      return !this.disableEdgeSwipe && this.swipeAllowed() &&
        (this.rightDrawer ?
          e.pageX >= this.offsetWidth - this.edgeSwipeSensitivity :
          e.pageX <= this.edgeSwipeSensitivity);
    },

    trackStart : function(e) {
      if (this.swipeAllowed()) {
        this.dragging = true;

        if (this.isMainSelected()) {
          this.dragging = this.peeking || this.isEdgeTouch(e);
        }

        if (this.dragging) {
          this.width = this.$.drawer.offsetWidth;
          this.transition = false;
          e.preventTap();
        }
      }
    },

    translateXForDeltaX: function(deltaX) {
      var isMain = this.isMainSelected();
      if (this.rightDrawer) {
        return Math.max(0, isMain ? this.width + deltaX : deltaX);
      } else {
        return Math.min(0, isMain ? deltaX - this.width : deltaX);
      }
    },

    trackx : function(e) {
      if (this.dragging) {
        if (this.peeking) {
          if (Math.abs(e.dx) <= this.edgeSwipeSensitivity) {
            return; // Ignore trackx until we move past the edge peek.
          }
          this.peeking = false;
        }
        this.moveDrawer(this.translateXForDeltaX(e.dx));
      }
    },

    trackEnd : function(e) {
      if (this.dragging) {
        this.dragging = false;
        this.transition = true;
        this.moveDrawer(null);

        if (this.rightDrawer) {
          this.selected = e.xDirection > 0 ? 'main' : 'drawer';
        } else {
          this.selected = e.xDirection > 0 ? 'drawer' : 'main';
        }
      }
    },

    transformForTranslateX: function(translateX) {
      if (translateX === null) {
        return '';
      }
      return this.hasWillChange ? 'translateX(' + translateX + 'px)' : 
          'translate3d(' + translateX + 'px, 0, 0)';
    },

    moveDrawer: function(translateX) {
      var s = this.$.drawer.style;

      if (this.hasTransform) {
        s.transform = this.transformForTranslateX(translateX);
      } else {
        s.webkitTransform = this.transformForTranslateX(translateX);
      }
    }

  });

;

    Polymer('core-key-helper', {
      ENTER_KEY: 13,
      ESCAPE_KEY: 27
    });
  ;

(function() {

  Polymer('core-overlay-layer', {
    publish: {
      opened: false
    },
    openedChanged: function() {
      this.classList.toggle('core-opened', this.opened);
    },
    /**
     * Adds an element to the overlay layer
     */
    addElement: function(element) {
      if (!this.parentNode) {
        document.querySelector('body').appendChild(this);
      }
      if (element.parentNode !== this) {
        element.__contents = [];
        var ip$ = element.querySelectorAll('content');
        for (var i=0, l=ip$.length, n; (i<l) && (n = ip$[i]); i++) {
          this.moveInsertedElements(n);
          this.cacheDomLocation(n);
          n.parentNode.removeChild(n);
          element.__contents.push(n);
        }
        this.cacheDomLocation(element);
        this.updateEventController(element);
        var h = this.makeHost();
        h.shadowRoot.appendChild(element);
        element.__host = h;
      }
    },
    makeHost: function() {
      var h = document.createElement('overlay-host');
      h.createShadowRoot();
      this.appendChild(h);
      return h;
    },
    moveInsertedElements: function(insertionPoint) {
      var n$ = insertionPoint.getDistributedNodes();
      var parent = insertionPoint.parentNode;
      insertionPoint.__contents = [];
      for (var i=0, l=n$.length, n; (i<l) && (n=n$[i]); i++) {
        this.cacheDomLocation(n);
        this.updateEventController(n);
        insertionPoint.__contents.push(n);
        parent.appendChild(n);  
      }
    },
    updateEventController: function(element) {
      element.eventController = this.element.findController(element);
    },
    /**
     * Removes an element from the overlay layer
     */
    removeElement: function(element) {
      element.eventController = null;
      this.replaceElement(element);
      var h = element.__host;
      if (h) {
        h.parentNode.removeChild(h);
      }
    },
    replaceElement: function(element) {
      if (element.__contents) {
        for (var i=0, c$=element.__contents, c; (c=c$[i]); i++) {
          this.replaceElement(c);
        }
        element.__contents = null;
      }
      if (element.__parentNode) {
        var n = element.__nextElementSibling && element.__nextElementSibling 
            === element.__parentNode ? element.__nextElementSibling : null;
        element.__parentNode.insertBefore(element, n);
      }
    },
    cacheDomLocation: function(element) {
      element.__nextElementSibling = element.nextElementSibling;
      element.__parentNode = element.parentNode;
    }
  });
  
})();
;

(function() {

  Polymer('core-overlay',Polymer.mixin({

    publish: {
      /**
       * The target element that will be shown when the overlay is 
       * opened. If unspecified, the core-overlay itself is the target.
       *
       * @attribute target
       * @type Object
       * @default the overlay element
       */
      target: null,


      /**
       * A `core-overlay`'s size is guaranteed to be 
       * constrained to the window size. To achieve this, the sizingElement
       * is sized with a max-height/width. By default this element is the 
       * target element, but it can be specifically set to a specific element
       * inside the target if that is more appropriate. This is useful, for 
       * example, when a region inside the overlay should scroll if needed.
       *
       * @attribute sizingTarget
       * @type Object
       * @default the target element
       */
      sizingTarget: null,
    
      /**
       * Set opened to true to show an overlay and to false to hide it.
       * A `core-overlay` may be made initially opened by setting its
       * `opened` attribute.
       * @attribute opened
       * @type boolean
       * @default false
       */
      opened: false,

      /**
       * If true, the overlay has a backdrop darkening the rest of the screen.
       * The backdrop element is attached to the document body and may be styled
       * with the class `core-overlay-backdrop`. When opened the `core-opened`
       * class is applied.
       *
       * @attribute backdrop
       * @type boolean
       * @default false
       */    
      backdrop: false,

      /**
       * If true, the overlay is guaranteed to display above page content.
       *
       * @attribute layered
       * @type boolean
       * @default false
      */
      layered: false,
    
      /**
       * By default an overlay will close automatically if the user
       * taps outside it or presses the escape key. Disable this
       * behavior by setting the `autoCloseDisabled` property to true.
       * @attribute autoCloseDisabled
       * @type boolean
       * @default false
       */
      autoCloseDisabled: false,

      /**
       * By default an overlay will focus its target or an element inside
       * it with the `autoFocus` attribute. Disable this
       * behavior by setting the `autoFocusDisabled` property to true.
       * @attribute autoFocusDisabled
       * @type boolean
       * @default false
       */
      autoFocusDisabled: false,

      /**
       * This property specifies an attribute on elements that should
       * close the overlay on tap. Should not set `closeSelector` if this
       * is set.
       *
       * @attribute closeAttribute
       * @type string
       * @default "core-overlay-toggle"
       */
      closeAttribute: 'core-overlay-toggle',

      /**
       * This property specifies a selector matching elements that should
       * close the overlay on tap. Should not set `closeAttribute` if this
       * is set.
       *
       * @attribute closeSelector
       * @type string
       * @default ""
       */
      closeSelector: '',

      /**
       * The transition property specifies a string which identifies a 
       * <a href="../core-transition/">`core-transition`</a> element that 
       * will be used to help the overlay open and close. The default
       * `core-transition-fade` will cause the overlay to fade in and out.
       *
       * @attribute transition
       * @type string
       * @default 'core-transition-fade'
       */
      transition: 'core-transition-fade'

    },

    captureEventName: 'tap',
    targetListeners: {
      'tap': 'tapHandler',
      'keydown': 'keydownHandler',
      'core-transitionend': 'transitionend'
    },

    attached: function() {
      this.resizerAttachedHandler();
    },

    detached: function() {
      this.resizerDetachedHandler();
    },

    resizerShouldNotify: function() {
      return this.opened;
    },

    registerCallback: function(element) {
      this.layer = document.createElement('core-overlay-layer');
      this.keyHelper = document.createElement('core-key-helper');
      this.meta = document.createElement('core-transition');
      this.scrim = document.createElement('div');
      this.scrim.className = 'core-overlay-backdrop';
    },

    ready: function() {
      this.target = this.target || this;
      // flush to ensure styles are installed before paint
      Polymer.flush();
    },

    /** 
     * Toggle the opened state of the overlay.
     * @method toggle
     */
    toggle: function() {
      this.opened = !this.opened;
    },

    /** 
     * Open the overlay. This is equivalent to setting the `opened`
     * property to true.
     * @method open
     */
    open: function() {
      this.opened = true;
    },

    /** 
     * Close the overlay. This is equivalent to setting the `opened` 
     * property to false.
     * @method close
     */
    close: function() {
      this.opened = false;
    },

    domReady: function() {
      this.ensureTargetSetup();
    },

    targetChanged: function(old) {
      if (this.target) {
        // really make sure tabIndex is set
        if (this.target.tabIndex < 0) {
          this.target.tabIndex = -1;
        }
        this.addElementListenerList(this.target, this.targetListeners);
        this.target.style.display = 'none';
        this.target.__overlaySetup = false;
      }
      if (old) {
        this.removeElementListenerList(old, this.targetListeners);
        var transition = this.getTransition();
        if (transition) {
          transition.teardown(old);
        } else {
          old.style.position = '';
          old.style.outline = '';
        }
        old.style.display = '';
      }
    },

    transitionChanged: function(old) {
      if (!this.target) {
        return;
      }
      if (old) {
        this.getTransition(old).teardown(this.target);
      }
      this.target.__overlaySetup = false;
    },

    // NOTE: wait to call this until we're as sure as possible that target
    // is styled.
    ensureTargetSetup: function() {
      if (!this.target || this.target.__overlaySetup) {
        return;
      }
      if (!this.sizingTarget) {
        this.sizingTarget = this.target;
      }
      this.target.__overlaySetup = true;
      this.target.style.display = '';
      var transition = this.getTransition();
      if (transition) {
        transition.setup(this.target);
      }
      var style = this.target.style;
      var computed = getComputedStyle(this.target);
      if (computed.position === 'static') {
        style.position = 'fixed';
      }
      style.outline = 'none';
      style.display = 'none';
    },

    openedChanged: function() {
      this.transitioning = true;
      this.ensureTargetSetup();
      this.prepareRenderOpened();
      // async here to allow overlay layer to become visible.
      this.async(function() {
        this.target.style.display = '';
        // force layout to ensure transitions will go
        this.target.offsetWidth;
        this.renderOpened();
      });
      this.fire('core-overlay-open', this.opened);
    },

    // tasks which must occur before opening; e.g. making the element visible
    prepareRenderOpened: function() {
      if (this.opened) {
        addOverlay(this);
      }
      this.prepareBackdrop();
      // async so we don't auto-close immediately via a click.
      this.async(function() {
        if (!this.autoCloseDisabled) {
          this.enableElementListener(this.opened, document,
              this.captureEventName, 'captureHandler', true);
        }
      });
      this.enableElementListener(this.opened, window, 'resize',
          'resizeHandler');

      if (this.opened) {
        // force layout so SD Polyfill renders
        this.target.offsetHeight;
        this.discoverDimensions();
        // if we are showing, then take care when positioning
        this.preparePositioning();
        this.positionTarget();
        this.updateTargetDimensions();
        this.finishPositioning();
        if (this.layered) {
          this.layer.addElement(this.target);
          this.layer.opened = this.opened;
        }
      }
    },

    // tasks which cause the overlay to actually open; typically play an
    // animation
    renderOpened: function() {
      this.notifyResize();
      var transition = this.getTransition();
      if (transition) {
        transition.go(this.target, {opened: this.opened});
      } else {
        this.transitionend();
      }
      this.renderBackdropOpened();
    },

    // finishing tasks; typically called via a transition
    transitionend: function(e) {
      // make sure this is our transition event.
      if (e && e.target !== this.target) {
        return;
      }
      this.transitioning = false;
      if (!this.opened) {
        this.resetTargetDimensions();
        this.target.style.display = 'none';
        this.completeBackdrop();
        removeOverlay(this);
        if (this.layered) {
          if (!currentOverlay()) {
            this.layer.opened = this.opened;
          }
          this.layer.removeElement(this.target);
        }
      }
      this.fire('core-overlay-' + (this.opened ? 'open' : 'close') + 
          '-completed');
      this.applyFocus();
    },

    prepareBackdrop: function() {
      if (this.backdrop && this.opened) {
        if (!this.scrim.parentNode) {
          document.body.appendChild(this.scrim);
          this.scrim.style.zIndex = currentOverlayZ() - 1;
        }
        trackBackdrop(this);
      }
    },

    renderBackdropOpened: function() {
      if (this.backdrop && getBackdrops().length < 2) {
        this.scrim.classList.toggle('core-opened', this.opened);
      }
    },

    completeBackdrop: function() {
      if (this.backdrop) {
        trackBackdrop(this);
        if (getBackdrops().length === 0) {
          this.scrim.parentNode.removeChild(this.scrim);
        }
      }
    },

    preparePositioning: function() {
      this.target.style.transition = this.target.style.webkitTransition = 'none';
      this.target.style.transform = this.target.style.webkitTransform = 'none';
      this.target.style.display = '';
    },

    discoverDimensions: function() {
      if (this.dimensions) {
        return;
      }
      var target = getComputedStyle(this.target);
      var sizer = getComputedStyle(this.sizingTarget);
      this.dimensions = {
        position: {
          v: target.top !== 'auto' ? 'top' : (target.bottom !== 'auto' ?
            'bottom' : null),
          h: target.left !== 'auto' ? 'left' : (target.right !== 'auto' ?
            'right' : null),
          css: target.position
        },
        size: {
          v: sizer.maxHeight !== 'none',
          h: sizer.maxWidth !== 'none'
        },
        margin: {
          top: parseInt(target.marginTop) || 0,
          right: parseInt(target.marginRight) || 0,
          bottom: parseInt(target.marginBottom) || 0,
          left: parseInt(target.marginLeft) || 0
        }
      };
    },

    finishPositioning: function(target) {
      this.target.style.display = 'none';
      this.target.style.transform = this.target.style.webkitTransform = '';
      // force layout to avoid application of transform
      this.target.offsetWidth;
      this.target.style.transition = this.target.style.webkitTransition = '';
    },

    getTransition: function(name) {
      return this.meta.byId(name || this.transition);
    },

    getFocusNode: function() {
      return this.target.querySelector('[autofocus]') || this.target;
    },

    applyFocus: function() {
      var focusNode = this.getFocusNode();
      if (this.opened) {
        if (!this.autoFocusDisabled) {
          focusNode.focus();
        }
      } else {
        focusNode.blur();
        if (currentOverlay() == this) {
          console.warn('Current core-overlay is attempting to focus itself as next! (bug)');
        } else {
          focusOverlay();
        }
      }
    },

    positionTarget: function() {
      // fire positioning event
      this.fire('core-overlay-position', {target: this.target,
          sizingTarget: this.sizingTarget, opened: this.opened});
      if (!this.dimensions.position.v) {
        this.target.style.top = '0px';
      }
      if (!this.dimensions.position.h) {
        this.target.style.left = '0px';
      }
    },

    updateTargetDimensions: function() {
      this.sizeTarget();
      this.repositionTarget();
    },

    sizeTarget: function() {
      this.sizingTarget.style.boxSizing = 'border-box';
      var dims = this.dimensions;
      var rect = this.target.getBoundingClientRect();
      if (!dims.size.v) {
        this.sizeDimension(rect, dims.position.v, 'top', 'bottom', 'Height');
      }
      if (!dims.size.h) {
        this.sizeDimension(rect, dims.position.h, 'left', 'right', 'Width');
      }
    },

    sizeDimension: function(rect, positionedBy, start, end, extent) {
      var dims = this.dimensions;
      var flip = (positionedBy === end);
      var m = flip ? start : end;
      var ws = window['inner' + extent];
      var o = dims.margin[m] + (flip ? ws - rect[end] : 
          rect[start]);
      var offset = 'offset' + extent;
      var o2 = this.target[offset] - this.sizingTarget[offset];
      this.sizingTarget.style['max' + extent] = (ws - o - o2) + 'px';
    },

    // vertically and horizontally center if not positioned
    repositionTarget: function() {
      // only center if position fixed.      
      if (this.dimensions.position.css !== 'fixed') {
        return; 
      }
      if (!this.dimensions.position.v) {
        var t = (window.innerHeight - this.target.offsetHeight) / 2;
        t -= this.dimensions.margin.top;
        this.target.style.top = t + 'px';
      }

      if (!this.dimensions.position.h) {
        var l = (window.innerWidth - this.target.offsetWidth) / 2;
        l -= this.dimensions.margin.left;
        this.target.style.left = l + 'px';
      }
    },

    resetTargetDimensions: function() {
      if (!this.dimensions || !this.dimensions.size.v) {
        this.sizingTarget.style.maxHeight = '';  
        this.target.style.top = '';
      }
      if (!this.dimensions || !this.dimensions.size.h) {
        this.sizingTarget.style.maxWidth = '';  
        this.target.style.left = '';
      }
      this.dimensions = null;
    },

    tapHandler: function(e) {
      // closeSelector takes precedence since closeAttribute has a default non-null value.
      if (e.target &&
          (this.closeSelector && e.target.matches(this.closeSelector)) ||
          (this.closeAttribute && e.target.hasAttribute(this.closeAttribute))) {
        this.toggle();
      } else {
        if (this.autoCloseJob) {
          this.autoCloseJob.stop();
          this.autoCloseJob = null;
        }
      }
    },
    
    // We use the traditional approach of capturing events on document
    // to to determine if the overlay needs to close. However, due to 
    // ShadowDOM event retargeting, the event target is not useful. Instead
    // of using it, we attempt to close asynchronously and prevent the close
    // if a tap event is immediately heard on the target.
    // TODO(sorvell): This approach will not work with modal. For
    // this we need a scrim.
    captureHandler: function(e) {
      if (!this.autoCloseDisabled && (currentOverlay() == this)) {
        this.autoCloseJob = this.job(this.autoCloseJob, function() {
          this.close();
        });
      }
    },

    keydownHandler: function(e) {
      if (!this.autoCloseDisabled && (e.keyCode == this.keyHelper.ESCAPE_KEY)) {
        this.close();
        e.stopPropagation();
      }
    },

    /**
     * Extensions of core-overlay should implement the `resizeHandler`
     * method to adjust the size and position of the overlay when the 
     * browser window resizes.
     * @method resizeHandler
     */
    resizeHandler: function() {
      this.updateTargetDimensions();
    },

    // TODO(sorvell): these utility methods should not be here.
    addElementListenerList: function(node, events) {
      for (var i in events) {
        this.addElementListener(node, i, events[i]);
      }
    },

    removeElementListenerList: function(node, events) {
      for (var i in events) {
        this.removeElementListener(node, i, events[i]);
      }
    },

    enableElementListener: function(enable, node, event, methodName, capture) {
      if (enable) {
        this.addElementListener(node, event, methodName, capture);
      } else {
        this.removeElementListener(node, event, methodName, capture);
      }
    },

    addElementListener: function(node, event, methodName, capture) {
      var fn = this._makeBoundListener(methodName);
      if (node && fn) {
        Polymer.addEventListener(node, event, fn, capture);
      }
    },

    removeElementListener: function(node, event, methodName, capture) {
      var fn = this._makeBoundListener(methodName);
      if (node && fn) {
        Polymer.removeEventListener(node, event, fn, capture);
      }
    },

    _makeBoundListener: function(methodName) {
      var self = this, method = this[methodName];
      if (!method) {
        return;
      }
      var bound = '_bound' + methodName;
      if (!this[bound]) {
        this[bound] = function(e) {
          method.call(self, e);
        };
      }
      return this[bound];
    }

  }, Polymer.CoreResizer));

  // TODO(sorvell): This should be an element with private state so it can
  // be independent of overlay.
  // track overlays for z-index and focus managemant
  var overlays = [];
  function addOverlay(overlay) {
    var z0 = currentOverlayZ();
    overlays.push(overlay);
    var z1 = currentOverlayZ();
    if (z1 <= z0) {
      applyOverlayZ(overlay, z0);
    }
  }

  function removeOverlay(overlay) {
    var i = overlays.indexOf(overlay);
    if (i >= 0) {
      overlays.splice(i, 1);
      setZ(overlay, '');
    }
  }
  
  function applyOverlayZ(overlay, aboveZ) {
    setZ(overlay.target, aboveZ + 2);
  }
  
  function setZ(element, z) {
    element.style.zIndex = z;
  }

  function currentOverlay() {
    return overlays[overlays.length-1];
  }
  
  var DEFAULT_Z = 10;
  
  function currentOverlayZ() {
    var z;
    var current = currentOverlay();
    if (current) {
      var z1 = window.getComputedStyle(current.target).zIndex;
      if (!isNaN(z1)) {
        z = Number(z1);
      }
    }
    return z || DEFAULT_Z;
  }
  
  function focusOverlay() {
    var current = currentOverlay();
    // We have to be careful to focus the next overlay _after_ any current
    // transitions are complete (due to the state being toggled prior to the
    // transition). Otherwise, we risk infinite recursion when a transitioning
    // (closed) overlay becomes the current overlay.
    //
    // NOTE: We make the assumption that any overlay that completes a transition
    // will call into focusOverlay to kick the process back off. Currently:
    // transitionend -> applyFocus -> focusOverlay.
    if (current && !current.transitioning) {
      current.applyFocus();
    }
  }

  var backdrops = [];
  function trackBackdrop(element) {
    if (element.opened) {
      backdrops.push(element);
    } else {
      var i = backdrops.indexOf(element);
      if (i >= 0) {
        backdrops.splice(i, 1);
      }
    }
  }

  function getBackdrops() {
    return backdrops;
  }
})();
;


(function() {

  function docElem(property) {
    var t;
    return ((t = document.documentElement) || (t = document.body.parentNode)) && (typeof t[property] === 'number') ? t : document.body;
  }

  // View width and height excluding any visible scrollbars
  // http://www.highdots.com/forums/javascript/faq-topic-how-do-i-296669.html
  //    1) document.client[Width|Height] always reliable when available, including Safari2
  //    2) document.documentElement.client[Width|Height] reliable in standards mode DOCTYPE, except for Safari2, Opera<9.5
  //    3) document.body.client[Width|Height] is gives correct result when #2 does not, except for Safari2
  //    4) When document.documentElement.client[Width|Height] is unreliable, it will be size of <html> element either greater or less than desired view size
  //       https://bugzilla.mozilla.org/show_bug.cgi?id=156388#c7
  //    5) When document.body.client[Width|Height] is unreliable, it will be size of <body> element less than desired view size
  function viewSize() {
    // This algorithm avoids creating test page to determine if document.documentElement.client[Width|Height] is greater then view size,
    // will succeed where such test page wouldn't detect dynamic unreliability,
    // and will only fail in the case the right or bottom edge is within the width of a scrollbar from edge of the viewport that has visible scrollbar(s).
    var doc = docElem('clientWidth');
    var body = document.body;
    var w, h;
    return typeof document.clientWidth === 'number' ?
      {w: document.clientWidth, h: document.clientHeight} :
      doc === body || (w = Math.max( doc.clientWidth, body.clientWidth )) > self.innerWidth || (h = Math.max( doc.clientHeight, body.clientHeight )) > self.innerHeight ?
        {w: body.clientWidth, h: body.clientHeight} : {w: w, h: h };
  }

  Polymer('core-dropdown',{

    publish: {

      /**
       * The element associated with this dropdown, usually the element that triggers
       * the menu. If unset, this property will default to the target's parent node
       * or shadow host.
       *
       * @attribute relatedTarget
       * @type Node
       */
      relatedTarget: null,

      /**
       * The horizontal alignment of the popup relative to `relatedTarget`. `left`
       * means the left edges are aligned together. `right` means the right edges
       * are aligned together.
       * 
       * Accepted values: 'left', 'right'
       *
       * @attribute halign
       * @type String
       * @default 'left'
       */
      halign: 'left',

      /**
       * The vertical alignment of the popup relative to `relatedTarget`. `top` means
       * the top edges are aligned together. `bottom` means the bottom edges are
       * aligned together.
       *
       * Accepted values: 'top', 'bottom'
       *
       * @attribute valign
       * @type String
       * @default 'top'
       */
      valign: 'top',

    },

    measure: function() {
      var target = this.target;
      // remember position, because core-overlay may have set the property
      var pos = target.style.position;

      // get the size of the target as if it's positioned in the top left
      // corner of the screen
      target.style.position = 'fixed';
      target.style.left = '0px';
      target.style.top = '0px';

      var rect = target.getBoundingClientRect();

      target.style.position = pos;
      target.style.left = null;
      target.style.top = null;

      return rect;
    },

    resetTargetDimensions: function() {
      var dims = this.dimensions;
      var style = this.target.style;
      if (dims.position.h_by === this.localName) {
        style[dims.position.h] = null;
        dims.position.h_by = null;
      }
      if (dims.position.v_by === this.localName) {
        style[dims.position.v] = null;
        dims.position.v_by = null;
      }
      style.width = null;
      style.height = null;
      this.super();
    },

    positionTarget: function() {
      if (!this.relatedTarget) {
        this.relatedTarget = this.target.parentElement || (this.target.parentNode && this.target.parentNode.host);
        if (!this.relatedTarget) {
          this.super();
          return;
        }
      }

      // explicitly set width/height, because we don't want it constrained
      // to the offsetParent
      var target = this.sizingTarget;
      var rect = this.measure();
      target.style.width = Math.ceil(rect.width) + 'px';
      target.style.height = Math.ceil(rect.height) + 'px';

      if (this.layered) {
        this.positionLayeredTarget();
      } else {
        this.positionNestedTarget();
      }
    },

    positionLayeredTarget: function() {
      var target = this.target;
      var rect = this.relatedTarget.getBoundingClientRect();

      var dims = this.dimensions;
      var margin = dims.margin;
      var vp = viewSize();

      if (!dims.position.h) {
        if (this.halign === 'right') {
          target.style.right = vp.w - rect.right - margin.right + 'px';
          dims.position.h = 'right';
        } else {
          target.style.left = rect.left - margin.left + 'px';
          dims.position.h = 'left';
        }
        dims.position.h_by = this.localName;
      }

      if (!dims.position.v) {
        if (this.valign === 'bottom') {
          target.style.bottom = vp.h - rect.bottom - margin.bottom + 'px';
          dims.position.v = 'bottom';
        } else {
          target.style.top = rect.top - margin.top + 'px';
          dims.position.v = 'top';
        }
        dims.position.v_by = this.localName;
      }

      if (dims.position.h_by || dims.position.v_by) {
        target.style.position = 'fixed';
      }
    },

    positionNestedTarget: function() {
      var target = this.target;
      var related = this.relatedTarget;

      var t_op = target.offsetParent;
      var r_op = related.offsetParent;
      if (window.ShadowDOMPolyfill) {
        t_op = wrap(t_op);
        r_op = wrap(r_op);
      }

      if (t_op !== r_op && t_op !== related) {
        console.warn('core-dropdown-overlay: dropdown\'s offsetParent must be the relatedTarget or the relatedTarget\'s offsetParent!');
      }

      // Don't use CSS to handle halign/valign so we can use
      // dimensions.position to detect custom positioning

      var dims = this.dimensions;
      var margin = dims.margin;
      var inside = t_op === related;

      if (!dims.position.h) {
        if (this.halign === 'right') {
          target.style.right = ((inside ? 0 : t_op.offsetWidth - related.offsetLeft - related.offsetWidth) - margin.right) + 'px';
          dims.position.h = 'right';
        } else {
          target.style.left = ((inside ? 0 : related.offsetLeft) - margin.left) + 'px';
          dims.position.h = 'left';
        }
        dims.position.h_by = this.localName;
      }

      if (!dims.position.v) {
        if (this.valign === 'bottom') {
          target.style.bottom = ((inside ? 0 : t_op.offsetHeight - related.offsetTop - related.offsetHeight) - margin.bottom) + 'px';
          dims.position.v = 'bottom';
        } else {
          target.style.top = ((inside ? 0 : related.offsetTop) - margin.top) + 'px';
          dims.position.v = 'top';
        }
        dims.position.v_by = this.localName;
      }
    }

  });

})();

;


  Polymer('core-dropdown-base',{

    publish: {

      /**
       * True if the menu is open.
       *
       * @attribute opened
       * @type boolean
       * @default false
       */
      opened: false

    },

    eventDelegates: {
      'tap': 'toggleOverlay'
    },

    overlayListeners: {
      'core-overlay-open': 'openAction'
    },

    get dropdown() {
      if (!this._dropdown) {
        this._dropdown = this.querySelector('.dropdown');
        for (var l in this.overlayListeners) {
          this.addElementListener(this._dropdown, l, this.overlayListeners[l]);
        }
      }
      return this._dropdown;
    },

    attached: function() {
      // find the dropdown on attach
      // FIXME: Support MO?
      this.dropdown;
    },

    addElementListener: function(node, event, methodName, capture) {
      var fn = this._makeBoundListener(methodName);
      if (node && fn) {
        Polymer.addEventListener(node, event, fn, capture);
      }
    },

    removeElementListener: function(node, event, methodName, capture) {
      var fn = this._makeBoundListener(methodName);
      if (node && fn) {
        Polymer.removeEventListener(node, event, fn, capture);
      }
    },

    _makeBoundListener: function(methodName) {
      var self = this, method = this[methodName];
      if (!method) {
        return;
      }
      var bound = '_bound' + methodName;
      if (!this[bound]) {
        this[bound] = function(e) {
          method.call(self, e);
        };
      }
      return this[bound];
    },

    openedChanged: function() {
      if (this.disabled) {
        return;
      }
      var dropdown = this.dropdown;
      if (dropdown) {
        dropdown.opened = this.opened;
      }
    },

    openAction: function(e) {
      this.opened = !!e.detail;
    },

    toggleOverlay: function() {
      this.opened = !this.opened;
    }

  });

;
Polymer('core-field');;


  Polymer('core-header-panel',{

    /**
     * Fired when the content has been scrolled.  `event.detail.target` returns
     * the scrollable element which you can use to access scroll info such as
     * `scrollTop`.
     *
     *     <core-header-panel on-scroll="{{scrollHandler}}">
     *       ...
     *     </core-header-panel>
     *
     *
     *     scrollHandler: function(event) {
     *       var scroller = event.detail.target;
     *       console.log(scroller.scrollTop);
     *     }
     *
     * @event scroll
     */

    publish: {
      /**
       * Controls header and scrolling behavior. Options are
       * `standard`, `seamed`, `waterfall`, `waterfall-tall`, `scroll` and 
       * `cover`. Default is `standard`.
       *
       * `standard`: The header is a step above the panel. The header will consume the
       * panel at the point of entry, preventing it from passing through to the
       * opposite side.
       *
       * `seamed`: The header is presented as seamed with the panel.
       *
       * `waterfall`: Similar to standard mode, but header is initially presented as
       * seamed with panel, but then separates to form the step.
       *
       * `waterfall-tall`: The header is initially taller (`tall` class is added to
       * the header).  As the user scrolls, the header separates (forming an edge)
       * while condensing (`tall` class is removed from the header).
       *
       * `scroll`: The header keeps its seam with the panel, and is pushed off screen.
       *
       * `cover`: The panel covers the whole `core-header-panel` including the
       * header. This allows user to style the panel in such a way that the panel is
       * partially covering the header.
       *
       *     <style>
       *       core-header-panel[mode=cover]::shadow #mainContainer {
       *         left: 80px;
       *       }
       *       .content {
       *         margin: 60px 60px 60px 0;
       *       }
       *     </style>
       *
       *     <core-header-panel mode="cover">
       *       <core-toolbar class="tall">
       *         <core-icon-button icon="menu"></core-icon-button>
       *       </core-toolbar>
       *       <div class="content"></div>
       *     </core-header-panel>
       *
       * @attribute mode
       * @type string
       * @default ''
       */
      mode: {value: '', reflect: true},

      /**
       * The class used in waterfall-tall mode.  Change this if the header
       * accepts a different class for toggling height, e.g. "medium-tall"
       *
       * @attribute tallClass
       * @type string
       * @default 'tall'
       */
      tallClass: 'tall',

      /**
       * If true, the drop-shadow is always shown no matter what mode is set to.
       *
       * @attribute shadow
       * @type boolean
       * @default false
       */
      shadow: false
    },

    animateDuration: 200,

    modeConfigs: {
      shadowMode: {'waterfall': 1, 'waterfall-tall': 1},
      noShadow: {'seamed': 1, 'cover': 1, 'scroll': 1},
      tallMode: {'waterfall-tall': 1},
      outerScroll: {'scroll': 1}
    },
    
    ready: function() {
      this.scrollHandler = this.scroll.bind(this);
      this.addListener();
    },
    
    detached: function() {
      this.removeListener(this.mode);
    },
    
    addListener: function() {
      this.scroller.addEventListener('scroll', this.scrollHandler);
    },
    
    removeListener: function(mode) {
      var s = this.getScrollerForMode(mode);
      s.removeEventListener('scroll', this.scrollHandler);
    },

    domReady: function() {
      this.async('scroll');
    },

    modeChanged: function(old) {
      var configs = this.modeConfigs;
      var header = this.header;
      if (header) {
        // in tallMode it may add tallClass to the header; so do the cleanup
        // when mode is changed from tallMode to not tallMode
        if (configs.tallMode[old] && !configs.tallMode[this.mode]) {
          header.classList.remove(this.tallClass);
          this.async(function() {
            header.classList.remove('animate');
          }, null, this.animateDuration);
        } else {
          header.classList.toggle('animate', configs.tallMode[this.mode]);
        }
      }
      if (configs && (configs.outerScroll[this.mode] || configs.outerScroll[old])) {
        this.removeListener(old);
        this.addListener();
      }
      this.scroll();
    },

    get header() {
      return this.$.headerContent.getDistributedNodes()[0];
    },
    
    getScrollerForMode: function(mode) {
      return this.modeConfigs.outerScroll[mode] ?
          this.$.outerContainer : this.$.mainContainer;
    },

    /**
     * Returns the scrollable element.
     *
     * @property scroller
     * @type Object
     */
    get scroller() {
      return this.getScrollerForMode(this.mode);
    },

    scroll: function() {
      var configs = this.modeConfigs;
      var main = this.$.mainContainer;
      var header = this.header;

      var sTop = main.scrollTop;
      var atTop = sTop === 0;

      this.$.dropShadow.classList.toggle('hidden', !this.shadow &&
          (atTop && configs.shadowMode[this.mode] || configs.noShadow[this.mode]));

      if (header && configs.tallMode[this.mode]) {
        header.classList.toggle(this.tallClass, atTop ||
            header.classList.contains(this.tallClass) &&
            main.scrollHeight < this.$.outerContainer.offsetHeight);
      }

      this.fire('scroll', {target: this.scroller}, this, false);
    }

  });

;

  
    Polymer('core-iconset', {
  
      /**
       * The URL of the iconset image.
       *
       * @attribute src
       * @type string
       * @default ''
       */
      src: '',

      /**
       * The width of the iconset image. This must only be specified if the
       * icons are arranged into separate rows inside the image.
       *
       * @attribute width
       * @type number
       * @default 0
       */
      width: 0,

      /**
       * A space separated list of names corresponding to icons in the iconset
       * image file. This list must be ordered the same as the icon images
       * in the image file.
       *
       * @attribute icons
       * @type string
       * @default ''
       */
      icons: '',

      /**
       * The size of an individual icon. Note that icons must be square.
       *
       * @attribute iconSize
       * @type number
       * @default 24
       */
      iconSize: 24,

      /**
       * The horizontal offset of the icon images in the inconset src image.
       * This is typically used if the image resource contains additional images
       * beside those intended for the iconset.
       *
       * @attribute offsetX
       * @type number
       * @default 0
       */
      offsetX: 0,
      /**
       * The vertical offset of the icon images in the inconset src image.
       * This is typically used if the image resource contains additional images
       * beside those intended for the iconset.
       *
       * @attribute offsetY
       * @type number
       * @default 0
       */
      offsetY: 0,
      type: 'iconset',

      created: function() {
        this.iconMap = {};
        this.iconNames = [];
        this.themes = {};
      },
  
      ready: function() {
        // TODO(sorvell): ensure iconset's src is always relative to the main
        // document
        if (this.src && (this.ownerDocument !== document)) {
          this.src = this.resolvePath(this.src, this.ownerDocument.baseURI);
        }
        this.super();
        this.updateThemes();
      },

      iconsChanged: function() {
        var ox = this.offsetX;
        var oy = this.offsetY;
        this.icons && this.icons.split(/\s+/g).forEach(function(name, i) {
          this.iconNames.push(name);
          this.iconMap[name] = {
            offsetX: ox,
            offsetY: oy
          }
          if (ox + this.iconSize < this.width) {
            ox += this.iconSize;
          } else {
            ox = this.offsetX;
            oy += this.iconSize;
          }
        }, this);
      },

      updateThemes: function() {
        var ts = this.querySelectorAll('property[theme]');
        ts && ts.array().forEach(function(t) {
          this.themes[t.getAttribute('theme')] = {
            offsetX: parseInt(t.getAttribute('offsetX')) || 0,
            offsetY: parseInt(t.getAttribute('offsetY')) || 0
          };
        }, this);
      },

      // TODO(ffu): support retrived by index e.g. getOffset(10);
      /**
       * Returns an object containing `offsetX` and `offsetY` properties which
       * specify the pixel locaion in the iconset's src file for the given
       * `icon` and `theme`. It's uncommon to call this method. It is useful,
       * for example, to manually position a css backgroundImage to the proper
       * offset. It's more common to use the `applyIcon` method.
       *
       * @method getOffset
       * @param {String|Number} icon The name of the icon or the index of the
       * icon within in the icon image.
       * @param {String} theme The name of the theme.
       * @returns {Object} An object specifying the offset of the given icon 
       * within the icon resource file; `offsetX` is the horizontal offset and
       * `offsetY` is the vertical offset. Both values are in pixel units.
       */
      getOffset: function(icon, theme) {
        var i = this.iconMap[icon];
        if (!i) {
          var n = this.iconNames[Number(icon)];
          i = this.iconMap[n];
        }
        var t = this.themes[theme];
        if (i && t) {
          return {
            offsetX: i.offsetX + t.offsetX,
            offsetY: i.offsetY + t.offsetY
          }
        }
        return i;
      },

      /**
       * Applies an icon to the given element as a css background image. This
       * method does not size the element, and it's often necessary to set 
       * the element's height and width so that the background image is visible.
       *
       * @method applyIcon
       * @param {Element} element The element to which the background is
       * applied.
       * @param {String|Number} icon The name or index of the icon to apply.
       * @param {Number} scale (optional, defaults to 1) A scaling factor 
       * with which the icon can be magnified.
       * @return {Element} The icon element.
       */
      applyIcon: function(element, icon, scale) {
        var offset = this.getOffset(icon);
        scale = scale || 1;
        if (element && offset) {
          var icon = element._icon || document.createElement('div');
          var style = icon.style;
          style.backgroundImage = 'url(' + this.src + ')';
          style.backgroundPosition = (-offset.offsetX * scale + 'px') + 
             ' ' + (-offset.offsetY * scale + 'px');
          style.backgroundSize = scale === 1 ? 'auto' :
             this.width * scale + 'px';
          if (icon.parentNode !== element) {
            element.appendChild(icon);
          }
          return icon;
        }
      }

    });

  ;

(function() {
  
  // mono-state
  var meta;
  
  Polymer('core-icon', {

    /**
     * The URL of an image for the icon. If the src property is specified,
     * the icon property should not be.
     *
     * @attribute src
     * @type string
     * @default ''
     */
    src: '',

    /**
     * Specifies the icon name or index in the set of icons available in
     * the icon's icon set. If the icon property is specified,
     * the src property should not be.
     *
     * @attribute icon
     * @type string
     * @default ''
     */
    icon: '',

    /**
     * Alternative text content for accessibility support.
     * If alt is present and not empty, it will set the element's role to img and add an aria-label whose content matches alt.
     * If alt is present and is an empty string, '', it will hide the element from the accessibility layer
     * If alt is not present, it will set the element's role to img and the element will fallback to using the icon attribute for its aria-label.
     * 
     * @attribute alt
     * @type string
     * @default ''
     */
    alt: null,

    observe: {
      'icon': 'updateIcon',
      'alt': 'updateAlt'
    },

    defaultIconset: 'icons',

    ready: function() {
      if (!meta) {
        meta = document.createElement('core-iconset');
      }

      // Allow user-provided `aria-label` in preference to any other text alternative.
      if (this.hasAttribute('aria-label')) {
        // Set `role` if it has not been overridden.
        if (!this.hasAttribute('role')) {
          this.setAttribute('role', 'img');
        }
        return;
      }
      this.updateAlt();
    },

    srcChanged: function() {
      var icon = this._icon || document.createElement('div');
      icon.textContent = '';
      icon.setAttribute('fit', '');
      icon.style.backgroundImage = 'url(' + this.src + ')';
      icon.style.backgroundPosition = 'center';
      icon.style.backgroundSize = '100%';
      if (!icon.parentNode) {
        this.appendChild(icon);
      }
      this._icon = icon;
    },

    getIconset: function(name) {
      return meta.byId(name || this.defaultIconset);
    },

    updateIcon: function(oldVal, newVal) {
      if (!this.icon) {
        this.updateAlt();
        return;
      }
      var parts = String(this.icon).split(':');
      var icon = parts.pop();
      if (icon) {
        var set = this.getIconset(parts.pop());
        if (set) {
          this._icon = set.applyIcon(this, icon);
          if (this._icon) {
            this._icon.setAttribute('fit', '');
          }
        }
      }
      // Check to see if we're using the old icon's name for our a11y fallback
      if (oldVal) {
        if (oldVal.split(':').pop() == this.getAttribute('aria-label')) {
          this.updateAlt();
        }
      }
    },

    updateAlt: function() {
      // Respect the user's decision to remove this element from
      // the a11y tree
      if (this.getAttribute('aria-hidden')) {
        return;
      }

      // Remove element from a11y tree if `alt` is empty, otherwise
      // use `alt` as `aria-label`.
      if (this.alt === '') {
        this.setAttribute('aria-hidden', 'true');
        if (this.hasAttribute('role')) {
          this.removeAttribute('role');
        }
        if (this.hasAttribute('aria-label')) {
          this.removeAttribute('aria-label');
        }
      } else {
        this.setAttribute('aria-label', this.alt ||
                                        this.icon.split(':').pop());
        if (!this.hasAttribute('role')) {
          this.setAttribute('role', 'img');
        }
        if (this.hasAttribute('aria-hidden')) {
          this.removeAttribute('aria-hidden');
        }
      }
    }

  });
  
})();
;


    Polymer('core-iconset-svg', {


      /**
       * The size of an individual icon. Note that icons must be square.
       *
       * @attribute iconSize
       * @type number
       * @default 24
       */
      iconSize: 24,
      type: 'iconset',

      created: function() {
        this._icons = {};
      },

      ready: function() {
        this.super();
        this.updateIcons();
      },

      iconById: function(id) {
        return this._icons[id] || (this._icons[id] = this.querySelector('[id="' + id +'"]'));
      },

      cloneIcon: function(id) {
        var icon = this.iconById(id);
        if (icon) {
          var content = icon.cloneNode(true);
          content.removeAttribute('id');
          var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
          svg.setAttribute('viewBox', '0 0 ' + this.iconSize + ' ' +
              this.iconSize);
          // NOTE(dfreedm): work around https://crbug.com/370136
          svg.style.pointerEvents = 'none';
          svg.appendChild(content);
          return svg;
        }
      },

      get iconNames() {
        if (!this._iconNames) {
          this._iconNames = this.findIconNames();
        }
        return this._iconNames;
      },

      findIconNames: function() {
        var icons = this.querySelectorAll('[id]').array();
        if (icons.length) {
          return icons.map(function(n){ return n.id });
        }
      },

      /**
       * Applies an icon to the given element. The svg icon is added to the
       * element's shadowRoot if one exists or directly to itself.
       *
       * @method applyIcon
       * @param {Element} element The element to which the icon is
       * applied.
       * @param {String|Number} icon The name the icon to apply.
       * @return {Element} The icon element
       */
      applyIcon: function(element, icon) {
        var root = element;
        // remove old
        var old = root.querySelector('svg');
        if (old) {
          old.remove();
        }
        // install new
        var svg = this.cloneIcon(icon);
        if (!svg) {
          return;
        }
        svg.setAttribute('height', '100%');
        svg.setAttribute('width', '100%');
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        svg.style.display = 'block';
        root.insertBefore(svg, root.firstElementChild);
        return svg;
      },
      
      /**
       * Tell users of the iconset, that the set has loaded.
       * This finds all elements matching the selector argument and calls 
       * the method argument on them.
       * @method updateIcons
       * @param selector {string} css selector to identify iconset users, 
       * defaults to '[icon]'
       * @param method {string} method to call on found elements, 
       * defaults to 'updateIcon'
       */
      updateIcons: function(selector, method) {
        selector = selector || '[icon]';
        method = method || 'updateIcon';
        var deep = window.ShadowDOMPolyfill ? '' : 'html /deep/ ';
        var i$ = document.querySelectorAll(deep + selector);
        for (var i=0, e; e=i$[i]; i++) {
          if (e[method]) {
            e[method].call(e);
          }
        }
      }
      

    });

  ;


    Polymer('core-icon-button', {

      /**
       * The URL of an image for the icon.  Should not use `icon` property
       * if you are using this property.
       *
       * @attribute src
       * @type string
       * @default ''
       */
      src: '',

      /**
       * If true, border is placed around the button to indicate it's
       * active state.
       *
       * @attribute active
       * @type boolean
       * @default false
       */
      active: false,

      /**
       * Specifies the icon name or index in the set of icons available in
       * the icon set.  Should not use `src` property if you are using this
       * property.
       *
       * @attribute icon
       * @type string
       * @default ''
       */
      icon: '',

      activeChanged: function() {
        this.classList.toggle('selected', this.active);
      }

    });

  ;


  Polymer('core-input', {

    publish: {

      /**
       * The "committed" value of the input, ie. the input value when the user
       * hits the "enter" key or blurs the input after changing the value. You
       * can bind to this value instead of listening for the "change" event.
       * Setting this property has no effect on the input value.
       *
       * @attribute committedValue
       * @type string
       * @default ''
       */
      committedValue: '',

      /**
       * Set to true to prevent invalid input from being entered.
       *
       * @attribute preventInvalidInput
       * @type boolean
       * @default false
       */
      preventInvalidInput: false

    },

    previousValidInput: '',

    eventDelegates: {
      input: 'inputAction',
      change: 'changeAction'
    },

    ready: function() {
      /* set ARIA attributes */
      this.disabledHandler();
      this.placeholderHandler();
    },

    attributeChanged: function(attr, old) {
      if (this[attr + 'Handler']) {
        this[attr + 'Handler'](old);
      }
    },

    disabledHandler: function() {
      if (this.disabled) {
        this.setAttribute('aria-disabled', '');
      } else {
        this.removeAttribute('aria-disabled');
      }
    },

    placeholderHandler: function() {
      if (this.placeholder) {
        this.setAttribute('aria-label', this.placeholder);
      } else {
        this.removeAttribute('aria-label');
      }
    },

    /**
     * Commits the `value` to `committedValue`
     *
     * @method commit
     */
    commit: function() {
      this.committedValue = this.value;
    },

    changeAction: function() {
      this.commit();
    },

    inputAction: function(e) {
      if (this.preventInvalidInput) {
        if (!e.target.validity.valid) {
          e.target.value = this.previousValidInput;
        } else {
          this.previousValidInput = e.target.value;
        }
      }
    }

  });

;


  Polymer('core-item', {
    
    /**
     * The URL of an image for the icon.
     *
     * @attribute src
     * @type string
     * @default ''
     */

    /**
     * Specifies the icon from the Polymer icon set.
     *
     * @attribute icon
     * @type string
     * @default ''
     */

    /**
     * Specifies the label for the menu item.
     *
     * @attribute label
     * @type string
     * @default ''
     */

  });

;

    (function() {

      var ID = 0;
      function generate(node) {
        if (!node.id) {
          node.id = 'core-label-' + ID++;
        }
        return node.id;
      }

      Polymer('core-label', {
        /**
         * A query selector string for a "target" element not nested in the `<core-label>`
         *
         * @attribute for
         * @type string
         * @default ''
         */
        publish: {
          'for': {reflect: true, value: ''}
        },
        eventDelegates: {
          'tap': 'tapHandler'
        },
        created: function() {
          generate(this);
          this._forElement = null;
        },
        ready: function() {
          if (!this.for) {
            this._forElement = this.querySelector('[for]');
            this._tie();
          }
        },
        tapHandler: function(ev) {
          if (!this._forElement) {
            return;
          }
          if (ev.target === this._forElement) {
            return;
          }
          this._forElement.focus();
          this._forElement.click();
          this.fire('tap', null, this._forElement);
        },
        _tie: function() {
          if (this._forElement) {
            this._forElement.setAttribute('aria-labelledby', this.id);
          }
        },
        _findScope: function() {
          var n = this.parentNode;
          while(n && n.parentNode) {
            n = n.parentNode;
          }
          return n;
        },
        forChanged: function(oldFor, newFor) {
          if (this._forElement) {
            this._forElement.removeAttribute('aria-labelledby');
          }
          var scope = this._findScope();
          if (!scope) {
            return;
          }
          this._forElement = scope.querySelector(newFor);
          if (this._forElement) {
            this._tie();
          }
        }
      });
    })();
  ;

(function() {

  var IOS = navigator.userAgent.match(/iP(?:hone|ad;(?: U;)? CPU) OS (\d+)/);
  var IOS_TOUCH_SCROLLING = IOS && IOS[1] >= 8;

  Polymer('core-list',Polymer.mixin({
    
    publish: {
      /**
       * Fired when an item element is tapped.
       * 
       * @event core-activate
       * @param {Object} detail
       *   @param {Object} detail.item the item element
       */

      /**
       * An array of source data for the list to display.  Elements
       * from this array will be set to the `model` peroperty on each
       * template instance scope for binding.
       *
       * When `groups` is used, this array may either be flat, with
       * the group lengths specified in the `groups` array; otherwise
       * `data` may be specified as an array of arrays, such that the
       * each array in `data` specifies a group.  See examples above.
       *
       * @attribute data
       * @type array
       * @default null
       */
      data: null,

      /**
       * An array of data conveying information about groupings of items
       * in the `data` array.  Elements from this array will be set to the
       * `groupModel` property of each template instance scope for binding.
       *
       * When `groups` is used, template children with the `divider` attribute
       * will be shown above each group.  Typically data from the `groupModel`
       * would be bound to dividers.
       *
       * If `data` is specified as a flat array, the `groups` array must
       * contain objects of the format `{ length: n, data: {...} }`, where
       * `length` determines the number of items from the `data` array
       * that should be grouped, and `data` specifies the user data that will
       * be assigned to the `groupModel` property on the template instance
       * scope.
       *
       * If `data` is specified as a nested array of arrays, group lengths
       * are derived from these arrays, so each object in `groups` need only
       * contain the user data to be assigned to `groupModel`.
       *
       * @attribute groups
       * @type array
       * @default null
       */
      groups: null,

      /**
       * 
       * An optional element on which to listen for scroll events.
       *
       * @attribute scrollTarget
       * @type Element
       * @default core-list
       */
      scrollTarget: null,

      /**
       * 
       * When true, tapping a row will select the item, placing its data model
       * in the set of selected items retrievable via the `selection` property.
       *
       * Note that tapping focusable elements within the list item will not
       * result in selection, since they are presumed to have their own action.
       *
       * @attribute selectionEnabled
       * @type {boolean}
       * @default true
       */
      selectionEnabled: true,

      /**
       * 
       * Set to true to support multiple selection.  Note, existing selection
       * state is maintained only when changing `multi` from `false` to `true`;
       * it is cleared when changing from `true` to `false`.
       *
       * @attribute multi
       * @type boolean
       * @default false
       */
      multi: false,

      /**
       * 
       * Data record (or array of records, if `multi: true`) corresponding to
       * the currently selected set of items.
       *
       * @attribute selection
       * @type {any}
       * @default null
       */
       selection: null,

      /**
       * 
       * When true, the list is rendered as a grid.  Grid items must be fixed
       * height and width, with the width of each item specified in the `width`
       * property.
       *
       * @attribute grid
       * @type boolean
       * @default false
       */
       grid: false,

      /**
       * 
       * When `grid` is used, `width` determines the width of each grid item.
       * This property has no meaning when not in `grid` mode.
       *
       * @attribute width
       * @type number
       * @default null
       */
       width: null,

      /**
       * The approximate height of a list item, in pixels. This is used only for determining
       * the number of physical elements to render based on the viewport size
       * of the list.  Items themselves may vary in height between each other
       * depending on their data model.  There is typically no need to adjust 
       * this value unless the average size is much larger or smaller than the default.
       *
       * @attribute height
       * @type number
       * @default 200
       */
      height: 200,

      /**
       * The amount of scrolling runway the list keeps rendered, as a factor of
       * the list viewport size.  There is typically no need to adjust this value
       * other than for performance tuning.  Larger value correspond to more
       * physical elements being rendered.
       *
       * @attribute runwayFactor
       * @type number
       * @default 4
       */
      runwayFactor: 4

    },

    eventDelegates: {
      tap: 'tapHandler',
      'core-resize': 'updateSize'
    },

    // Local cache of scrollTop
    _scrollTop: 0,
    
    observe: {
      'isAttached data grid width template scrollTarget': 'initialize',
      'multi selectionEnabled': '_resetSelection'
    },

    ready: function() {
      this._boundScrollHandler = this.scrollHandler.bind(this);
      this._boundPositionItems = this._positionItems.bind(this);
      this._oldMulti = this.multi;
      this._oldSelectionEnabled = this.selectionEnabled;
      this._virtualStart = 0;
      this._virtualCount = 0;
      this._physicalStart = 0;
      this._physicalOffset = 0;
      this._physicalSize = 0;
      this._physicalSizes = [];
      this._physicalAverage = 0;
      this._itemSizes = [];
      this._dividerSizes = [];
      this._repositionedItems = [];

      this._aboveSize = 0;

      this._nestedGroups = false;
      this._groupStart = 0;
      this._groupStartIndex = 0;
    },

    attached: function() {
      this.isAttached = true;
      this.template = this.querySelector('template');
      if (!this.template.bindingDelegate) {
        this.template.bindingDelegate = this.element.syntax;
      }
      this.resizableAttachedHandler();
    },

    detached: function() {
      this.isAttached = false;
      if (this._target) {
        this._target.removeEventListener('scroll', this._boundScrollHandler);
      }
      this.resizableDetachedHandler();
    },

    /**
     * To be called by the user when the list is manually resized
     * or shown after being hidden.
     *
     * @method updateSize
     */
    updateSize: function() {
      if (!this._positionPending && !this._needItemInit) {
        this._resetIndex(this._getFirstVisibleIndex() || 0);
        this.initialize();
      }
    },

    _resetSelection: function() {
      if (((this._oldMulti != this.multi) && !this.multi) || 
          ((this._oldSelectionEnabled != this.selectionEnabled) && 
            !this.selectionEnabled)) {
        this._clearSelection();
        this.refresh();
      } else {
        this.selection = this.$.selection.getSelection();
      }
      this._oldMulti = this.multi;
      this._oldSelectionEnabled = this.selectionEnabled;
    },

    // Adjust virtual start index based on changes to backing data
    _adjustVirtualIndex: function(splices, group) {
      if (this._targetSize === 0) {
        return;
      }
      var totalDelta = 0;
      for (var i=0; i<splices.length; i++) {
        var s = splices[i];
        var idx = s.index;
        var gidx, gitem;
        if (group) {
          gidx = this.data.indexOf(group);
          idx += this.virtualIndexForGroup(gidx);
        }
        // We only need to care about changes happening above the current position
        if (idx >= this._virtualStart) {
          break;
        }
        var delta = Math.max(s.addedCount - s.removed.length, idx - this._virtualStart);
        totalDelta += delta;
        this._physicalStart += delta;
        this._virtualStart += delta;
        if (this._grouped) {
          if (group) {
            gitem = s.index;
          } else {
            var g = this.groupForVirtualIndex(s.index);
            gidx = g.group;
            gitem = g.groupIndex;
          }
          if (gidx == this._groupStart && gitem < this._groupStartIndex) {
            this._groupStartIndex += delta;
          }
        }
      }
      // Adjust offset/scroll position based on total number of items changed
      if (this._virtualStart < this._physicalCount) {
        this._resetIndex(this._getFirstVisibleIndex() || 0);
      } else {
        totalDelta = Math.max((totalDelta / this._rowFactor) * this._physicalAverage, -this._physicalOffset);
        this._physicalOffset += totalDelta;
        this._scrollTop = this.setScrollTop(this._scrollTop + totalDelta);
      }
    },

    _updateSelection: function(splices) {
      for (var i=0; i<splices.length; i++) {
        var s = splices[i];
        for (var j=0; j<s.removed.length; j++) {
          var d = s.removed[j];
          this.$.selection.setItemSelected(d, false);
        }
      }
    },

    groupsChanged: function() {
      if (!!this.groups != this._grouped) {
        this.updateSize();
      }
    },

    initialize: function() {
      if (!this.template || !this.isAttached) {
        return;
      }

      // TODO(kschaaf): Checking arguments.length currently the only way to 
      // know that the array was mutated as opposed to newly assigned; need
      // a better API for Polymer observers
      var splices;
      if (arguments.length == 1) {
        splices = arguments[0];
        if (!this._nestedGroups) {
          this._adjustVirtualIndex(splices);
        }
        this._updateSelection(splices);
      } else {
        this._clearSelection();
      }

      // Initialize scroll target
      var target = this.scrollTarget || this;
      if (this._target !== target) {
        this.initializeScrollTarget(target);
      }

      // Initialize data
      this.initializeData(splices, false);
    },

    initializeScrollTarget: function(target) {
      // Listen for scroll events
      if (this._target) {
        this._target.removeEventListener('scroll', this._boundScrollHandler, false);
      }
      this._target = target;
      target.addEventListener('scroll', this._boundScrollHandler, false);
      // Support for non-native scrollers (must implement abstract API):
      // getScrollTop, setScrollTop, sync
      if ((target != this) && target.setScrollTop && target.getScrollTop) {
        this.setScrollTop = function(val) {
          target.setScrollTop(val);
          return target.getScrollTop();
        };
        this.getScrollTop = target.getScrollTop.bind(target);
        this.syncScroller = target.sync ? target.sync.bind(target) : function() {};
        // Adjusting scroll position on non-native scrollers is risky
        this.adjustPositionAllowed = false;
      } else {
        this.setScrollTop = function(val) {
          target.scrollTop = val;
          return target.scrollTop;
        };
        this.getScrollTop = function() {
          return target.scrollTop;
        };
        this.syncScroller = function() {};
        this.adjustPositionAllowed = true;
      }
      // Only use -webkit-overflow-touch from iOS8+, where scroll events are fired
      if (IOS_TOUCH_SCROLLING) {
        target.style.webkitOverflowScrolling = 'touch';
        // Adjusting scrollTop during iOS momentum scrolling is "no bueno"
        this.adjustPositionAllowed = false;
      }
      // Force overflow as necessary
      this._target.style.willChange = 'transform';
      if (getComputedStyle(this._target).position == 'static') {
        this._target.style.position = 'relative';
      }
      this._target.style.boxSizing = this._target.style.mozBoxSizing = 'border-box';
      this.style.overflowY = (target == this) ? 'auto' : null;
    },

    updateGroupObservers: function(splices) {
      // If we're going from grouped to non-grouped, remove all observers
      if (!this._nestedGroups) {
        if (this._groupObservers && this._groupObservers.length) {
          splices = [{
            index: 0,
            addedCount: 0,
            removed: this._groupObservers
          }];
        } else {
          splices = null;
        }
      }
      // Otherwise, create observers for all groups, unless this is a group splice
      if (this._nestedGroups) {
        splices = splices || [{
          index: 0,
          addedCount: this.data.length,
          removed: []
        }];
      }
      if (splices) {
        var observers = this._groupObservers || [];
        // Apply the splices to the observer array
        for (var i=0; i<splices.length; i++) {
          var s = splices[i], j;
          var args = [s.index, s.removed.length];
          if (s.removed.length) {
            for (j=s.index; j<s.removed.length; j++) {
              observers[j].close();
            }
          }
          if (s.addedCount) {
            for (j=s.index; j<s.addedCount; j++) {
              var o = new ArrayObserver(this.data[j]);
              args.push(o);
              o.open(this.getGroupDataHandler(this.data[j]));
            }
          }
          observers.splice.apply(observers, args);
        }
        this._groupObservers = observers;
      }
    },

    getGroupDataHandler: function(group) {
      return function(splices) {
        this.groupDataChanged(splices, group);
      }.bind(this);
    },

    groupDataChanged: function(splices, group) {
      this._adjustVirtualIndex(splices, group);
      this._updateSelection(splices);
      this.initializeData(null, true);
    },

    initializeData: function(splices, groupUpdate) {
      var i;

      // Calculate row-factor for grid layout
      if (this.grid) {
        if (!this.width) {
          throw 'Grid requires the `width` property to be set';
        }
        var cs = getComputedStyle(this._target);
        var padding = parseInt(cs.paddingLeft || 0) + parseInt(cs.paddingRight || 0);
        this._rowFactor = Math.floor((this._target.offsetWidth - padding) / this.width) || 1;
        this._rowMargin = (this._target.offsetWidth - (this._rowFactor * this.width) - padding) / 2;
      } else {
        this._rowFactor = 1;
        this._rowMargin = 0;
      }

      // Count virtual data size, depending on whether grouping is enabled
      if (!this.data || !this.data.length) {
        this._virtualCount = 0;
        this._grouped = false;
        this._nestedGroups = false;
      } else if (this.groups) {
        this._grouped = true;
        this._nestedGroups = Array.isArray(this.data[0]);
        if (this._nestedGroups) {
          if (this.groups.length != this.data.length) {
            throw 'When using nested grouped data, data.length and groups.length must agree!';
          }
          this._virtualCount = 0;
          for (i=0; i<this.groups.length; i++) {
            this._virtualCount += this.data[i] && this.data[i].length;
          }
        } else {
          this._virtualCount = this.data.length;
          var len = 0;
          for (i=0; i<this.groups.length; i++) {
            len += this.groups[i].length;
          }
          if (len != this.data.length) {
            throw 'When using groups data, the sum of group[n].length\'s and data.length must agree!';
          }
        }
        var g = this.groupForVirtualIndex(this._virtualStart);
        this._groupStart = g.group;
        this._groupStartIndex = g.groupIndex;
      } else {
        this._grouped = false;
        this._nestedGroups = false;
        this._virtualCount = this.data.length;
      }

      // Update grouped array observers used when group data is nested
      if (!groupUpdate) {
        this.updateGroupObservers(splices);
      }
      
      // Add physical items up to a max based on data length, viewport size, and extra item overhang
      var currentCount = this._physicalCount || 0;
      var height = this._target.offsetHeight;
      if (!height && this._target.offsetParent) {
        console.warn('core-list must either be sized or be inside an overflow:auto div that is sized');
      }
      this._physicalCount = Math.min(Math.ceil(height / (this._physicalAverage || this.height)) * this.runwayFactor * this._rowFactor, this._virtualCount);
      this._physicalCount = Math.max(currentCount, this._physicalCount);
      this._physicalData = this._physicalData || new Array(this._physicalCount);
      var needItemInit = false;
      while (currentCount < this._physicalCount) {
        var model = this.templateInstance ? Object.create(this.templateInstance.model) : {};
        this._physicalData[currentCount++] = model;
        needItemInit = true;
      }
      this.template.model = this._physicalData;
      this.template.setAttribute('repeat', '');
      this._dir = 0;

      // If we've added new items, wait until the template renders then
      // initialize the new items before refreshing
      if (!this._needItemInit) {
        if (needItemInit) {
          this._needItemInit = true;
          this.resetMetrics();
          this.onMutation(this, this.initializeItems);
        } else {
          this.refresh();
        }
      }
    },

    initializeItems: function() {
      var currentCount = this._physicalItems && this._physicalItems.length || 0;
      this._physicalItems = this._physicalItems || [new Array(this._physicalCount)];
      this._physicalDividers = this._physicalDividers || new Array(this._physicalCount);
      for (var i = 0, item = this.template.nextElementSibling;
           item && i < this._physicalCount;
           item = item.nextElementSibling) {
        if (item.getAttribute('divider') != null) {
          this._physicalDividers[i] = item;
        } else {
          this._physicalItems[i++] = item;
        }
      }
      this.refresh();
      this._needItemInit = false;
    },

    _updateItemData: function(force, physicalIndex, virtualIndex, groupIndex, groupItemIndex) {
      var physicalItem = this._physicalItems[physicalIndex];
      var physicalDatum = this._physicalData[physicalIndex];
      var virtualDatum = this.dataForIndex(virtualIndex, groupIndex, groupItemIndex);
      var needsReposition;
      if (force || physicalDatum.model != virtualDatum) {
        // Set model, index, and selected fields
        physicalDatum.model = virtualDatum;
        physicalDatum.index = virtualIndex;
        physicalDatum.physicalIndex = physicalIndex;
        physicalDatum.selected = this.selectionEnabled && virtualDatum ? 
            this._selectedData.get(virtualDatum) : null;
        // Set group-related fields
        if (this._grouped) {
          var groupModel = this.groups[groupIndex];
          physicalDatum.groupModel = groupModel && (this._nestedGroups ? groupModel : groupModel.data);
          physicalDatum.groupIndex = groupIndex;
          physicalDatum.groupItemIndex = groupItemIndex;
          physicalItem._isDivider = this.data.length && (groupItemIndex === 0);
          physicalItem._isRowStart = (groupItemIndex % this._rowFactor) === 0;
        } else {
          physicalDatum.groupModel = null;
          physicalDatum.groupIndex = null;
          physicalDatum.groupItemIndex = null;
          physicalItem._isDivider = false;
          physicalItem._isRowStart = (virtualIndex % this._rowFactor) === 0;
        }
        // Hide physical items when not in use (no model assigned)
        physicalItem.hidden = !virtualDatum;
        var divider = this._physicalDividers[physicalIndex];
        if (divider && (divider.hidden == physicalItem._isDivider)) {
          divider.hidden = !physicalItem._isDivider;
        }
        needsReposition = !force;
      } else {
        needsReposition = false;
      }
      return needsReposition || force;
    },

    scrollHandler: function() {
      if (IOS_TOUCH_SCROLLING) {
        // iOS sends multiple scroll events per rAF
        // Align work to rAF to reduce overhead & artifacts
        if (!this._raf) {
          this._raf = requestAnimationFrame(function() { 
            this._raf = null;
            this.refresh();
          }.bind(this));
        }
      } else {
        this.refresh();
      }
    },

    resetMetrics: function() {
      this._physicalAverage = 0;
      this._physicalAverageCount = 0;
    },

    updateMetrics: function(force) {
      // Measure physical items & dividers
      var totalSize = 0;
      var count = 0;
      for (var i=0; i<this._physicalCount; i++) {
        var item = this._physicalItems[i];
        if (!item.hidden) {
          var size = this._itemSizes[i] = item.offsetHeight;
          if (item._isDivider) {
            var divider = this._physicalDividers[i];
            if (divider) {
              size += (this._dividerSizes[i] = divider.offsetHeight);
            }
          }
          this._physicalSizes[i] = size;
          if (item._isRowStart) {
            totalSize += size;
            count++;
          }
        }
      }
      this._physicalSize = totalSize;

      // Measure other DOM
      this._viewportSize = this.$.viewport.offsetHeight;
      this._targetSize = this._target.offsetHeight;

      // Measure content in scroller before virtualized items
      if (this._target != this) {
        this._aboveSize = this.offsetTop;
      } else {
        this._aboveSize = parseInt(getComputedStyle(this._target).paddingTop);
      }

      // Calculate average height
      if (count) {
        totalSize = (this._physicalAverage * this._physicalAverageCount) + totalSize;
        this._physicalAverageCount += count;
        this._physicalAverage = Math.round(totalSize / this._physicalAverageCount);
      }
    },

    getGroupLen: function(group) {
      group = arguments.length ? group : this._groupStart;
      if (this._nestedGroups) {
        return this.data[group].length;
      } else {
        return this.groups[group].length;
      }
    },

    changeStartIndex: function(inc) {
      this._virtualStart += inc;
      if (this._grouped) {
        while (inc > 0) {
          var groupMax = this.getGroupLen() - this._groupStartIndex - 1;
          if (inc > groupMax) {
            inc -= (groupMax + 1);
            this._groupStart++;
            this._groupStartIndex = 0;
          } else {
            this._groupStartIndex += inc;
            inc = 0;
          }
        }
        while (inc < 0) {
          if (-inc > this._groupStartIndex) {
            inc += this._groupStartIndex;
            this._groupStart--;
            this._groupStartIndex = this.getGroupLen();
          } else {
            this._groupStartIndex += inc;
            inc = this.getGroupLen();
          }
        }
      }
      // In grid mode, virtualIndex must alway start on a row start!
      if (this.grid) {
        if (this._grouped) {
          inc = this._groupStartIndex % this._rowFactor;
        } else {
          inc = this._virtualStart % this._rowFactor;
        }
        if (inc) {
          this.changeStartIndex(-inc);
        }
      }
    },

    getRowCount: function(dir) {
      if (!this.grid) {
        return dir;
      } else if (!this._grouped) {
        return dir * this._rowFactor;
      } else {
        if (dir < 0) {
          if (this._groupStartIndex > 0) {
            return -Math.min(this._rowFactor, this._groupStartIndex);
          } else {
            var prevLen = this.getGroupLen(this._groupStart-1);
            return -Math.min(this._rowFactor, prevLen % this._rowFactor || this._rowFactor);
          }
        } else {
          return Math.min(this._rowFactor, this.getGroupLen() - this._groupStartIndex);
        }
      }
    },

    _virtualToPhysical: function(virtualIndex) {
      var physicalIndex = (virtualIndex - this._physicalStart) % this._physicalCount;
      return physicalIndex < 0 ? this._physicalCount + physicalIndex : physicalIndex;
    },

    groupForVirtualIndex: function(virtual) {
      if (!this._grouped) {
        return {};
      } else {
        var group;
        for (group=0; group<this.groups.length; group++) {
          var groupLen = this.getGroupLen(group);
          if (groupLen > virtual) {
            break;
          } else {
            virtual -= groupLen;
          }
        }
        return {group: group, groupIndex: virtual };
      }
    },

    virtualIndexForGroup: function(group, groupIndex) {
      groupIndex = groupIndex ? Math.min(groupIndex, this.getGroupLen(group)) : 0;
      group--;
      while (group >= 0) {
        groupIndex += this.getGroupLen(group--);
      }
      return groupIndex;
    },

    dataForIndex: function(virtual, group, groupIndex) {
      if (this.data) {
        if (this._nestedGroups) {
          if (virtual < this._virtualCount) {
            return this.data[group][groupIndex];
          }
        } else {
          return this.data[virtual];
        }
      }
    },

    // Refresh the list at the current scroll position.
    refresh: function() {
      var i, deltaCount;

      // Determine scroll position & any scrollDelta that may have occurred
      var lastScrollTop = this._scrollTop;
      this._scrollTop = this.getScrollTop();
      var scrollDelta = this._scrollTop - lastScrollTop;
      this._dir = scrollDelta < 0 ? -1 : scrollDelta > 0 ? 1 : 0;

      // Adjust virtual items and positioning offset if scroll occurred
      if (Math.abs(scrollDelta) > Math.max(this._physicalSize, this._targetSize)) {
        // Random access to point in list: guess new index based on average size
        deltaCount = Math.round((scrollDelta / this._physicalAverage) * this._rowFactor);
        deltaCount = Math.max(deltaCount, -this._virtualStart);
        deltaCount = Math.min(deltaCount, this._virtualCount - this._virtualStart - 1);
        this._physicalOffset += Math.max(scrollDelta, -this._physicalOffset);
        this.changeStartIndex(deltaCount);
        // console.log(this._scrollTop, 'Random access to ' + this._virtualStart, this._physicalOffset);
      } else {
        // Incremental movement: adjust index by flipping items
        var base = this._aboveSize + this._physicalOffset;
        var margin = 0.3 * Math.max((this._physicalSize - this._targetSize, this._physicalSize));
        this._upperBound = base + margin;
        this._lowerBound = base + this._physicalSize - this._targetSize - margin;
        var flipBound = this._dir > 0 ? this._upperBound : this._lowerBound;
        if (((this._dir > 0 && this._scrollTop > flipBound) ||
             (this._dir < 0 && this._scrollTop < flipBound))) {
          var flipSize = Math.abs(this._scrollTop - flipBound);
          for (i=0; (i<this._physicalCount) && (flipSize > 0) &&
              ((this._dir < 0 && this._virtualStart > 0) || 
               (this._dir > 0 && this._virtualStart < this._virtualCount-this._physicalCount)); i++) {
            var idx = this._virtualToPhysical(this._dir > 0 ? 
              this._virtualStart : 
              this._virtualStart + this._physicalCount -1);
            var size = this._physicalSizes[idx];
            flipSize -= size;
            var cnt = this.getRowCount(this._dir);
            // console.log(this._scrollTop, 'flip ' + (this._dir > 0 ? 'down' : 'up'), cnt, this._virtualStart, this._physicalOffset);
            if (this._dir > 0) {
              // When scrolling down, offset is adjusted based on previous item's size
              this._physicalOffset += size;
              // console.log('  ->', this._virtualStart, size, this._physicalOffset);
            }
            this.changeStartIndex(cnt);
            if (this._dir < 0) {
              this._repositionedItems.push(this._virtualStart);
            }
          }
        }
      }

      // Assign data to items lazily if scrolling, otherwise force
      if (this._updateItems(!scrollDelta)) {
        // Position items after bindings resolve (method varies based on O.o impl)
        if (Observer.hasObjectObserve) {
          this.async(this._boundPositionItems);
        } else {
          Platform.flush();
          Platform.endOfMicrotask(this._boundPositionItems);
        }
      }
    },

    _updateItems: function(force) {
      var i, virtualIndex, physicalIndex;
      var needsReposition = false;
      var groupIndex = this._groupStart;
      var groupItemIndex = this._groupStartIndex;
      for (i = 0; i < this._physicalCount; ++i) {
        virtualIndex = this._virtualStart + i;
        physicalIndex = this._virtualToPhysical(virtualIndex);
        // Update physical item with new user data and list metadata
        needsReposition = 
          this._updateItemData(force, physicalIndex, virtualIndex, groupIndex, groupItemIndex) || needsReposition;
        // Increment
        groupItemIndex++;
        if (this.groups && groupIndex < this.groups.length - 1) {
          if (groupItemIndex >= this.getGroupLen(groupIndex)) {
            groupItemIndex = 0;
            groupIndex++;
          }
        }
      }
      return needsReposition;
    },

    _positionItems: function() {
      var i, virtualIndex, physicalIndex, physicalItem;

      // Measure
      this.updateMetrics();

      // Pre-positioning tasks
      if (this._dir < 0) {
        // When going up, remove offset after measuring size for
        // new data for item being moved from bottom to top
        while (this._repositionedItems.length) {
          virtualIndex = this._repositionedItems.pop();
          physicalIndex = this._virtualToPhysical(virtualIndex);
          this._physicalOffset -= this._physicalSizes[physicalIndex];
          // console.log('  <-', virtualIndex, this._physicalSizes[physicalIndex], this._physicalOffset);
        }
        // Adjust scroll position to home into top when going up
        if (this._scrollTop + this._targetSize < this._viewportSize) {
          this._updateScrollPosition(this._scrollTop);
        }
      }

      // Position items
      var divider, upperBound, lowerBound;
      var rowx = 0;
      var x = this._rowMargin;
      var y = this._physicalOffset;
      var lastHeight = 0;
      for (i = 0; i < this._physicalCount; ++i) {
        // Calculate indices
        virtualIndex = this._virtualStart + i;
        physicalIndex = this._virtualToPhysical(virtualIndex);
        physicalItem = this._physicalItems[physicalIndex];
        // Position divider
        if (physicalItem._isDivider) {
          if (rowx !== 0) {
            y += lastHeight;
            rowx = 0;
          }
          divider = this._physicalDividers[physicalIndex];
          x = this._rowMargin;
          if (divider && (divider._translateX != x || divider._translateY != y)) {
            divider.style.opacity = 1;
            if (this.grid) {
              divider.style.width = this.width * this._rowFactor + 'px';
            }
            divider.style.transform = divider.style.webkitTransform =
              'translate3d(' + x + 'px,' + y + 'px,0)';
            divider._translateX = x;
            divider._translateY = y;
          }
          y += this._dividerSizes[physicalIndex];
        }
        // Position item
        if (physicalItem._translateX != x || physicalItem._translateY != y) {
          physicalItem.style.opacity = 1;
          physicalItem.style.transform = physicalItem.style.webkitTransform =
            'translate3d(' + x + 'px,' + y + 'px,0)';
          physicalItem._translateX = x;
          physicalItem._translateY = y;
        }
        // Increment offsets
        lastHeight = this._itemSizes[physicalIndex];
        if (this.grid) {
          rowx++;
          if (rowx >= this._rowFactor) {
            rowx = 0;
            y += lastHeight;
          }
          x = this._rowMargin + rowx * this.width;
        } else {
          y += lastHeight;
        }
      }

      if (this._scrollTop >= 0) {
        this._updateViewportHeight();
      }
    },

    _updateViewportHeight: function() {
      var remaining = Math.max(this._virtualCount - this._virtualStart - this._physicalCount, 0);
      remaining = Math.ceil(remaining / this._rowFactor);
      var vs = this._physicalOffset + this._physicalSize + remaining * this._physicalAverage;
      if (this._viewportSize != vs) {
        // console.log(this._scrollTop, 'adjusting viewport height', vs - this._viewportSize, vs);
        this._viewportSize = vs;
        this.$.viewport.style.height = this._viewportSize + 'px';
        this.syncScroller();
      }
    },

    _updateScrollPosition: function(scrollTop) {
      var deltaHeight = this._virtualStart === 0 ? this._physicalOffset :
        Math.min(scrollTop + this._physicalOffset, 0);
      if (deltaHeight) {
        // console.log(scrollTop, 'adjusting scroll pos', this._virtualStart, -deltaHeight, scrollTop - deltaHeight);
        if (this.adjustPositionAllowed) {
          this._scrollTop = this.setScrollTop(scrollTop - deltaHeight);
        }
        this._physicalOffset -= deltaHeight;
      }
    },

    // list selection
    tapHandler: function(e) {
      var n = e.target;
      var p = e.path;
      if (!this.selectionEnabled || (n === this)) {
        return;
      }
      requestAnimationFrame(function() {
        // Gambit: only select the item if the tap wasn't on a focusable child
        // of the list (since anything with its own action should be focusable
        // and not result in result in list selection).  To check this, we
        // asynchronously check that shadowRoot.activeElement is null, which 
        // means the tapped item wasn't focusable. On polyfill where
        // activeElement doesn't follow the data-hinding part of the spec, we
        // can check that document.activeElement is the list itself, which will
        // catch focus in lieu of the tapped item being focusable, as we make
        // the list focusable (tabindex="-1") for this purpose.  Note we also
        // allow the list items themselves to be focusable if desired, so those
        // are excluded as well.
        var active = window.ShadowDOMPolyfill ? 
            wrap(document.activeElement) : this.shadowRoot.activeElement;
        if (active && (active != this) && (active.parentElement != this) && 
            (document.activeElement != document.body)) {
          return;
        }
        // Unfortunately, Safari does not focus certain form controls via mouse,
        // so we also blacklist input, button, & select
        // (https://bugs.webkit.org/show_bug.cgi?id=118043)
        if ((p[0].localName == 'input') || 
            (p[0].localName == 'button') || 
            (p[0].localName == 'select')) {
          return;
        }

        var model = n.templateInstance && n.templateInstance.model;
        if (model) {
          var data = this.dataForIndex(model.index, model.groupIndex, model.groupItemIndex);
          var item = this._physicalItems[model.physicalIndex];
          if (!this.multi && data == this.selection) {
            this.$.selection.select(null);
          } else {
            this.$.selection.select(data);
          }
          this.asyncFire('core-activate', {data: data, item: item});
        }
      }.bind(this));
    },

    selectedHandler: function(e, detail) {
      this.selection = this.$.selection.getSelection();
      var id = this.indexesForData(detail.item);
      // TODO(sorvell): we should be relying on selection to store the
      // selected data but we want to optimize for lookup.
      this._selectedData.set(detail.item, detail.isSelected);
      if (id.physical >= 0 && id.virtual >= 0) {
        this.refresh();
      }
    },

    /**
     * Select the list item at the given index.
     *
     * @method selectItem
     * @param {number} index 
     */
    selectItem: function(index) {
      if (!this.selectionEnabled) {
        return;
      }
      var data = this.data[index];
      if (data) {
        this.$.selection.select(data);
      }
    },

    /**
     * Set the selected state of the list item at the given index.
     *
     * @method setItemSelected
     * @param {number} index 
     * @param {boolean} isSelected 
     */
    setItemSelected: function(index, isSelected) {
      var data = this.data[index];
      if (data) {
        this.$.selection.setItemSelected(data, isSelected);
      }
    },

    indexesForData: function(data) {
      var virtual = -1;
      var groupsLen = 0;
      if (this._nestedGroups) {
        for (var i=0; i<this.groups.length; i++) {
          virtual = this.data[i].indexOf(data);
          if (virtual < 0) {
            groupsLen += this.data[i].length;
          } else {
            virtual += groupsLen;
            break;
          }
        }
      } else {
        virtual = this.data.indexOf(data);
      }
      var physical = this.virtualToPhysicalIndex(virtual);
      return { virtual: virtual, physical: physical };
    },

    virtualToPhysicalIndex: function(index) {
      for (var i=0, l=this._physicalData.length; i<l; i++) {
        if (this._physicalData[i].index === index) {
          return i;
        }
      }
      return -1;
    },

    /**
     * Clears the current selection state of the list.
     *
     * @method clearSelection
     */
    clearSelection: function() {
      this._clearSelection();
      this.refresh();
    },

    _clearSelection: function() {
      this._selectedData = new WeakMap();
      this.$.selection.clear();
      this.selection = this.$.selection.getSelection();
    },

    _getFirstVisibleIndex: function() {
      for (var i=0; i<this._physicalCount; i++) {
        var virtualIndex = this._virtualStart + i;
        var physicalIndex = this._virtualToPhysical(virtualIndex);
        var item = this._physicalItems[physicalIndex];
        if (!item.hidden && item._translateY >= this._scrollTop - this._aboveSize) {
          return virtualIndex;
        }
      }
    },

    _resetIndex: function(index) {
      index = Math.min(index, this._virtualCount-1);
      index = Math.max(index, 0);
      this.changeStartIndex(index - this._virtualStart);
      this._scrollTop = this.setScrollTop(this._aboveSize + (index / this._rowFactor) * this._physicalAverage);
      this._physicalOffset = this._scrollTop - this._aboveSize;
      this._dir = 0;
    },

    /**
     * Scroll to an item.
     *
     * Note, when grouping is used, the index is based on the
     * total flattened number of items.  For scrolling to an item
     * within a group, use the `scrollToGroupItem` API.
     *
     * @method scrollToItem
     * @param {number} index 
     */
    scrollToItem: function(index) {
      this.scrollToGroupItem(null, index);
    },

    /**
     * Scroll to a group.
     *
     * @method scrollToGroup
     * @param {number} group 
     */
    scrollToGroup: function(group) {
      this.scrollToGroupItem(group, 0);
    },

    /**
     * Scroll to an item within a group.
     *
     * @method scrollToGroupItem
     * @param {number} group 
     * @param {number} index 
     */
    scrollToGroupItem: function(group, index) {
      if (group != null) {
        index = this.virtualIndexForGroup(group, index);
      }
      this._resetIndex(index);
      this.refresh();
    }

  }, Polymer.CoreResizable));

})();
;

  (function() {
    /*
     * Chrome uses an older version of DOM Level 3 Keyboard Events
     *
     * Most keys are labeled as text, but some are Unicode codepoints.
     * Values taken from: http://www.w3.org/TR/2007/WD-DOM-Level-3-Events-20071221/keyset.html#KeySet-Set
     */
    var KEY_IDENTIFIER = {
      'U+0009': 'tab',
      'U+001B': 'esc',
      'U+0020': 'space',
      'U+002A': '*',
      'U+0030': '0',
      'U+0031': '1',
      'U+0032': '2',
      'U+0033': '3',
      'U+0034': '4',
      'U+0035': '5',
      'U+0036': '6',
      'U+0037': '7',
      'U+0038': '8',
      'U+0039': '9',
      'U+0041': 'a',
      'U+0042': 'b',
      'U+0043': 'c',
      'U+0044': 'd',
      'U+0045': 'e',
      'U+0046': 'f',
      'U+0047': 'g',
      'U+0048': 'h',
      'U+0049': 'i',
      'U+004A': 'j',
      'U+004B': 'k',
      'U+004C': 'l',
      'U+004D': 'm',
      'U+004E': 'n',
      'U+004F': 'o',
      'U+0050': 'p',
      'U+0051': 'q',
      'U+0052': 'r',
      'U+0053': 's',
      'U+0054': 't',
      'U+0055': 'u',
      'U+0056': 'v',
      'U+0057': 'w',
      'U+0058': 'x',
      'U+0059': 'y',
      'U+005A': 'z',
      'U+007F': 'del'
    };

    /*
     * Special table for KeyboardEvent.keyCode.
     * KeyboardEvent.keyIdentifier is better, and KeyBoardEvent.key is even better than that
     *
     * Values from: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent.keyCode#Value_of_keyCode
     */
    var KEY_CODE = {
      9: 'tab',
      13: 'enter',
      27: 'esc',
      33: 'pageup',
      34: 'pagedown',
      35: 'end',
      36: 'home',
      32: 'space',
      37: 'left',
      38: 'up',
      39: 'right',
      40: 'down',
      46: 'del',
      106: '*'
    };

    /*
     * KeyboardEvent.key is mostly represented by printable character made by the keyboard, with unprintable keys labeled
     * nicely.
     *
     * However, on OS X, Alt+char can make a Unicode character that follows an Apple-specific mapping. In this case, we
     * fall back to .keyCode.
     */
    var KEY_CHAR = /[a-z0-9*]/;

    function transformKey(key) {
      var validKey = '';
      if (key) {
        var lKey = key.toLowerCase();
        if (lKey.length == 1) {
          if (KEY_CHAR.test(lKey)) {
            validKey = lKey;
          }
        } else if (lKey == 'multiply') {
          // numpad '*' can map to Multiply on IE/Windows
          validKey = '*';
        } else {
          validKey = lKey;
        }
      }
      return validKey;
    }

    var IDENT_CHAR = /U\+/;
    function transformKeyIdentifier(keyIdent) {
      var validKey = '';
      if (keyIdent) {
        if (IDENT_CHAR.test(keyIdent)) {
          validKey = KEY_IDENTIFIER[keyIdent];
        } else {
          validKey = keyIdent.toLowerCase();
        }
      }
      return validKey;
    }

    function transformKeyCode(keyCode) {
      var validKey = '';
      if (Number(keyCode)) {
        if (keyCode >= 65 && keyCode <= 90) {
          // ascii a-z
          // lowercase is 32 offset from uppercase
          validKey = String.fromCharCode(32 + keyCode);
        } else if (keyCode >= 112 && keyCode <= 123) {
          // function keys f1-f12
          validKey = 'f' + (keyCode - 112);
        } else if (keyCode >= 48 && keyCode <= 57) {
          // top 0-9 keys
          validKey = String(48 - keyCode);
        } else if (keyCode >= 96 && keyCode <= 105) {
          // num pad 0-9
          validKey = String(96 - keyCode);
        } else {
          validKey = KEY_CODE[keyCode];
        }
      }
      return validKey;
    }

    function keyboardEventToKey(ev) {
      // fall back from .key, to .keyIdentifier, to .keyCode, and then to .detail.key to support artificial keyboard events
      var normalizedKey = transformKey(ev.key) || transformKeyIdentifier(ev.keyIdentifier) || transformKeyCode(ev.keyCode) || transformKey(ev.detail.key) || '';
      return {
        shift: ev.shiftKey,
        ctrl: ev.ctrlKey,
        meta: ev.metaKey,
        alt: ev.altKey,
        key: normalizedKey
      };
    }

    /*
     * Input: ctrl+shift+f7 => {ctrl: true, shift: true, key: 'f7'}
     * ctrl/space => {ctrl: true} || {key: space}
     */
    function stringToKey(keyCombo) {
      var keys = keyCombo.split('+');
      var keyObj = Object.create(null);
      keys.forEach(function(key) {
        if (key == 'shift') {
          keyObj.shift = true;
        } else if (key == 'ctrl') {
          keyObj.ctrl = true;
        } else if (key == 'alt') {
          keyObj.alt = true;
        } else {
          keyObj.key = key;
        }
      });
      return keyObj;
    }

    function keyMatches(a, b) {
      return Boolean(a.alt) == Boolean(b.alt) && Boolean(a.ctrl) == Boolean(b.ctrl) && Boolean(a.shift) == Boolean(b.shift) && a.key === b.key;
    }

    /**
     * Fired when a keycombo in `keys` is pressed.
     *
     * @event keys-pressed
     */
    function processKeys(ev) {
      var current = keyboardEventToKey(ev);
      for (var i = 0, dk; i < this._desiredKeys.length; i++) {
        dk = this._desiredKeys[i];
        if (keyMatches(dk, current)) {
          ev.preventDefault();
          ev.stopPropagation();
          this.fire('keys-pressed', current, this, false);
          break;
        }
      }
    }

    function listen(node, handler) {
      if (node && node.addEventListener) {
        node.addEventListener('keydown', handler);
      }
    }

    function unlisten(node, handler) {
      if (node && node.removeEventListener) {
        node.removeEventListener('keydown', handler);
      }
    }

    Polymer('core-a11y-keys', {
      created: function() {
        this._keyHandler = processKeys.bind(this);
      },
      attached: function() {
        if (!this.target) {
          this.target = this.parentNode;
        }
        listen(this.target, this._keyHandler);
      },
      detached: function() {
        unlisten(this.target, this._keyHandler);
      },
      publish: {
        /**
         * The set of key combinations that will be matched (in keys syntax).
         *
         * @attribute keys
         * @type string
         * @default ''
         */
        keys: '',
        /**
         * The node that will fire keyboard events.
         * Default to this element's parentNode unless one is assigned
         *
         * @attribute target
         * @type Node
         * @default this.parentNode
         */
        target: null
      },
      keysChanged: function() {
        // * can have multiple mappings: shift+8, * on numpad or Multiply on numpad
        var normalized = this.keys.replace('*', '* shift+*');
        this._desiredKeys = normalized.toLowerCase().split(' ').map(stringToKey);
      },
      targetChanged: function(oldTarget) {
        unlisten(oldTarget, this._keyHandler);
        listen(this.target, this._keyHandler);
      }
    });
  })();
;
Polymer('core-menu');;


  Polymer('core-submenu', {

    publish: {
      active: {value: false, reflect: true}
    },

    opened: false,

    get items() {
      return this.$.submenu.items;
    },

    hasItems: function() {
      return !!this.items.length;
    },

    unselectAllItems: function() {
      this.$.submenu.selected = null;
      this.$.submenu.clearSelection();
    },

    activeChanged: function() {
      if (this.hasItems()) {
        this.opened = this.active;
      }
      if (!this.active) {
        this.unselectAllItems();
      }
    },
    
    toggle: function() {
      this.opened = !this.opened;
    },

    activate: function() {
      if (this.hasItems() && this.active) {
        this.toggle();
        this.unselectAllItems();
      }
    }
    
  });

;
Polymer('core-pages');;

(function() {

  Polymer('core-scroll-header-panel',Polymer.mixin({
    
    /**
     * Fired when the content has been scrolled.
     *
     * @event scroll
     */
     
    /**
     * Fired when the header is transformed.
     *
     * @event core-header-transform
     */
     
    publish: {
      /**
       * If true, the header's height will condense to `_condensedHeaderHeight`
       * as the user scrolls down from the top of the content area.
       *
       * @attribute condenses
       * @type boolean
       * @default false
       */
      condenses: false,

      /**
       * If true, no cross-fade transition from one background to another.
       *
       * @attribute noDissolve
       * @type boolean
       * @default false
       */
      noDissolve: false,

      /**
       * If true, the header doesn't slide back in when scrolling back up.
       *
       * @attribute noReveal
       * @type boolean
       * @default false
       */
      noReveal: false,

      /**
       * If true, the header is fixed to the top and never moves away.
       *
       * @attribute fixed
       * @type boolean
       * @default false
       */
      fixed: false,
      
      /**
       * If true, the condensed header is always shown and does not move away.
       *
       * @attribute keepCondensedHeader
       * @type boolean
       * @default false
       */
      keepCondensedHeader: false,

      /**
       * The height of the header when it is at its full size.
       *
       * By default, the height will be measured when it is ready.  If the height
       * changes later the user needs to either set this value to reflect the
       * new height or invoke `measureHeaderHeight()`.
       *
       * @attribute headerHeight
       * @type number
       * @default 0
       */
      headerHeight: 0,

      /**
       * The height of the header when it is condensed.
       *
       * By default, `_condensedHeaderHeight` is 1/3 of `headerHeight` unless
       * this is specified.
       *
       * @attribute condensedHeaderHeight
       * @type number
       * @default 0
       */
      condensedHeaderHeight: 0,
      
      /**
       * By default, the top part of the header stays when the header is being
       * condensed.  Set this to true if you want the top part of the header
       * to be scrolled away.
       *
       * @attribute scrollAwayTopbar
       * @type boolean
       * @default false
       */
      scrollAwayTopbar: false
    },

    prevScrollTop: 0,
    
    headerMargin: 0,
    
    y: 0,
    
    observe: {
      'headerMargin fixed': 'setup'
    },

    eventDelegates: {
      'core-resize': 'measureHeaderHeight'
    },

    attached: function() {
      this.resizableAttachedHandler();
    },

    ready: function() {
      this._scrollHandler = this.scroll.bind(this);
      this.scroller.addEventListener('scroll', this._scrollHandler);
    },
    
    detached: function() {
      this.scroller.removeEventListener('scroll', this._scrollHandler);
      this.resizableDetachedHandler();
    },
    
    domReady: function() {
      this.async('measureHeaderHeight');
    },

    get header() {
      return this.$.headerContent.getDistributedNodes()[0];
    },
    
    /**
     * Returns the scrollable element.
     *
     * @property scroller
     * @type Object
     */
    get scroller() {
      return this.$.mainContainer;
    },
    
    /**
     * Invoke this to tell `core-scroll-header-panel` to re-measure the header's
     * height.
     *
     * @method measureHeaderHeight
     */
    measureHeaderHeight: function() {
      var header = this.header;
      if (header && header.offsetHeight) {
        this.headerHeight = header.offsetHeight;
      }
    },
    
    headerHeightChanged: function() {
      if (!this.condensedHeaderHeight) {
        // assume _condensedHeaderHeight is 1/3 of the headerHeight
        this._condensedHeaderHeight = this.headerHeight * 1 / 3;
      }
      this.condensedHeaderHeightChanged();
    },
    
    condensedHeaderHeightChanged: function() {
      if (this.condensedHeaderHeight) {
        this._condensedHeaderHeight = this.condensedHeaderHeight;
      }
      if (this.headerHeight) {
        this.headerMargin = this.headerHeight - this._condensedHeaderHeight;
      }
    },
    
    condensesChanged: function() {
      if (this.condenses) {
        this.scroll();
      } else {
        // reset transform/opacity set on the header
        this.condenseHeader(null);
      }
    },
    
    setup: function() {
      var s = this.scroller.style;
      s.paddingTop = this.fixed ? '' : this.headerHeight + 'px';
      s.top = this.fixed ? this.headerHeight + 'px' : '';
      if (this.fixed) {
        this.transformHeader(null);
      } else {
        this.scroll();
      }
    },
    
    transformHeader: function(y) {
      var s = this.$.headerContainer.style;
      this.translateY(s, -y);
      
      if (this.condenses) {
        this.condenseHeader(y);
      }
      
      this.fire('core-header-transform', {y: y, height: this.headerHeight, 
          condensedHeight: this._condensedHeaderHeight});
    },
    
    condenseHeader: function(y) {
      var reset = y == null;
      // adjust top bar in core-header so the top bar stays at the top
      if (!this.scrollAwayTopbar && this.header.$ && this.header.$.topBar) {
        this.translateY(this.header.$.topBar.style, 
            reset ? null : Math.min(y, this.headerMargin));
      }
      // transition header bg
      var hbg = this.$.headerBg.style;
      if (!this.noDissolve) {
        hbg.opacity = reset ? '' : (this.headerMargin - y) / this.headerMargin;
      }
      // adjust header bg so it stays at the center
      this.translateY(hbg, reset ? null : y / 2);
      // transition condensed header bg
      var chbg = this.$.condensedHeaderBg.style;
      if (!this.noDissolve) {
        chbg = this.$.condensedHeaderBg.style;
        chbg.opacity = reset ? '' : y / this.headerMargin;
        // adjust condensed header bg so it stays at the center
        this.translateY(chbg, reset ? null : y / 2);
      }
    },
    
    translateY: function(s, y) {
      var t = y == null ? '' : 'translate3d(0, ' + y + 'px, 0)';
      setTransform(s, t);
    },
    
    scroll: function(event) {
      if (!this.header) {
        return;
      }
      
      var sTop = this.scroller.scrollTop;
      
      var y = Math.min(this.keepCondensedHeader ? 
          this.headerMargin : this.headerHeight, Math.max(0, 
          (this.noReveal ? sTop : this.y + sTop - this.prevScrollTop)));
      
      if (this.condenses && this.prevScrollTop >= sTop && sTop > this.headerMargin) {
        y = Math.max(y, this.headerMargin);
      }
      
      if (!event || !this.fixed && y !== this.y) {
        this.transformHeader(y);
      }
      
      this.prevScrollTop = Math.max(sTop, 0);
      this.y = y;
      
      if (event) {
        this.fire('scroll', {target: this.scroller}, this, false);
      }
    }

  }, Polymer.CoreResizable));
  
  //determine proper transform mechanizm
  if (document.documentElement.style.transform !== undefined) {
    var setTransform = function(style, string) {
      style.transform = string;
    }
  } else {
    var setTransform = function(style, string) {
      style.webkitTransform = string;
    }
  }

})();

;


(function() {

  Polymer('core-toolbar', {
    
    /**
     * Controls how the items are aligned horizontally.
     * Options are `start`, `center`, `end`, `between` and `around`.
     *
     * @attribute justify
     * @type string
     * @default ''
     */
    justify: '',
    
    /**
     * Controls how the items are aligned horizontally when they are placed
     * in the middle.
     * Options are `start`, `center`, `end`, `between` and `around`.
     *
     * @attribute middleJustify
     * @type string
     * @default ''
     */
    middleJustify: '',
    
    /**
     * Controls how the items are aligned horizontally when they are placed
     * at the bottom.
     * Options are `start`, `center`, `end`, `between` and `around`.
     *
     * @attribute bottomJustify
     * @type string
     * @default ''
     */
    bottomJustify: '',
    
    justifyChanged: function(old) {
      this.updateBarJustify(this.$.topBar, this.justify, old);
    },
    
    middleJustifyChanged: function(old) {
      this.updateBarJustify(this.$.middleBar, this.middleJustify, old);
    },
    
    bottomJustifyChanged: function(old) {
      this.updateBarJustify(this.$.bottomBar, this.bottomJustify, old);
    },
    
    updateBarJustify: function(bar, justify, old) {
      if (old) {
        bar.removeAttribute(this.toLayoutAttrName(old));
      }
      if (justify) {
        bar.setAttribute(this.toLayoutAttrName(justify), '');
      }
    },
    
    toLayoutAttrName: function(value) {
      return value === 'between' ? 'justified' : value + '-justified';
    }
    
  });

})();

;

(function() {

  var proto = {

      /**
       * A simple string label for the tooltip to display. To display a rich
       * HTML tooltip instead, omit `label` and include the `tip` attribute
       * on a child node of `core-tooltip`.
       *
       * @attribute label
       * @type string
       * @default null
       */
      label: null,

      eventDelegates: {
        'core-resize': 'positionChanged'
      },

      computed: {
        // Indicates whether the tooltip has a set label propety or
        // an element with the `tip` attribute.
        hasTooltipContent: 'label || !!tipElement'
      },

      publish: {
        /**
         * Forces the tooltip to display. If `disabled` is set, this property is ignored.
         *
         * @attribute show
         * @type boolean
         * @default false
         */
        show: {value: false, reflect: true},

        /**
         * Positions the tooltip to the top, right, bottom, left of its content.
         *
         * @attribute position
         * @type string
         * @default 'bottom'
         */
        position: {value: 'bottom', reflect: true},

        /**
         * If true, the tooltip an arrow pointing towards the content.
         *
         * @attribute noarrow
         * @type boolean
         * @default false
         */
        noarrow: {value: false, reflect: true}
      },

      /**
       * Customizes the attribute used to specify which content
       * is the rich HTML tooltip.
       *
       * @attribute tipAttribute
       * @type string
       * @default 'tip'
       */
      tipAttribute: 'tip',

      attached: function() {
        this.updatedChildren();
        this.resizableAttachedHandler();
      },

      detached: function() {
        this.resizableDetachedHandler();
      },

      updatedChildren: function () {
        this.tipElement = null;

        for (var i = 0, el; el = this.$.c.getDistributedNodes()[i]; ++i) {
          if (el.hasAttribute && el.hasAttribute(this.tipAttribute)) {
            this.tipElement = el;
            break;
          }
        }

        // Job ensures we're not double calling setPosition() on DOM attach.
        this.job('positionJob', this.setPosition);

        // Monitor children to re-position tooltip when light dom changes.
        this.onMutation(this, this.updatedChildren);
      },

      labelChanged: function(oldVal, newVal) {
        this.job('positionJob', this.setPosition);
      },

      positionChanged: function(oldVal, newVal) {
        this.job('positionJob', this.setPosition);
      },

      setPosition: function() {
        var controlWidth = this.clientWidth;
        var controlHeight = this.clientHeight;
        var toolTipWidth = this.$.tooltip.clientWidth;
        var toolTipHeight = this.$.tooltip.clientHeight;

        switch (this.position) {
          case 'top':
          case 'bottom':
            this.$.tooltip.style.left = (controlWidth - toolTipWidth) / 2 + 'px';
            this.$.tooltip.style.top = null;
            break;
          case 'left':
          case 'right':
            this.$.tooltip.style.left = null;
            this.$.tooltip.style.top = (controlHeight - toolTipHeight) / 2 + 'px';
            break;
        }
      }

    };

    Polymer.mixin2(proto, Polymer.CoreFocusable);
    Polymer.mixin(proto, Polymer.CoreResizable);
    Polymer('core-tooltip',proto);
  })();

;

  Polymer('paper-shadow',{

    publish: {

      /**
       * The z-depth of this shadow, from 0-5. Setting this property
       * after element creation has no effect. Use `setZ()` instead.
       *
       * @attribute z
       * @type number
       * @default 1
       */
      z: 1,

      /**
       * Set this to true to animate the shadow when setting a new
       * `z` value.
       *
       * @attribute animated
       * @type boolean
       * @default false
       */
      animated: false

    },

    /**
     * Set the z-depth of the shadow. This should be used after element
     * creation instead of setting the z property directly.
     *
     * @method setZ
     * @param {Number} newZ
     */
    setZ: function(newZ) {
      if (this.z !== newZ) {
        this.$['shadow-bottom'].classList.remove('paper-shadow-bottom-z-' + this.z);
        this.$['shadow-bottom'].classList.add('paper-shadow-bottom-z-' + newZ);
        this.$['shadow-top'].classList.remove('paper-shadow-top-z-' + this.z);
        this.$['shadow-top'].classList.add('paper-shadow-top-z-' + newZ);
        this.z = newZ;
      }
    }

  });
;


  (function() {

    var waveMaxRadius = 150;
    //
    // INK EQUATIONS
    //
    function waveRadiusFn(touchDownMs, touchUpMs, anim) {
      // Convert from ms to s
      var touchDown = touchDownMs / 1000;
      var touchUp = touchUpMs / 1000;
      var totalElapsed = touchDown + touchUp;
      var ww = anim.width, hh = anim.height;
      // use diagonal size of container to avoid floating point math sadness
      var waveRadius = Math.min(Math.sqrt(ww * ww + hh * hh), waveMaxRadius) * 1.1 + 5;
      var duration = 1.1 - .2 * (waveRadius / waveMaxRadius);
      var tt = (totalElapsed / duration);

      var size = waveRadius * (1 - Math.pow(80, -tt));
      return Math.abs(size);
    }

    function waveOpacityFn(td, tu, anim) {
      // Convert from ms to s.
      var touchDown = td / 1000;
      var touchUp = tu / 1000;
      var totalElapsed = touchDown + touchUp;

      if (tu <= 0) {  // before touch up
        return anim.initialOpacity;
      }
      return Math.max(0, anim.initialOpacity - touchUp * anim.opacityDecayVelocity);
    }

    function waveOuterOpacityFn(td, tu, anim) {
      // Convert from ms to s.
      var touchDown = td / 1000;
      var touchUp = tu / 1000;

      // Linear increase in background opacity, capped at the opacity
      // of the wavefront (waveOpacity).
      var outerOpacity = touchDown * 0.3;
      var waveOpacity = waveOpacityFn(td, tu, anim);
      return Math.max(0, Math.min(outerOpacity, waveOpacity));
    }

    // Determines whether the wave should be completely removed.
    function waveDidFinish(wave, radius, anim) {
      var waveOpacity = waveOpacityFn(wave.tDown, wave.tUp, anim);

      // If the wave opacity is 0 and the radius exceeds the bounds
      // of the element, then this is finished.
      return waveOpacity < 0.01 && radius >= Math.min(wave.maxRadius, waveMaxRadius);
    };

    function waveAtMaximum(wave, radius, anim) {
      var waveOpacity = waveOpacityFn(wave.tDown, wave.tUp, anim);

      return waveOpacity >= anim.initialOpacity && radius >= Math.min(wave.maxRadius, waveMaxRadius);
    }

    //
    // DRAWING
    //
    function drawRipple(ctx, x, y, radius, innerAlpha, outerAlpha) {
      // Only animate opacity and transform
      if (outerAlpha !== undefined) {
        ctx.bg.style.opacity = outerAlpha;
      }
      ctx.wave.style.opacity = innerAlpha;

      var s = radius / (ctx.containerSize / 2);
      var dx = x - (ctx.containerWidth / 2);
      var dy = y - (ctx.containerHeight / 2);

      ctx.wc.style.webkitTransform = 'translate3d(' + dx + 'px,' + dy + 'px,0)';
      ctx.wc.style.transform = 'translate3d(' + dx + 'px,' + dy + 'px,0)';

      // 2d transform for safari because of border-radius and overflow:hidden clipping bug.
      // https://bugs.webkit.org/show_bug.cgi?id=98538
      ctx.wave.style.webkitTransform = 'scale(' + s + ',' + s + ')';
      ctx.wave.style.transform = 'scale3d(' + s + ',' + s + ',1)';
    }

    //
    // SETUP
    //
    function createWave(elem) {
      var elementStyle = window.getComputedStyle(elem);
      var fgColor = elementStyle.color;

      var inner = document.createElement('div');
      inner.style.backgroundColor = fgColor;
      inner.classList.add('wave');

      var outer = document.createElement('div');
      outer.classList.add('wave-container');
      outer.appendChild(inner);

      var container = elem.$.waves;
      container.appendChild(outer);

      elem.$.bg.style.backgroundColor = fgColor;

      var wave = {
        bg: elem.$.bg,
        wc: outer,
        wave: inner,
        waveColor: fgColor,
        maxRadius: 0,
        isMouseDown: false,
        mouseDownStart: 0.0,
        mouseUpStart: 0.0,
        tDown: 0,
        tUp: 0
      };
      return wave;
    }

    function removeWaveFromScope(scope, wave) {
      if (scope.waves) {
        var pos = scope.waves.indexOf(wave);
        scope.waves.splice(pos, 1);
        // FIXME cache nodes
        wave.wc.remove();
      }
    };

    // Shortcuts.
    var pow = Math.pow;
    var now = Date.now;
    if (window.performance && performance.now) {
      now = performance.now.bind(performance);
    }

    function cssColorWithAlpha(cssColor, alpha) {
        var parts = cssColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
        if (typeof alpha == 'undefined') {
            alpha = 1;
        }
        if (!parts) {
          return 'rgba(255, 255, 255, ' + alpha + ')';
        }
        return 'rgba(' + parts[1] + ', ' + parts[2] + ', ' + parts[3] + ', ' + alpha + ')';
    }

    function dist(p1, p2) {
      return Math.sqrt(pow(p1.x - p2.x, 2) + pow(p1.y - p2.y, 2));
    }

    function distanceFromPointToFurthestCorner(point, size) {
      var tl_d = dist(point, {x: 0, y: 0});
      var tr_d = dist(point, {x: size.w, y: 0});
      var bl_d = dist(point, {x: 0, y: size.h});
      var br_d = dist(point, {x: size.w, y: size.h});
      return Math.max(tl_d, tr_d, bl_d, br_d);
    }

    Polymer('paper-ripple', {

      /**
       * The initial opacity set on the wave.
       *
       * @attribute initialOpacity
       * @type number
       * @default 0.25
       */
      initialOpacity: 0.25,

      /**
       * How fast (opacity per second) the wave fades out.
       *
       * @attribute opacityDecayVelocity
       * @type number
       * @default 0.8
       */
      opacityDecayVelocity: 0.8,

      backgroundFill: true,
      pixelDensity: 2,

      eventDelegates: {
        down: 'downAction',
        up: 'upAction'
      },

      ready: function() {
        this.waves = [];
      },

      downAction: function(e) {
        var wave = createWave(this);

        this.cancelled = false;
        wave.isMouseDown = true;
        wave.tDown = 0.0;
        wave.tUp = 0.0;
        wave.mouseUpStart = 0.0;
        wave.mouseDownStart = now();

        var rect = this.getBoundingClientRect();
        var width = rect.width;
        var height = rect.height;
        var touchX = e.x - rect.left;
        var touchY = e.y - rect.top;

        wave.startPosition = {x:touchX, y:touchY};

        if (this.classList.contains("recenteringTouch")) {
          wave.endPosition = {x: width / 2,  y: height / 2};
          wave.slideDistance = dist(wave.startPosition, wave.endPosition);
        }
        wave.containerSize = Math.max(width, height);
        wave.containerWidth = width;
        wave.containerHeight = height;
        wave.maxRadius = distanceFromPointToFurthestCorner(wave.startPosition, {w: width, h: height});

        // The wave is circular so constrain its container to 1:1
        wave.wc.style.top = (wave.containerHeight - wave.containerSize) / 2 + 'px';
        wave.wc.style.left = (wave.containerWidth - wave.containerSize) / 2 + 'px';
        wave.wc.style.width = wave.containerSize + 'px';
        wave.wc.style.height = wave.containerSize + 'px';

        this.waves.push(wave);

        if (!this._loop) {
          this._loop = this.animate.bind(this, {
            width: width,
            height: height
          });
          requestAnimationFrame(this._loop);
        }
        // else there is already a rAF
      },

      upAction: function() {
        for (var i = 0; i < this.waves.length; i++) {
          // Declare the next wave that has mouse down to be mouse'ed up.
          var wave = this.waves[i];
          if (wave.isMouseDown) {
            wave.isMouseDown = false
            wave.mouseUpStart = now();
            wave.mouseDownStart = 0;
            wave.tUp = 0.0;
            break;
          }
        }
        this._loop && requestAnimationFrame(this._loop);
      },

      cancel: function() {
        this.cancelled = true;
      },

      animate: function(ctx) {
        var shouldRenderNextFrame = false;

        var deleteTheseWaves = [];
        // The oldest wave's touch down duration
        var longestTouchDownDuration = 0;
        var longestTouchUpDuration = 0;
        // Save the last known wave color
        var lastWaveColor = null;
        // wave animation values
        var anim = {
          initialOpacity: this.initialOpacity,
          opacityDecayVelocity: this.opacityDecayVelocity,
          height: ctx.height,
          width: ctx.width
        }

        for (var i = 0; i < this.waves.length; i++) {
          var wave = this.waves[i];

          if (wave.mouseDownStart > 0) {
            wave.tDown = now() - wave.mouseDownStart;
          }
          if (wave.mouseUpStart > 0) {
            wave.tUp = now() - wave.mouseUpStart;
          }

          // Determine how long the touch has been up or down.
          var tUp = wave.tUp;
          var tDown = wave.tDown;
          longestTouchDownDuration = Math.max(longestTouchDownDuration, tDown);
          longestTouchUpDuration = Math.max(longestTouchUpDuration, tUp);

          // Obtain the instantenous size and alpha of the ripple.
          var radius = waveRadiusFn(tDown, tUp, anim);
          var waveAlpha =  waveOpacityFn(tDown, tUp, anim);
          var waveColor = cssColorWithAlpha(wave.waveColor, waveAlpha);
          lastWaveColor = wave.waveColor;

          // Position of the ripple.
          var x = wave.startPosition.x;
          var y = wave.startPosition.y;

          // Ripple gravitational pull to the center of the canvas.
          if (wave.endPosition) {

            // This translates from the origin to the center of the view  based on the max dimension of
            var translateFraction = Math.min(1, radius / wave.containerSize * 2 / Math.sqrt(2) );

            x += translateFraction * (wave.endPosition.x - wave.startPosition.x);
            y += translateFraction * (wave.endPosition.y - wave.startPosition.y);
          }

          // If we do a background fill fade too, work out the correct color.
          var bgFillColor = null;
          if (this.backgroundFill) {
            var bgFillAlpha = waveOuterOpacityFn(tDown, tUp, anim);
            bgFillColor = cssColorWithAlpha(wave.waveColor, bgFillAlpha);
          }

          // Draw the ripple.
          drawRipple(wave, x, y, radius, waveAlpha, bgFillAlpha);

          // Determine whether there is any more rendering to be done.
          var maximumWave = waveAtMaximum(wave, radius, anim);
          var waveDissipated = waveDidFinish(wave, radius, anim);
          var shouldKeepWave = !waveDissipated || maximumWave;
          // keep rendering dissipating wave when at maximum radius on upAction
          var shouldRenderWaveAgain = wave.mouseUpStart ? !waveDissipated : !maximumWave;
          shouldRenderNextFrame = shouldRenderNextFrame || shouldRenderWaveAgain;
          if (!shouldKeepWave || this.cancelled) {
            deleteTheseWaves.push(wave);
          }
       }

        if (shouldRenderNextFrame) {
          requestAnimationFrame(this._loop);
        }

        for (var i = 0; i < deleteTheseWaves.length; ++i) {
          var wave = deleteTheseWaves[i];
          removeWaveFromScope(this, wave);
        }

        if (!this.waves.length && this._loop) {
          // clear the background color
          this.$.bg.style.backgroundColor = null;
          this._loop = null;
          this.fire('core-transitionend');
        }
      }

    });

  })();

;


  (function() {

    var p = {

      eventDelegates: {
        down: 'downAction',
        up: 'upAction'
      },

      toggleBackground: function() {
        if (this.active) {

          if (!this.$.bg) {
            var bg = document.createElement('div');
            bg.setAttribute('id', 'bg');
            bg.setAttribute('fit', '');
            bg.style.opacity = 0.25;
            this.$.bg = bg;
            this.shadowRoot.insertBefore(bg, this.shadowRoot.firstChild);
          }
          this.$.bg.style.backgroundColor = getComputedStyle(this).color;

        } else {

          if (this.$.bg) {
            this.$.bg.style.backgroundColor = '';
          }
        }
      },

      activeChanged: function() {
        this.super();

        if (this.toggle && (!this.lastEvent || this.matches(':host-context([noink])'))) {
          this.toggleBackground();
        }
      },

      pressedChanged: function() {
        this.super();

        if (!this.lastEvent) {
          return;
        }

        if (this.$.ripple && !this.hasAttribute('noink')) {
          if (this.pressed) {
            this.$.ripple.downAction(this.lastEvent);
          } else {
            this.$.ripple.upAction();
          }
        }

        this.adjustZ();
      },

      focusedChanged: function() {
        this.adjustZ();
      },

      disabledChanged: function() {
        this._disabledChanged();
        this.adjustZ();
      },

      recenteringTouchChanged: function() {
        if (this.$.ripple) {
          this.$.ripple.classList.toggle('recenteringTouch', this.recenteringTouch);
        }
      },

      fillChanged: function() {
        if (this.$.ripple) {
          this.$.ripple.classList.toggle('fill', this.fill);
        }
      },

      adjustZ: function() {
        if (!this.$.shadow) {
          return;
        }
        if (this.active) {
          this.$.shadow.setZ(2);
        } else if (this.disabled) {
          this.$.shadow.setZ(0);
        } else if (this.focused) {
          this.$.shadow.setZ(3);
        } else {
          this.$.shadow.setZ(1);
        }
      },

      downAction: function(e) {
        this._downAction();

        if (this.hasAttribute('noink')) {
          return;
        }

        this.lastEvent = e;
        if (!this.$.ripple) {
          var ripple = document.createElement('paper-ripple');
          ripple.setAttribute('id', 'ripple');
          ripple.setAttribute('fit', '');
          if (this.recenteringTouch) {
            ripple.classList.add('recenteringTouch');
          }
          if (!this.fill) {
            ripple.classList.add('circle');
          }
          this.$.ripple = ripple;
          this.shadowRoot.insertBefore(ripple, this.shadowRoot.firstChild);
          // No need to forward the event to the ripple because the ripple
          // is triggered in activeChanged
        }
      },

      upAction: function() {
        this._upAction();

        if (this.toggle) {
          this.toggleBackground();
          if (this.$.ripple) {
            this.$.ripple.cancel();
          }
        }
      }

    };

    Polymer.mixin2(p, Polymer.CoreFocusable);
    Polymer('paper-button-base',p);

  })();

;

    Polymer('paper-button',{

      publish: {

        /**
         * If true, the button will be styled with a shadow.
         *
         * @attribute raised
         * @type boolean
         * @default false
         */
        raised: false,

        /**
         * By default the ripple emanates from where the user touched the button.
         * Set this to true to always center the ripple.
         *
         * @attribute recenteringTouch
         * @type boolean
         * @default false
         */
        recenteringTouch: false,

        /**
         * By default the ripple expands to fill the button. Set this to true to
         * constrain the ripple to a circle within the button.
         *
         * @attribute fill
         * @type boolean
         * @default true
         */
        fill: true

      },

      _activate: function() {
        this.click();
        this.fire('tap');
        if (!this.pressed) {
          var bcr = this.getBoundingClientRect();
          var x = bcr.left + (bcr.width / 2);
          var y = bcr.top + (bcr.height / 2);
          this.downAction({x: x, y: y});
          var fn = function fn() {
            this.upAction();
            this.removeEventListener('keyup', fn);
          }.bind(this);
          this.addEventListener('keyup', fn);
        }
      }

    });
  ;


  Polymer('core-transition-css', {

    /**
     * The class that will be applied to all animated nodes.
     *
     * @attribute baseClass
     * @type string
     * @default "core-transition"
     */
    baseClass: 'core-transition',

    /**
     * The class that will be applied to nodes in the opened state.
     *
     * @attribute openedClass
     * @type string
     * @default "core-opened"
     */
    openedClass: 'core-opened',

    /**
     * The class that will be applied to nodes in the closed state.
     *
     * @attribute closedClass
     * @type string
     * @default "core-closed"
     */
    closedClass: 'core-closed',

    /**
     * Event to listen to for animation completion.
     *
     * @attribute completeEventName
     * @type string
     * @default "transitionEnd"
     */
    completeEventName: 'transitionend',

    publish: {
      /**
       * A secondary configuration attribute for the animation. The class
       * `<baseClass>-<transitionType` is applied to the animated node during
       * `setup`.
       *
       * @attribute transitionType
       * @type string
       */
      transitionType: null
    },

    registerCallback: function(element) {
      this.transitionStyle = element.templateContent().firstElementChild;
    },

    // template is just for loading styles, we don't need a shadowRoot
    fetchTemplate: function() {
      return null;
    },

    go: function(node, state) {
      if (state.opened !== undefined) {
        this.transitionOpened(node, state.opened);
      }
    },

    setup: function(node) {
      if (!node._hasTransitionStyle) {
        if (!node.shadowRoot) {
          node.createShadowRoot().innerHTML = '<content></content>';
        }
        this.installScopeStyle(this.transitionStyle, 'transition',
            node.shadowRoot);
        node._hasTransitionStyle = true;
      }
      node.classList.add(this.baseClass);
      if (this.transitionType) {
        node.classList.add(this.baseClass + '-' + this.transitionType);
      }
    },

    teardown: function(node) {
      node.classList.remove(this.baseClass);
      if (this.transitionType) {
        node.classList.remove(this.baseClass + '-' + this.transitionType);
      }
    },

    transitionOpened: function(node, opened) {
      this.listenOnce(node, this.completeEventName, function() {
        if (!opened) {
          node.classList.remove(this.closedClass);
        }
        this.complete(node);
      });
      node.classList.toggle(this.openedClass, opened);
      node.classList.toggle(this.closedClass, !opened);
    }

  });
;


  Polymer('paper-dialog-base',{

    publish: {

      /**
       * The title of the dialog.
       *
       * @attribute heading
       * @type string
       * @default ''
       */
      heading: '',

      /**
       * @attribute transition
       * @type string
       * @default ''
       */
      transition: '',

      /**
       * @attribute layered
       * @type boolean
       * @default true
       */
      layered: true
    },

    ready: function() {
      this.super();
      this.sizingTarget = this.$.scroller;
    },

    headingChanged: function(old) {
      var label = this.getAttribute('aria-label');
      if (!label || label === old) {
        this.setAttribute('aria-label', this.heading);
      }
    },

    openAction: function() {
      if (this.$.scroller.scrollTop) {
        this.$.scroller.scrollTop = 0;
      }
    }

  });

;


  Polymer('paper-action-dialog',{

    publish: {

      /**
       * @attribute closeSelector
       * @type string
       * @default '[affirmative],[dismissive]'
       */
      closeSelector: '[affirmative],[dismissive]'
    }

  });

;
Polymer('paper-dialog');;

    Polymer('paper-fab',{

      publish: {

        /**
         * The URL of an image for the icon. If the src property is specified,
         * the icon property should not be.
         *
         * @attribute src
         * @type string
         * @default ''
         */
        src: '',

        /**
         * Specifies the icon name or index in the set of icons available in
         * the icon's icon set. If the icon property is specified,
         * the src property should not be.
         *
         * @attribute icon
         * @type string
         * @default ''
         */
        icon: '',

        /**
         * Set this to true to style this is a "mini" FAB.
         *
         * @attribute mini
         * @type boolean
         * @default false
         */
        mini: false,

        raised: true,
        recenteringTouch: true,
        fill: false

      },

      iconChanged: function(oldIcon) {
        var label = this.getAttribute('aria-label');
        if (!label || label === oldIcon) {
          this.setAttribute('aria-label', this.icon);
        }
      }

    });

  ;

    Polymer('paper-icon-button',{

      publish: {

        /**
         * The URL of an image for the icon. If the src property is specified,
         * the icon property should not be.
         *
         * @attribute src
         * @type string
         * @default ''
         */
        src: '',

        /**
         * Specifies the icon name or index in the set of icons available in
         * the icon's icon set. If the icon property is specified,
         * the src property should not be.
         *
         * @attribute icon
         * @type string
         * @default ''
         */
        icon: '',

        recenteringTouch: true,
        fill: false

      },

      iconChanged: function(oldIcon) {
        var label = this.getAttribute('aria-label');
        if (!label || label === oldIcon) {
          this.setAttribute('aria-label', this.icon);
        }
      }

    });

  ;


  Polymer('paper-radio-button', {
    
    /**
     * Fired when the checked state changes due to user interaction.
     *
     * @event change
     */
     
    /**
     * Fired when the checked state changes.
     *
     * @event core-change
     */
    
    publish: {
      /**
       * Gets or sets the state, `true` is checked and `false` is unchecked.
       *
       * @attribute checked
       * @type boolean
       * @default false
       */
      checked: {value: false, reflect: true},
      
      /**
       * The label for the radio button.
       *
       * @attribute label
       * @type string
       * @default ''
       */
      label: '',
      
      /**
       * Normally the user cannot uncheck the radio button by tapping once
       * checked.  Setting this property to `true` makes the radio button
       * toggleable from checked to unchecked.
       *
       * @attribute toggles
       * @type boolean
       * @default false
       */
      toggles: false,
      
      /**
       * If true, the user cannot interact with this element.
       *
       * @attribute disabled
       * @type boolean
       * @default false
       */
      disabled: {value: false, reflect: true}
    },
    
    eventDelegates: {
      tap: 'tap'
    },
    
    tap: function() {
      if (this.disabled) {
        return;
      }
      var old = this.checked;
      this.toggle();
      if (this.checked !== old) {
        this.fire('change');
      }
    },
    
    toggle: function() {
      this.checked = !this.toggles || !this.checked;
    },
    
    checkedChanged: function() {
      this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
      this.fire('core-change');
    },
    
    labelChanged: function() {
      this.setAttribute('aria-label', this.label);
    }
    
  });
  
;


    Polymer('paper-checkbox', {

      /**
       * Fired when the checked state changes due to user interaction.
       *
       * @event change
       */

      /**
       * Fired when the checked state changes.
       *
       * @event core-change
       */

      toggles: true,

      checkedChanged: function () {
        this.setAttribute('aria-checked', this.checked ? 'true' : 'false');
        this.fire('core-change');
      }

    });

  ;

    Polymer('paper-dropdown-transition', {

      publish: {

        /**
         * The duration of the transition in ms. You can also set the duration by
         * setting a `duration` attribute on the target:
         *
         *    <paper-dropdown duration="1000"></paper-dropdown>
         *
         * @attribute duration
         * @type number
         * @default 500
         */
        duration: 500

      },

      setup: function(node) {
        this.super(arguments);

        var to = {
          'top': '0%',
          'left': '0%',
          'bottom': '100%',
          'right': '100%'
        };

        var bg = node.$.background;
        bg.style.webkitTransformOrigin = to[node.halign] + ' ' + to[node.valign];
        bg.style.transformOrigin = to[node.halign] + ' ' + to[node.valign];
      },

      transitionOpened: function(node, opened) {
        this.super(arguments);

        if (opened) {
          if (this.player) {
            this.player.cancel();
          }

          var duration = Number(node.getAttribute('duration')) || this.duration;

          var anims = [];

          var size = node.getBoundingClientRect();

          var ink = node.$.ripple;
          // var offset = 40 / Math.max(size.width, size.height);
          var offset = 0.2;
          anims.push(new Animation(ink, [{
            'opacity': 0.9,
            'transform': 'scale(0)',
          }, {
            'opacity': 0.9,
            'transform': 'scale(1)'
          }], {
            duration: duration * offset
          }));

          var bg = node.$.background;
          var sx = 40 / size.width;
          var sy = 40 / size.height;
          anims.push(new Animation(bg, [{
            'opacity': 0.9,
            'transform': 'scale(' + sx + ',' + sy + ')',
          }, {
            'opacity': 1,
            'transform': 'scale(' + Math.max(sx, 0.95) + ',' + Math.max(sy, 0.5) + ')'
          }, {
            'opacity': 1,
            'transform': 'scale(1, 1)'
          }], {
            delay: duration * offset,
            duration: duration * (1 - offset),
            fill: 'forwards'
          }));

          var menu = node.querySelector('.menu');
          if (menu) {
            var items = menu.items || menu.children.array();
            var itemDelay = offset + (1 - offset) / 2;
            var itemDuration = duration * (1 - itemDelay) / items.length;
            var reverse = this.valign === 'bottom';

            items.forEach(function(item, i) {
              anims.push(new Animation(item, [{
                'opacity': 0
              }, {
                'opacity': 1
              }], {
                delay: duration * itemDelay + itemDuration * (reverse ? items.length - 1 - i : i),
                duration: itemDuration,
                fill: 'both'
              }));
            }.bind(this));

            anims.push(new Animation(node.$.scroller, [{
              'opacity': 1
            }, {
              'opacity': 1
            }], {
              delay: duration * itemDelay,
              duration: itemDuration * items.length,
              fill: 'both'
            }));

          } else {
            anims.push(new Animation(node.$.scroller, [{
              'opacity': 0
            }, {
              'opacity': 1
            }], {
              delay: duration * (offset + (1 - offset) / 2),
              duration: duration * 0.5,
              fill: 'both'
            }));
          }

          var group = new AnimationGroup(anims, {
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
          });
          this.player = document.timeline.play(group);
          this.player.onfinish = function() {
            this.fire('core-transitionend', this, node);
          }.bind(this);

        } else {
          this.fire('core-transitionend', this, node);
        }
      },

    });
  ;


  Polymer('paper-dropdown',{

    publish: {
      transition: 'paper-dropdown-transition'
    },

    ready: function() {
      this.super();
      this.sizingTarget = this.$.scroller;
    }

  });

;


  (function() {

    var paperInput = CoreStyle.g.paperInput = CoreStyle.g.paperInput || {};

    paperInput.labelColor = '#757575';
    paperInput.focusedColor = '#4059a9';
    paperInput.invalidColor = '#d34336';

    Polymer('paper-input-decorator',{

      publish: {

        /**
         * The label for this input. It normally appears as grey text inside
         * the text input and disappears once the user enters text.
         *
         * @attribute label
         * @type string
         * @default ''
         */
        label: '',

        /**
         * If true, the label will "float" above the text input once the
         * user enters text instead of disappearing.
         *
         * @attribute floatingLabel
         * @type boolean
         * @default false
         */
        floatingLabel: false,

        /**
         * Set to true to style the element as disabled.
         *
         * @attribute disabled
         * @type boolean
         * @default false
         */
        disabled: {value: false, reflect: true},

        /**
         * Use this property to override the automatic label visibility.
         * If this property is set to `true` or `false`, the label visibility
         * will respect this value instead of be based on whether there is
         * a non-null value in the input.
         *
         * @attribute labelVisible
         * @type boolean
         * @default false
         */
        labelVisible: null,

        /**
         * Set this property to true to show the error message.
         *
         * @attribute isInvalid
         * @type boolean
         * @default false
         */
        isInvalid: false,

        /**
         * Set this property to true to validate the input as the user types.
         * This will not validate when changing the input programmatically; call
         * `validate()` instead.
         *
         * @attribute autoValidate
         * @type boolean
         * @default false
         */
        autoValidate: false,

        /**
         * The message to display if the input value fails validation. If this
         * is unset or the empty string, a default message is displayed depending
         * on the type of validation error.
         *
         * @attribute error
         * @type string
         */
        error: '',

        focused: {value: false, reflect: true}

      },

      computed: {
        floatingLabelVisible: 'floatingLabel && !_labelVisible',
        _labelVisible: '(labelVisible === true || labelVisible === false) ? labelVisible : _autoLabelVisible'
      },

      ready: function() {
        // Delegate focus/blur events
        Polymer.addEventListener(this, 'focus', this.focusAction.bind(this), true);
        Polymer.addEventListener(this, 'blur', this.blurAction.bind(this), true);
      },

      attached: function() {
        this.input = this.querySelector('input,textarea');

        this.mo = new MutationObserver(function() {
          this.input = this.querySelector('input,textarea');
        }.bind(this));
        this.mo.observe(this, {childList: true});
      },

      detached: function() {
        this.mo.disconnect();
        this.mo = null;
      },

      prepareLabelTransform: function() {
        var toRect = this.$.floatedLabelText.getBoundingClientRect();
        var fromRect = this.$.labelText.getBoundingClientRect();
        if (toRect.width !== 0) {
          var sy = toRect.height / fromRect.height;
          this.$.labelText.cachedTransform =
            'scale3d(' + (toRect.width / fromRect.width) + ',' + sy + ',1) ' +
            'translate3d(0,' + (toRect.top - fromRect.top) / sy + 'px,0)';
        }
      },

      animateFloatingLabel: function() {
        if (!this.floatingLabel || this.labelAnimated) {
          return false;
        }

        if (!this.$.labelText.cachedTransform) {
          this.prepareLabelTransform();
        }

        // If there's still no cached transform, the input is invisible so don't
        // do the animation.
        if (!this.$.labelText.cachedTransform) {
          return false;
        }

        this.labelAnimated = true;
        // Handle interrupted animation
        this.async(function() {
          this.transitionEndAction();
        }, null, 250);

        if (this._labelVisible) {
          // Handle if the label started out floating
          if (!this.$.labelText.style.webkitTransform && !this.$.labelText.style.transform) {
            this.$.labelText.style.webkitTransform = this.$.labelText.cachedTransform;
            this.$.labelText.style.transform = this.$.labelText.cachedTransform;
            this.$.labelText.offsetTop;
          }
          this.$.labelText.style.webkitTransform = '';
          this.$.labelText.style.transform = '';
        } else {
          this.$.labelText.style.webkitTransform = this.$.labelText.cachedTransform;
          this.$.labelText.style.transform = this.$.labelText.cachedTransform;
          this.input.placeholder = '';
        }

        return true;
      },

      animateUnderline: function(e) {
        if (this.focused) {
          var rect = this.$.underline.getBoundingClientRect();
          var right = e.x - rect.left;
          this.$.focusedUnderline.style.mozTransformOrigin = right + 'px';
          this.$.focusedUnderline.style.webkitTransformOrigin = right + 'px ';
          this.$.focusedUnderline.style.transformOriginX = right + 'px';

          // Animations only run when the user interacts with the input
          this.underlineAnimated = true;
        }
      },

      /**
       * Validate the input using HTML5 Constraints.
       *
       * @method validate
       * @return {boolean} True if the input is valid.
       */
      validate: function() {
        this.isInvalid = !this.input.validity.valid;
        return this.input.validity.valid;
      },

      _labelVisibleChanged: function(old) {
        // do not do the animation on first render
        if (old !== undefined) {
          if (!this.animateFloatingLabel()) {
            this.updateInputLabel(this.input, this.label);
          }
        }
      },

      labelVisibleChanged: function() {
        if (this.labelVisible === 'true') {
          this.labelVisible = true;
        } else if (this.labelVisible === 'false') {
          this.labelVisible = false;
        }
      },

      labelChanged: function() {
        if (this.input) {
          this.updateInputLabel(this.input, this.label);
        }
      },

      isInvalidChanged: function() {
        this.classList.toggle('invalid', this.isInvalid);
      },

      focusedChanged: function() {
        this.updateLabelVisibility(this.input && this.input.value);
        if (this.lastEvent) {
          this.animateUnderline(this.lastEvent);
          this.lastEvent = null;
        }
        this.underlineVisible = this.focused;
      },

      inputChanged: function(old) {
        if (this.input) {
          this.updateLabelVisibility(this.input.value);
          this.updateInputLabel(this.input, this.label);

          if (this.autoValidate) {
            this.validate();
          }
        }
        if (old) {
          this.updateInputLabel(old, '');
        }
      },

      focusAction: function() {
        this.focused = true;
      },

      blurAction: function() {
        this.focused = false;
      },

      /**
       * Updates the label visibility based on a value. This is handled automatically
       * if the user is typing, but if you imperatively set the input value you need
       * to call this function.
       *
       * @method updateLabelVisibility
       * @param {string} value
       */
      updateLabelVisibility: function(value) {
        var v = (value !== null && value !== undefined) ? String(value) : value;
        this._autoLabelVisible = (!this.focused && !v) || (!this.floatingLabel && !v);
      },

      updateInputLabel: function(input, label) {
        if (this._labelVisible) {
          this.input.placeholder = this.label;
        } else {
          this.input.placeholder = '';
        }
        if (label) {
          input.setAttribute('aria-label', label);
        } else {
          input.removeAttribute('aria-label');
        }
      },

      inputAction: function() {
        this.updateLabelVisibility(this.input.value);
        if (this.autoValidate) {
          this.validate();
        }
      },

      downAction: function(e) {
        // eat the event and do nothing if already focused
        if (e.target !== this.input && this.focused) {
          e.preventDefault();
          return;
        }
        // cache the event here because "down" fires before "focus" when tapping on
        // the input and the underline animation runs on focus change
        this.lastEvent = e;
      },

      tapAction: function(e) {
        if (this.disabled) {
          return;
        }

        if (this.focused) {
          return;
        }

        if (this.input) {
          this.input.focus();
          e.preventDefault();
        }
      },

      transitionEndAction: function() {
        this.underlineAnimated = false;
        this.labelAnimated = false;
        if (this._labelVisible) {
          this.input.placeholder = this.label;
        }
      },

      charCounterErrorAction: function(e) {
        this.isInvalid = e.detail.hasError;

        // If the allowed characters have been exceeded, show either the error
        // icon, or the character counter, but not both.
        this.$.errorIcon.hidden = e.detail.hideErrorIcon;
      }

    });

  }());

  ;


  Polymer('paper-input', {

    publish: {
      /**
       * The label for this input. It normally appears as grey text inside
       * the text input and disappears once the user enters text.
       *
       * @attribute label
       * @type string
       * @default ''
       */
      label: '',

      /**
       * If true, the label will "float" above the text input once the
       * user enters text instead of disappearing.
       *
       * @attribute floatingLabel
       * @type boolean
       * @default false
       */
      floatingLabel: false,

      /**
       * Set to true to style the element as disabled.
       *
       * @attribute disabled
       * @type boolean
       * @default false
       */
      disabled: {value: false, reflect: true},

      /**
       * The current value of the input.
       *
       * @attribute value
       * @type String
       * @default ''
       */
      value: '',

      /**
       * The most recently committed value of the input.
       *
       * @attribute committedValue
       * @type String
       * @default ''
       */
      committedValue: ''

    },

    /**
     * Focuses the `input`.
     *
     * @method focus
     */
    focus: function() {
      this.$.input.focus();
    },

    valueChanged: function() {
      this.$.decorator.updateLabelVisibility(this.value);
    },

    changeAction: function(e) {
      // re-fire event that does not bubble across shadow roots
      this.fire('change', null, this);
    }

  });

;

    Polymer('paper-item',{

      publish: {

        /**
         * If true, the button will be styled with a shadow.
         *
         * @attribute raised
         * @type boolean
         * @default false
         */
        raised: false,

        /**
         * By default the ripple emanates from where the user touched the button.
         * Set this to true to always center the ripple.
         *
         * @attribute recenteringTouch
         * @type boolean
         * @default false
         */
        recenteringTouch: false,

        /**
         * By default the ripple expands to fill the button. Set this to false to
         * constrain the ripple to a circle within the button.
         *
         * @attribute fill
         * @type boolean
         * @default true
         */
        fill: true

      }

    });
  ;


  Polymer('paper-menu-button',{

    overlayListeners: {
      'core-overlay-open': 'openAction',
      'core-activate': 'activateAction'
    },

    activateAction: function() {
      this.opened = false;
    }

  });

;

  
    Polymer('paper-radio-group', {
      nextIndex: function(index) {
        var items = this.items;
        var newIndex = index;
        do {
          newIndex = (newIndex + 1) % items.length;
          if (newIndex === index) {
            break;
          }
        } while (items[newIndex].disabled);
        return newIndex;
      },
      previousIndex: function(index) {
        var items = this.items;
        var newIndex = index;
        do {
          newIndex = (newIndex || items.length) - 1;
          if (newIndex === index) {
            break;
          }
        } while (items[newIndex].disabled);
        return newIndex;
      },
      selectNext: function() {
        var node = this.selectIndex(this.nextIndex(this.selectedIndex));
        node.focus();
      },
      selectPrevious: function() {
        var node = this.selectIndex(this.previousIndex(this.selectedIndex));
        node.focus();
      },
      selectedAttribute: 'checked',
      activateEvent: 'change'
      
    });
  
  ;


  Polymer('paper-tab', {
    
    /**
     * If true, ink ripple effect is disabled.
     *
     * @attribute noink
     * @type boolean
     * @default false
     */
    noink: false,
    
    eventDelegates: {
      down: 'downAction',
      up: 'upAction'
    },

    downAction: function(e) {
      if (this.noink || (this.parentElement && this.parentElement.noink)) {
        return;
      }
      this.$.ink.downAction(e);
    },

    upAction: function() {
      this.$.ink.upAction();
    },
    
    cancelRipple: function() {
      this.$.ink.upAction();
    }
    
  });
  
;


  Polymer('paper-tabs',Polymer.mixin({
    
    /**
     * If true, ink ripple effect is disabled.
     *
     * @attribute noink
     * @type boolean
     * @default false
     */
    noink: false,
    
    /**
     * If true, the bottom bar to indicate the selected tab will not be shown.
     *
     * @attribute nobar
     * @type boolean
     * @default false
     */
    nobar: false,
    
    /**
     * If true, the slide effect for the bottom bar is disabled.
     *
     * @attribute noslide
     * @type boolean
     * @default false
     */
    noslide: false,
    
    /**
     * If true, tabs are scrollable and the tab width is based on the label width.
     *
     * @attribute scrollable
     * @type boolean
     * @default false
     */
    scrollable: false,
    
    /**
     * If true, dragging on the tabs to scroll is disabled.
     *
     * @attribute disableDrag
     * @type boolean
     * @default false
     */
    disableDrag: false,
    
    /**
     * If true, scroll buttons (left/right arrow) will be hidden for scrollable tabs.
     *
     * @attribute hideScrollButton
     * @type boolean
     * @default false
     */
    hideScrollButton: false,
    
    /**
     * If true, the tabs are aligned to bottom (the selection bar appears at the top).
     *
     @attribute alignBottom
     @type boolean
     @default false
     */
    alignBottom: false,

    eventDelegates: {
      'core-resize': 'resizeHandler'
    },
    
    activateEvent: 'tap',
    
    step: 10,
    
    holdDelay: 10,
    
    ready: function() {
      this.super();
      this._trackxHandler = this.trackx.bind(this);
      Polymer.addEventListener(this.$.tabsContainer, 'trackx', this._trackxHandler);
      this._tabsObserver = new MutationObserver(this.updateBar.bind(this));
    },
    
    domReady: function() {
      this.async('resizeHandler');
      this._tabsObserver.observe(this, {childList: true, subtree: true, characterData: true});
    },

    attached: function() {
      this.resizableAttachedHandler();
    },
    
    detached: function() {
      Polymer.removeEventListener(this.$.tabsContainer, 'trackx', this._trackxHandler);
      this._tabsObserver.disconnect();
      this.resizableDetachedHandler();
    },
    
    trackStart: function(e) {
      if (!this.scrollable || this.disableDrag) {
        return;
      }
      var t = e.target;
      if (t && t.cancelRipple) {
        t.cancelRipple();
      }
      this._startx = this.$.tabsContainer.scrollLeft;
      e.preventTap();
    },
    
    trackx: function(e) {
      if (!this.scrollable || this.disableDrag) {
        return;
      }
      this.$.tabsContainer.scrollLeft = this._startx - e.dx;
    },
    
    resizeHandler: function() {
      this.scroll();
      this.updateBar();
    },
    
    scroll: function() {
      if (!this.scrollable) {
        return;
      }
      var tc = this.$.tabsContainer;
      var l = tc.scrollLeft;
      this.leftHidden = l === 0;
      this.rightHidden = l === Math.max(0, (tc.scrollWidth - tc.clientWidth));
    },
    
    holdLeft: function() {
      this.holdJob = setInterval(this.scrollToLeft.bind(this), this.holdDelay);
    },
    
    holdRight: function() {
      this.holdJob = setInterval(this.scrollToRight.bind(this), this.holdDelay);
    },
    
    releaseHold: function() {
      clearInterval(this.holdJob);
      this.holdJob = null;
    },
    
    scrollToLeft: function() {
      this.$.tabsContainer.scrollLeft -= this.step;
    },
    
    scrollToRight: function() {
      this.$.tabsContainer.scrollLeft += this.step;
    },
    
    /**
     * Invoke this to update the size and position of the bottom bar.  Usually
     * you only need to call this if the `paper-tabs` is initially hidden and
     * later becomes visible.
     *
     * @method updateBar
     */
    updateBar: function() {
      this.async('selectedItemChanged');
    },
    
    selectedItemChanged: function(old) {
      var oldIndex = this.selectedIndex;
      this.super(arguments);
      var s = this.$.selectionBar.style;
      
      if (!this.selectedItem) {
        s.width = 0;
        s.left = 0;
        return;
      } 
      
      var r = this.$.tabsContent.getBoundingClientRect();
      this._w = r.width;
      this._l = r.left;
      
      r = this.selectedItem.getBoundingClientRect();
      this._sw = r.width;
      this._sl = r.left;
      this._sOffsetLeft = this._sl - this._l; 
      
      if (this.noslide || old == null) {
        this.positionBarForSelected();
        return;
      }
      
      var oldRect = old.getBoundingClientRect();
      
      var m = 5;
      this.$.selectionBar.classList.add('expand');
      if (oldIndex < this.selectedIndex) {
        s.width = this.calcPercent(this._sl + this._sw - oldRect.left) - m + '%';
        this._transitionCounter = 1;
      } else {
        s.width = this.calcPercent(oldRect.left + oldRect.width - this._sl) - m + '%';
        s.left = this.calcPercent(this._sOffsetLeft) + m + '%';
        this._transitionCounter = 2;
      }
      if (this.scrollable) {
        this.scrollToSelectedIfNeeded();
      }
    },
    
    scrollToSelectedIfNeeded: function() {
      var scrollLeft = this.$.tabsContainer.scrollLeft;
      // scroll to selected if needed
      if (this._sOffsetLeft + this._sw < scrollLeft || 
          this._sOffsetLeft - scrollLeft > this.$.tabsContainer.offsetWidth) {
        this.$.tabsContainer.scrollLeft = this._sOffsetLeft;
      }
    },
    
    positionBarForSelected: function() {
      var s = this.$.selectionBar.style;
      s.width = this.calcPercent(this._sw) + '%';
      s.left = this.calcPercent(this._sOffsetLeft) + '%';
    },
    
    calcPercent: function(w) {
      return 100 * w / this._w;
    },
    
    barTransitionEnd: function(e) {
      this._transitionCounter--;
      var cl = this.$.selectionBar.classList;
      if (cl.contains('expand') && !this._transitionCounter) {
        cl.remove('expand');
        cl.add('contract');
        this.positionBarForSelected();
      } else if (cl.contains('contract')) {
        cl.remove('contract');
      }
    }
    
  }, Polymer.CoreResizable));
  
;


  (function() {
  
    var currentToast;
  
    Polymer('paper-toast', {
  
      /**
       * The text shows in a toast.
       *
       * @attribute text
       * @type string
       * @default ''
       */
      text: '',
      
      /**
       * The duration in milliseconds to show the toast.
       *
       * @attribute duration
       * @type number
       * @default 3000
       */
      duration: 3000,
      
      /**
       * Set opened to true to show the toast and to false to hide it.
       *
       * @attribute opened
       * @type boolean
       * @default false
       */
      opened: false,
      
      /**
       * Min-width when the toast changes to narrow layout.  In narrow layout,
       * the toast fits at the bottom of the screen when opened.
       *
       * @attribute responsiveWidth
       * @type string
       * @default '480px'
       */
      responsiveWidth: '480px',
      
      /**
       * If true, the toast can't be swiped.
       *
       * @attribute swipeDisabled
       * @type boolean
       * @default false
       */
      swipeDisabled: false,
      
      /**
       * By default, the toast will close automatically if the user taps
       * outside it or presses the escape key. Disable this behavior by setting
       * the `autoCloseDisabled` property to true.
       *
       * @attribute autoCloseDisabled
       * @type boolean
       * @default false
       */
      autoCloseDisabled: false,
      
      narrowMode: false,
      
      eventDelegates: {
        trackstart: 'trackStart',
        track: 'track',
        trackend: 'trackEnd',
        transitionend: 'transitionEnd'
      },
      
      narrowModeChanged: function() {
        this.classList.toggle('fit-bottom', this.narrowMode);
        if (this.opened) {
          this.$.overlay.resizeHandler();
        }
      },
      
      openedChanged: function() {
        if (this.opened) {
          this.dismissJob = this.job(this.dismissJob, this.dismiss, this.duration);
        } else {
          this.dismissJob && this.dismissJob.stop();
          this.dismiss();
        }
      },
      
      /** 
       * Toggle the opened state of the toast.
       * @method toggle
       */
      toggle: function() {
        this.opened = !this.opened;
      },
      
      /** 
       * Show the toast for the specified duration
       * @method show
       */
      show: function() {
        if (currentToast) {
          currentToast.dismiss();
        }
        currentToast = this;
        this.opened = true;
      },
      
      /** 
       * Dismiss the toast and hide it.
       * @method dismiss
       */
      dismiss: function() {
        if (this.dragging) {
          this.shouldDismiss = true;
        } else {
          this.opened = false;
          if (currentToast === this) {
            currentToast = null;
          }
        }
      },
      
      trackStart: function(e) {
        if (!this.swipeDisabled) {
          e.preventTap();
          this.vertical = e.yDirection;
          this.w = this.offsetWidth;
          this.h = this.offsetHeight;
          this.dragging = true;
          this.classList.add('dragging');
        }
      },
      
      track: function(e) {
        if (this.dragging) {
          var s = this.style;
          if (this.vertical) {
            var y = e.dy;
            s.opacity = (this.h - Math.abs(y)) / this.h;
            s.transform = s.webkitTransform = 'translate3d(0, ' + y + 'px, 0)';
          } else {
            var x = e.dx;
            s.opacity = (this.w - Math.abs(x)) / this.w;
            s.transform = s.webkitTransform = 'translate3d(' + x + 'px, 0, 0)';
          }
        }
      },
      
      trackEnd: function(e) {
        if (this.dragging) {
          this.classList.remove('dragging');
          this.style.opacity = '';
          this.style.transform = this.style.webkitTransform = '';
          var cl = this.classList;
          if (this.vertical) {
            cl.toggle('fade-out-down', e.yDirection === 1 && e.dy > 0);
            cl.toggle('fade-out-up', e.yDirection === -1 && e.dy < 0);
          } else {
            cl.toggle('fade-out-right', e.xDirection === 1 && e.dx > 0);
            cl.toggle('fade-out-left', e.xDirection === -1 && e.dx < 0);
          }
          this.dragging = false;
        }
      },
      
      transitionEnd: function() {
        var cl = this.classList;
        if (cl.contains('fade-out-right') || cl.contains('fade-out-left') || 
            cl.contains('fade-out-down') || cl.contains('fade-out-up')) {
          this.dismiss();
          cl.remove('fade-out-right', 'fade-out-left', 
              'fade-out-down', 'fade-out-up');
        } else if (this.shouldDismiss) {
          this.dismiss();
        }
        this.shouldDismiss = false;
      }
  
    });
    
  })();

;


  Polymer('paper-toggle-button', {
    
    /**
     * Fired when the checked state changes due to user interaction.
     *
     * @event change
     */
     
    /**
     * Fired when the checked state changes.
     *
     * @event core-change
     */

    /**
     * Gets or sets the state, `true` is checked and `false` is unchecked.
     *
     * @attribute checked
     * @type boolean
     * @default false
     */
    checked: false,

    /**
     * If true, the toggle button is disabled.  A disabled toggle button cannot
     * be tapped or dragged to change the checked state.
     *
     * @attribute disabled
     * @type boolean
     * @default false
     */
    disabled: false,

    eventDelegates: {
      down: 'downAction',
      up: 'upAction',
      tap: 'tap',
      trackstart: 'trackStart',
      trackx: 'trackx',
      trackend: 'trackEnd'
    },

    downAction: function(e) {
      var rect = this.$.ink.getBoundingClientRect();
      this.$.ink.downAction({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      });
    },

    upAction: function(e) {
      this.$.ink.upAction();
    },

    tap: function() {
      if (this.disabled) {
        return;
      }
      this.checked = !this.checked;
      this.fire('change');
    },

    trackStart: function(e) {
      if (this.disabled) {
        return;
      }
      this._w = this.$.toggleBar.offsetWidth / 2;
      e.preventTap();
    },

    trackx: function(e) {
      this._x = Math.min(this._w, 
          Math.max(0, this.checked ? this._w + e.dx : e.dx));
      this.$.toggleButton.classList.add('dragging');
      var s =  this.$.toggleButton.style;
      s.webkitTransform = s.transform = 'translate3d(' + this._x + 'px,0,0)';
    },

    trackEnd: function() {
      var s =  this.$.toggleButton.style;
      s.transform = s.webkitTransform = '';
      this.$.toggleButton.classList.remove('dragging');
      var old = this.checked;
      this.checked = Math.abs(this._x) > this._w / 2;
      if (this.checked !== old) {
        this.fire('change');
      }
    },
    
    checkedChanged: function() {
      this.setAttribute('aria-pressed', Boolean(this.checked));
      this.fire('core-change');
    }

  });

;
/**
 * @license
 * Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */
// @version 0.5.5
window.PolymerGestures = {};

(function(scope) {
  var hasFullPath = false;

  // test for full event path support
  var pathTest = document.createElement('meta');
  if (pathTest.createShadowRoot) {
    var sr = pathTest.createShadowRoot();
    var s = document.createElement('span');
    sr.appendChild(s);
    pathTest.addEventListener('testpath', function(ev) {
      if (ev.path) {
        // if the span is in the event path, then path[0] is the real source for all events
        hasFullPath = ev.path[0] === s;
      }
      ev.stopPropagation();
    });
    var ev = new CustomEvent('testpath', {bubbles: true});
    // must add node to DOM to trigger event listener
    document.head.appendChild(pathTest);
    s.dispatchEvent(ev);
    pathTest.parentNode.removeChild(pathTest);
    sr = s = null;
  }
  pathTest = null;

  var target = {
    shadow: function(inEl) {
      if (inEl) {
        return inEl.shadowRoot || inEl.webkitShadowRoot;
      }
    },
    canTarget: function(shadow) {
      return shadow && Boolean(shadow.elementFromPoint);
    },
    targetingShadow: function(inEl) {
      var s = this.shadow(inEl);
      if (this.canTarget(s)) {
        return s;
      }
    },
    olderShadow: function(shadow) {
      var os = shadow.olderShadowRoot;
      if (!os) {
        var se = shadow.querySelector('shadow');
        if (se) {
          os = se.olderShadowRoot;
        }
      }
      return os;
    },
    allShadows: function(element) {
      var shadows = [], s = this.shadow(element);
      while(s) {
        shadows.push(s);
        s = this.olderShadow(s);
      }
      return shadows;
    },
    searchRoot: function(inRoot, x, y) {
      var t, st, sr, os;
      if (inRoot) {
        t = inRoot.elementFromPoint(x, y);
        if (t) {
          // found element, check if it has a ShadowRoot
          sr = this.targetingShadow(t);
        } else if (inRoot !== document) {
          // check for sibling roots
          sr = this.olderShadow(inRoot);
        }
        // search other roots, fall back to light dom element
        return this.searchRoot(sr, x, y) || t;
      }
    },
    owner: function(element) {
      if (!element) {
        return document;
      }
      var s = element;
      // walk up until you hit the shadow root or document
      while (s.parentNode) {
        s = s.parentNode;
      }
      // the owner element is expected to be a Document or ShadowRoot
      if (s.nodeType != Node.DOCUMENT_NODE && s.nodeType != Node.DOCUMENT_FRAGMENT_NODE) {
        s = document;
      }
      return s;
    },
    findTarget: function(inEvent) {
      if (hasFullPath && inEvent.path && inEvent.path.length) {
        return inEvent.path[0];
      }
      var x = inEvent.clientX, y = inEvent.clientY;
      // if the listener is in the shadow root, it is much faster to start there
      var s = this.owner(inEvent.target);
      // if x, y is not in this root, fall back to document search
      if (!s.elementFromPoint(x, y)) {
        s = document;
      }
      return this.searchRoot(s, x, y);
    },
    findTouchAction: function(inEvent) {
      var n;
      if (hasFullPath && inEvent.path && inEvent.path.length) {
        var path = inEvent.path;
        for (var i = 0; i < path.length; i++) {
          n = path[i];
          if (n.nodeType === Node.ELEMENT_NODE && n.hasAttribute('touch-action')) {
            return n.getAttribute('touch-action');
          }
        }
      } else {
        n = inEvent.target;
        while(n) {
          if (n.nodeType === Node.ELEMENT_NODE && n.hasAttribute('touch-action')) {
            return n.getAttribute('touch-action');
          }
          n = n.parentNode || n.host;
        }
      }
      // auto is default
      return "auto";
    },
    LCA: function(a, b) {
      if (a === b) {
        return a;
      }
      if (a && !b) {
        return a;
      }
      if (b && !a) {
        return b;
      }
      if (!b && !a) {
        return document;
      }
      // fast case, a is a direct descendant of b or vice versa
      if (a.contains && a.contains(b)) {
        return a;
      }
      if (b.contains && b.contains(a)) {
        return b;
      }
      var adepth = this.depth(a);
      var bdepth = this.depth(b);
      var d = adepth - bdepth;
      if (d >= 0) {
        a = this.walk(a, d);
      } else {
        b = this.walk(b, -d);
      }
      while (a && b && a !== b) {
        a = a.parentNode || a.host;
        b = b.parentNode || b.host;
      }
      return a;
    },
    walk: function(n, u) {
      for (var i = 0; n && (i < u); i++) {
        n = n.parentNode || n.host;
      }
      return n;
    },
    depth: function(n) {
      var d = 0;
      while(n) {
        d++;
        n = n.parentNode || n.host;
      }
      return d;
    },
    deepContains: function(a, b) {
      var common = this.LCA(a, b);
      // if a is the common ancestor, it must "deeply" contain b
      return common === a;
    },
    insideNode: function(node, x, y) {
      var rect = node.getBoundingClientRect();
      return (rect.left <= x) && (x <= rect.right) && (rect.top <= y) && (y <= rect.bottom);
    },
    path: function(event) {
      var p;
      if (hasFullPath && event.path && event.path.length) {
        p = event.path;
      } else {
        p = [];
        var n = this.findTarget(event);
        while (n) {
          p.push(n);
          n = n.parentNode || n.host;
        }
      }
      return p;
    }
  };
  scope.targetFinding = target;
  /**
   * Given an event, finds the "deepest" node that could have been the original target before ShadowDOM retargetting
   *
   * @param {Event} Event An event object with clientX and clientY properties
   * @return {Element} The probable event origninator
   */
  scope.findTarget = target.findTarget.bind(target);
  /**
   * Determines if the "container" node deeply contains the "containee" node, including situations where the "containee" is contained by one or more ShadowDOM
   * roots.
   *
   * @param {Node} container
   * @param {Node} containee
   * @return {Boolean}
   */
  scope.deepContains = target.deepContains.bind(target);

  /**
   * Determines if the x/y position is inside the given node.
   *
   * Example:
   *
   *     function upHandler(event) {
   *       var innode = PolymerGestures.insideNode(event.target, event.clientX, event.clientY);
   *       if (innode) {
   *         // wait for tap?
   *       } else {
   *         // tap will never happen
   *       }
   *     }
   *
   * @param {Node} node
   * @param {Number} x Screen X position
   * @param {Number} y screen Y position
   * @return {Boolean}
   */
  scope.insideNode = target.insideNode;

})(window.PolymerGestures);

(function() {
  function shadowSelector(v) {
    return 'html /deep/ ' + selector(v);
  }
  function selector(v) {
    return '[touch-action="' + v + '"]';
  }
  function rule(v) {
    return '{ -ms-touch-action: ' + v + '; touch-action: ' + v + ';}';
  }
  var attrib2css = [
    'none',
    'auto',
    'pan-x',
    'pan-y',
    {
      rule: 'pan-x pan-y',
      selectors: [
        'pan-x pan-y',
        'pan-y pan-x'
      ]
    },
    'manipulation'
  ];
  var styles = '';
  // only install stylesheet if the browser has touch action support
  var hasTouchAction = typeof document.head.style.touchAction === 'string';
  // only add shadow selectors if shadowdom is supported
  var hasShadowRoot = !window.ShadowDOMPolyfill && document.head.createShadowRoot;

  if (hasTouchAction) {
    attrib2css.forEach(function(r) {
      if (String(r) === r) {
        styles += selector(r) + rule(r) + '\n';
        if (hasShadowRoot) {
          styles += shadowSelector(r) + rule(r) + '\n';
        }
      } else {
        styles += r.selectors.map(selector) + rule(r.rule) + '\n';
        if (hasShadowRoot) {
          styles += r.selectors.map(shadowSelector) + rule(r.rule) + '\n';
        }
      }
    });

    var el = document.createElement('style');
    el.textContent = styles;
    document.head.appendChild(el);
  }
})();

/**
 * This is the constructor for new PointerEvents.
 *
 * New Pointer Events must be given a type, and an optional dictionary of
 * initialization properties.
 *
 * Due to certain platform requirements, events returned from the constructor
 * identify as MouseEvents.
 *
 * @constructor
 * @param {String} inType The type of the event to create.
 * @param {Object} [inDict] An optional dictionary of initial event properties.
 * @return {Event} A new PointerEvent of type `inType` and initialized with properties from `inDict`.
 */
(function(scope) {

  var MOUSE_PROPS = [
    'bubbles',
    'cancelable',
    'view',
    'detail',
    'screenX',
    'screenY',
    'clientX',
    'clientY',
    'ctrlKey',
    'altKey',
    'shiftKey',
    'metaKey',
    'button',
    'relatedTarget',
    'pageX',
    'pageY'
  ];

  var MOUSE_DEFAULTS = [
    false,
    false,
    null,
    null,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null,
    0,
    0
  ];

  var NOP_FACTORY = function(){ return function(){}; };

  var eventFactory = {
    // TODO(dfreedm): this is overridden by tap recognizer, needs review
    preventTap: NOP_FACTORY,
    makeBaseEvent: function(inType, inDict) {
      var e = document.createEvent('Event');
      e.initEvent(inType, inDict.bubbles || false, inDict.cancelable || false);
      e.preventTap = eventFactory.preventTap(e);
      return e;
    },
    makeGestureEvent: function(inType, inDict) {
      inDict = inDict || Object.create(null);

      var e = this.makeBaseEvent(inType, inDict);
      for (var i = 0, keys = Object.keys(inDict), k; i < keys.length; i++) {
        k = keys[i];
        if( k !== 'bubbles' && k !== 'cancelable' ) {
           e[k] = inDict[k];
        }
      }
      return e;
    },
    makePointerEvent: function(inType, inDict) {
      inDict = inDict || Object.create(null);

      var e = this.makeBaseEvent(inType, inDict);
      // define inherited MouseEvent properties
      for(var i = 2, p; i < MOUSE_PROPS.length; i++) {
        p = MOUSE_PROPS[i];
        e[p] = inDict[p] || MOUSE_DEFAULTS[i];
      }
      e.buttons = inDict.buttons || 0;

      // Spec requires that pointers without pressure specified use 0.5 for down
      // state and 0 for up state.
      var pressure = 0;
      if (inDict.pressure) {
        pressure = inDict.pressure;
      } else {
        pressure = e.buttons ? 0.5 : 0;
      }

      // add x/y properties aliased to clientX/Y
      e.x = e.clientX;
      e.y = e.clientY;

      // define the properties of the PointerEvent interface
      e.pointerId = inDict.pointerId || 0;
      e.width = inDict.width || 0;
      e.height = inDict.height || 0;
      e.pressure = pressure;
      e.tiltX = inDict.tiltX || 0;
      e.tiltY = inDict.tiltY || 0;
      e.pointerType = inDict.pointerType || '';
      e.hwTimestamp = inDict.hwTimestamp || 0;
      e.isPrimary = inDict.isPrimary || false;
      e._source = inDict._source || '';
      return e;
    }
  };

  scope.eventFactory = eventFactory;
})(window.PolymerGestures);

/**
 * This module implements an map of pointer states
 */
(function(scope) {
  var USE_MAP = window.Map && window.Map.prototype.forEach;
  var POINTERS_FN = function(){ return this.size; };
  function PointerMap() {
    if (USE_MAP) {
      var m = new Map();
      m.pointers = POINTERS_FN;
      return m;
    } else {
      this.keys = [];
      this.values = [];
    }
  }

  PointerMap.prototype = {
    set: function(inId, inEvent) {
      var i = this.keys.indexOf(inId);
      if (i > -1) {
        this.values[i] = inEvent;
      } else {
        this.keys.push(inId);
        this.values.push(inEvent);
      }
    },
    has: function(inId) {
      return this.keys.indexOf(inId) > -1;
    },
    'delete': function(inId) {
      var i = this.keys.indexOf(inId);
      if (i > -1) {
        this.keys.splice(i, 1);
        this.values.splice(i, 1);
      }
    },
    get: function(inId) {
      var i = this.keys.indexOf(inId);
      return this.values[i];
    },
    clear: function() {
      this.keys.length = 0;
      this.values.length = 0;
    },
    // return value, key, map
    forEach: function(callback, thisArg) {
      this.values.forEach(function(v, i) {
        callback.call(thisArg, v, this.keys[i], this);
      }, this);
    },
    pointers: function() {
      return this.keys.length;
    }
  };

  scope.PointerMap = PointerMap;
})(window.PolymerGestures);

(function(scope) {
  var CLONE_PROPS = [
    // MouseEvent
    'bubbles',
    'cancelable',
    'view',
    'detail',
    'screenX',
    'screenY',
    'clientX',
    'clientY',
    'ctrlKey',
    'altKey',
    'shiftKey',
    'metaKey',
    'button',
    'relatedTarget',
    // DOM Level 3
    'buttons',
    // PointerEvent
    'pointerId',
    'width',
    'height',
    'pressure',
    'tiltX',
    'tiltY',
    'pointerType',
    'hwTimestamp',
    'isPrimary',
    // event instance
    'type',
    'target',
    'currentTarget',
    'which',
    'pageX',
    'pageY',
    'timeStamp',
    // gesture addons
    'preventTap',
    'tapPrevented',
    '_source'
  ];

  var CLONE_DEFAULTS = [
    // MouseEvent
    false,
    false,
    null,
    null,
    0,
    0,
    0,
    0,
    false,
    false,
    false,
    false,
    0,
    null,
    // DOM Level 3
    0,
    // PointerEvent
    0,
    0,
    0,
    0,
    0,
    0,
    '',
    0,
    false,
    // event instance
    '',
    null,
    null,
    0,
    0,
    0,
    0,
    function(){},
    false
  ];

  var HAS_SVG_INSTANCE = (typeof SVGElementInstance !== 'undefined');

  var eventFactory = scope.eventFactory;

  // set of recognizers to run for the currently handled event
  var currentGestures;

  /**
   * This module is for normalizing events. Mouse and Touch events will be
   * collected here, and fire PointerEvents that have the same semantics, no
   * matter the source.
   * Events fired:
   *   - pointerdown: a pointing is added
   *   - pointerup: a pointer is removed
   *   - pointermove: a pointer is moved
   *   - pointerover: a pointer crosses into an element
   *   - pointerout: a pointer leaves an element
   *   - pointercancel: a pointer will no longer generate events
   */
  var dispatcher = {
    IS_IOS: false,
    pointermap: new scope.PointerMap(),
    requiredGestures: new scope.PointerMap(),
    eventMap: Object.create(null),
    // Scope objects for native events.
    // This exists for ease of testing.
    eventSources: Object.create(null),
    eventSourceList: [],
    gestures: [],
    // map gesture event -> {listeners: int, index: gestures[int]}
    dependencyMap: {
      // make sure down and up are in the map to trigger "register"
      down: {listeners: 0, index: -1},
      up: {listeners: 0, index: -1}
    },
    gestureQueue: [],
    /**
     * Add a new event source that will generate pointer events.
     *
     * `inSource` must contain an array of event names named `events`, and
     * functions with the names specified in the `events` array.
     * @param {string} name A name for the event source
     * @param {Object} source A new source of platform events.
     */
    registerSource: function(name, source) {
      var s = source;
      var newEvents = s.events;
      if (newEvents) {
        newEvents.forEach(function(e) {
          if (s[e]) {
            this.eventMap[e] = s[e].bind(s);
          }
        }, this);
        this.eventSources[name] = s;
        this.eventSourceList.push(s);
      }
    },
    registerGesture: function(name, source) {
      var obj = Object.create(null);
      obj.listeners = 0;
      obj.index = this.gestures.length;
      for (var i = 0, g; i < source.exposes.length; i++) {
        g = source.exposes[i].toLowerCase();
        this.dependencyMap[g] = obj;
      }
      this.gestures.push(source);
    },
    register: function(element, initial) {
      var l = this.eventSourceList.length;
      for (var i = 0, es; (i < l) && (es = this.eventSourceList[i]); i++) {
        // call eventsource register
        es.register.call(es, element, initial);
      }
    },
    unregister: function(element) {
      var l = this.eventSourceList.length;
      for (var i = 0, es; (i < l) && (es = this.eventSourceList[i]); i++) {
        // call eventsource register
        es.unregister.call(es, element);
      }
    },
    // EVENTS
    down: function(inEvent) {
      this.requiredGestures.set(inEvent.pointerId, currentGestures);
      this.fireEvent('down', inEvent);
    },
    move: function(inEvent) {
      // pipe move events into gesture queue directly
      inEvent.type = 'move';
      this.fillGestureQueue(inEvent);
    },
    up: function(inEvent) {
      this.fireEvent('up', inEvent);
      this.requiredGestures.delete(inEvent.pointerId);
    },
    cancel: function(inEvent) {
      inEvent.tapPrevented = true;
      this.fireEvent('up', inEvent);
      this.requiredGestures.delete(inEvent.pointerId);
    },
    addGestureDependency: function(node, currentGestures) {
      var gesturesWanted = node._pgEvents;
      if (gesturesWanted && currentGestures) {
        var gk = Object.keys(gesturesWanted);
        for (var i = 0, r, ri, g; i < gk.length; i++) {
          // gesture
          g = gk[i];
          if (gesturesWanted[g] > 0) {
            // lookup gesture recognizer
            r = this.dependencyMap[g];
            // recognizer index
            ri = r ? r.index : -1;
            currentGestures[ri] = true;
          }
        }
      }
    },
    // LISTENER LOGIC
    eventHandler: function(inEvent) {
      // This is used to prevent multiple dispatch of events from
      // platform events. This can happen when two elements in different scopes
      // are set up to create pointer events, which is relevant to Shadow DOM.

      var type = inEvent.type;

      // only generate the list of desired events on "down"
      if (type === 'touchstart' || type === 'mousedown' || type === 'pointerdown' || type === 'MSPointerDown') {
        if (!inEvent._handledByPG) {
          currentGestures = {};
        }

        // in IOS mode, there is only a listener on the document, so this is not re-entrant
        if (this.IS_IOS) {
          var ev = inEvent;
          if (type === 'touchstart') {
            var ct = inEvent.changedTouches[0];
            // set up a fake event to give to the path builder
            ev = {target: inEvent.target, clientX: ct.clientX, clientY: ct.clientY, path: inEvent.path};
          }
          // use event path if available, otherwise build a path from target finding
          var nodes = inEvent.path || scope.targetFinding.path(ev);
          for (var i = 0, n; i < nodes.length; i++) {
            n = nodes[i];
            this.addGestureDependency(n, currentGestures);
          }
        } else {
          this.addGestureDependency(inEvent.currentTarget, currentGestures);
        }
      }

      if (inEvent._handledByPG) {
        return;
      }
      var fn = this.eventMap && this.eventMap[type];
      if (fn) {
        fn(inEvent);
      }
      inEvent._handledByPG = true;
    },
    // set up event listeners
    listen: function(target, events) {
      for (var i = 0, l = events.length, e; (i < l) && (e = events[i]); i++) {
        this.addEvent(target, e);
      }
    },
    // remove event listeners
    unlisten: function(target, events) {
      for (var i = 0, l = events.length, e; (i < l) && (e = events[i]); i++) {
        this.removeEvent(target, e);
      }
    },
    addEvent: function(target, eventName) {
      target.addEventListener(eventName, this.boundHandler);
    },
    removeEvent: function(target, eventName) {
      target.removeEventListener(eventName, this.boundHandler);
    },
    // EVENT CREATION AND TRACKING
    /**
     * Creates a new Event of type `inType`, based on the information in
     * `inEvent`.
     *
     * @param {string} inType A string representing the type of event to create
     * @param {Event} inEvent A platform event with a target
     * @return {Event} A PointerEvent of type `inType`
     */
    makeEvent: function(inType, inEvent) {
      var e = eventFactory.makePointerEvent(inType, inEvent);
      e.preventDefault = inEvent.preventDefault;
      e.tapPrevented = inEvent.tapPrevented;
      e._target = e._target || inEvent.target;
      return e;
    },
    // make and dispatch an event in one call
    fireEvent: function(inType, inEvent) {
      var e = this.makeEvent(inType, inEvent);
      return this.dispatchEvent(e);
    },
    /**
     * Returns a snapshot of inEvent, with writable properties.
     *
     * @param {Event} inEvent An event that contains properties to copy.
     * @return {Object} An object containing shallow copies of `inEvent`'s
     *    properties.
     */
    cloneEvent: function(inEvent) {
      var eventCopy = Object.create(null), p;
      for (var i = 0; i < CLONE_PROPS.length; i++) {
        p = CLONE_PROPS[i];
        eventCopy[p] = inEvent[p] || CLONE_DEFAULTS[i];
        // Work around SVGInstanceElement shadow tree
        // Return the <use> element that is represented by the instance for Safari, Chrome, IE.
        // This is the behavior implemented by Firefox.
        if (p === 'target' || p === 'relatedTarget') {
          if (HAS_SVG_INSTANCE && eventCopy[p] instanceof SVGElementInstance) {
            eventCopy[p] = eventCopy[p].correspondingUseElement;
          }
        }
      }
      // keep the semantics of preventDefault
      eventCopy.preventDefault = function() {
        inEvent.preventDefault();
      };
      return eventCopy;
    },
    /**
     * Dispatches the event to its target.
     *
     * @param {Event} inEvent The event to be dispatched.
     * @return {Boolean} True if an event handler returns true, false otherwise.
     */
    dispatchEvent: function(inEvent) {
      var t = inEvent._target;
      if (t) {
        t.dispatchEvent(inEvent);
        // clone the event for the gesture system to process
        // clone after dispatch to pick up gesture prevention code
        var clone = this.cloneEvent(inEvent);
        clone.target = t;
        this.fillGestureQueue(clone);
      }
    },
    gestureTrigger: function() {
      // process the gesture queue
      for (var i = 0, e, rg; i < this.gestureQueue.length; i++) {
        e = this.gestureQueue[i];
        rg = e._requiredGestures;
        if (rg) {
          for (var j = 0, g, fn; j < this.gestures.length; j++) {
            // only run recognizer if an element in the source event's path is listening for those gestures
            if (rg[j]) {
              g = this.gestures[j];
              fn = g[e.type];
              if (fn) {
                fn.call(g, e);
              }
            }
          }
        }
      }
      this.gestureQueue.length = 0;
    },
    fillGestureQueue: function(ev) {
      // only trigger the gesture queue once
      if (!this.gestureQueue.length) {
        requestAnimationFrame(this.boundGestureTrigger);
      }
      ev._requiredGestures = this.requiredGestures.get(ev.pointerId);
      this.gestureQueue.push(ev);
    }
  };
  dispatcher.boundHandler = dispatcher.eventHandler.bind(dispatcher);
  dispatcher.boundGestureTrigger = dispatcher.gestureTrigger.bind(dispatcher);
  scope.dispatcher = dispatcher;

  /**
   * Listen for `gesture` on `node` with the `handler` function
   *
   * If `handler` is the first listener for `gesture`, the underlying gesture recognizer is then enabled.
   *
   * @param {Element} node
   * @param {string} gesture
   * @return Boolean `gesture` is a valid gesture
   */
  scope.activateGesture = function(node, gesture) {
    var g = gesture.toLowerCase();
    var dep = dispatcher.dependencyMap[g];
    if (dep) {
      var recognizer = dispatcher.gestures[dep.index];
      if (!node._pgListeners) {
        dispatcher.register(node);
        node._pgListeners = 0;
      }
      // TODO(dfreedm): re-evaluate bookkeeping to avoid using attributes
      if (recognizer) {
        var touchAction = recognizer.defaultActions && recognizer.defaultActions[g];
        var actionNode;
        switch(node.nodeType) {
          case Node.ELEMENT_NODE:
            actionNode = node;
          break;
          case Node.DOCUMENT_FRAGMENT_NODE:
            actionNode = node.host;
          break;
          default:
            actionNode = null;
          break;
        }
        if (touchAction && actionNode && !actionNode.hasAttribute('touch-action')) {
          actionNode.setAttribute('touch-action', touchAction);
        }
      }
      if (!node._pgEvents) {
        node._pgEvents = {};
      }
      node._pgEvents[g] = (node._pgEvents[g] || 0) + 1;
      node._pgListeners++;
    }
    return Boolean(dep);
  };

  /**
   *
   * Listen for `gesture` from `node` with `handler` function.
   *
   * @param {Element} node
   * @param {string} gesture
   * @param {Function} handler
   * @param {Boolean} capture
   */
  scope.addEventListener = function(node, gesture, handler, capture) {
    if (handler) {
      scope.activateGesture(node, gesture);
      node.addEventListener(gesture, handler, capture);
    }
  };

  /**
   * Tears down the gesture configuration for `node`
   *
   * If `handler` is the last listener for `gesture`, the underlying gesture recognizer is disabled.
   *
   * @param {Element} node
   * @param {string} gesture
   * @return Boolean `gesture` is a valid gesture
   */
  scope.deactivateGesture = function(node, gesture) {
    var g = gesture.toLowerCase();
    var dep = dispatcher.dependencyMap[g];
    if (dep) {
      if (node._pgListeners > 0) {
        node._pgListeners--;
      }
      if (node._pgListeners === 0) {
        dispatcher.unregister(node);
      }
      if (node._pgEvents) {
        if (node._pgEvents[g] > 0) {
          node._pgEvents[g]--;
        } else {
          node._pgEvents[g] = 0;
        }
      }
    }
    return Boolean(dep);
  };

  /**
   * Stop listening for `gesture` from `node` with `handler` function.
   *
   * @param {Element} node
   * @param {string} gesture
   * @param {Function} handler
   * @param {Boolean} capture
   */
  scope.removeEventListener = function(node, gesture, handler, capture) {
    if (handler) {
      scope.deactivateGesture(node, gesture);
      node.removeEventListener(gesture, handler, capture);
    }
  };
})(window.PolymerGestures);

(function(scope) {
  var dispatcher = scope.dispatcher;
  var pointermap = dispatcher.pointermap;
  // radius around touchend that swallows mouse events
  var DEDUP_DIST = 25;

  var WHICH_TO_BUTTONS = [0, 1, 4, 2];

  var currentButtons = 0;

  var FIREFOX_LINUX = /Linux.*Firefox\//i;

  var HAS_BUTTONS = (function() {
    // firefox on linux returns spec-incorrect values for mouseup.buttons
    // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent.buttons#See_also
    // https://codereview.chromium.org/727593003/#msg16
    if (FIREFOX_LINUX.test(navigator.userAgent)) {
      return false;
    }
    try {
      return new MouseEvent('test', {buttons: 1}).buttons === 1;
    } catch (e) {
      return false;
    }
  })();

  // handler block for native mouse events
  var mouseEvents = {
    POINTER_ID: 1,
    POINTER_TYPE: 'mouse',
    events: [
      'mousedown',
      'mousemove',
      'mouseup'
    ],
    exposes: [
      'down',
      'up',
      'move'
    ],
    register: function(target) {
      dispatcher.listen(target, this.events);
    },
    unregister: function(target) {
      if (target.nodeType === Node.DOCUMENT_NODE) {
        return;
      }
      dispatcher.unlisten(target, this.events);
    },
    lastTouches: [],
    // collide with the global mouse listener
    isEventSimulatedFromTouch: function(inEvent) {
      var lts = this.lastTouches;
      var x = inEvent.clientX, y = inEvent.clientY;
      for (var i = 0, l = lts.length, t; i < l && (t = lts[i]); i++) {
        // simulated mouse events will be swallowed near a primary touchend
        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
        if (dx <= DEDUP_DIST && dy <= DEDUP_DIST) {
          return true;
        }
      }
    },
    prepareEvent: function(inEvent) {
      var e = dispatcher.cloneEvent(inEvent);
      e.pointerId = this.POINTER_ID;
      e.isPrimary = true;
      e.pointerType = this.POINTER_TYPE;
      e._source = 'mouse';
      if (!HAS_BUTTONS) {
        var type = inEvent.type;
        var bit = WHICH_TO_BUTTONS[inEvent.which] || 0;
        if (type === 'mousedown') {
          currentButtons |= bit;
        } else if (type === 'mouseup') {
          currentButtons &= ~bit;
        }
        e.buttons = currentButtons;
      }
      return e;
    },
    mousedown: function(inEvent) {
      if (!this.isEventSimulatedFromTouch(inEvent)) {
        var p = pointermap.has(this.POINTER_ID);
        var e = this.prepareEvent(inEvent);
        e.target = scope.findTarget(inEvent);
        pointermap.set(this.POINTER_ID, e.target);
        dispatcher.down(e);
      }
    },
    mousemove: function(inEvent) {
      if (!this.isEventSimulatedFromTouch(inEvent)) {
        var target = pointermap.get(this.POINTER_ID);
        if (target) {
          var e = this.prepareEvent(inEvent);
          e.target = target;
          // handle case where we missed a mouseup
          if ((HAS_BUTTONS ? e.buttons : e.which) === 0) {
            if (!HAS_BUTTONS) {
              currentButtons = e.buttons = 0;
            }
            dispatcher.cancel(e);
            this.cleanupMouse(e.buttons);
          } else {
            dispatcher.move(e);
          }
        }
      }
    },
    mouseup: function(inEvent) {
      if (!this.isEventSimulatedFromTouch(inEvent)) {
        var e = this.prepareEvent(inEvent);
        e.relatedTarget = scope.findTarget(inEvent);
        e.target = pointermap.get(this.POINTER_ID);
        dispatcher.up(e);
        this.cleanupMouse(e.buttons);
      }
    },
    cleanupMouse: function(buttons) {
      if (buttons === 0) {
        pointermap.delete(this.POINTER_ID);
      }
    }
  };

  scope.mouseEvents = mouseEvents;
})(window.PolymerGestures);

(function(scope) {
  var dispatcher = scope.dispatcher;
  var allShadows = scope.targetFinding.allShadows.bind(scope.targetFinding);
  var pointermap = dispatcher.pointermap;
  var touchMap = Array.prototype.map.call.bind(Array.prototype.map);
  // This should be long enough to ignore compat mouse events made by touch
  var DEDUP_TIMEOUT = 2500;
  var DEDUP_DIST = 25;
  var CLICK_COUNT_TIMEOUT = 200;
  var HYSTERESIS = 20;
  var ATTRIB = 'touch-action';
  // TODO(dfreedm): disable until http://crbug.com/399765 is resolved
  // var HAS_TOUCH_ACTION = ATTRIB in document.head.style;
  var HAS_TOUCH_ACTION = false;

  // handler block for native touch events
  var touchEvents = {
    IS_IOS: false,
    events: [
      'touchstart',
      'touchmove',
      'touchend',
      'touchcancel'
    ],
    exposes: [
      'down',
      'up',
      'move'
    ],
    register: function(target, initial) {
      if (this.IS_IOS ? initial : !initial) {
        dispatcher.listen(target, this.events);
      }
    },
    unregister: function(target) {
      if (!this.IS_IOS) {
        dispatcher.unlisten(target, this.events);
      }
    },
    scrollTypes: {
      EMITTER: 'none',
      XSCROLLER: 'pan-x',
      YSCROLLER: 'pan-y',
    },
    touchActionToScrollType: function(touchAction) {
      var t = touchAction;
      var st = this.scrollTypes;
      if (t === st.EMITTER) {
        return 'none';
      } else if (t === st.XSCROLLER) {
        return 'X';
      } else if (t === st.YSCROLLER) {
        return 'Y';
      } else {
        return 'XY';
      }
    },
    POINTER_TYPE: 'touch',
    firstTouch: null,
    isPrimaryTouch: function(inTouch) {
      return this.firstTouch === inTouch.identifier;
    },
    setPrimaryTouch: function(inTouch) {
      // set primary touch if there no pointers, or the only pointer is the mouse
      if (pointermap.pointers() === 0 || (pointermap.pointers() === 1 && pointermap.has(1))) {
        this.firstTouch = inTouch.identifier;
        this.firstXY = {X: inTouch.clientX, Y: inTouch.clientY};
        this.firstTarget = inTouch.target;
        this.scrolling = null;
        this.cancelResetClickCount();
      }
    },
    removePrimaryPointer: function(inPointer) {
      if (inPointer.isPrimary) {
        this.firstTouch = null;
        this.firstXY = null;
        this.resetClickCount();
      }
    },
    clickCount: 0,
    resetId: null,
    resetClickCount: function() {
      var fn = function() {
        this.clickCount = 0;
        this.resetId = null;
      }.bind(this);
      this.resetId = setTimeout(fn, CLICK_COUNT_TIMEOUT);
    },
    cancelResetClickCount: function() {
      if (this.resetId) {
        clearTimeout(this.resetId);
      }
    },
    typeToButtons: function(type) {
      var ret = 0;
      if (type === 'touchstart' || type === 'touchmove') {
        ret = 1;
      }
      return ret;
    },
    findTarget: function(touch, id) {
      if (this.currentTouchEvent.type === 'touchstart') {
        if (this.isPrimaryTouch(touch)) {
          var fastPath = {
            clientX: touch.clientX,
            clientY: touch.clientY,
            path: this.currentTouchEvent.path,
            target: this.currentTouchEvent.target
          };
          return scope.findTarget(fastPath);
        } else {
          return scope.findTarget(touch);
        }
      }
      // reuse target we found in touchstart
      return pointermap.get(id);
    },
    touchToPointer: function(inTouch) {
      var cte = this.currentTouchEvent;
      var e = dispatcher.cloneEvent(inTouch);
      // Spec specifies that pointerId 1 is reserved for Mouse.
      // Touch identifiers can start at 0.
      // Add 2 to the touch identifier for compatibility.
      var id = e.pointerId = inTouch.identifier + 2;
      e.target = this.findTarget(inTouch, id);
      e.bubbles = true;
      e.cancelable = true;
      e.detail = this.clickCount;
      e.buttons = this.typeToButtons(cte.type);
      e.width = inTouch.webkitRadiusX || inTouch.radiusX || 0;
      e.height = inTouch.webkitRadiusY || inTouch.radiusY || 0;
      e.pressure = inTouch.webkitForce || inTouch.force || 0.5;
      e.isPrimary = this.isPrimaryTouch(inTouch);
      e.pointerType = this.POINTER_TYPE;
      e._source = 'touch';
      // forward touch preventDefaults
      var self = this;
      e.preventDefault = function() {
        self.scrolling = false;
        self.firstXY = null;
        cte.preventDefault();
      };
      return e;
    },
    processTouches: function(inEvent, inFunction) {
      var tl = inEvent.changedTouches;
      this.currentTouchEvent = inEvent;
      for (var i = 0, t, p; i < tl.length; i++) {
        t = tl[i];
        p = this.touchToPointer(t);
        if (inEvent.type === 'touchstart') {
          pointermap.set(p.pointerId, p.target);
        }
        if (pointermap.has(p.pointerId)) {
          inFunction.call(this, p);
        }
        if (inEvent.type === 'touchend' || inEvent._cancel) {
          this.cleanUpPointer(p);
        }
      }
    },
    // For single axis scrollers, determines whether the element should emit
    // pointer events or behave as a scroller
    shouldScroll: function(inEvent) {
      if (this.firstXY) {
        var ret;
        var touchAction = scope.targetFinding.findTouchAction(inEvent);
        var scrollAxis = this.touchActionToScrollType(touchAction);
        if (scrollAxis === 'none') {
          // this element is a touch-action: none, should never scroll
          ret = false;
        } else if (scrollAxis === 'XY') {
          // this element should always scroll
          ret = true;
        } else {
          var t = inEvent.changedTouches[0];
          // check the intended scroll axis, and other axis
          var a = scrollAxis;
          var oa = scrollAxis === 'Y' ? 'X' : 'Y';
          var da = Math.abs(t['client' + a] - this.firstXY[a]);
          var doa = Math.abs(t['client' + oa] - this.firstXY[oa]);
          // if delta in the scroll axis > delta other axis, scroll instead of
          // making events
          ret = da >= doa;
        }
        return ret;
      }
    },
    findTouch: function(inTL, inId) {
      for (var i = 0, l = inTL.length, t; i < l && (t = inTL[i]); i++) {
        if (t.identifier === inId) {
          return true;
        }
      }
    },
    // In some instances, a touchstart can happen without a touchend. This
    // leaves the pointermap in a broken state.
    // Therefore, on every touchstart, we remove the touches that did not fire a
    // touchend event.
    // To keep state globally consistent, we fire a
    // pointercancel for this "abandoned" touch
    vacuumTouches: function(inEvent) {
      var tl = inEvent.touches;
      // pointermap.pointers() should be < tl.length here, as the touchstart has not
      // been processed yet.
      if (pointermap.pointers() >= tl.length) {
        var d = [];
        pointermap.forEach(function(value, key) {
          // Never remove pointerId == 1, which is mouse.
          // Touch identifiers are 2 smaller than their pointerId, which is the
          // index in pointermap.
          if (key !== 1 && !this.findTouch(tl, key - 2)) {
            var p = value;
            d.push(p);
          }
        }, this);
        d.forEach(function(p) {
          this.cancel(p);
          pointermap.delete(p.pointerId);
        }, this);
      }
    },
    touchstart: function(inEvent) {
      this.vacuumTouches(inEvent);
      this.setPrimaryTouch(inEvent.changedTouches[0]);
      this.dedupSynthMouse(inEvent);
      if (!this.scrolling) {
        this.clickCount++;
        this.processTouches(inEvent, this.down);
      }
    },
    down: function(inPointer) {
      dispatcher.down(inPointer);
    },
    touchmove: function(inEvent) {
      if (HAS_TOUCH_ACTION) {
        // touchevent.cancelable == false is sent when the page is scrolling under native Touch Action in Chrome 36
        // https://groups.google.com/a/chromium.org/d/msg/input-dev/wHnyukcYBcA/b9kmtwM1jJQJ
        if (inEvent.cancelable) {
          this.processTouches(inEvent, this.move);
        }
      } else {
        if (!this.scrolling) {
          if (this.scrolling === null && this.shouldScroll(inEvent)) {
            this.scrolling = true;
          } else {
            this.scrolling = false;
            inEvent.preventDefault();
            this.processTouches(inEvent, this.move);
          }
        } else if (this.firstXY) {
          var t = inEvent.changedTouches[0];
          var dx = t.clientX - this.firstXY.X;
          var dy = t.clientY - this.firstXY.Y;
          var dd = Math.sqrt(dx * dx + dy * dy);
          if (dd >= HYSTERESIS) {
            this.touchcancel(inEvent);
            this.scrolling = true;
            this.firstXY = null;
          }
        }
      }
    },
    move: function(inPointer) {
      dispatcher.move(inPointer);
    },
    touchend: function(inEvent) {
      this.dedupSynthMouse(inEvent);
      this.processTouches(inEvent, this.up);
    },
    up: function(inPointer) {
      inPointer.relatedTarget = scope.findTarget(inPointer);
      dispatcher.up(inPointer);
    },
    cancel: function(inPointer) {
      dispatcher.cancel(inPointer);
    },
    touchcancel: function(inEvent) {
      inEvent._cancel = true;
      this.processTouches(inEvent, this.cancel);
    },
    cleanUpPointer: function(inPointer) {
      pointermap['delete'](inPointer.pointerId);
      this.removePrimaryPointer(inPointer);
    },
    // prevent synth mouse events from creating pointer events
    dedupSynthMouse: function(inEvent) {
      var lts = scope.mouseEvents.lastTouches;
      var t = inEvent.changedTouches[0];
      // only the primary finger will synth mouse events
      if (this.isPrimaryTouch(t)) {
        // remember x/y of last touch
        var lt = {x: t.clientX, y: t.clientY};
        lts.push(lt);
        var fn = (function(lts, lt){
          var i = lts.indexOf(lt);
          if (i > -1) {
            lts.splice(i, 1);
          }
        }).bind(null, lts, lt);
        setTimeout(fn, DEDUP_TIMEOUT);
      }
    }
  };

  // prevent "ghost clicks" that come from elements that were removed in a touch handler
  var STOP_PROP_FN = Event.prototype.stopImmediatePropagation || Event.prototype.stopPropagation;
  document.addEventListener('click', function(ev) {
    var x = ev.clientX, y = ev.clientY;
    // check if a click is within DEDUP_DIST px radius of the touchstart
    var closeTo = function(touch) {
      var dx = Math.abs(x - touch.x), dy = Math.abs(y - touch.y);
      return (dx <= DEDUP_DIST && dy <= DEDUP_DIST);
    };
    // if click coordinates are close to touch coordinates, assume the click came from a touch
    var wasTouched = scope.mouseEvents.lastTouches.some(closeTo);
    // if the click came from touch, and the touchstart target is not in the path of the click event,
    // then the touchstart target was probably removed, and the click should be "busted"
    var path = scope.targetFinding.path(ev);
    if (wasTouched) {
      for (var i = 0; i < path.length; i++) {
        if (path[i] === touchEvents.firstTarget) {
          return;
        }
      }
      ev.preventDefault();
      STOP_PROP_FN.call(ev);
    }
  }, true);

  scope.touchEvents = touchEvents;
})(window.PolymerGestures);

(function(scope) {
  var dispatcher = scope.dispatcher;
  var pointermap = dispatcher.pointermap;
  var HAS_BITMAP_TYPE = window.MSPointerEvent && typeof window.MSPointerEvent.MSPOINTER_TYPE_MOUSE === 'number';
  var msEvents = {
    events: [
      'MSPointerDown',
      'MSPointerMove',
      'MSPointerUp',
      'MSPointerCancel',
    ],
    register: function(target) {
      dispatcher.listen(target, this.events);
    },
    unregister: function(target) {
      if (target.nodeType === Node.DOCUMENT_NODE) {
        return;
      }
      dispatcher.unlisten(target, this.events);
    },
    POINTER_TYPES: [
      '',
      'unavailable',
      'touch',
      'pen',
      'mouse'
    ],
    prepareEvent: function(inEvent) {
      var e = inEvent;
      e = dispatcher.cloneEvent(inEvent);
      if (HAS_BITMAP_TYPE) {
        e.pointerType = this.POINTER_TYPES[inEvent.pointerType];
      }
      e._source = 'ms';
      return e;
    },
    cleanup: function(id) {
      pointermap['delete'](id);
    },
    MSPointerDown: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      e.target = scope.findTarget(inEvent);
      pointermap.set(inEvent.pointerId, e.target);
      dispatcher.down(e);
    },
    MSPointerMove: function(inEvent) {
      var target = pointermap.get(inEvent.pointerId);
      if (target) {
        var e = this.prepareEvent(inEvent);
        e.target = target;
        dispatcher.move(e);
      }
    },
    MSPointerUp: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      e.relatedTarget = scope.findTarget(inEvent);
      e.target = pointermap.get(e.pointerId);
      dispatcher.up(e);
      this.cleanup(inEvent.pointerId);
    },
    MSPointerCancel: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      e.relatedTarget = scope.findTarget(inEvent);
      e.target = pointermap.get(e.pointerId);
      dispatcher.cancel(e);
      this.cleanup(inEvent.pointerId);
    }
  };

  scope.msEvents = msEvents;
})(window.PolymerGestures);

(function(scope) {
  var dispatcher = scope.dispatcher;
  var pointermap = dispatcher.pointermap;
  var pointerEvents = {
    events: [
      'pointerdown',
      'pointermove',
      'pointerup',
      'pointercancel'
    ],
    prepareEvent: function(inEvent) {
      var e = dispatcher.cloneEvent(inEvent);
      e._source = 'pointer';
      return e;
    },
    register: function(target) {
      dispatcher.listen(target, this.events);
    },
    unregister: function(target) {
      if (target.nodeType === Node.DOCUMENT_NODE) {
        return;
      }
      dispatcher.unlisten(target, this.events);
    },
    cleanup: function(id) {
      pointermap['delete'](id);
    },
    pointerdown: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      e.target = scope.findTarget(inEvent);
      pointermap.set(e.pointerId, e.target);
      dispatcher.down(e);
    },
    pointermove: function(inEvent) {
      var target = pointermap.get(inEvent.pointerId);
      if (target) {
        var e = this.prepareEvent(inEvent);
        e.target = target;
        dispatcher.move(e);
      }
    },
    pointerup: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      e.relatedTarget = scope.findTarget(inEvent);
      e.target = pointermap.get(e.pointerId);
      dispatcher.up(e);
      this.cleanup(inEvent.pointerId);
    },
    pointercancel: function(inEvent) {
      var e = this.prepareEvent(inEvent);
      e.relatedTarget = scope.findTarget(inEvent);
      e.target = pointermap.get(e.pointerId);
      dispatcher.cancel(e);
      this.cleanup(inEvent.pointerId);
    }
  };

  scope.pointerEvents = pointerEvents;
})(window.PolymerGestures);

/**
 * This module contains the handlers for native platform events.
 * From here, the dispatcher is called to create unified pointer events.
 * Included are touch events (v1), mouse events, and MSPointerEvents.
 */
(function(scope) {

  var dispatcher = scope.dispatcher;
  var nav = window.navigator;

  if (window.PointerEvent) {
    dispatcher.registerSource('pointer', scope.pointerEvents);
  } else if (nav.msPointerEnabled) {
    dispatcher.registerSource('ms', scope.msEvents);
  } else {
    dispatcher.registerSource('mouse', scope.mouseEvents);
    if (window.ontouchstart !== undefined) {
      dispatcher.registerSource('touch', scope.touchEvents);
    }
  }

  // Work around iOS bugs https://bugs.webkit.org/show_bug.cgi?id=135628 and https://bugs.webkit.org/show_bug.cgi?id=136506
  var ua = navigator.userAgent;
  var IS_IOS = ua.match(/iPad|iPhone|iPod/) && 'ontouchstart' in window;

  dispatcher.IS_IOS = IS_IOS;
  scope.touchEvents.IS_IOS = IS_IOS;

  dispatcher.register(document, true);
})(window.PolymerGestures);

/**
 * This event denotes the beginning of a series of tracking events.
 *
 * @module PointerGestures
 * @submodule Events
 * @class trackstart
 */
/**
 * Pixels moved in the x direction since trackstart.
 * @type Number
 * @property dx
 */
/**
 * Pixes moved in the y direction since trackstart.
 * @type Number
 * @property dy
 */
/**
 * Pixels moved in the x direction since the last track.
 * @type Number
 * @property ddx
 */
/**
 * Pixles moved in the y direction since the last track.
 * @type Number
 * @property ddy
 */
/**
 * The clientX position of the track gesture.
 * @type Number
 * @property clientX
 */
/**
 * The clientY position of the track gesture.
 * @type Number
 * @property clientY
 */
/**
 * The pageX position of the track gesture.
 * @type Number
 * @property pageX
 */
/**
 * The pageY position of the track gesture.
 * @type Number
 * @property pageY
 */
/**
 * The screenX position of the track gesture.
 * @type Number
 * @property screenX
 */
/**
 * The screenY position of the track gesture.
 * @type Number
 * @property screenY
 */
/**
 * The last x axis direction of the pointer.
 * @type Number
 * @property xDirection
 */
/**
 * The last y axis direction of the pointer.
 * @type Number
 * @property yDirection
 */
/**
 * A shared object between all tracking events.
 * @type Object
 * @property trackInfo
 */
/**
 * The element currently under the pointer.
 * @type Element
 * @property relatedTarget
 */
/**
 * The type of pointer that make the track gesture.
 * @type String
 * @property pointerType
 */
/**
 *
 * This event fires for all pointer movement being tracked.
 *
 * @class track
 * @extends trackstart
 */
/**
 * This event fires when the pointer is no longer being tracked.
 *
 * @class trackend
 * @extends trackstart
 */

 (function(scope) {
   var dispatcher = scope.dispatcher;
   var eventFactory = scope.eventFactory;
   var pointermap = new scope.PointerMap();
   var track = {
     events: [
       'down',
       'move',
       'up',
     ],
     exposes: [
      'trackstart',
      'track',
      'trackx',
      'tracky',
      'trackend'
     ],
     defaultActions: {
       'track': 'none',
       'trackx': 'pan-y',
       'tracky': 'pan-x'
     },
     WIGGLE_THRESHOLD: 4,
     clampDir: function(inDelta) {
       return inDelta > 0 ? 1 : -1;
     },
     calcPositionDelta: function(inA, inB) {
       var x = 0, y = 0;
       if (inA && inB) {
         x = inB.pageX - inA.pageX;
         y = inB.pageY - inA.pageY;
       }
       return {x: x, y: y};
     },
     fireTrack: function(inType, inEvent, inTrackingData) {
       var t = inTrackingData;
       var d = this.calcPositionDelta(t.downEvent, inEvent);
       var dd = this.calcPositionDelta(t.lastMoveEvent, inEvent);
       if (dd.x) {
         t.xDirection = this.clampDir(dd.x);
       } else if (inType === 'trackx') {
         return;
       }
       if (dd.y) {
         t.yDirection = this.clampDir(dd.y);
       } else if (inType === 'tracky') {
         return;
       }
       var gestureProto = {
         bubbles: true,
         cancelable: true,
         trackInfo: t.trackInfo,
         relatedTarget: inEvent.relatedTarget,
         pointerType: inEvent.pointerType,
         pointerId: inEvent.pointerId,
         _source: 'track'
       };
       if (inType !== 'tracky') {
         gestureProto.x = inEvent.x;
         gestureProto.dx = d.x;
         gestureProto.ddx = dd.x;
         gestureProto.clientX = inEvent.clientX;
         gestureProto.pageX = inEvent.pageX;
         gestureProto.screenX = inEvent.screenX;
         gestureProto.xDirection = t.xDirection;
       }
       if (inType !== 'trackx') {
         gestureProto.dy = d.y;
         gestureProto.ddy = dd.y;
         gestureProto.y = inEvent.y;
         gestureProto.clientY = inEvent.clientY;
         gestureProto.pageY = inEvent.pageY;
         gestureProto.screenY = inEvent.screenY;
         gestureProto.yDirection = t.yDirection;
       }
       var e = eventFactory.makeGestureEvent(inType, gestureProto);
       t.downTarget.dispatchEvent(e);
     },
     down: function(inEvent) {
       if (inEvent.isPrimary && (inEvent.pointerType === 'mouse' ? inEvent.buttons === 1 : true)) {
         var p = {
           downEvent: inEvent,
           downTarget: inEvent.target,
           trackInfo: {},
           lastMoveEvent: null,
           xDirection: 0,
           yDirection: 0,
           tracking: false
         };
         pointermap.set(inEvent.pointerId, p);
       }
     },
     move: function(inEvent) {
       var p = pointermap.get(inEvent.pointerId);
       if (p) {
         if (!p.tracking) {
           var d = this.calcPositionDelta(p.downEvent, inEvent);
           var move = d.x * d.x + d.y * d.y;
           // start tracking only if finger moves more than WIGGLE_THRESHOLD
           if (move > this.WIGGLE_THRESHOLD) {
             p.tracking = true;
             p.lastMoveEvent = p.downEvent;
             this.fireTrack('trackstart', inEvent, p);
           }
         }
         if (p.tracking) {
           this.fireTrack('track', inEvent, p);
           this.fireTrack('trackx', inEvent, p);
           this.fireTrack('tracky', inEvent, p);
         }
         p.lastMoveEvent = inEvent;
       }
     },
     up: function(inEvent) {
       var p = pointermap.get(inEvent.pointerId);
       if (p) {
         if (p.tracking) {
           this.fireTrack('trackend', inEvent, p);
         }
         pointermap.delete(inEvent.pointerId);
       }
     }
   };
   dispatcher.registerGesture('track', track);
 })(window.PolymerGestures);

/**
 * This event is fired when a pointer is held down for 200ms.
 *
 * @module PointerGestures
 * @submodule Events
 * @class hold
 */
/**
 * Type of pointer that made the holding event.
 * @type String
 * @property pointerType
 */
/**
 * Screen X axis position of the held pointer
 * @type Number
 * @property clientX
 */
/**
 * Screen Y axis position of the held pointer
 * @type Number
 * @property clientY
 */
/**
 * Type of pointer that made the holding event.
 * @type String
 * @property pointerType
 */
/**
 * This event is fired every 200ms while a pointer is held down.
 *
 * @class holdpulse
 * @extends hold
 */
/**
 * Milliseconds pointer has been held down.
 * @type Number
 * @property holdTime
 */
/**
 * This event is fired when a held pointer is released or moved.
 *
 * @class release
 */

(function(scope) {
  var dispatcher = scope.dispatcher;
  var eventFactory = scope.eventFactory;
  var hold = {
    // wait at least HOLD_DELAY ms between hold and pulse events
    HOLD_DELAY: 200,
    // pointer can move WIGGLE_THRESHOLD pixels before not counting as a hold
    WIGGLE_THRESHOLD: 16,
    events: [
      'down',
      'move',
      'up',
    ],
    exposes: [
      'hold',
      'holdpulse',
      'release'
    ],
    heldPointer: null,
    holdJob: null,
    pulse: function() {
      var hold = Date.now() - this.heldPointer.timeStamp;
      var type = this.held ? 'holdpulse' : 'hold';
      this.fireHold(type, hold);
      this.held = true;
    },
    cancel: function() {
      clearInterval(this.holdJob);
      if (this.held) {
        this.fireHold('release');
      }
      this.held = false;
      this.heldPointer = null;
      this.target = null;
      this.holdJob = null;
    },
    down: function(inEvent) {
      if (inEvent.isPrimary && !this.heldPointer) {
        this.heldPointer = inEvent;
        this.target = inEvent.target;
        this.holdJob = setInterval(this.pulse.bind(this), this.HOLD_DELAY);
      }
    },
    up: function(inEvent) {
      if (this.heldPointer && this.heldPointer.pointerId === inEvent.pointerId) {
        this.cancel();
      }
    },
    move: function(inEvent) {
      if (this.heldPointer && this.heldPointer.pointerId === inEvent.pointerId) {
        var x = inEvent.clientX - this.heldPointer.clientX;
        var y = inEvent.clientY - this.heldPointer.clientY;
        if ((x * x + y * y) > this.WIGGLE_THRESHOLD) {
          this.cancel();
        }
      }
    },
    fireHold: function(inType, inHoldTime) {
      var p = {
        bubbles: true,
        cancelable: true,
        pointerType: this.heldPointer.pointerType,
        pointerId: this.heldPointer.pointerId,
        x: this.heldPointer.clientX,
        y: this.heldPointer.clientY,
        _source: 'hold'
      };
      if (inHoldTime) {
        p.holdTime = inHoldTime;
      }
      var e = eventFactory.makeGestureEvent(inType, p);
      this.target.dispatchEvent(e);
    }
  };
  dispatcher.registerGesture('hold', hold);
})(window.PolymerGestures);

/**
 * This event is fired when a pointer quickly goes down and up, and is used to
 * denote activation.
 *
 * Any gesture event can prevent the tap event from being created by calling
 * `event.preventTap`.
 *
 * Any pointer event can prevent the tap by setting the `tapPrevented` property
 * on itself.
 *
 * @module PointerGestures
 * @submodule Events
 * @class tap
 */
/**
 * X axis position of the tap.
 * @property x
 * @type Number
 */
/**
 * Y axis position of the tap.
 * @property y
 * @type Number
 */
/**
 * Type of the pointer that made the tap.
 * @property pointerType
 * @type String
 */
(function(scope) {
  var dispatcher = scope.dispatcher;
  var eventFactory = scope.eventFactory;
  var pointermap = new scope.PointerMap();
  var tap = {
    events: [
      'down',
      'up'
    ],
    exposes: [
      'tap'
    ],
    down: function(inEvent) {
      if (inEvent.isPrimary && !inEvent.tapPrevented) {
        pointermap.set(inEvent.pointerId, {
          target: inEvent.target,
          buttons: inEvent.buttons,
          x: inEvent.clientX,
          y: inEvent.clientY
        });
      }
    },
    shouldTap: function(e, downState) {
      var tap = true;
      if (e.pointerType === 'mouse') {
        // only allow left click to tap for mouse
        tap = (e.buttons ^ 1) && (downState.buttons & 1);
      }
      return tap && !e.tapPrevented;
    },
    up: function(inEvent) {
      var start = pointermap.get(inEvent.pointerId);
      if (start && this.shouldTap(inEvent, start)) {
        // up.relatedTarget is target currently under finger
        var t = scope.targetFinding.LCA(start.target, inEvent.relatedTarget);
        if (t) {
          var e = eventFactory.makeGestureEvent('tap', {
            bubbles: true,
            cancelable: true,
            x: inEvent.clientX,
            y: inEvent.clientY,
            detail: inEvent.detail,
            pointerType: inEvent.pointerType,
            pointerId: inEvent.pointerId,
            altKey: inEvent.altKey,
            ctrlKey: inEvent.ctrlKey,
            metaKey: inEvent.metaKey,
            shiftKey: inEvent.shiftKey,
            _source: 'tap'
          });
          t.dispatchEvent(e);
        }
      }
      pointermap.delete(inEvent.pointerId);
    }
  };
  // patch eventFactory to remove id from tap's pointermap for preventTap calls
  eventFactory.preventTap = function(e) {
    return function() {
      e.tapPrevented = true;
      pointermap.delete(e.pointerId);
    };
  };
  dispatcher.registerGesture('tap', tap);
})(window.PolymerGestures);

/*
 * Basic strategy: find the farthest apart points, use as diameter of circle
 * react to size change and rotation of the chord
 */

/**
 * @module pointer-gestures
 * @submodule Events
 * @class pinch
 */
/**
 * Scale of the pinch zoom gesture
 * @property scale
 * @type Number
 */
/**
 * Center X position of pointers causing pinch
 * @property centerX
 * @type Number
 */
/**
 * Center Y position of pointers causing pinch
 * @property centerY
 * @type Number
 */

/**
 * @module pointer-gestures
 * @submodule Events
 * @class rotate
 */
/**
 * Angle (in degrees) of rotation. Measured from starting positions of pointers.
 * @property angle
 * @type Number
 */
/**
 * Center X position of pointers causing rotation
 * @property centerX
 * @type Number
 */
/**
 * Center Y position of pointers causing rotation
 * @property centerY
 * @type Number
 */
(function(scope) {
  var dispatcher = scope.dispatcher;
  var eventFactory = scope.eventFactory;
  var pointermap = new scope.PointerMap();
  var RAD_TO_DEG = 180 / Math.PI;
  var pinch = {
    events: [
      'down',
      'up',
      'move',
      'cancel'
    ],
    exposes: [
      'pinchstart',
      'pinch',
      'pinchend',
      'rotate'
    ],
    defaultActions: {
      'pinch': 'none',
      'rotate': 'none'
    },
    reference: {},
    down: function(inEvent) {
      pointermap.set(inEvent.pointerId, inEvent);
      if (pointermap.pointers() == 2) {
        var points = this.calcChord();
        var angle = this.calcAngle(points);
        this.reference = {
          angle: angle,
          diameter: points.diameter,
          target: scope.targetFinding.LCA(points.a.target, points.b.target)
        };

        this.firePinch('pinchstart', points.diameter, points);
      }
    },
    up: function(inEvent) {
      var p = pointermap.get(inEvent.pointerId);
      var num = pointermap.pointers();
      if (p) {
        if (num === 2) {
          // fire 'pinchend' before deleting pointer
          var points = this.calcChord();
          this.firePinch('pinchend', points.diameter, points);
        }
        pointermap.delete(inEvent.pointerId);
      }
    },
    move: function(inEvent) {
      if (pointermap.has(inEvent.pointerId)) {
        pointermap.set(inEvent.pointerId, inEvent);
        if (pointermap.pointers() > 1) {
          this.calcPinchRotate();
        }
      }
    },
    cancel: function(inEvent) {
        this.up(inEvent);
    },
    firePinch: function(type, diameter, points) {
      var zoom = diameter / this.reference.diameter;
      var e = eventFactory.makeGestureEvent(type, {
        bubbles: true,
        cancelable: true,
        scale: zoom,
        centerX: points.center.x,
        centerY: points.center.y,
        _source: 'pinch'
      });
      this.reference.target.dispatchEvent(e);
    },
    fireRotate: function(angle, points) {
      var diff = Math.round((angle - this.reference.angle) % 360);
      var e = eventFactory.makeGestureEvent('rotate', {
        bubbles: true,
        cancelable: true,
        angle: diff,
        centerX: points.center.x,
        centerY: points.center.y,
        _source: 'pinch'
      });
      this.reference.target.dispatchEvent(e);
    },
    calcPinchRotate: function() {
      var points = this.calcChord();
      var diameter = points.diameter;
      var angle = this.calcAngle(points);
      if (diameter != this.reference.diameter) {
        this.firePinch('pinch', diameter, points);
      }
      if (angle != this.reference.angle) {
        this.fireRotate(angle, points);
      }
    },
    calcChord: function() {
      var pointers = [];
      pointermap.forEach(function(p) {
        pointers.push(p);
      });
      var dist = 0;
      // start with at least two pointers
      var points = {a: pointers[0], b: pointers[1]};
      var x, y, d;
      for (var i = 0; i < pointers.length; i++) {
        var a = pointers[i];
        for (var j = i + 1; j < pointers.length; j++) {
          var b = pointers[j];
          x = Math.abs(a.clientX - b.clientX);
          y = Math.abs(a.clientY - b.clientY);
          d = x + y;
          if (d > dist) {
            dist = d;
            points = {a: a, b: b};
          }
        }
      }
      x = Math.abs(points.a.clientX + points.b.clientX) / 2;
      y = Math.abs(points.a.clientY + points.b.clientY) / 2;
      points.center = { x: x, y: y };
      points.diameter = dist;
      return points;
    },
    calcAngle: function(points) {
      var x = points.a.clientX - points.b.clientX;
      var y = points.a.clientY - points.b.clientY;
      return (360 + Math.atan2(y, x) * RAD_TO_DEG) % 360;
    }
  };
  dispatcher.registerGesture('pinch', pinch);
})(window.PolymerGestures);

(function (global) {
    'use strict';

    var Token,
        TokenName,
        Syntax,
        Messages,
        source,
        index,
        length,
        delegate,
        lookahead,
        state;

    Token = {
        BooleanLiteral: 1,
        EOF: 2,
        Identifier: 3,
        Keyword: 4,
        NullLiteral: 5,
        NumericLiteral: 6,
        Punctuator: 7,
        StringLiteral: 8
    };

    TokenName = {};
    TokenName[Token.BooleanLiteral] = 'Boolean';
    TokenName[Token.EOF] = '<end>';
    TokenName[Token.Identifier] = 'Identifier';
    TokenName[Token.Keyword] = 'Keyword';
    TokenName[Token.NullLiteral] = 'Null';
    TokenName[Token.NumericLiteral] = 'Numeric';
    TokenName[Token.Punctuator] = 'Punctuator';
    TokenName[Token.StringLiteral] = 'String';

    Syntax = {
        ArrayExpression: 'ArrayExpression',
        BinaryExpression: 'BinaryExpression',
        CallExpression: 'CallExpression',
        ConditionalExpression: 'ConditionalExpression',
        EmptyStatement: 'EmptyStatement',
        ExpressionStatement: 'ExpressionStatement',
        Identifier: 'Identifier',
        Literal: 'Literal',
        LabeledStatement: 'LabeledStatement',
        LogicalExpression: 'LogicalExpression',
        MemberExpression: 'MemberExpression',
        ObjectExpression: 'ObjectExpression',
        Program: 'Program',
        Property: 'Property',
        ThisExpression: 'ThisExpression',
        UnaryExpression: 'UnaryExpression'
    };

    // Error messages should be identical to V8.
    Messages = {
        UnexpectedToken:  'Unexpected token %0',
        UnknownLabel: 'Undefined label \'%0\'',
        Redeclaration: '%0 \'%1\' has already been declared'
    };

    // Ensure the condition is true, otherwise throw an error.
    // This is only to have a better contract semantic, i.e. another safety net
    // to catch a logic error. The condition shall be fulfilled in normal case.
    // Do NOT use this to enforce a certain condition on any user input.

    function assert(condition, message) {
        if (!condition) {
            throw new Error('ASSERT: ' + message);
        }
    }

    function isDecimalDigit(ch) {
        return (ch >= 48 && ch <= 57);   // 0..9
    }


    // 7.2 White Space

    function isWhiteSpace(ch) {
        return (ch === 32) ||  // space
            (ch === 9) ||      // tab
            (ch === 0xB) ||
            (ch === 0xC) ||
            (ch === 0xA0) ||
            (ch >= 0x1680 && '\u1680\u180E\u2000\u2001\u2002\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\uFEFF'.indexOf(String.fromCharCode(ch)) > 0);
    }

    // 7.3 Line Terminators

    function isLineTerminator(ch) {
        return (ch === 10) || (ch === 13) || (ch === 0x2028) || (ch === 0x2029);
    }

    // 7.6 Identifier Names and Identifiers

    function isIdentifierStart(ch) {
        return (ch === 36) || (ch === 95) ||  // $ (dollar) and _ (underscore)
            (ch >= 65 && ch <= 90) ||         // A..Z
            (ch >= 97 && ch <= 122);          // a..z
    }

    function isIdentifierPart(ch) {
        return (ch === 36) || (ch === 95) ||  // $ (dollar) and _ (underscore)
            (ch >= 65 && ch <= 90) ||         // A..Z
            (ch >= 97 && ch <= 122) ||        // a..z
            (ch >= 48 && ch <= 57);           // 0..9
    }

    // 7.6.1.1 Keywords

    function isKeyword(id) {
        return (id === 'this')
    }

    // 7.4 Comments

    function skipWhitespace() {
        while (index < length && isWhiteSpace(source.charCodeAt(index))) {
           ++index;
        }
    }

    function getIdentifier() {
        var start, ch;

        start = index++;
        while (index < length) {
            ch = source.charCodeAt(index);
            if (isIdentifierPart(ch)) {
                ++index;
            } else {
                break;
            }
        }

        return source.slice(start, index);
    }

    function scanIdentifier() {
        var start, id, type;

        start = index;

        id = getIdentifier();

        // There is no keyword or literal with only one character.
        // Thus, it must be an identifier.
        if (id.length === 1) {
            type = Token.Identifier;
        } else if (isKeyword(id)) {
            type = Token.Keyword;
        } else if (id === 'null') {
            type = Token.NullLiteral;
        } else if (id === 'true' || id === 'false') {
            type = Token.BooleanLiteral;
        } else {
            type = Token.Identifier;
        }

        return {
            type: type,
            value: id,
            range: [start, index]
        };
    }


    // 7.7 Punctuators

    function scanPunctuator() {
        var start = index,
            code = source.charCodeAt(index),
            code2,
            ch1 = source[index],
            ch2;

        switch (code) {

        // Check for most common single-character punctuators.
        case 46:   // . dot
        case 40:   // ( open bracket
        case 41:   // ) close bracket
        case 59:   // ; semicolon
        case 44:   // , comma
        case 123:  // { open curly brace
        case 125:  // } close curly brace
        case 91:   // [
        case 93:   // ]
        case 58:   // :
        case 63:   // ?
            ++index;
            return {
                type: Token.Punctuator,
                value: String.fromCharCode(code),
                range: [start, index]
            };

        default:
            code2 = source.charCodeAt(index + 1);

            // '=' (char #61) marks an assignment or comparison operator.
            if (code2 === 61) {
                switch (code) {
                case 37:  // %
                case 38:  // &
                case 42:  // *:
                case 43:  // +
                case 45:  // -
                case 47:  // /
                case 60:  // <
                case 62:  // >
                case 124: // |
                    index += 2;
                    return {
                        type: Token.Punctuator,
                        value: String.fromCharCode(code) + String.fromCharCode(code2),
                        range: [start, index]
                    };

                case 33: // !
                case 61: // =
                    index += 2;

                    // !== and ===
                    if (source.charCodeAt(index) === 61) {
                        ++index;
                    }
                    return {
                        type: Token.Punctuator,
                        value: source.slice(start, index),
                        range: [start, index]
                    };
                default:
                    break;
                }
            }
            break;
        }

        // Peek more characters.

        ch2 = source[index + 1];

        // Other 2-character punctuators: && ||

        if (ch1 === ch2 && ('&|'.indexOf(ch1) >= 0)) {
            index += 2;
            return {
                type: Token.Punctuator,
                value: ch1 + ch2,
                range: [start, index]
            };
        }

        if ('<>=!+-*%&|^/'.indexOf(ch1) >= 0) {
            ++index;
            return {
                type: Token.Punctuator,
                value: ch1,
                range: [start, index]
            };
        }

        throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
    }

    // 7.8.3 Numeric Literals
    function scanNumericLiteral() {
        var number, start, ch;

        ch = source[index];
        assert(isDecimalDigit(ch.charCodeAt(0)) || (ch === '.'),
            'Numeric literal must start with a decimal digit or a decimal point');

        start = index;
        number = '';
        if (ch !== '.') {
            number = source[index++];
            ch = source[index];

            // Hex number starts with '0x'.
            // Octal number starts with '0'.
            if (number === '0') {
                // decimal number starts with '0' such as '09' is illegal.
                if (ch && isDecimalDigit(ch.charCodeAt(0))) {
                    throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
                }
            }

            while (isDecimalDigit(source.charCodeAt(index))) {
                number += source[index++];
            }
            ch = source[index];
        }

        if (ch === '.') {
            number += source[index++];
            while (isDecimalDigit(source.charCodeAt(index))) {
                number += source[index++];
            }
            ch = source[index];
        }

        if (ch === 'e' || ch === 'E') {
            number += source[index++];

            ch = source[index];
            if (ch === '+' || ch === '-') {
                number += source[index++];
            }
            if (isDecimalDigit(source.charCodeAt(index))) {
                while (isDecimalDigit(source.charCodeAt(index))) {
                    number += source[index++];
                }
            } else {
                throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
            }
        }

        if (isIdentifierStart(source.charCodeAt(index))) {
            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
        }

        return {
            type: Token.NumericLiteral,
            value: parseFloat(number),
            range: [start, index]
        };
    }

    // 7.8.4 String Literals

    function scanStringLiteral() {
        var str = '', quote, start, ch, octal = false;

        quote = source[index];
        assert((quote === '\'' || quote === '"'),
            'String literal must starts with a quote');

        start = index;
        ++index;

        while (index < length) {
            ch = source[index++];

            if (ch === quote) {
                quote = '';
                break;
            } else if (ch === '\\') {
                ch = source[index++];
                if (!ch || !isLineTerminator(ch.charCodeAt(0))) {
                    switch (ch) {
                    case 'n':
                        str += '\n';
                        break;
                    case 'r':
                        str += '\r';
                        break;
                    case 't':
                        str += '\t';
                        break;
                    case 'b':
                        str += '\b';
                        break;
                    case 'f':
                        str += '\f';
                        break;
                    case 'v':
                        str += '\x0B';
                        break;

                    default:
                        str += ch;
                        break;
                    }
                } else {
                    if (ch ===  '\r' && source[index] === '\n') {
                        ++index;
                    }
                }
            } else if (isLineTerminator(ch.charCodeAt(0))) {
                break;
            } else {
                str += ch;
            }
        }

        if (quote !== '') {
            throwError({}, Messages.UnexpectedToken, 'ILLEGAL');
        }

        return {
            type: Token.StringLiteral,
            value: str,
            octal: octal,
            range: [start, index]
        };
    }

    function isIdentifierName(token) {
        return token.type === Token.Identifier ||
            token.type === Token.Keyword ||
            token.type === Token.BooleanLiteral ||
            token.type === Token.NullLiteral;
    }

    function advance() {
        var ch;

        skipWhitespace();

        if (index >= length) {
            return {
                type: Token.EOF,
                range: [index, index]
            };
        }

        ch = source.charCodeAt(index);

        // Very common: ( and ) and ;
        if (ch === 40 || ch === 41 || ch === 58) {
            return scanPunctuator();
        }

        // String literal starts with single quote (#39) or double quote (#34).
        if (ch === 39 || ch === 34) {
            return scanStringLiteral();
        }

        if (isIdentifierStart(ch)) {
            return scanIdentifier();
        }

        // Dot (.) char #46 can also start a floating-point number, hence the need
        // to check the next character.
        if (ch === 46) {
            if (isDecimalDigit(source.charCodeAt(index + 1))) {
                return scanNumericLiteral();
            }
            return scanPunctuator();
        }

        if (isDecimalDigit(ch)) {
            return scanNumericLiteral();
        }

        return scanPunctuator();
    }

    function lex() {
        var token;

        token = lookahead;
        index = token.range[1];

        lookahead = advance();

        index = token.range[1];

        return token;
    }

    function peek() {
        var pos;

        pos = index;
        lookahead = advance();
        index = pos;
    }

    // Throw an exception

    function throwError(token, messageFormat) {
        var error,
            args = Array.prototype.slice.call(arguments, 2),
            msg = messageFormat.replace(
                /%(\d)/g,
                function (whole, index) {
                    assert(index < args.length, 'Message reference must be in range');
                    return args[index];
                }
            );

        error = new Error(msg);
        error.index = index;
        error.description = msg;
        throw error;
    }

    // Throw an exception because of the token.

    function throwUnexpected(token) {
        throwError(token, Messages.UnexpectedToken, token.value);
    }

    // Expect the next token to match the specified punctuator.
    // If not, an exception will be thrown.

    function expect(value) {
        var token = lex();
        if (token.type !== Token.Punctuator || token.value !== value) {
            throwUnexpected(token);
        }
    }

    // Return true if the next token matches the specified punctuator.

    function match(value) {
        return lookahead.type === Token.Punctuator && lookahead.value === value;
    }

    // Return true if the next token matches the specified keyword

    function matchKeyword(keyword) {
        return lookahead.type === Token.Keyword && lookahead.value === keyword;
    }

    function consumeSemicolon() {
        // Catch the very common case first: immediately a semicolon (char #59).
        if (source.charCodeAt(index) === 59) {
            lex();
            return;
        }

        skipWhitespace();

        if (match(';')) {
            lex();
            return;
        }

        if (lookahead.type !== Token.EOF && !match('}')) {
            throwUnexpected(lookahead);
        }
    }

    // 11.1.4 Array Initialiser

    function parseArrayInitialiser() {
        var elements = [];

        expect('[');

        while (!match(']')) {
            if (match(',')) {
                lex();
                elements.push(null);
            } else {
                elements.push(parseExpression());

                if (!match(']')) {
                    expect(',');
                }
            }
        }

        expect(']');

        return delegate.createArrayExpression(elements);
    }

    // 11.1.5 Object Initialiser

    function parseObjectPropertyKey() {
        var token;

        skipWhitespace();
        token = lex();

        // Note: This function is called only from parseObjectProperty(), where
        // EOF and Punctuator tokens are already filtered out.
        if (token.type === Token.StringLiteral || token.type === Token.NumericLiteral) {
            return delegate.createLiteral(token);
        }

        return delegate.createIdentifier(token.value);
    }

    function parseObjectProperty() {
        var token, key;

        token = lookahead;
        skipWhitespace();

        if (token.type === Token.EOF || token.type === Token.Punctuator) {
            throwUnexpected(token);
        }

        key = parseObjectPropertyKey();
        expect(':');
        return delegate.createProperty('init', key, parseExpression());
    }

    function parseObjectInitialiser() {
        var properties = [];

        expect('{');

        while (!match('}')) {
            properties.push(parseObjectProperty());

            if (!match('}')) {
                expect(',');
            }
        }

        expect('}');

        return delegate.createObjectExpression(properties);
    }

    // 11.1.6 The Grouping Operator

    function parseGroupExpression() {
        var expr;

        expect('(');

        expr = parseExpression();

        expect(')');

        return expr;
    }


    // 11.1 Primary Expressions

    function parsePrimaryExpression() {
        var type, token, expr;

        if (match('(')) {
            return parseGroupExpression();
        }

        type = lookahead.type;

        if (type === Token.Identifier) {
            expr = delegate.createIdentifier(lex().value);
        } else if (type === Token.StringLiteral || type === Token.NumericLiteral) {
            expr = delegate.createLiteral(lex());
        } else if (type === Token.Keyword) {
            if (matchKeyword('this')) {
                lex();
                expr = delegate.createThisExpression();
            }
        } else if (type === Token.BooleanLiteral) {
            token = lex();
            token.value = (token.value === 'true');
            expr = delegate.createLiteral(token);
        } else if (type === Token.NullLiteral) {
            token = lex();
            token.value = null;
            expr = delegate.createLiteral(token);
        } else if (match('[')) {
            expr = parseArrayInitialiser();
        } else if (match('{')) {
            expr = parseObjectInitialiser();
        }

        if (expr) {
            return expr;
        }

        throwUnexpected(lex());
    }

    // 11.2 Left-Hand-Side Expressions

    function parseArguments() {
        var args = [];

        expect('(');

        if (!match(')')) {
            while (index < length) {
                args.push(parseExpression());
                if (match(')')) {
                    break;
                }
                expect(',');
            }
        }

        expect(')');

        return args;
    }

    function parseNonComputedProperty() {
        var token;

        token = lex();

        if (!isIdentifierName(token)) {
            throwUnexpected(token);
        }

        return delegate.createIdentifier(token.value);
    }

    function parseNonComputedMember() {
        expect('.');

        return parseNonComputedProperty();
    }

    function parseComputedMember() {
        var expr;

        expect('[');

        expr = parseExpression();

        expect(']');

        return expr;
    }

    function parseLeftHandSideExpression() {
        var expr, args, property;

        expr = parsePrimaryExpression();

        while (true) {
            if (match('[')) {
                property = parseComputedMember();
                expr = delegate.createMemberExpression('[', expr, property);
            } else if (match('.')) {
                property = parseNonComputedMember();
                expr = delegate.createMemberExpression('.', expr, property);
            } else if (match('(')) {
                args = parseArguments();
                expr = delegate.createCallExpression(expr, args);
            } else {
                break;
            }
        }

        return expr;
    }

    // 11.3 Postfix Expressions

    var parsePostfixExpression = parseLeftHandSideExpression;

    // 11.4 Unary Operators

    function parseUnaryExpression() {
        var token, expr;

        if (lookahead.type !== Token.Punctuator && lookahead.type !== Token.Keyword) {
            expr = parsePostfixExpression();
        } else if (match('+') || match('-') || match('!')) {
            token = lex();
            expr = parseUnaryExpression();
            expr = delegate.createUnaryExpression(token.value, expr);
        } else if (matchKeyword('delete') || matchKeyword('void') || matchKeyword('typeof')) {
            throwError({}, Messages.UnexpectedToken);
        } else {
            expr = parsePostfixExpression();
        }

        return expr;
    }

    function binaryPrecedence(token) {
        var prec = 0;

        if (token.type !== Token.Punctuator && token.type !== Token.Keyword) {
            return 0;
        }

        switch (token.value) {
        case '||':
            prec = 1;
            break;

        case '&&':
            prec = 2;
            break;

        case '==':
        case '!=':
        case '===':
        case '!==':
            prec = 6;
            break;

        case '<':
        case '>':
        case '<=':
        case '>=':
        case 'instanceof':
            prec = 7;
            break;

        case 'in':
            prec = 7;
            break;

        case '+':
        case '-':
            prec = 9;
            break;

        case '*':
        case '/':
        case '%':
            prec = 11;
            break;

        default:
            break;
        }

        return prec;
    }

    // 11.5 Multiplicative Operators
    // 11.6 Additive Operators
    // 11.7 Bitwise Shift Operators
    // 11.8 Relational Operators
    // 11.9 Equality Operators
    // 11.10 Binary Bitwise Operators
    // 11.11 Binary Logical Operators

    function parseBinaryExpression() {
        var expr, token, prec, stack, right, operator, left, i;

        left = parseUnaryExpression();

        token = lookahead;
        prec = binaryPrecedence(token);
        if (prec === 0) {
            return left;
        }
        token.prec = prec;
        lex();

        right = parseUnaryExpression();

        stack = [left, token, right];

        while ((prec = binaryPrecedence(lookahead)) > 0) {

            // Reduce: make a binary expression from the three topmost entries.
            while ((stack.length > 2) && (prec <= stack[stack.length - 2].prec)) {
                right = stack.pop();
                operator = stack.pop().value;
                left = stack.pop();
                expr = delegate.createBinaryExpression(operator, left, right);
                stack.push(expr);
            }

            // Shift.
            token = lex();
            token.prec = prec;
            stack.push(token);
            expr = parseUnaryExpression();
            stack.push(expr);
        }

        // Final reduce to clean-up the stack.
        i = stack.length - 1;
        expr = stack[i];
        while (i > 1) {
            expr = delegate.createBinaryExpression(stack[i - 1].value, stack[i - 2], expr);
            i -= 2;
        }

        return expr;
    }


    // 11.12 Conditional Operator

    function parseConditionalExpression() {
        var expr, consequent, alternate;

        expr = parseBinaryExpression();

        if (match('?')) {
            lex();
            consequent = parseConditionalExpression();
            expect(':');
            alternate = parseConditionalExpression();

            expr = delegate.createConditionalExpression(expr, consequent, alternate);
        }

        return expr;
    }

    // Simplification since we do not support AssignmentExpression.
    var parseExpression = parseConditionalExpression;

    // Polymer Syntax extensions

    // Filter ::
    //   Identifier
    //   Identifier "(" ")"
    //   Identifier "(" FilterArguments ")"

    function parseFilter() {
        var identifier, args;

        identifier = lex();

        if (identifier.type !== Token.Identifier) {
            throwUnexpected(identifier);
        }

        args = match('(') ? parseArguments() : [];

        return delegate.createFilter(identifier.value, args);
    }

    // Filters ::
    //   "|" Filter
    //   Filters "|" Filter

    function parseFilters() {
        while (match('|')) {
            lex();
            parseFilter();
        }
    }

    // TopLevel ::
    //   LabelledExpressions
    //   AsExpression
    //   InExpression
    //   FilterExpression

    // AsExpression ::
    //   FilterExpression as Identifier

    // InExpression ::
    //   Identifier, Identifier in FilterExpression
    //   Identifier in FilterExpression

    // FilterExpression ::
    //   Expression
    //   Expression Filters

    function parseTopLevel() {
        skipWhitespace();
        peek();

        var expr = parseExpression();
        if (expr) {
            if (lookahead.value === ',' || lookahead.value == 'in' &&
                       expr.type === Syntax.Identifier) {
                parseInExpression(expr);
            } else {
                parseFilters();
                if (lookahead.value === 'as') {
                    parseAsExpression(expr);
                } else {
                    delegate.createTopLevel(expr);
                }
            }
        }

        if (lookahead.type !== Token.EOF) {
            throwUnexpected(lookahead);
        }
    }

    function parseAsExpression(expr) {
        lex();  // as
        var identifier = lex().value;
        delegate.createAsExpression(expr, identifier);
    }

    function parseInExpression(identifier) {
        var indexName;
        if (lookahead.value === ',') {
            lex();
            if (lookahead.type !== Token.Identifier)
                throwUnexpected(lookahead);
            indexName = lex().value;
        }

        lex();  // in
        var expr = parseExpression();
        parseFilters();
        delegate.createInExpression(identifier.name, indexName, expr);
    }

    function parse(code, inDelegate) {
        delegate = inDelegate;
        source = code;
        index = 0;
        length = source.length;
        lookahead = null;
        state = {
            labelSet: {}
        };

        return parseTopLevel();
    }

    global.esprima = {
        parse: parse
    };
})(this);

// Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
// This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
// The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
// The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
// Code distributed by Google as part of the polymer project is also
// subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt

(function (global) {
  'use strict';

  function prepareBinding(expressionText, name, node, filterRegistry) {
    var expression;
    try {
      expression = getExpression(expressionText);
      if (expression.scopeIdent &&
          (node.nodeType !== Node.ELEMENT_NODE ||
           node.tagName !== 'TEMPLATE' ||
           (name !== 'bind' && name !== 'repeat'))) {
        throw Error('as and in can only be used within <template bind/repeat>');
      }
    } catch (ex) {
      console.error('Invalid expression syntax: ' + expressionText, ex);
      return;
    }

    return function(model, node, oneTime) {
      var binding = expression.getBinding(model, filterRegistry, oneTime);
      if (expression.scopeIdent && binding) {
        node.polymerExpressionScopeIdent_ = expression.scopeIdent;
        if (expression.indexIdent)
          node.polymerExpressionIndexIdent_ = expression.indexIdent;
      }

      return binding;
    }
  }

  // TODO(rafaelw): Implement simple LRU.
  var expressionParseCache = Object.create(null);

  function getExpression(expressionText) {
    var expression = expressionParseCache[expressionText];
    if (!expression) {
      var delegate = new ASTDelegate();
      esprima.parse(expressionText, delegate);
      expression = new Expression(delegate);
      expressionParseCache[expressionText] = expression;
    }
    return expression;
  }

  function Literal(value) {
    this.value = value;
    this.valueFn_ = undefined;
  }

  Literal.prototype = {
    valueFn: function() {
      if (!this.valueFn_) {
        var value = this.value;
        this.valueFn_ = function() {
          return value;
        }
      }

      return this.valueFn_;
    }
  }

  function IdentPath(name) {
    this.name = name;
    this.path = Path.get(name);
  }

  IdentPath.prototype = {
    valueFn: function() {
      if (!this.valueFn_) {
        var name = this.name;
        var path = this.path;
        this.valueFn_ = function(model, observer) {
          if (observer)
            observer.addPath(model, path);

          return path.getValueFrom(model);
        }
      }

      return this.valueFn_;
    },

    setValue: function(model, newValue) {
      if (this.path.length == 1)
        model = findScope(model, this.path[0]);

      return this.path.setValueFrom(model, newValue);
    }
  };

  function MemberExpression(object, property, accessor) {
    this.computed = accessor == '[';

    this.dynamicDeps = typeof object == 'function' ||
                       object.dynamicDeps ||
                       (this.computed && !(property instanceof Literal));

    this.simplePath =
        !this.dynamicDeps &&
        (property instanceof IdentPath || property instanceof Literal) &&
        (object instanceof MemberExpression || object instanceof IdentPath);

    this.object = this.simplePath ? object : getFn(object);
    this.property = !this.computed || this.simplePath ?
        property : getFn(property);
  }

  MemberExpression.prototype = {
    get fullPath() {
      if (!this.fullPath_) {

        var parts = this.object instanceof MemberExpression ?
            this.object.fullPath.slice() : [this.object.name];
        parts.push(this.property instanceof IdentPath ?
            this.property.name : this.property.value);
        this.fullPath_ = Path.get(parts);
      }

      return this.fullPath_;
    },

    valueFn: function() {
      if (!this.valueFn_) {
        var object = this.object;

        if (this.simplePath) {
          var path = this.fullPath;

          this.valueFn_ = function(model, observer) {
            if (observer)
              observer.addPath(model, path);

            return path.getValueFrom(model);
          };
        } else if (!this.computed) {
          var path = Path.get(this.property.name);

          this.valueFn_ = function(model, observer, filterRegistry) {
            var context = object(model, observer, filterRegistry);

            if (observer)
              observer.addPath(context, path);

            return path.getValueFrom(context);
          }
        } else {
          // Computed property.
          var property = this.property;

          this.valueFn_ = function(model, observer, filterRegistry) {
            var context = object(model, observer, filterRegistry);
            var propName = property(model, observer, filterRegistry);
            if (observer)
              observer.addPath(context, [propName]);

            return context ? context[propName] : undefined;
          };
        }
      }
      return this.valueFn_;
    },

    setValue: function(model, newValue) {
      if (this.simplePath) {
        this.fullPath.setValueFrom(model, newValue);
        return newValue;
      }

      var object = this.object(model);
      var propName = this.property instanceof IdentPath ? this.property.name :
          this.property(model);
      return object[propName] = newValue;
    }
  };

  function Filter(name, args) {
    this.name = name;
    this.args = [];
    for (var i = 0; i < args.length; i++) {
      this.args[i] = getFn(args[i]);
    }
  }

  Filter.prototype = {
    transform: function(model, observer, filterRegistry, toModelDirection,
                        initialArgs) {
      var context = model;
      var fn = context[this.name];

      if (!fn) {
        fn = filterRegistry[this.name];
        if (!fn) {
          console.error('Cannot find function or filter: ' + this.name);
          return;
        }
      }

      // If toModelDirection is falsey, then the "normal" (dom-bound) direction
      // is used. Otherwise, it looks for a 'toModel' property function on the
      // object.
      if (toModelDirection) {
        fn = fn.toModel;
      } else if (typeof fn.toDOM == 'function') {
        fn = fn.toDOM;
      }

      if (typeof fn != 'function') {
        console.error('Cannot find function or filter: ' + this.name);
        return;
      }

      var args = initialArgs || [];
      for (var i = 0; i < this.args.length; i++) {
        args.push(getFn(this.args[i])(model, observer, filterRegistry));
      }

      return fn.apply(context, args);
    }
  };

  function notImplemented() { throw Error('Not Implemented'); }

  var unaryOperators = {
    '+': function(v) { return +v; },
    '-': function(v) { return -v; },
    '!': function(v) { return !v; }
  };

  var binaryOperators = {
    '+': function(l, r) { return l+r; },
    '-': function(l, r) { return l-r; },
    '*': function(l, r) { return l*r; },
    '/': function(l, r) { return l/r; },
    '%': function(l, r) { return l%r; },
    '<': function(l, r) { return l<r; },
    '>': function(l, r) { return l>r; },
    '<=': function(l, r) { return l<=r; },
    '>=': function(l, r) { return l>=r; },
    '==': function(l, r) { return l==r; },
    '!=': function(l, r) { return l!=r; },
    '===': function(l, r) { return l===r; },
    '!==': function(l, r) { return l!==r; },
    '&&': function(l, r) { return l&&r; },
    '||': function(l, r) { return l||r; },
  };

  function getFn(arg) {
    return typeof arg == 'function' ? arg : arg.valueFn();
  }

  function ASTDelegate() {
    this.expression = null;
    this.filters = [];
    this.deps = {};
    this.currentPath = undefined;
    this.scopeIdent = undefined;
    this.indexIdent = undefined;
    this.dynamicDeps = false;
  }

  ASTDelegate.prototype = {
    createUnaryExpression: function(op, argument) {
      if (!unaryOperators[op])
        throw Error('Disallowed operator: ' + op);

      argument = getFn(argument);

      return function(model, observer, filterRegistry) {
        return unaryOperators[op](argument(model, observer, filterRegistry));
      };
    },

    createBinaryExpression: function(op, left, right) {
      if (!binaryOperators[op])
        throw Error('Disallowed operator: ' + op);

      left = getFn(left);
      right = getFn(right);

      switch (op) {
        case '||':
          this.dynamicDeps = true;
          return function(model, observer, filterRegistry) {
            return left(model, observer, filterRegistry) ||
                right(model, observer, filterRegistry);
          };
        case '&&':
          this.dynamicDeps = true;
          return function(model, observer, filterRegistry) {
            return left(model, observer, filterRegistry) &&
                right(model, observer, filterRegistry);
          };
      }

      return function(model, observer, filterRegistry) {
        return binaryOperators[op](left(model, observer, filterRegistry),
                                   right(model, observer, filterRegistry));
      };
    },

    createConditionalExpression: function(test, consequent, alternate) {
      test = getFn(test);
      consequent = getFn(consequent);
      alternate = getFn(alternate);

      this.dynamicDeps = true;

      return function(model, observer, filterRegistry) {
        return test(model, observer, filterRegistry) ?
            consequent(model, observer, filterRegistry) :
            alternate(model, observer, filterRegistry);
      }
    },

    createIdentifier: function(name) {
      var ident = new IdentPath(name);
      ident.type = 'Identifier';
      return ident;
    },

    createMemberExpression: function(accessor, object, property) {
      var ex = new MemberExpression(object, property, accessor);
      if (ex.dynamicDeps)
        this.dynamicDeps = true;
      return ex;
    },

    createCallExpression: function(expression, args) {
      if (!(expression instanceof IdentPath))
        throw Error('Only identifier function invocations are allowed');

      var filter = new Filter(expression.name, args);

      return function(model, observer, filterRegistry) {
        return filter.transform(model, observer, filterRegistry, false);
      };
    },

    createLiteral: function(token) {
      return new Literal(token.value);
    },

    createArrayExpression: function(elements) {
      for (var i = 0; i < elements.length; i++)
        elements[i] = getFn(elements[i]);

      return function(model, observer, filterRegistry) {
        var arr = []
        for (var i = 0; i < elements.length; i++)
          arr.push(elements[i](model, observer, filterRegistry));
        return arr;
      }
    },

    createProperty: function(kind, key, value) {
      return {
        key: key instanceof IdentPath ? key.name : key.value,
        value: value
      };
    },

    createObjectExpression: function(properties) {
      for (var i = 0; i < properties.length; i++)
        properties[i].value = getFn(properties[i].value);

      return function(model, observer, filterRegistry) {
        var obj = {};
        for (var i = 0; i < properties.length; i++)
          obj[properties[i].key] =
              properties[i].value(model, observer, filterRegistry);
        return obj;
      }
    },

    createFilter: function(name, args) {
      this.filters.push(new Filter(name, args));
    },

    createAsExpression: function(expression, scopeIdent) {
      this.expression = expression;
      this.scopeIdent = scopeIdent;
    },

    createInExpression: function(scopeIdent, indexIdent, expression) {
      this.expression = expression;
      this.scopeIdent = scopeIdent;
      this.indexIdent = indexIdent;
    },

    createTopLevel: function(expression) {
      this.expression = expression;
    },

    createThisExpression: notImplemented
  }

  function ConstantObservable(value) {
    this.value_ = value;
  }

  ConstantObservable.prototype = {
    open: function() { return this.value_; },
    discardChanges: function() { return this.value_; },
    deliver: function() {},
    close: function() {},
  }

  function Expression(delegate) {
    this.scopeIdent = delegate.scopeIdent;
    this.indexIdent = delegate.indexIdent;

    if (!delegate.expression)
      throw Error('No expression found.');

    this.expression = delegate.expression;
    getFn(this.expression); // forces enumeration of path dependencies

    this.filters = delegate.filters;
    this.dynamicDeps = delegate.dynamicDeps;
  }

  Expression.prototype = {
    getBinding: function(model, filterRegistry, oneTime) {
      if (oneTime)
        return this.getValue(model, undefined, filterRegistry);

      var observer = new CompoundObserver();
      // captures deps.
      var firstValue = this.getValue(model, observer, filterRegistry);
      var firstTime = true;
      var self = this;

      function valueFn() {
        // deps cannot have changed on first value retrieval.
        if (firstTime) {
          firstTime = false;
          return firstValue;
        }

        if (self.dynamicDeps)
          observer.startReset();

        var value = self.getValue(model,
                                  self.dynamicDeps ? observer : undefined,
                                  filterRegistry);
        if (self.dynamicDeps)
          observer.finishReset();

        return value;
      }

      function setValueFn(newValue) {
        self.setValue(model, newValue, filterRegistry);
        return newValue;
      }

      return new ObserverTransform(observer, valueFn, setValueFn, true);
    },

    getValue: function(model, observer, filterRegistry) {
      var value = getFn(this.expression)(model, observer, filterRegistry);
      for (var i = 0; i < this.filters.length; i++) {
        value = this.filters[i].transform(model, observer, filterRegistry,
            false, [value]);
      }

      return value;
    },

    setValue: function(model, newValue, filterRegistry) {
      var count = this.filters ? this.filters.length : 0;
      while (count-- > 0) {
        newValue = this.filters[count].transform(model, undefined,
            filterRegistry, true, [newValue]);
      }

      if (this.expression.setValue)
        return this.expression.setValue(model, newValue);
    }
  }

  /**
   * Converts a style property name to a css property name. For example:
   * "WebkitUserSelect" to "-webkit-user-select"
   */
  function convertStylePropertyName(name) {
    return String(name).replace(/[A-Z]/g, function(c) {
      return '-' + c.toLowerCase();
    });
  }

  var parentScopeName = '@' + Math.random().toString(36).slice(2);

  // Single ident paths must bind directly to the appropriate scope object.
  // I.e. Pushed values in two-bindings need to be assigned to the actual model
  // object.
  function findScope(model, prop) {
    while (model[parentScopeName] &&
           !Object.prototype.hasOwnProperty.call(model, prop)) {
      model = model[parentScopeName];
    }

    return model;
  }

  function isLiteralExpression(pathString) {
    switch (pathString) {
      case '':
        return false;

      case 'false':
      case 'null':
      case 'true':
        return true;
    }

    if (!isNaN(Number(pathString)))
      return true;

    return false;
  };

  function PolymerExpressions() {}

  PolymerExpressions.prototype = {
    // "built-in" filters
    styleObject: function(value) {
      var parts = [];
      for (var key in value) {
        parts.push(convertStylePropertyName(key) + ': ' + value[key]);
      }
      return parts.join('; ');
    },

    tokenList: function(value) {
      var tokens = [];
      for (var key in value) {
        if (value[key])
          tokens.push(key);
      }
      return tokens.join(' ');
    },

    // binding delegate API
    prepareInstancePositionChanged: function(template) {
      var indexIdent = template.polymerExpressionIndexIdent_;
      if (!indexIdent)
        return;

      return function(templateInstance, index) {
        templateInstance.model[indexIdent] = index;
      };
    },

    prepareBinding: function(pathString, name, node) {
      var path = Path.get(pathString);

      if (!isLiteralExpression(pathString) && path.valid) {
        if (path.length == 1) {
          return function(model, node, oneTime) {
            if (oneTime)
              return path.getValueFrom(model);

            var scope = findScope(model, path[0]);
            return new PathObserver(scope, path);
          };
        }
        return; // bail out early if pathString is simple path.
      }

      return prepareBinding(pathString, name, node, this);
    },

    prepareInstanceModel: function(template) {
      var scopeName = template.polymerExpressionScopeIdent_;
      if (!scopeName)
        return;

      var parentScope = template.templateInstance ?
          template.templateInstance.model :
          template.model;

      var indexName = template.polymerExpressionIndexIdent_;

      return function(model) {
        return createScopeObject(parentScope, model, scopeName, indexName);
      };
    }
  };

  var createScopeObject = ('__proto__' in {}) ?
    function(parentScope, model, scopeName, indexName) {
      var scope = {};
      scope[scopeName] = model;
      scope[indexName] = undefined;
      scope[parentScopeName] = parentScope;
      scope.__proto__ = parentScope;
      return scope;
    } :
    function(parentScope, model, scopeName, indexName) {
      var scope = Object.create(parentScope);
      Object.defineProperty(scope, scopeName,
          { value: model, configurable: true, writable: true });
      Object.defineProperty(scope, indexName,
          { value: undefined, configurable: true, writable: true });
      Object.defineProperty(scope, parentScopeName,
          { value: parentScope, configurable: true, writable: true });
      return scope;
    };

  global.PolymerExpressions = PolymerExpressions;
  PolymerExpressions.getExpression = getExpression;
})(this);

Polymer = {
  version: '0.5.5'
};

// TODO(sorvell): this ensures Polymer is an object and not a function
// Platform is currently defining it as a function to allow for async loading
// of polymer; once we refine the loading process this likely goes away.
if (typeof window.Polymer === 'function') {
  Polymer = {};
}


(function(scope) {

  function withDependencies(task, depends) {
    depends = depends || [];
    if (!depends.map) {
      depends = [depends];
    }
    return task.apply(this, depends.map(marshal));
  }

  function module(name, dependsOrFactory, moduleFactory) {
    var module;
    switch (arguments.length) {
      case 0:
        return;
      case 1:
        module = null;
        break;
      case 2:
        // dependsOrFactory is `factory` in this case
        module = dependsOrFactory.apply(this);
        break;
      default:
        // dependsOrFactory is `depends` in this case
        module = withDependencies(moduleFactory, dependsOrFactory);
        break;
    }
    modules[name] = module;
  };

  function marshal(name) {
    return modules[name];
  }

  var modules = {};

  function using(depends, task) {
    HTMLImports.whenImportsReady(function() {
      withDependencies(task, depends);
    });
  };

  // exports

  scope.marshal = marshal;
  // `module` confuses commonjs detectors
  scope.modularize = module;
  scope.using = using;

})(window);

/*
	Build only script.

  Ensures scripts needed for basic x-platform compatibility
  will be run when platform.js is not loaded.
 */
if (!window.WebComponents) {

/*
	On supported platforms, platform.js is not needed. To retain compatibility
	with the polyfills, we stub out minimal functionality.
 */
if (!window.WebComponents) {

  WebComponents = {
  	flush: function() {},
    flags: {log: {}}
  };

  Platform = WebComponents;

  CustomElements = {
  	useNative: true,
    ready: true,
    takeRecords: function() {},
    instanceof: function(obj, base) {
      return obj instanceof base;
    }
  };
  
  HTMLImports = {
  	useNative: true
  };

  
  addEventListener('HTMLImportsLoaded', function() {
    document.dispatchEvent(
      new CustomEvent('WebComponentsReady', {bubbles: true})
    );
  });


  // ShadowDOM
  ShadowDOMPolyfill = null;
  wrap = unwrap = function(n){
    return n;
  };

}

/*
  Create polyfill scope and feature detect native support.
*/
window.HTMLImports = window.HTMLImports || {flags:{}};

(function(scope) {

/**
  Basic setup and simple module executer. We collect modules and then execute
  the code later, only if it's necessary for polyfilling.
*/
var IMPORT_LINK_TYPE = 'import';
var useNative = Boolean(IMPORT_LINK_TYPE in document.createElement('link'));

/**
  Support `currentScript` on all browsers as `document._currentScript.`

  NOTE: We cannot polyfill `document.currentScript` because it's not possible
  both to override and maintain the ability to capture the native value.
  Therefore we choose to expose `_currentScript` both when native imports
  and the polyfill are in use.
*/
// NOTE: ShadowDOMPolyfill intrusion.
var hasShadowDOMPolyfill = Boolean(window.ShadowDOMPolyfill);
var wrap = function(node) {
  return hasShadowDOMPolyfill ? ShadowDOMPolyfill.wrapIfNeeded(node) : node;
};
var rootDocument = wrap(document);

var currentScriptDescriptor = {
  get: function() {
    var script = HTMLImports.currentScript || document.currentScript ||
        // NOTE: only works when called in synchronously executing code.
        // readyState should check if `loading` but IE10 is
        // interactive when scripts run so we cheat.
        (document.readyState !== 'complete' ?
        document.scripts[document.scripts.length - 1] : null);
    return wrap(script);
  },
  configurable: true
};

Object.defineProperty(document, '_currentScript', currentScriptDescriptor);
Object.defineProperty(rootDocument, '_currentScript', currentScriptDescriptor);

/**
  Add support for the `HTMLImportsLoaded` event and the `HTMLImports.whenReady`
  method. This api is necessary because unlike the native implementation,
  script elements do not force imports to resolve. Instead, users should wrap
  code in either an `HTMLImportsLoaded` hander or after load time in an
  `HTMLImports.whenReady(callback)` call.

  NOTE: This module also supports these apis under the native implementation.
  Therefore, if this file is loaded, the same code can be used under both
  the polyfill and native implementation.
 */

var isIE = /Trident/.test(navigator.userAgent);

// call a callback when all HTMLImports in the document at call time
// (or at least document ready) have loaded.
// 1. ensure the document is in a ready state (has dom), then
// 2. watch for loading of imports and call callback when done
function whenReady(callback, doc) {
  doc = doc || rootDocument;
  // if document is loading, wait and try again
  whenDocumentReady(function() {
    watchImportsLoad(callback, doc);
  }, doc);
}

// call the callback when the document is in a ready state (has dom)
var requiredReadyState = isIE ? 'complete' : 'interactive';
var READY_EVENT = 'readystatechange';
function isDocumentReady(doc) {
  return (doc.readyState === 'complete' ||
      doc.readyState === requiredReadyState);
}

// call <callback> when we ensure the document is in a ready state
function whenDocumentReady(callback, doc) {
  if (!isDocumentReady(doc)) {
    var checkReady = function() {
      if (doc.readyState === 'complete' ||
          doc.readyState === requiredReadyState) {
        doc.removeEventListener(READY_EVENT, checkReady);
        whenDocumentReady(callback, doc);
      }
    };
    doc.addEventListener(READY_EVENT, checkReady);
  } else if (callback) {
    callback();
  }
}

function markTargetLoaded(event) {
  event.target.__loaded = true;
}

// call <callback> when we ensure all imports have loaded
function watchImportsLoad(callback, doc) {
  var imports = doc.querySelectorAll('link[rel=import]');
  var loaded = 0, l = imports.length;
  function checkDone(d) {
    if ((loaded == l) && callback) {
       callback();
    }
  }
  function loadedImport(e) {
    markTargetLoaded(e);
    loaded++;
    checkDone();
  }
  if (l) {
    for (var i=0, imp; (i<l) && (imp=imports[i]); i++) {
      if (isImportLoaded(imp)) {
        loadedImport.call(imp, {target: imp});
      } else {
        imp.addEventListener('load', loadedImport);
        imp.addEventListener('error', loadedImport);
      }
    }
  } else {
    checkDone();
  }
}

// NOTE: test for native imports loading is based on explicitly watching
// all imports (see below).
// However, we cannot rely on this entirely without watching the entire document
// for import links. For perf reasons, currently only head is watched.
// Instead, we fallback to checking if the import property is available
// and the document is not itself loading.
function isImportLoaded(link) {
  return useNative ? link.__loaded ||
      (link.import && link.import.readyState !== 'loading') :
      link.__importParsed;
}

// TODO(sorvell): Workaround for
// https://www.w3.org/Bugs/Public/show_bug.cgi?id=25007, should be removed when
// this bug is addressed.
// (1) Install a mutation observer to see when HTMLImports have loaded
// (2) if this script is run during document load it will watch any existing
// imports for loading.
//
// NOTE: The workaround has restricted functionality: (1) it's only compatible
// with imports that are added to document.head since the mutation observer
// watches only head for perf reasons, (2) it requires this script
// to run before any imports have completed loading.
if (useNative) {
  new MutationObserver(function(mxns) {
    for (var i=0, l=mxns.length, m; (i < l) && (m=mxns[i]); i++) {
      if (m.addedNodes) {
        handleImports(m.addedNodes);
      }
    }
  }).observe(document.head, {childList: true});

  function handleImports(nodes) {
    for (var i=0, l=nodes.length, n; (i<l) && (n=nodes[i]); i++) {
      if (isImport(n)) {
        handleImport(n);
      }
    }
  }

  function isImport(element) {
    return element.localName === 'link' && element.rel === 'import';
  }

  function handleImport(element) {
    var loaded = element.import;
    if (loaded) {
      markTargetLoaded({target: element});
    } else {
      element.addEventListener('load', markTargetLoaded);
      element.addEventListener('error', markTargetLoaded);
    }
  }

  // make sure to catch any imports that are in the process of loading
  // when this script is run.
  (function() {
    if (document.readyState === 'loading') {
      var imports = document.querySelectorAll('link[rel=import]');
      for (var i=0, l=imports.length, imp; (i<l) && (imp=imports[i]); i++) {
        handleImport(imp);
      }
    }
  })();

}

// Fire the 'HTMLImportsLoaded' event when imports in document at load time
// have loaded. This event is required to simulate the script blocking
// behavior of native imports. A main document script that needs to be sure
// imports have loaded should wait for this event.
whenReady(function() {
  HTMLImports.ready = true;
  HTMLImports.readyTime = new Date().getTime();
  rootDocument.dispatchEvent(
    new CustomEvent('HTMLImportsLoaded', {bubbles: true})
  );
});

// exports
scope.IMPORT_LINK_TYPE = IMPORT_LINK_TYPE;
scope.useNative = useNative;
scope.rootDocument = rootDocument;
scope.whenReady = whenReady;
scope.isIE = isIE;

})(HTMLImports);

(function(scope) {

  // TODO(sorvell): It's desireable to provide a default stylesheet 
  // that's convenient for styling unresolved elements, but
  // it's cumbersome to have to include this manually in every page.
  // It would make sense to put inside some HTMLImport but 
  // the HTMLImports polyfill does not allow loading of stylesheets 
  // that block rendering. Therefore this injection is tolerated here.
  var style = document.createElement('style');
  style.textContent = ''
      + 'body {'
      + 'transition: opacity ease-in 0.2s;' 
      + ' } \n'
      + 'body[unresolved] {'
      + 'opacity: 0; display: block; overflow: hidden;' 
      + ' } \n'
      ;
  var head = document.querySelector('head');
  head.insertBefore(style, head.firstChild);

})(Platform);

/*
	Build only script.

  Ensures scripts needed for basic x-platform compatibility
  will be run when platform.js is not loaded.
 */
}
(function(global) {
  'use strict';

  var testingExposeCycleCount = global.testingExposeCycleCount;

  // Detect and do basic sanity checking on Object/Array.observe.
  function detectObjectObserve() {
    if (typeof Object.observe !== 'function' ||
        typeof Array.observe !== 'function') {
      return false;
    }

    var records = [];

    function callback(recs) {
      records = recs;
    }

    var test = {};
    var arr = [];
    Object.observe(test, callback);
    Array.observe(arr, callback);
    test.id = 1;
    test.id = 2;
    delete test.id;
    arr.push(1, 2);
    arr.length = 0;

    Object.deliverChangeRecords(callback);
    if (records.length !== 5)
      return false;

    if (records[0].type != 'add' ||
        records[1].type != 'update' ||
        records[2].type != 'delete' ||
        records[3].type != 'splice' ||
        records[4].type != 'splice') {
      return false;
    }

    Object.unobserve(test, callback);
    Array.unobserve(arr, callback);

    return true;
  }

  var hasObserve = detectObjectObserve();

  function detectEval() {
    // Don't test for eval if we're running in a Chrome App environment.
    // We check for APIs set that only exist in a Chrome App context.
    if (typeof chrome !== 'undefined' && chrome.app && chrome.app.runtime) {
      return false;
    }

    // Firefox OS Apps do not allow eval. This feature detection is very hacky
    // but even if some other platform adds support for this function this code
    // will continue to work.
    if (typeof navigator != 'undefined' && navigator.getDeviceStorage) {
      return false;
    }

    try {
      var f = new Function('', 'return true;');
      return f();
    } catch (ex) {
      return false;
    }
  }

  var hasEval = detectEval();

  function isIndex(s) {
    return +s === s >>> 0 && s !== '';
  }

  function toNumber(s) {
    return +s;
  }

  function isObject(obj) {
    return obj === Object(obj);
  }

  var numberIsNaN = global.Number.isNaN || function(value) {
    return typeof value === 'number' && global.isNaN(value);
  }

  function areSameValue(left, right) {
    if (left === right)
      return left !== 0 || 1 / left === 1 / right;
    if (numberIsNaN(left) && numberIsNaN(right))
      return true;

    return left !== left && right !== right;
  }

  var createObject = ('__proto__' in {}) ?
    function(obj) { return obj; } :
    function(obj) {
      var proto = obj.__proto__;
      if (!proto)
        return obj;
      var newObject = Object.create(proto);
      Object.getOwnPropertyNames(obj).forEach(function(name) {
        Object.defineProperty(newObject, name,
                             Object.getOwnPropertyDescriptor(obj, name));
      });
      return newObject;
    };

  var identStart = '[\$_a-zA-Z]';
  var identPart = '[\$_a-zA-Z0-9]';
  var identRegExp = new RegExp('^' + identStart + '+' + identPart + '*' + '$');

  function getPathCharType(char) {
    if (char === undefined)
      return 'eof';

    var code = char.charCodeAt(0);

    switch(code) {
      case 0x5B: // [
      case 0x5D: // ]
      case 0x2E: // .
      case 0x22: // "
      case 0x27: // '
      case 0x30: // 0
        return char;

      case 0x5F: // _
      case 0x24: // $
        return 'ident';

      case 0x20: // Space
      case 0x09: // Tab
      case 0x0A: // Newline
      case 0x0D: // Return
      case 0xA0:  // No-break space
      case 0xFEFF:  // Byte Order Mark
      case 0x2028:  // Line Separator
      case 0x2029:  // Paragraph Separator
        return 'ws';
    }

    // a-z, A-Z
    if ((0x61 <= code && code <= 0x7A) || (0x41 <= code && code <= 0x5A))
      return 'ident';

    // 1-9
    if (0x31 <= code && code <= 0x39)
      return 'number';

    return 'else';
  }

  var pathStateMachine = {
    'beforePath': {
      'ws': ['beforePath'],
      'ident': ['inIdent', 'append'],
      '[': ['beforeElement'],
      'eof': ['afterPath']
    },

    'inPath': {
      'ws': ['inPath'],
      '.': ['beforeIdent'],
      '[': ['beforeElement'],
      'eof': ['afterPath']
    },

    'beforeIdent': {
      'ws': ['beforeIdent'],
      'ident': ['inIdent', 'append']
    },

    'inIdent': {
      'ident': ['inIdent', 'append'],
      '0': ['inIdent', 'append'],
      'number': ['inIdent', 'append'],
      'ws': ['inPath', 'push'],
      '.': ['beforeIdent', 'push'],
      '[': ['beforeElement', 'push'],
      'eof': ['afterPath', 'push']
    },

    'beforeElement': {
      'ws': ['beforeElement'],
      '0': ['afterZero', 'append'],
      'number': ['inIndex', 'append'],
      "'": ['inSingleQuote', 'append', ''],
      '"': ['inDoubleQuote', 'append', '']
    },

    'afterZero': {
      'ws': ['afterElement', 'push'],
      ']': ['inPath', 'push']
    },

    'inIndex': {
      '0': ['inIndex', 'append'],
      'number': ['inIndex', 'append'],
      'ws': ['afterElement'],
      ']': ['inPath', 'push']
    },

    'inSingleQuote': {
      "'": ['afterElement'],
      'eof': ['error'],
      'else': ['inSingleQuote', 'append']
    },

    'inDoubleQuote': {
      '"': ['afterElement'],
      'eof': ['error'],
      'else': ['inDoubleQuote', 'append']
    },

    'afterElement': {
      'ws': ['afterElement'],
      ']': ['inPath', 'push']
    }
  }

  function noop() {}

  function parsePath(path) {
    var keys = [];
    var index = -1;
    var c, newChar, key, type, transition, action, typeMap, mode = 'beforePath';

    var actions = {
      push: function() {
        if (key === undefined)
          return;

        keys.push(key);
        key = undefined;
      },

      append: function() {
        if (key === undefined)
          key = newChar
        else
          key += newChar;
      }
    };

    function maybeUnescapeQuote() {
      if (index >= path.length)
        return;

      var nextChar = path[index + 1];
      if ((mode == 'inSingleQuote' && nextChar == "'") ||
          (mode == 'inDoubleQuote' && nextChar == '"')) {
        index++;
        newChar = nextChar;
        actions.append();
        return true;
      }
    }

    while (mode) {
      index++;
      c = path[index];

      if (c == '\\' && maybeUnescapeQuote(mode))
        continue;

      type = getPathCharType(c);
      typeMap = pathStateMachine[mode];
      transition = typeMap[type] || typeMap['else'] || 'error';

      if (transition == 'error')
        return; // parse error;

      mode = transition[0];
      action = actions[transition[1]] || noop;
      newChar = transition[2] === undefined ? c : transition[2];
      action();

      if (mode === 'afterPath') {
        return keys;
      }
    }

    return; // parse error
  }

  function isIdent(s) {
    return identRegExp.test(s);
  }

  var constructorIsPrivate = {};

  function Path(parts, privateToken) {
    if (privateToken !== constructorIsPrivate)
      throw Error('Use Path.get to retrieve path objects');

    for (var i = 0; i < parts.length; i++) {
      this.push(String(parts[i]));
    }

    if (hasEval && this.length) {
      this.getValueFrom = this.compiledGetValueFromFn();
    }
  }

  // TODO(rafaelw): Make simple LRU cache
  var pathCache = {};

  function getPath(pathString) {
    if (pathString instanceof Path)
      return pathString;

    if (pathString == null || pathString.length == 0)
      pathString = '';

    if (typeof pathString != 'string') {
      if (isIndex(pathString.length)) {
        // Constructed with array-like (pre-parsed) keys
        return new Path(pathString, constructorIsPrivate);
      }

      pathString = String(pathString);
    }

    var path = pathCache[pathString];
    if (path)
      return path;

    var parts = parsePath(pathString);
    if (!parts)
      return invalidPath;

    var path = new Path(parts, constructorIsPrivate);
    pathCache[pathString] = path;
    return path;
  }

  Path.get = getPath;

  function formatAccessor(key) {
    if (isIndex(key)) {
      return '[' + key + ']';
    } else {
      return '["' + key.replace(/"/g, '\\"') + '"]';
    }
  }

  Path.prototype = createObject({
    __proto__: [],
    valid: true,

    toString: function() {
      var pathString = '';
      for (var i = 0; i < this.length; i++) {
        var key = this[i];
        if (isIdent(key)) {
          pathString += i ? '.' + key : key;
        } else {
          pathString += formatAccessor(key);
        }
      }

      return pathString;
    },

    getValueFrom: function(obj, directObserver) {
      for (var i = 0; i < this.length; i++) {
        if (obj == null)
          return;
        obj = obj[this[i]];
      }
      return obj;
    },

    iterateObjects: function(obj, observe) {
      for (var i = 0; i < this.length; i++) {
        if (i)
          obj = obj[this[i - 1]];
        if (!isObject(obj))
          return;
        observe(obj, this[i]);
      }
    },

    compiledGetValueFromFn: function() {
      var str = '';
      var pathString = 'obj';
      str += 'if (obj != null';
      var i = 0;
      var key;
      for (; i < (this.length - 1); i++) {
        key = this[i];
        pathString += isIdent(key) ? '.' + key : formatAccessor(key);
        str += ' &&\n     ' + pathString + ' != null';
      }
      str += ')\n';

      var key = this[i];
      pathString += isIdent(key) ? '.' + key : formatAccessor(key);

      str += '  return ' + pathString + ';\nelse\n  return undefined;';
      return new Function('obj', str);
    },

    setValueFrom: function(obj, value) {
      if (!this.length)
        return false;

      for (var i = 0; i < this.length - 1; i++) {
        if (!isObject(obj))
          return false;
        obj = obj[this[i]];
      }

      if (!isObject(obj))
        return false;

      obj[this[i]] = value;
      return true;
    }
  });

  var invalidPath = new Path('', constructorIsPrivate);
  invalidPath.valid = false;
  invalidPath.getValueFrom = invalidPath.setValueFrom = function() {};

  var MAX_DIRTY_CHECK_CYCLES = 1000;

  function dirtyCheck(observer) {
    var cycles = 0;
    while (cycles < MAX_DIRTY_CHECK_CYCLES && observer.check_()) {
      cycles++;
    }
    if (testingExposeCycleCount)
      global.dirtyCheckCycleCount = cycles;

    return cycles > 0;
  }

  function objectIsEmpty(object) {
    for (var prop in object)
      return false;
    return true;
  }

  function diffIsEmpty(diff) {
    return objectIsEmpty(diff.added) &&
           objectIsEmpty(diff.removed) &&
           objectIsEmpty(diff.changed);
  }

  function diffObjectFromOldObject(object, oldObject) {
    var added = {};
    var removed = {};
    var changed = {};

    for (var prop in oldObject) {
      var newValue = object[prop];

      if (newValue !== undefined && newValue === oldObject[prop])
        continue;

      if (!(prop in object)) {
        removed[prop] = undefined;
        continue;
      }

      if (newValue !== oldObject[prop])
        changed[prop] = newValue;
    }

    for (var prop in object) {
      if (prop in oldObject)
        continue;

      added[prop] = object[prop];
    }

    if (Array.isArray(object) && object.length !== oldObject.length)
      changed.length = object.length;

    return {
      added: added,
      removed: removed,
      changed: changed
    };
  }

  var eomTasks = [];
  function runEOMTasks() {
    if (!eomTasks.length)
      return false;

    for (var i = 0; i < eomTasks.length; i++) {
      eomTasks[i]();
    }
    eomTasks.length = 0;
    return true;
  }

  var runEOM = hasObserve ? (function(){
    return function(fn) {
      return Promise.resolve().then(fn);
    }
  })() :
  (function() {
    return function(fn) {
      eomTasks.push(fn);
    };
  })();

  var observedObjectCache = [];

  function newObservedObject() {
    var observer;
    var object;
    var discardRecords = false;
    var first = true;

    function callback(records) {
      if (observer && observer.state_ === OPENED && !discardRecords)
        observer.check_(records);
    }

    return {
      open: function(obs) {
        if (observer)
          throw Error('ObservedObject in use');

        if (!first)
          Object.deliverChangeRecords(callback);

        observer = obs;
        first = false;
      },
      observe: function(obj, arrayObserve) {
        object = obj;
        if (arrayObserve)
          Array.observe(object, callback);
        else
          Object.observe(object, callback);
      },
      deliver: function(discard) {
        discardRecords = discard;
        Object.deliverChangeRecords(callback);
        discardRecords = false;
      },
      close: function() {
        observer = undefined;
        Object.unobserve(object, callback);
        observedObjectCache.push(this);
      }
    };
  }

  /*
   * The observedSet abstraction is a perf optimization which reduces the total
   * number of Object.observe observations of a set of objects. The idea is that
   * groups of Observers will have some object dependencies in common and this
   * observed set ensures that each object in the transitive closure of
   * dependencies is only observed once. The observedSet acts as a write barrier
   * such that whenever any change comes through, all Observers are checked for
   * changed values.
   *
   * Note that this optimization is explicitly moving work from setup-time to
   * change-time.
   *
   * TODO(rafaelw): Implement "garbage collection". In order to move work off
   * the critical path, when Observers are closed, their observed objects are
   * not Object.unobserve(d). As a result, it's possible that if the observedSet
   * is kept open, but some Observers have been closed, it could cause "leaks"
   * (prevent otherwise collectable objects from being collected). At some
   * point, we should implement incremental "gc" which keeps a list of
   * observedSets which may need clean-up and does small amounts of cleanup on a
   * timeout until all is clean.
   */

  function getObservedObject(observer, object, arrayObserve) {
    var dir = observedObjectCache.pop() || newObservedObject();
    dir.open(observer);
    dir.observe(object, arrayObserve);
    return dir;
  }

  var observedSetCache = [];

  function newObservedSet() {
    var observerCount = 0;
    var observers = [];
    var objects = [];
    var rootObj;
    var rootObjProps;

    function observe(obj, prop) {
      if (!obj)
        return;

      if (obj === rootObj)
        rootObjProps[prop] = true;

      if (objects.indexOf(obj) < 0) {
        objects.push(obj);
        Object.observe(obj, callback);
      }

      observe(Object.getPrototypeOf(obj), prop);
    }

    function allRootObjNonObservedProps(recs) {
      for (var i = 0; i < recs.length; i++) {
        var rec = recs[i];
        if (rec.object !== rootObj ||
            rootObjProps[rec.name] ||
            rec.type === 'setPrototype') {
          return false;
        }
      }
      return true;
    }

    function callback(recs) {
      if (allRootObjNonObservedProps(recs))
        return;

      var observer;
      for (var i = 0; i < observers.length; i++) {
        observer = observers[i];
        if (observer.state_ == OPENED) {
          observer.iterateObjects_(observe);
        }
      }

      for (var i = 0; i < observers.length; i++) {
        observer = observers[i];
        if (observer.state_ == OPENED) {
          observer.check_();
        }
      }
    }

    var record = {
      objects: objects,
      get rootObject() { return rootObj; },
      set rootObject(value) {
        rootObj = value;
        rootObjProps = {};
      },
      open: function(obs, object) {
        observers.push(obs);
        observerCount++;
        obs.iterateObjects_(observe);
      },
      close: function(obs) {
        observerCount--;
        if (observerCount > 0) {
          return;
        }

        for (var i = 0; i < objects.length; i++) {
          Object.unobserve(objects[i], callback);
          Observer.unobservedCount++;
        }

        observers.length = 0;
        objects.length = 0;
        rootObj = undefined;
        rootObjProps = undefined;
        observedSetCache.push(this);
        if (lastObservedSet === this)
          lastObservedSet = null;
      },
    };

    return record;
  }

  var lastObservedSet;

  function getObservedSet(observer, obj) {
    if (!lastObservedSet || lastObservedSet.rootObject !== obj) {
      lastObservedSet = observedSetCache.pop() || newObservedSet();
      lastObservedSet.rootObject = obj;
    }
    lastObservedSet.open(observer, obj);
    return lastObservedSet;
  }

  var UNOPENED = 0;
  var OPENED = 1;
  var CLOSED = 2;
  var RESETTING = 3;

  var nextObserverId = 1;

  function Observer() {
    this.state_ = UNOPENED;
    this.callback_ = undefined;
    this.target_ = undefined; // TODO(rafaelw): Should be WeakRef
    this.directObserver_ = undefined;
    this.value_ = undefined;
    this.id_ = nextObserverId++;
  }

  Observer.prototype = {
    open: function(callback, target) {
      if (this.state_ != UNOPENED)
        throw Error('Observer has already been opened.');

      addToAll(this);
      this.callback_ = callback;
      this.target_ = target;
      this.connect_();
      this.state_ = OPENED;
      return this.value_;
    },

    close: function() {
      if (this.state_ != OPENED)
        return;

      removeFromAll(this);
      this.disconnect_();
      this.value_ = undefined;
      this.callback_ = undefined;
      this.target_ = undefined;
      this.state_ = CLOSED;
    },

    deliver: function() {
      if (this.state_ != OPENED)
        return;

      dirtyCheck(this);
    },

    report_: function(changes) {
      try {
        this.callback_.apply(this.target_, changes);
      } catch (ex) {
        Observer._errorThrownDuringCallback = true;
        console.error('Exception caught during observer callback: ' +
                       (ex.stack || ex));
      }
    },

    discardChanges: function() {
      this.check_(undefined, true);
      return this.value_;
    }
  }

  var collectObservers = !hasObserve;
  var allObservers;
  Observer._allObserversCount = 0;

  if (collectObservers) {
    allObservers = [];
  }

  function addToAll(observer) {
    Observer._allObserversCount++;
    if (!collectObservers)
      return;

    allObservers.push(observer);
  }

  function removeFromAll(observer) {
    Observer._allObserversCount--;
  }

  var runningMicrotaskCheckpoint = false;

  global.Platform = global.Platform || {};

  global.Platform.performMicrotaskCheckpoint = function() {
    if (runningMicrotaskCheckpoint)
      return;

    if (!collectObservers)
      return;

    runningMicrotaskCheckpoint = true;

    var cycles = 0;
    var anyChanged, toCheck;

    do {
      cycles++;
      toCheck = allObservers;
      allObservers = [];
      anyChanged = false;

      for (var i = 0; i < toCheck.length; i++) {
        var observer = toCheck[i];
        if (observer.state_ != OPENED)
          continue;

        if (observer.check_())
          anyChanged = true;

        allObservers.push(observer);
      }
      if (runEOMTasks())
        anyChanged = true;
    } while (cycles < MAX_DIRTY_CHECK_CYCLES && anyChanged);

    if (testingExposeCycleCount)
      global.dirtyCheckCycleCount = cycles;

    runningMicrotaskCheckpoint = false;
  };

  if (collectObservers) {
    global.Platform.clearObservers = function() {
      allObservers = [];
    };
  }

  function ObjectObserver(object) {
    Observer.call(this);
    this.value_ = object;
    this.oldObject_ = undefined;
  }

  ObjectObserver.prototype = createObject({
    __proto__: Observer.prototype,

    arrayObserve: false,

    connect_: function(callback, target) {
      if (hasObserve) {
        this.directObserver_ = getObservedObject(this, this.value_,
                                                 this.arrayObserve);
      } else {
        this.oldObject_ = this.copyObject(this.value_);
      }

    },

    copyObject: function(object) {
      var copy = Array.isArray(object) ? [] : {};
      for (var prop in object) {
        copy[prop] = object[prop];
      };
      if (Array.isArray(object))
        copy.length = object.length;
      return copy;
    },

    check_: function(changeRecords, skipChanges) {
      var diff;
      var oldValues;
      if (hasObserve) {
        if (!changeRecords)
          return false;

        oldValues = {};
        diff = diffObjectFromChangeRecords(this.value_, changeRecords,
                                           oldValues);
      } else {
        oldValues = this.oldObject_;
        diff = diffObjectFromOldObject(this.value_, this.oldObject_);
      }

      if (diffIsEmpty(diff))
        return false;

      if (!hasObserve)
        this.oldObject_ = this.copyObject(this.value_);

      this.report_([
        diff.added || {},
        diff.removed || {},
        diff.changed || {},
        function(property) {
          return oldValues[property];
        }
      ]);

      return true;
    },

    disconnect_: function() {
      if (hasObserve) {
        this.directObserver_.close();
        this.directObserver_ = undefined;
      } else {
        this.oldObject_ = undefined;
      }
    },

    deliver: function() {
      if (this.state_ != OPENED)
        return;

      if (hasObserve)
        this.directObserver_.deliver(false);
      else
        dirtyCheck(this);
    },

    discardChanges: function() {
      if (this.directObserver_)
        this.directObserver_.deliver(true);
      else
        this.oldObject_ = this.copyObject(this.value_);

      return this.value_;
    }
  });

  function ArrayObserver(array) {
    if (!Array.isArray(array))
      throw Error('Provided object is not an Array');
    ObjectObserver.call(this, array);
  }

  ArrayObserver.prototype = createObject({

    __proto__: ObjectObserver.prototype,

    arrayObserve: true,

    copyObject: function(arr) {
      return arr.slice();
    },

    check_: function(changeRecords) {
      var splices;
      if (hasObserve) {
        if (!changeRecords)
          return false;
        splices = projectArraySplices(this.value_, changeRecords);
      } else {
        splices = calcSplices(this.value_, 0, this.value_.length,
                              this.oldObject_, 0, this.oldObject_.length);
      }

      if (!splices || !splices.length)
        return false;

      if (!hasObserve)
        this.oldObject_ = this.copyObject(this.value_);

      this.report_([splices]);
      return true;
    }
  });

  ArrayObserver.applySplices = function(previous, current, splices) {
    splices.forEach(function(splice) {
      var spliceArgs = [splice.index, splice.removed.length];
      var addIndex = splice.index;
      while (addIndex < splice.index + splice.addedCount) {
        spliceArgs.push(current[addIndex]);
        addIndex++;
      }

      Array.prototype.splice.apply(previous, spliceArgs);
    });
  };

  function PathObserver(object, path) {
    Observer.call(this);

    this.object_ = object;
    this.path_ = getPath(path);
    this.directObserver_ = undefined;
  }

  PathObserver.prototype = createObject({
    __proto__: Observer.prototype,

    get path() {
      return this.path_;
    },

    connect_: function() {
      if (hasObserve)
        this.directObserver_ = getObservedSet(this, this.object_);

      this.check_(undefined, true);
    },

    disconnect_: function() {
      this.value_ = undefined;

      if (this.directObserver_) {
        this.directObserver_.close(this);
        this.directObserver_ = undefined;
      }
    },

    iterateObjects_: function(observe) {
      this.path_.iterateObjects(this.object_, observe);
    },

    check_: function(changeRecords, skipChanges) {
      var oldValue = this.value_;
      this.value_ = this.path_.getValueFrom(this.object_);
      if (skipChanges || areSameValue(this.value_, oldValue))
        return false;

      this.report_([this.value_, oldValue, this]);
      return true;
    },

    setValue: function(newValue) {
      if (this.path_)
        this.path_.setValueFrom(this.object_, newValue);
    }
  });

  function CompoundObserver(reportChangesOnOpen) {
    Observer.call(this);

    this.reportChangesOnOpen_ = reportChangesOnOpen;
    this.value_ = [];
    this.directObserver_ = undefined;
    this.observed_ = [];
  }

  var observerSentinel = {};

  CompoundObserver.prototype = createObject({
    __proto__: Observer.prototype,

    connect_: function() {
      if (hasObserve) {
        var object;
        var needsDirectObserver = false;
        for (var i = 0; i < this.observed_.length; i += 2) {
          object = this.observed_[i]
          if (object !== observerSentinel) {
            needsDirectObserver = true;
            break;
          }
        }

        if (needsDirectObserver)
          this.directObserver_ = getObservedSet(this, object);
      }

      this.check_(undefined, !this.reportChangesOnOpen_);
    },

    disconnect_: function() {
      for (var i = 0; i < this.observed_.length; i += 2) {
        if (this.observed_[i] === observerSentinel)
          this.observed_[i + 1].close();
      }
      this.observed_.length = 0;
      this.value_.length = 0;

      if (this.directObserver_) {
        this.directObserver_.close(this);
        this.directObserver_ = undefined;
      }
    },

    addPath: function(object, path) {
      if (this.state_ != UNOPENED && this.state_ != RESETTING)
        throw Error('Cannot add paths once started.');

      var path = getPath(path);
      this.observed_.push(object, path);
      if (!this.reportChangesOnOpen_)
        return;
      var index = this.observed_.length / 2 - 1;
      this.value_[index] = path.getValueFrom(object);
    },

    addObserver: function(observer) {
      if (this.state_ != UNOPENED && this.state_ != RESETTING)
        throw Error('Cannot add observers once started.');

      this.observed_.push(observerSentinel, observer);
      if (!this.reportChangesOnOpen_)
        return;
      var index = this.observed_.length / 2 - 1;
      this.value_[index] = observer.open(this.deliver, this);
    },

    startReset: function() {
      if (this.state_ != OPENED)
        throw Error('Can only reset while open');

      this.state_ = RESETTING;
      this.disconnect_();
    },

    finishReset: function() {
      if (this.state_ != RESETTING)
        throw Error('Can only finishReset after startReset');
      this.state_ = OPENED;
      this.connect_();

      return this.value_;
    },

    iterateObjects_: function(observe) {
      var object;
      for (var i = 0; i < this.observed_.length; i += 2) {
        object = this.observed_[i]
        if (object !== observerSentinel)
          this.observed_[i + 1].iterateObjects(object, observe)
      }
    },

    check_: function(changeRecords, skipChanges) {
      var oldValues;
      for (var i = 0; i < this.observed_.length; i += 2) {
        var object = this.observed_[i];
        var path = this.observed_[i+1];
        var value;
        if (object === observerSentinel) {
          var observable = path;
          value = this.state_ === UNOPENED ?
              observable.open(this.deliver, this) :
              observable.discardChanges();
        } else {
          value = path.getValueFrom(object);
        }

        if (skipChanges) {
          this.value_[i / 2] = value;
          continue;
        }

        if (areSameValue(value, this.value_[i / 2]))
          continue;

        oldValues = oldValues || [];
        oldValues[i / 2] = this.value_[i / 2];
        this.value_[i / 2] = value;
      }

      if (!oldValues)
        return false;

      // TODO(rafaelw): Having observed_ as the third callback arg here is
      // pretty lame API. Fix.
      this.report_([this.value_, oldValues, this.observed_]);
      return true;
    }
  });

  function identFn(value) { return value; }

  function ObserverTransform(observable, getValueFn, setValueFn,
                             dontPassThroughSet) {
    this.callback_ = undefined;
    this.target_ = undefined;
    this.value_ = undefined;
    this.observable_ = observable;
    this.getValueFn_ = getValueFn || identFn;
    this.setValueFn_ = setValueFn || identFn;
    // TODO(rafaelw): This is a temporary hack. PolymerExpressions needs this
    // at the moment because of a bug in it's dependency tracking.
    this.dontPassThroughSet_ = dontPassThroughSet;
  }

  ObserverTransform.prototype = {
    open: function(callback, target) {
      this.callback_ = callback;
      this.target_ = target;
      this.value_ =
          this.getValueFn_(this.observable_.open(this.observedCallback_, this));
      return this.value_;
    },

    observedCallback_: function(value) {
      value = this.getValueFn_(value);
      if (areSameValue(value, this.value_))
        return;
      var oldValue = this.value_;
      this.value_ = value;
      this.callback_.call(this.target_, this.value_, oldValue);
    },

    discardChanges: function() {
      this.value_ = this.getValueFn_(this.observable_.discardChanges());
      return this.value_;
    },

    deliver: function() {
      return this.observable_.deliver();
    },

    setValue: function(value) {
      value = this.setValueFn_(value);
      if (!this.dontPassThroughSet_ && this.observable_.setValue)
        return this.observable_.setValue(value);
    },

    close: function() {
      if (this.observable_)
        this.observable_.close();
      this.callback_ = undefined;
      this.target_ = undefined;
      this.observable_ = undefined;
      this.value_ = undefined;
      this.getValueFn_ = undefined;
      this.setValueFn_ = undefined;
    }
  }

  var expectedRecordTypes = {
    add: true,
    update: true,
    delete: true
  };

  function diffObjectFromChangeRecords(object, changeRecords, oldValues) {
    var added = {};
    var removed = {};

    for (var i = 0; i < changeRecords.length; i++) {
      var record = changeRecords[i];
      if (!expectedRecordTypes[record.type]) {
        console.error('Unknown changeRecord type: ' + record.type);
        console.error(record);
        continue;
      }

      if (!(record.name in oldValues))
        oldValues[record.name] = record.oldValue;

      if (record.type == 'update')
        continue;

      if (record.type == 'add') {
        if (record.name in removed)
          delete removed[record.name];
        else
          added[record.name] = true;

        continue;
      }

      // type = 'delete'
      if (record.name in added) {
        delete added[record.name];
        delete oldValues[record.name];
      } else {
        removed[record.name] = true;
      }
    }

    for (var prop in added)
      added[prop] = object[prop];

    for (var prop in removed)
      removed[prop] = undefined;

    var changed = {};
    for (var prop in oldValues) {
      if (prop in added || prop in removed)
        continue;

      var newValue = object[prop];
      if (oldValues[prop] !== newValue)
        changed[prop] = newValue;
    }

    return {
      added: added,
      removed: removed,
      changed: changed
    };
  }

  function newSplice(index, removed, addedCount) {
    return {
      index: index,
      removed: removed,
      addedCount: addedCount
    };
  }

  var EDIT_LEAVE = 0;
  var EDIT_UPDATE = 1;
  var EDIT_ADD = 2;
  var EDIT_DELETE = 3;

  function ArraySplice() {}

  ArraySplice.prototype = {

    // Note: This function is *based* on the computation of the Levenshtein
    // "edit" distance. The one change is that "updates" are treated as two
    // edits - not one. With Array splices, an update is really a delete
    // followed by an add. By retaining this, we optimize for "keeping" the
    // maximum array items in the original array. For example:
    //
    //   'xxxx123' -> '123yyyy'
    //
    // With 1-edit updates, the shortest path would be just to update all seven
    // characters. With 2-edit updates, we delete 4, leave 3, and add 4. This
    // leaves the substring '123' intact.
    calcEditDistances: function(current, currentStart, currentEnd,
                                old, oldStart, oldEnd) {
      // "Deletion" columns
      var rowCount = oldEnd - oldStart + 1;
      var columnCount = currentEnd - currentStart + 1;
      var distances = new Array(rowCount);

      // "Addition" rows. Initialize null column.
      for (var i = 0; i < rowCount; i++) {
        distances[i] = new Array(columnCount);
        distances[i][0] = i;
      }

      // Initialize null row
      for (var j = 0; j < columnCount; j++)
        distances[0][j] = j;

      for (var i = 1; i < rowCount; i++) {
        for (var j = 1; j < columnCount; j++) {
          if (this.equals(current[currentStart + j - 1], old[oldStart + i - 1]))
            distances[i][j] = distances[i - 1][j - 1];
          else {
            var north = distances[i - 1][j] + 1;
            var west = distances[i][j - 1] + 1;
            distances[i][j] = north < west ? north : west;
          }
        }
      }

      return distances;
    },

    // This starts at the final weight, and walks "backward" by finding
    // the minimum previous weight recursively until the origin of the weight
    // matrix.
    spliceOperationsFromEditDistances: function(distances) {
      var i = distances.length - 1;
      var j = distances[0].length - 1;
      var current = distances[i][j];
      var edits = [];
      while (i > 0 || j > 0) {
        if (i == 0) {
          edits.push(EDIT_ADD);
          j--;
          continue;
        }
        if (j == 0) {
          edits.push(EDIT_DELETE);
          i--;
          continue;
        }
        var northWest = distances[i - 1][j - 1];
        var west = distances[i - 1][j];
        var north = distances[i][j - 1];

        var min;
        if (west < north)
          min = west < northWest ? west : northWest;
        else
          min = north < northWest ? north : northWest;

        if (min == northWest) {
          if (northWest == current) {
            edits.push(EDIT_LEAVE);
          } else {
            edits.push(EDIT_UPDATE);
            current = northWest;
          }
          i--;
          j--;
        } else if (min == west) {
          edits.push(EDIT_DELETE);
          i--;
          current = west;
        } else {
          edits.push(EDIT_ADD);
          j--;
          current = north;
        }
      }

      edits.reverse();
      return edits;
    },

    /**
     * Splice Projection functions:
     *
     * A splice map is a representation of how a previous array of items
     * was transformed into a new array of items. Conceptually it is a list of
     * tuples of
     *
     *   <index, removed, addedCount>
     *
     * which are kept in ascending index order of. The tuple represents that at
     * the |index|, |removed| sequence of items were removed, and counting forward
     * from |index|, |addedCount| items were added.
     */

    /**
     * Lacking individual splice mutation information, the minimal set of
     * splices can be synthesized given the previous state and final state of an
     * array. The basic approach is to calculate the edit distance matrix and
     * choose the shortest path through it.
     *
     * Complexity: O(l * p)
     *   l: The length of the current array
     *   p: The length of the old array
     */
    calcSplices: function(current, currentStart, currentEnd,
                          old, oldStart, oldEnd) {
      var prefixCount = 0;
      var suffixCount = 0;

      var minLength = Math.min(currentEnd - currentStart, oldEnd - oldStart);
      if (currentStart == 0 && oldStart == 0)
        prefixCount = this.sharedPrefix(current, old, minLength);

      if (currentEnd == current.length && oldEnd == old.length)
        suffixCount = this.sharedSuffix(current, old, minLength - prefixCount);

      currentStart += prefixCount;
      oldStart += prefixCount;
      currentEnd -= suffixCount;
      oldEnd -= suffixCount;

      if (currentEnd - currentStart == 0 && oldEnd - oldStart == 0)
        return [];

      if (currentStart == currentEnd) {
        var splice = newSplice(currentStart, [], 0);
        while (oldStart < oldEnd)
          splice.removed.push(old[oldStart++]);

        return [ splice ];
      } else if (oldStart == oldEnd)
        return [ newSplice(currentStart, [], currentEnd - currentStart) ];

      var ops = this.spliceOperationsFromEditDistances(
          this.calcEditDistances(current, currentStart, currentEnd,
                                 old, oldStart, oldEnd));

      var splice = undefined;
      var splices = [];
      var index = currentStart;
      var oldIndex = oldStart;
      for (var i = 0; i < ops.length; i++) {
        switch(ops[i]) {
          case EDIT_LEAVE:
            if (splice) {
              splices.push(splice);
              splice = undefined;
            }

            index++;
            oldIndex++;
            break;
          case EDIT_UPDATE:
            if (!splice)
              splice = newSplice(index, [], 0);

            splice.addedCount++;
            index++;

            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
          case EDIT_ADD:
            if (!splice)
              splice = newSplice(index, [], 0);

            splice.addedCount++;
            index++;
            break;
          case EDIT_DELETE:
            if (!splice)
              splice = newSplice(index, [], 0);

            splice.removed.push(old[oldIndex]);
            oldIndex++;
            break;
        }
      }

      if (splice) {
        splices.push(splice);
      }
      return splices;
    },

    sharedPrefix: function(current, old, searchLength) {
      for (var i = 0; i < searchLength; i++)
        if (!this.equals(current[i], old[i]))
          return i;
      return searchLength;
    },

    sharedSuffix: function(current, old, searchLength) {
      var index1 = current.length;
      var index2 = old.length;
      var count = 0;
      while (count < searchLength && this.equals(current[--index1], old[--index2]))
        count++;

      return count;
    },

    calculateSplices: function(current, previous) {
      return this.calcSplices(current, 0, current.length, previous, 0,
                              previous.length);
    },

    equals: function(currentValue, previousValue) {
      return currentValue === previousValue;
    }
  };

  var arraySplice = new ArraySplice();

  function calcSplices(current, currentStart, currentEnd,
                       old, oldStart, oldEnd) {
    return arraySplice.calcSplices(current, currentStart, currentEnd,
                                   old, oldStart, oldEnd);
  }

  function intersect(start1, end1, start2, end2) {
    // Disjoint
    if (end1 < start2 || end2 < start1)
      return -1;

    // Adjacent
    if (end1 == start2 || end2 == start1)
      return 0;

    // Non-zero intersect, span1 first
    if (start1 < start2) {
      if (end1 < end2)
        return end1 - start2; // Overlap
      else
        return end2 - start2; // Contained
    } else {
      // Non-zero intersect, span2 first
      if (end2 < end1)
        return end2 - start1; // Overlap
      else
        return end1 - start1; // Contained
    }
  }

  function mergeSplice(splices, index, removed, addedCount) {

    var splice = newSplice(index, removed, addedCount);

    var inserted = false;
    var insertionOffset = 0;

    for (var i = 0; i < splices.length; i++) {
      var current = splices[i];
      current.index += insertionOffset;

      if (inserted)
        continue;

      var intersectCount = intersect(splice.index,
                                     splice.index + splice.removed.length,
                                     current.index,
                                     current.index + current.addedCount);

      if (intersectCount >= 0) {
        // Merge the two splices

        splices.splice(i, 1);
        i--;

        insertionOffset -= current.addedCount - current.removed.length;

        splice.addedCount += current.addedCount - intersectCount;
        var deleteCount = splice.removed.length +
                          current.removed.length - intersectCount;

        if (!splice.addedCount && !deleteCount) {
          // merged splice is a noop. discard.
          inserted = true;
        } else {
          var removed = current.removed;

          if (splice.index < current.index) {
            // some prefix of splice.removed is prepended to current.removed.
            var prepend = splice.removed.slice(0, current.index - splice.index);
            Array.prototype.push.apply(prepend, removed);
            removed = prepend;
          }

          if (splice.index + splice.removed.length > current.index + current.addedCount) {
            // some suffix of splice.removed is appended to current.removed.
            var append = splice.removed.slice(current.index + current.addedCount - splice.index);
            Array.prototype.push.apply(removed, append);
          }

          splice.removed = removed;
          if (current.index < splice.index) {
            splice.index = current.index;
          }
        }
      } else if (splice.index < current.index) {
        // Insert splice here.

        inserted = true;

        splices.splice(i, 0, splice);
        i++;

        var offset = splice.addedCount - splice.removed.length
        current.index += offset;
        insertionOffset += offset;
      }
    }

    if (!inserted)
      splices.push(splice);
  }

  function createInitialSplices(array, changeRecords) {
    var splices = [];

    for (var i = 0; i < changeRecords.length; i++) {
      var record = changeRecords[i];
      switch(record.type) {
        case 'splice':
          mergeSplice(splices, record.index, record.removed.slice(), record.addedCount);
          break;
        case 'add':
        case 'update':
        case 'delete':
          if (!isIndex(record.name))
            continue;
          var index = toNumber(record.name);
          if (index < 0)
            continue;
          mergeSplice(splices, index, [record.oldValue], 1);
          break;
        default:
          console.error('Unexpected record type: ' + JSON.stringify(record));
          break;
      }
    }

    return splices;
  }

  function projectArraySplices(array, changeRecords) {
    var splices = [];

    createInitialSplices(array, changeRecords).forEach(function(splice) {
      if (splice.addedCount == 1 && splice.removed.length == 1) {
        if (splice.removed[0] !== array[splice.index])
          splices.push(splice);

        return
      };

      splices = splices.concat(calcSplices(array, splice.index, splice.index + splice.addedCount,
                                           splice.removed, 0, splice.removed.length));
    });

    return splices;
  }

  // Export the observe-js object for **Node.js**, with backwards-compatibility
  // for the old `require()` API. Also ensure `exports` is not a DOM Element.
  // If we're in the browser, export as a global object.

  var expose = global;

  if (typeof exports !== 'undefined' && !exports.nodeType) {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports;
    }
    expose = exports;
  }

  expose.Observer = Observer;
  expose.Observer.runEOM_ = runEOM;
  expose.Observer.observerSentinel_ = observerSentinel; // for testing.
  expose.Observer.hasObjectObserve = hasObserve;
  expose.ArrayObserver = ArrayObserver;
  expose.ArrayObserver.calculateSplices = function(current, previous) {
    return arraySplice.calculateSplices(current, previous);
  };

  expose.ArraySplice = ArraySplice;
  expose.ObjectObserver = ObjectObserver;
  expose.PathObserver = PathObserver;
  expose.CompoundObserver = CompoundObserver;
  expose.Path = Path;
  expose.ObserverTransform = ObserverTransform;
  
})(typeof global !== 'undefined' && global && typeof module !== 'undefined' && module ? global : this || window);

// Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
// This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
// The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
// The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
// Code distributed by Google as part of the polymer project is also
// subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt

(function(global) {
  'use strict';

  var filter = Array.prototype.filter.call.bind(Array.prototype.filter);

  function getTreeScope(node) {
    while (node.parentNode) {
      node = node.parentNode;
    }

    return typeof node.getElementById === 'function' ? node : null;
  }

  Node.prototype.bind = function(name, observable) {
    console.error('Unhandled binding to Node: ', this, name, observable);
  };

  Node.prototype.bindFinished = function() {};

  function updateBindings(node, name, binding) {
    var bindings = node.bindings_;
    if (!bindings)
      bindings = node.bindings_ = {};

    if (bindings[name])
      binding[name].close();

    return bindings[name] = binding;
  }

  function returnBinding(node, name, binding) {
    return binding;
  }

  function sanitizeValue(value) {
    return value == null ? '' : value;
  }

  function updateText(node, value) {
    node.data = sanitizeValue(value);
  }

  function textBinding(node) {
    return function(value) {
      return updateText(node, value);
    };
  }

  var maybeUpdateBindings = returnBinding;

  Object.defineProperty(Platform, 'enableBindingsReflection', {
    get: function() {
      return maybeUpdateBindings === updateBindings;
    },
    set: function(enable) {
      maybeUpdateBindings = enable ? updateBindings : returnBinding;
      return enable;
    },
    configurable: true
  });

  Text.prototype.bind = function(name, value, oneTime) {
    if (name !== 'textContent')
      return Node.prototype.bind.call(this, name, value, oneTime);

    if (oneTime)
      return updateText(this, value);

    var observable = value;
    updateText(this, observable.open(textBinding(this)));
    return maybeUpdateBindings(this, name, observable);
  }

  function updateAttribute(el, name, conditional, value) {
    if (conditional) {
      if (value)
        el.setAttribute(name, '');
      else
        el.removeAttribute(name);
      return;
    }

    el.setAttribute(name, sanitizeValue(value));
  }

  function attributeBinding(el, name, conditional) {
    return function(value) {
      updateAttribute(el, name, conditional, value);
    };
  }

  Element.prototype.bind = function(name, value, oneTime) {
    var conditional = name[name.length - 1] == '?';
    if (conditional) {
      this.removeAttribute(name);
      name = name.slice(0, -1);
    }

    if (oneTime)
      return updateAttribute(this, name, conditional, value);


    var observable = value;
    updateAttribute(this, name, conditional,
        observable.open(attributeBinding(this, name, conditional)));

    return maybeUpdateBindings(this, name, observable);
  };

  var checkboxEventType;
  (function() {
    // Attempt to feature-detect which event (change or click) is fired first
    // for checkboxes.
    var div = document.createElement('div');
    var checkbox = div.appendChild(document.createElement('input'));
    checkbox.setAttribute('type', 'checkbox');
    var first;
    var count = 0;
    checkbox.addEventListener('click', function(e) {
      count++;
      first = first || 'click';
    });
    checkbox.addEventListener('change', function() {
      count++;
      first = first || 'change';
    });

    var event = document.createEvent('MouseEvent');
    event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false,
        false, false, false, 0, null);
    checkbox.dispatchEvent(event);
    // WebKit/Blink don't fire the change event if the element is outside the
    // document, so assume 'change' for that case.
    checkboxEventType = count == 1 ? 'change' : first;
  })();

  function getEventForInputType(element) {
    switch (element.type) {
      case 'checkbox':
        return checkboxEventType;
      case 'radio':
      case 'select-multiple':
      case 'select-one':
        return 'change';
      case 'range':
        if (/Trident|MSIE/.test(navigator.userAgent))
          return 'change';
      default:
        return 'input';
    }
  }

  function updateInput(input, property, value, santizeFn) {
    input[property] = (santizeFn || sanitizeValue)(value);
  }

  function inputBinding(input, property, santizeFn) {
    return function(value) {
      return updateInput(input, property, value, santizeFn);
    }
  }

  function noop() {}

  function bindInputEvent(input, property, observable, postEventFn) {
    var eventType = getEventForInputType(input);

    function eventHandler() {
      var isNum = property == 'value' && input.type == 'number';
      observable.setValue(isNum ? input.valueAsNumber : input[property]);
      observable.discardChanges();
      (postEventFn || noop)(input);
      Platform.performMicrotaskCheckpoint();
    }
    input.addEventListener(eventType, eventHandler);

    return {
      close: function() {
        input.removeEventListener(eventType, eventHandler);
        observable.close();
      },

      observable_: observable
    }
  }

  function booleanSanitize(value) {
    return Boolean(value);
  }

  // |element| is assumed to be an HTMLInputElement with |type| == 'radio'.
  // Returns an array containing all radio buttons other than |element| that
  // have the same |name|, either in the form that |element| belongs to or,
  // if no form, in the document tree to which |element| belongs.
  //
  // This implementation is based upon the HTML spec definition of a
  // "radio button group":
  //   http://www.whatwg.org/specs/web-apps/current-work/multipage/number-state.html#radio-button-group
  //
  function getAssociatedRadioButtons(element) {
    if (element.form) {
      return filter(element.form.elements, function(el) {
        return el != element &&
            el.tagName == 'INPUT' &&
            el.type == 'radio' &&
            el.name == element.name;
      });
    } else {
      var treeScope = getTreeScope(element);
      if (!treeScope)
        return [];
      var radios = treeScope.querySelectorAll(
          'input[type="radio"][name="' + element.name + '"]');
      return filter(radios, function(el) {
        return el != element && !el.form;
      });
    }
  }

  function checkedPostEvent(input) {
    // Only the radio button that is getting checked gets an event. We
    // therefore find all the associated radio buttons and update their
    // check binding manually.
    if (input.tagName === 'INPUT' &&
        input.type === 'radio') {
      getAssociatedRadioButtons(input).forEach(function(radio) {
        var checkedBinding = radio.bindings_.checked;
        if (checkedBinding) {
          // Set the value directly to avoid an infinite call stack.
          checkedBinding.observable_.setValue(false);
        }
      });
    }
  }

  HTMLInputElement.prototype.bind = function(name, value, oneTime) {
    if (name !== 'value' && name !== 'checked')
      return HTMLElement.prototype.bind.call(this, name, value, oneTime);

    this.removeAttribute(name);
    var sanitizeFn = name == 'checked' ? booleanSanitize : sanitizeValue;
    var postEventFn = name == 'checked' ? checkedPostEvent : noop;

    if (oneTime)
      return updateInput(this, name, value, sanitizeFn);


    var observable = value;
    var binding = bindInputEvent(this, name, observable, postEventFn);
    updateInput(this, name,
                observable.open(inputBinding(this, name, sanitizeFn)),
                sanitizeFn);

    // Checkboxes may need to update bindings of other checkboxes.
    return updateBindings(this, name, binding);
  }

  HTMLTextAreaElement.prototype.bind = function(name, value, oneTime) {
    if (name !== 'value')
      return HTMLElement.prototype.bind.call(this, name, value, oneTime);

    this.removeAttribute('value');

    if (oneTime)
      return updateInput(this, 'value', value);

    var observable = value;
    var binding = bindInputEvent(this, 'value', observable);
    updateInput(this, 'value',
                observable.open(inputBinding(this, 'value', sanitizeValue)));
    return maybeUpdateBindings(this, name, binding);
  }

  function updateOption(option, value) {
    var parentNode = option.parentNode;;
    var select;
    var selectBinding;
    var oldValue;
    if (parentNode instanceof HTMLSelectElement &&
        parentNode.bindings_ &&
        parentNode.bindings_.value) {
      select = parentNode;
      selectBinding = select.bindings_.value;
      oldValue = select.value;
    }

    option.value = sanitizeValue(value);

    if (select && select.value != oldValue) {
      selectBinding.observable_.setValue(select.value);
      selectBinding.observable_.discardChanges();
      Platform.performMicrotaskCheckpoint();
    }
  }

  function optionBinding(option) {
    return function(value) {
      updateOption(option, value);
    }
  }

  HTMLOptionElement.prototype.bind = function(name, value, oneTime) {
    if (name !== 'value')
      return HTMLElement.prototype.bind.call(this, name, value, oneTime);

    this.removeAttribute('value');

    if (oneTime)
      return updateOption(this, value);

    var observable = value;
    var binding = bindInputEvent(this, 'value', observable);
    updateOption(this, observable.open(optionBinding(this)));
    return maybeUpdateBindings(this, name, binding);
  }

  HTMLSelectElement.prototype.bind = function(name, value, oneTime) {
    if (name === 'selectedindex')
      name = 'selectedIndex';

    if (name !== 'selectedIndex' && name !== 'value')
      return HTMLElement.prototype.bind.call(this, name, value, oneTime);

    this.removeAttribute(name);

    if (oneTime)
      return updateInput(this, name, value);

    var observable = value;
    var binding = bindInputEvent(this, name, observable);
    updateInput(this, name,
                observable.open(inputBinding(this, name)));

    // Option update events may need to access select bindings.
    return updateBindings(this, name, binding);
  }
})(this);

// Copyright (c) 2014 The Polymer Project Authors. All rights reserved.
// This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
// The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
// The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
// Code distributed by Google as part of the polymer project is also
// subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt

(function(global) {
  'use strict';

  function assert(v) {
    if (!v)
      throw new Error('Assertion failed');
  }

  var forEach = Array.prototype.forEach.call.bind(Array.prototype.forEach);

  function getFragmentRoot(node) {
    var p;
    while (p = node.parentNode) {
      node = p;
    }

    return node;
  }

  function searchRefId(node, id) {
    if (!id)
      return;

    var ref;
    var selector = '#' + id;
    while (!ref) {
      node = getFragmentRoot(node);

      if (node.protoContent_)
        ref = node.protoContent_.querySelector(selector);
      else if (node.getElementById)
        ref = node.getElementById(id);

      if (ref || !node.templateCreator_)
        break

      node = node.templateCreator_;
    }

    return ref;
  }

  function getInstanceRoot(node) {
    while (node.parentNode) {
      node = node.parentNode;
    }
    return node.templateCreator_ ? node : null;
  }

  var Map;
  if (global.Map && typeof global.Map.prototype.forEach === 'function') {
    Map = global.Map;
  } else {
    Map = function() {
      this.keys = [];
      this.values = [];
    };

    Map.prototype = {
      set: function(key, value) {
        var index = this.keys.indexOf(key);
        if (index < 0) {
          this.keys.push(key);
          this.values.push(value);
        } else {
          this.values[index] = value;
        }
      },

      get: function(key) {
        var index = this.keys.indexOf(key);
        if (index < 0)
          return;

        return this.values[index];
      },

      delete: function(key, value) {
        var index = this.keys.indexOf(key);
        if (index < 0)
          return false;

        this.keys.splice(index, 1);
        this.values.splice(index, 1);
        return true;
      },

      forEach: function(f, opt_this) {
        for (var i = 0; i < this.keys.length; i++)
          f.call(opt_this || this, this.values[i], this.keys[i], this);
      }
    };
  }

  // JScript does not have __proto__. We wrap all object literals with
  // createObject which uses Object.create, Object.defineProperty and
  // Object.getOwnPropertyDescriptor to create a new object that does the exact
  // same thing. The main downside to this solution is that we have to extract
  // all those property descriptors for IE.
  var createObject = ('__proto__' in {}) ?
      function(obj) { return obj; } :
      function(obj) {
        var proto = obj.__proto__;
        if (!proto)
          return obj;
        var newObject = Object.create(proto);
        Object.getOwnPropertyNames(obj).forEach(function(name) {
          Object.defineProperty(newObject, name,
                               Object.getOwnPropertyDescriptor(obj, name));
        });
        return newObject;
      };

  // IE does not support have Document.prototype.contains.
  if (typeof document.contains != 'function') {
    Document.prototype.contains = function(node) {
      if (node === this || node.parentNode === this)
        return true;
      return this.documentElement.contains(node);
    }
  }

  var BIND = 'bind';
  var REPEAT = 'repeat';
  var IF = 'if';

  var templateAttributeDirectives = {
    'template': true,
    'repeat': true,
    'bind': true,
    'ref': true,
    'if': true
  };

  var semanticTemplateElements = {
    'THEAD': true,
    'TBODY': true,
    'TFOOT': true,
    'TH': true,
    'TR': true,
    'TD': true,
    'COLGROUP': true,
    'COL': true,
    'CAPTION': true,
    'OPTION': true,
    'OPTGROUP': true
  };

  var hasTemplateElement = typeof HTMLTemplateElement !== 'undefined';
  if (hasTemplateElement) {
    // TODO(rafaelw): Remove when fix for
    // https://codereview.chromium.org/164803002/
    // makes it to Chrome release.
    (function() {
      var t = document.createElement('template');
      var d = t.content.ownerDocument;
      var html = d.appendChild(d.createElement('html'));
      var head = html.appendChild(d.createElement('head'));
      var base = d.createElement('base');
      base.href = document.baseURI;
      head.appendChild(base);
    })();
  }

  var allTemplatesSelectors = 'template, ' +
      Object.keys(semanticTemplateElements).map(function(tagName) {
        return tagName.toLowerCase() + '[template]';
      }).join(', ');

  function isSVGTemplate(el) {
    return el.tagName == 'template' &&
           el.namespaceURI == 'http://www.w3.org/2000/svg';
  }

  function isHTMLTemplate(el) {
    return el.tagName == 'TEMPLATE' &&
           el.namespaceURI == 'http://www.w3.org/1999/xhtml';
  }

  function isAttributeTemplate(el) {
    return Boolean(semanticTemplateElements[el.tagName] &&
                   el.hasAttribute('template'));
  }

  function isTemplate(el) {
    if (el.isTemplate_ === undefined)
      el.isTemplate_ = el.tagName == 'TEMPLATE' || isAttributeTemplate(el);

    return el.isTemplate_;
  }

  // FIXME: Observe templates being added/removed from documents
  // FIXME: Expose imperative API to decorate and observe templates in
  // "disconnected tress" (e.g. ShadowRoot)
  document.addEventListener('DOMContentLoaded', function(e) {
    bootstrapTemplatesRecursivelyFrom(document);
    // FIXME: Is this needed? Seems like it shouldn't be.
    Platform.performMicrotaskCheckpoint();
  }, false);

  function forAllTemplatesFrom(node, fn) {
    var subTemplates = node.querySelectorAll(allTemplatesSelectors);

    if (isTemplate(node))
      fn(node)
    forEach(subTemplates, fn);
  }

  function bootstrapTemplatesRecursivelyFrom(node) {
    function bootstrap(template) {
      if (!HTMLTemplateElement.decorate(template))
        bootstrapTemplatesRecursivelyFrom(template.content);
    }

    forAllTemplatesFrom(node, bootstrap);
  }

  if (!hasTemplateElement) {
    /**
     * This represents a <template> element.
     * @constructor
     * @extends {HTMLElement}
     */
    global.HTMLTemplateElement = function() {
      throw TypeError('Illegal constructor');
    };
  }

  var hasProto = '__proto__' in {};

  function mixin(to, from) {
    Object.getOwnPropertyNames(from).forEach(function(name) {
      Object.defineProperty(to, name,
                            Object.getOwnPropertyDescriptor(from, name));
    });
  }

  // http://dvcs.w3.org/hg/webcomponents/raw-file/tip/spec/templates/index.html#dfn-template-contents-owner
  function getOrCreateTemplateContentsOwner(template) {
    var doc = template.ownerDocument
    if (!doc.defaultView)
      return doc;
    var d = doc.templateContentsOwner_;
    if (!d) {
      // TODO(arv): This should either be a Document or HTMLDocument depending
      // on doc.
      d = doc.implementation.createHTMLDocument('');
      while (d.lastChild) {
        d.removeChild(d.lastChild);
      }
      doc.templateContentsOwner_ = d;
    }
    return d;
  }

  function getTemplateStagingDocument(template) {
    if (!template.stagingDocument_) {
      var owner = template.ownerDocument;
      if (!owner.stagingDocument_) {
        owner.stagingDocument_ = owner.implementation.createHTMLDocument('');
        owner.stagingDocument_.isStagingDocument = true;
        // TODO(rafaelw): Remove when fix for
        // https://codereview.chromium.org/164803002/
        // makes it to Chrome release.
        var base = owner.stagingDocument_.createElement('base');
        base.href = document.baseURI;
        owner.stagingDocument_.head.appendChild(base);

        owner.stagingDocument_.stagingDocument_ = owner.stagingDocument_;
      }

      template.stagingDocument_ = owner.stagingDocument_;
    }

    return template.stagingDocument_;
  }

  // For non-template browsers, the parser will disallow <template> in certain
  // locations, so we allow "attribute templates" which combine the template
  // element with the top-level container node of the content, e.g.
  //
  //   <tr template repeat="{{ foo }}"" class="bar"><td>Bar</td></tr>
  //
  // becomes
  //
  //   <template repeat="{{ foo }}">
  //   + #document-fragment
  //     + <tr class="bar">
  //       + <td>Bar</td>
  //
  function extractTemplateFromAttributeTemplate(el) {
    var template = el.ownerDocument.createElement('template');
    el.parentNode.insertBefore(template, el);

    var attribs = el.attributes;
    var count = attribs.length;
    while (count-- > 0) {
      var attrib = attribs[count];
      if (templateAttributeDirectives[attrib.name]) {
        if (attrib.name !== 'template')
          template.setAttribute(attrib.name, attrib.value);
        el.removeAttribute(attrib.name);
      }
    }

    return template;
  }

  function extractTemplateFromSVGTemplate(el) {
    var template = el.ownerDocument.createElement('template');
    el.parentNode.insertBefore(template, el);

    var attribs = el.attributes;
    var count = attribs.length;
    while (count-- > 0) {
      var attrib = attribs[count];
      template.setAttribute(attrib.name, attrib.value);
      el.removeAttribute(attrib.name);
    }

    el.parentNode.removeChild(el);
    return template;
  }

  function liftNonNativeTemplateChildrenIntoContent(template, el, useRoot) {
    var content = template.content;
    if (useRoot) {
      content.appendChild(el);
      return;
    }

    var child;
    while (child = el.firstChild) {
      content.appendChild(child);
    }
  }

  var templateObserver;
  if (typeof MutationObserver == 'function') {
    templateObserver = new MutationObserver(function(records) {
      for (var i = 0; i < records.length; i++) {
        records[i].target.refChanged_();
      }
    });
  }

  /**
   * Ensures proper API and content model for template elements.
   * @param {HTMLTemplateElement} opt_instanceRef The template element which
   *     |el| template element will return as the value of its ref(), and whose
   *     content will be used as source when createInstance() is invoked.
   */
  HTMLTemplateElement.decorate = function(el, opt_instanceRef) {
    if (el.templateIsDecorated_)
      return false;

    var templateElement = el;
    templateElement.templateIsDecorated_ = true;

    var isNativeHTMLTemplate = isHTMLTemplate(templateElement) &&
                               hasTemplateElement;
    var bootstrapContents = isNativeHTMLTemplate;
    var liftContents = !isNativeHTMLTemplate;
    var liftRoot = false;

    if (!isNativeHTMLTemplate) {
      if (isAttributeTemplate(templateElement)) {
        assert(!opt_instanceRef);
        templateElement = extractTemplateFromAttributeTemplate(el);
        templateElement.templateIsDecorated_ = true;
        isNativeHTMLTemplate = hasTemplateElement;
        liftRoot = true;
      } else if (isSVGTemplate(templateElement)) {
        templateElement = extractTemplateFromSVGTemplate(el);
        templateElement.templateIsDecorated_ = true;
        isNativeHTMLTemplate = hasTemplateElement;
      }
    }

    if (!isNativeHTMLTemplate) {
      fixTemplateElementPrototype(templateElement);
      var doc = getOrCreateTemplateContentsOwner(templateElement);
      templateElement.content_ = doc.createDocumentFragment();
    }

    if (opt_instanceRef) {
      // template is contained within an instance, its direct content must be
      // empty
      templateElement.instanceRef_ = opt_instanceRef;
    } else if (liftContents) {
      liftNonNativeTemplateChildrenIntoContent(templateElement,
                                               el,
                                               liftRoot);
    } else if (bootstrapContents) {
      bootstrapTemplatesRecursivelyFrom(templateElement.content);
    }

    return true;
  };

  // TODO(rafaelw): This used to decorate recursively all templates from a given
  // node. This happens by default on 'DOMContentLoaded', but may be needed
  // in subtrees not descendent from document (e.g. ShadowRoot).
  // Review whether this is the right public API.
  HTMLTemplateElement.bootstrap = bootstrapTemplatesRecursivelyFrom;

  var htmlElement = global.HTMLUnknownElement || HTMLElement;

  var contentDescriptor = {
    get: function() {
      return this.content_;
    },
    enumerable: true,
    configurable: true
  };

  if (!hasTemplateElement) {
    // Gecko is more picky with the prototype than WebKit. Make sure to use the
    // same prototype as created in the constructor.
    HTMLTemplateElement.prototype = Object.create(htmlElement.prototype);

    Object.defineProperty(HTMLTemplateElement.prototype, 'content',
                          contentDescriptor);
  }

  function fixTemplateElementPrototype(el) {
    if (hasProto)
      el.__proto__ = HTMLTemplateElement.prototype;
    else
      mixin(el, HTMLTemplateElement.prototype);
  }

  function ensureSetModelScheduled(template) {
    if (!template.setModelFn_) {
      template.setModelFn_ = function() {
        template.setModelFnScheduled_ = false;
        var map = getBindings(template,
            template.delegate_ && template.delegate_.prepareBinding);
        processBindings(template, map, template.model_);
      };
    }

    if (!template.setModelFnScheduled_) {
      template.setModelFnScheduled_ = true;
      Observer.runEOM_(template.setModelFn_);
    }
  }

  mixin(HTMLTemplateElement.prototype, {
    bind: function(name, value, oneTime) {
      if (name != 'ref')
        return Element.prototype.bind.call(this, name, value, oneTime);

      var self = this;
      var ref = oneTime ? value : value.open(function(ref) {
        self.setAttribute('ref', ref);
        self.refChanged_();
      });

      this.setAttribute('ref', ref);
      this.refChanged_();
      if (oneTime)
        return;

      if (!this.bindings_) {
        this.bindings_ = { ref: value };
      } else {
        this.bindings_.ref = value;
      }

      return value;
    },

    processBindingDirectives_: function(directives) {
      if (this.iterator_)
        this.iterator_.closeDeps();

      if (!directives.if && !directives.bind && !directives.repeat) {
        if (this.iterator_) {
          this.iterator_.close();
          this.iterator_ = undefined;
        }

        return;
      }

      if (!this.iterator_) {
        this.iterator_ = new TemplateIterator(this);
      }

      this.iterator_.updateDependencies(directives, this.model_);

      if (templateObserver) {
        templateObserver.observe(this, { attributes: true,
                                         attributeFilter: ['ref'] });
      }

      return this.iterator_;
    },

    createInstance: function(model, bindingDelegate, delegate_) {
      if (bindingDelegate)
        delegate_ = this.newDelegate_(bindingDelegate);
      else if (!delegate_)
        delegate_ = this.delegate_;

      if (!this.refContent_)
        this.refContent_ = this.ref_.content;
      var content = this.refContent_;
      if (content.firstChild === null)
        return emptyInstance;

      var map = getInstanceBindingMap(content, delegate_);
      var stagingDocument = getTemplateStagingDocument(this);
      var instance = stagingDocument.createDocumentFragment();
      instance.templateCreator_ = this;
      instance.protoContent_ = content;
      instance.bindings_ = [];
      instance.terminator_ = null;
      var instanceRecord = instance.templateInstance_ = {
        firstNode: null,
        lastNode: null,
        model: model
      };

      var i = 0;
      var collectTerminator = false;
      for (var child = content.firstChild; child; child = child.nextSibling) {
        // The terminator of the instance is the clone of the last child of the
        // content. If the last child is an active template, it may produce
        // instances as a result of production, so simply collecting the last
        // child of the instance after it has finished producing may be wrong.
        if (child.nextSibling === null)
          collectTerminator = true;

        var clone = cloneAndBindInstance(child, instance, stagingDocument,
                                         map.children[i++],
                                         model,
                                         delegate_,
                                         instance.bindings_);
        clone.templateInstance_ = instanceRecord;
        if (collectTerminator)
          instance.terminator_ = clone;
      }

      instanceRecord.firstNode = instance.firstChild;
      instanceRecord.lastNode = instance.lastChild;
      instance.templateCreator_ = undefined;
      instance.protoContent_ = undefined;
      return instance;
    },

    get model() {
      return this.model_;
    },

    set model(model) {
      this.model_ = model;
      ensureSetModelScheduled(this);
    },

    get bindingDelegate() {
      return this.delegate_ && this.delegate_.raw;
    },

    refChanged_: function() {
      if (!this.iterator_ || this.refContent_ === this.ref_.content)
        return;

      this.refContent_ = undefined;
      this.iterator_.valueChanged();
      this.iterator_.updateIteratedValue(this.iterator_.getUpdatedValue());
    },

    clear: function() {
      this.model_ = undefined;
      this.delegate_ = undefined;
      if (this.bindings_ && this.bindings_.ref)
        this.bindings_.ref.close()
      this.refContent_ = undefined;
      if (!this.iterator_)
        return;
      this.iterator_.valueChanged();
      this.iterator_.close()
      this.iterator_ = undefined;
    },

    setDelegate_: function(delegate) {
      this.delegate_ = delegate;
      this.bindingMap_ = undefined;
      if (this.iterator_) {
        this.iterator_.instancePositionChangedFn_ = undefined;
        this.iterator_.instanceModelFn_ = undefined;
      }
    },

    newDelegate_: function(bindingDelegate) {
      if (!bindingDelegate)
        return;

      function delegateFn(name) {
        var fn = bindingDelegate && bindingDelegate[name];
        if (typeof fn != 'function')
          return;

        return function() {
          return fn.apply(bindingDelegate, arguments);
        };
      }

      return {
        bindingMaps: {},
        raw: bindingDelegate,
        prepareBinding: delegateFn('prepareBinding'),
        prepareInstanceModel: delegateFn('prepareInstanceModel'),
        prepareInstancePositionChanged:
            delegateFn('prepareInstancePositionChanged')
      };
    },

    set bindingDelegate(bindingDelegate) {
      if (this.delegate_) {
        throw Error('Template must be cleared before a new bindingDelegate ' +
                    'can be assigned');
      }

      this.setDelegate_(this.newDelegate_(bindingDelegate));
    },

    get ref_() {
      var ref = searchRefId(this, this.getAttribute('ref'));
      if (!ref)
        ref = this.instanceRef_;

      if (!ref)
        return this;

      var nextRef = ref.ref_;
      return nextRef ? nextRef : ref;
    }
  });

  // Returns
  //   a) undefined if there are no mustaches.
  //   b) [TEXT, (ONE_TIME?, PATH, DELEGATE_FN, TEXT)+] if there is at least one mustache.
  function parseMustaches(s, name, node, prepareBindingFn) {
    if (!s || !s.length)
      return;

    var tokens;
    var length = s.length;
    var startIndex = 0, lastIndex = 0, endIndex = 0;
    var onlyOneTime = true;
    while (lastIndex < length) {
      var startIndex = s.indexOf('{{', lastIndex);
      var oneTimeStart = s.indexOf('[[', lastIndex);
      var oneTime = false;
      var terminator = '}}';

      if (oneTimeStart >= 0 &&
          (startIndex < 0 || oneTimeStart < startIndex)) {
        startIndex = oneTimeStart;
        oneTime = true;
        terminator = ']]';
      }

      endIndex = startIndex < 0 ? -1 : s.indexOf(terminator, startIndex + 2);

      if (endIndex < 0) {
        if (!tokens)
          return;

        tokens.push(s.slice(lastIndex)); // TEXT
        break;
      }

      tokens = tokens || [];
      tokens.push(s.slice(lastIndex, startIndex)); // TEXT
      var pathString = s.slice(startIndex + 2, endIndex).trim();
      tokens.push(oneTime); // ONE_TIME?
      onlyOneTime = onlyOneTime && oneTime;
      var delegateFn = prepareBindingFn &&
                       prepareBindingFn(pathString, name, node);
      // Don't try to parse the expression if there's a prepareBinding function
      if (delegateFn == null) {
        tokens.push(Path.get(pathString)); // PATH
      } else {
        tokens.push(null);
      }
      tokens.push(delegateFn); // DELEGATE_FN
      lastIndex = endIndex + 2;
    }

    if (lastIndex === length)
      tokens.push(''); // TEXT

    tokens.hasOnePath = tokens.length === 5;
    tokens.isSimplePath = tokens.hasOnePath &&
                          tokens[0] == '' &&
                          tokens[4] == '';
    tokens.onlyOneTime = onlyOneTime;

    tokens.combinator = function(values) {
      var newValue = tokens[0];

      for (var i = 1; i < tokens.length; i += 4) {
        var value = tokens.hasOnePath ? values : values[(i - 1) / 4];
        if (value !== undefined)
          newValue += value;
        newValue += tokens[i + 3];
      }

      return newValue;
    }

    return tokens;
  };

  function processOneTimeBinding(name, tokens, node, model) {
    if (tokens.hasOnePath) {
      var delegateFn = tokens[3];
      var value = delegateFn ? delegateFn(model, node, true) :
                               tokens[2].getValueFrom(model);
      return tokens.isSimplePath ? value : tokens.combinator(value);
    }

    var values = [];
    for (var i = 1; i < tokens.length; i += 4) {
      var delegateFn = tokens[i + 2];
      values[(i - 1) / 4] = delegateFn ? delegateFn(model, node) :
          tokens[i + 1].getValueFrom(model);
    }

    return tokens.combinator(values);
  }

  function processSinglePathBinding(name, tokens, node, model) {
    var delegateFn = tokens[3];
    var observer = delegateFn ? delegateFn(model, node, false) :
        new PathObserver(model, tokens[2]);

    return tokens.isSimplePath ? observer :
        new ObserverTransform(observer, tokens.combinator);
  }

  function processBinding(name, tokens, node, model) {
    if (tokens.onlyOneTime)
      return processOneTimeBinding(name, tokens, node, model);

    if (tokens.hasOnePath)
      return processSinglePathBinding(name, tokens, node, model);

    var observer = new CompoundObserver();

    for (var i = 1; i < tokens.length; i += 4) {
      var oneTime = tokens[i];
      var delegateFn = tokens[i + 2];

      if (delegateFn) {
        var value = delegateFn(model, node, oneTime);
        if (oneTime)
          observer.addPath(value)
        else
          observer.addObserver(value);
        continue;
      }

      var path = tokens[i + 1];
      if (oneTime)
        observer.addPath(path.getValueFrom(model))
      else
        observer.addPath(model, path);
    }

    return new ObserverTransform(observer, tokens.combinator);
  }

  function processBindings(node, bindings, model, instanceBindings) {
    for (var i = 0; i < bindings.length; i += 2) {
      var name = bindings[i]
      var tokens = bindings[i + 1];
      var value = processBinding(name, tokens, node, model);
      var binding = node.bind(name, value, tokens.onlyOneTime);
      if (binding && instanceBindings)
        instanceBindings.push(binding);
    }

    node.bindFinished();
    if (!bindings.isTemplate)
      return;

    node.model_ = model;
    var iter = node.processBindingDirectives_(bindings);
    if (instanceBindings && iter)
      instanceBindings.push(iter);
  }

  function parseWithDefault(el, name, prepareBindingFn) {
    var v = el.getAttribute(name);
    return parseMustaches(v == '' ? '{{}}' : v, name, el, prepareBindingFn);
  }

  function parseAttributeBindings(element, prepareBindingFn) {
    assert(element);

    var bindings = [];
    var ifFound = false;
    var bindFound = false;

    for (var i = 0; i < element.attributes.length; i++) {
      var attr = element.attributes[i];
      var name = attr.name;
      var value = attr.value;

      // Allow bindings expressed in attributes to be prefixed with underbars.
      // We do this to allow correct semantics for browsers that don't implement
      // <template> where certain attributes might trigger side-effects -- and
      // for IE which sanitizes certain attributes, disallowing mustache
      // replacements in their text.
      while (name[0] === '_') {
        name = name.substring(1);
      }

      if (isTemplate(element) &&
          (name === IF || name === BIND || name === REPEAT)) {
        continue;
      }

      var tokens = parseMustaches(value, name, element,
                                  prepareBindingFn);
      if (!tokens)
        continue;

      bindings.push(name, tokens);
    }

    if (isTemplate(element)) {
      bindings.isTemplate = true;
      bindings.if = parseWithDefault(element, IF, prepareBindingFn);
      bindings.bind = parseWithDefault(element, BIND, prepareBindingFn);
      bindings.repeat = parseWithDefault(element, REPEAT, prepareBindingFn);

      if (bindings.if && !bindings.bind && !bindings.repeat)
        bindings.bind = parseMustaches('{{}}', BIND, element, prepareBindingFn);
    }

    return bindings;
  }

  function getBindings(node, prepareBindingFn) {
    if (node.nodeType === Node.ELEMENT_NODE)
      return parseAttributeBindings(node, prepareBindingFn);

    if (node.nodeType === Node.TEXT_NODE) {
      var tokens = parseMustaches(node.data, 'textContent', node,
                                  prepareBindingFn);
      if (tokens)
        return ['textContent', tokens];
    }

    return [];
  }

  function cloneAndBindInstance(node, parent, stagingDocument, bindings, model,
                                delegate,
                                instanceBindings,
                                instanceRecord) {
    var clone = parent.appendChild(stagingDocument.importNode(node, false));

    var i = 0;
    for (var child = node.firstChild; child; child = child.nextSibling) {
      cloneAndBindInstance(child, clone, stagingDocument,
                            bindings.children[i++],
                            model,
                            delegate,
                            instanceBindings);
    }

    if (bindings.isTemplate) {
      HTMLTemplateElement.decorate(clone, node);
      if (delegate)
        clone.setDelegate_(delegate);
    }

    processBindings(clone, bindings, model, instanceBindings);
    return clone;
  }

  function createInstanceBindingMap(node, prepareBindingFn) {
    var map = getBindings(node, prepareBindingFn);
    map.children = {};
    var index = 0;
    for (var child = node.firstChild; child; child = child.nextSibling) {
      map.children[index++] = createInstanceBindingMap(child, prepareBindingFn);
    }

    return map;
  }

  var contentUidCounter = 1;

  // TODO(rafaelw): Setup a MutationObserver on content which clears the id
  // so that bindingMaps regenerate when the template.content changes.
  function getContentUid(content) {
    var id = content.id_;
    if (!id)
      id = content.id_ = contentUidCounter++;
    return id;
  }

  // Each delegate is associated with a set of bindingMaps, one for each
  // content which may be used by a template. The intent is that each binding
  // delegate gets the opportunity to prepare the instance (via the prepare*
  // delegate calls) once across all uses.
  // TODO(rafaelw): Separate out the parse map from the binding map. In the
  // current implementation, if two delegates need a binding map for the same
  // content, the second will have to reparse.
  function getInstanceBindingMap(content, delegate_) {
    var contentId = getContentUid(content);
    if (delegate_) {
      var map = delegate_.bindingMaps[contentId];
      if (!map) {
        map = delegate_.bindingMaps[contentId] =
            createInstanceBindingMap(content, delegate_.prepareBinding) || [];
      }
      return map;
    }

    var map = content.bindingMap_;
    if (!map) {
      map = content.bindingMap_ =
          createInstanceBindingMap(content, undefined) || [];
    }
    return map;
  }

  Object.defineProperty(Node.prototype, 'templateInstance', {
    get: function() {
      var instance = this.templateInstance_;
      return instance ? instance :
          (this.parentNode ? this.parentNode.templateInstance : undefined);
    }
  });

  var emptyInstance = document.createDocumentFragment();
  emptyInstance.bindings_ = [];
  emptyInstance.terminator_ = null;

  function TemplateIterator(templateElement) {
    this.closed = false;
    this.templateElement_ = templateElement;
    this.instances = [];
    this.deps = undefined;
    this.iteratedValue = [];
    this.presentValue = undefined;
    this.arrayObserver = undefined;
  }

  TemplateIterator.prototype = {
    closeDeps: function() {
      var deps = this.deps;
      if (deps) {
        if (deps.ifOneTime === false)
          deps.ifValue.close();
        if (deps.oneTime === false)
          deps.value.close();
      }
    },

    updateDependencies: function(directives, model) {
      this.closeDeps();

      var deps = this.deps = {};
      var template = this.templateElement_;

      var ifValue = true;
      if (directives.if) {
        deps.hasIf = true;
        deps.ifOneTime = directives.if.onlyOneTime;
        deps.ifValue = processBinding(IF, directives.if, template, model);

        ifValue = deps.ifValue;

        // oneTime if & predicate is false. nothing else to do.
        if (deps.ifOneTime && !ifValue) {
          this.valueChanged();
          return;
        }

        if (!deps.ifOneTime)
          ifValue = ifValue.open(this.updateIfValue, this);
      }

      if (directives.repeat) {
        deps.repeat = true;
        deps.oneTime = directives.repeat.onlyOneTime;
        deps.value = processBinding(REPEAT, directives.repeat, template, model);
      } else {
        deps.repeat = false;
        deps.oneTime = directives.bind.onlyOneTime;
        deps.value = processBinding(BIND, directives.bind, template, model);
      }

      var value = deps.value;
      if (!deps.oneTime)
        value = value.open(this.updateIteratedValue, this);

      if (!ifValue) {
        this.valueChanged();
        return;
      }

      this.updateValue(value);
    },

    /**
     * Gets the updated value of the bind/repeat. This can potentially call
     * user code (if a bindingDelegate is set up) so we try to avoid it if we
     * already have the value in hand (from Observer.open).
     */
    getUpdatedValue: function() {
      var value = this.deps.value;
      if (!this.deps.oneTime)
        value = value.discardChanges();
      return value;
    },

    updateIfValue: function(ifValue) {
      if (!ifValue) {
        this.valueChanged();
        return;
      }

      this.updateValue(this.getUpdatedValue());
    },

    updateIteratedValue: function(value) {
      if (this.deps.hasIf) {
        var ifValue = this.deps.ifValue;
        if (!this.deps.ifOneTime)
          ifValue = ifValue.discardChanges();
        if (!ifValue) {
          this.valueChanged();
          return;
        }
      }

      this.updateValue(value);
    },

    updateValue: function(value) {
      if (!this.deps.repeat)
        value = [value];
      var observe = this.deps.repeat &&
                    !this.deps.oneTime &&
                    Array.isArray(value);
      this.valueChanged(value, observe);
    },

    valueChanged: function(value, observeValue) {
      if (!Array.isArray(value))
        value = [];

      if (value === this.iteratedValue)
        return;

      this.unobserve();
      this.presentValue = value;
      if (observeValue) {
        this.arrayObserver = new ArrayObserver(this.presentValue);
        this.arrayObserver.open(this.handleSplices, this);
      }

      this.handleSplices(ArrayObserver.calculateSplices(this.presentValue,
                                                        this.iteratedValue));
    },

    getLastInstanceNode: function(index) {
      if (index == -1)
        return this.templateElement_;
      var instance = this.instances[index];
      var terminator = instance.terminator_;
      if (!terminator)
        return this.getLastInstanceNode(index - 1);

      if (terminator.nodeType !== Node.ELEMENT_NODE ||
          this.templateElement_ === terminator) {
        return terminator;
      }

      var subtemplateIterator = terminator.iterator_;
      if (!subtemplateIterator)
        return terminator;

      return subtemplateIterator.getLastTemplateNode();
    },

    getLastTemplateNode: function() {
      return this.getLastInstanceNode(this.instances.length - 1);
    },

    insertInstanceAt: function(index, fragment) {
      var previousInstanceLast = this.getLastInstanceNode(index - 1);
      var parent = this.templateElement_.parentNode;
      this.instances.splice(index, 0, fragment);

      parent.insertBefore(fragment, previousInstanceLast.nextSibling);
    },

    extractInstanceAt: function(index) {
      var previousInstanceLast = this.getLastInstanceNode(index - 1);
      var lastNode = this.getLastInstanceNode(index);
      var parent = this.templateElement_.parentNode;
      var instance = this.instances.splice(index, 1)[0];

      while (lastNode !== previousInstanceLast) {
        var node = previousInstanceLast.nextSibling;
        if (node == lastNode)
          lastNode = previousInstanceLast;

        instance.appendChild(parent.removeChild(node));
      }

      return instance;
    },

    getDelegateFn: function(fn) {
      fn = fn && fn(this.templateElement_);
      return typeof fn === 'function' ? fn : null;
    },

    handleSplices: function(splices) {
      if (this.closed || !splices.length)
        return;

      var template = this.templateElement_;

      if (!template.parentNode) {
        this.close();
        return;
      }

      ArrayObserver.applySplices(this.iteratedValue, this.presentValue,
                                 splices);

      var delegate = template.delegate_;
      if (this.instanceModelFn_ === undefined) {
        this.instanceModelFn_ =
            this.getDelegateFn(delegate && delegate.prepareInstanceModel);
      }

      if (this.instancePositionChangedFn_ === undefined) {
        this.instancePositionChangedFn_ =
            this.getDelegateFn(delegate &&
                               delegate.prepareInstancePositionChanged);
      }

      // Instance Removals
      var instanceCache = new Map;
      var removeDelta = 0;
      for (var i = 0; i < splices.length; i++) {
        var splice = splices[i];
        var removed = splice.removed;
        for (var j = 0; j < removed.length; j++) {
          var model = removed[j];
          var instance = this.extractInstanceAt(splice.index + removeDelta);
          if (instance !== emptyInstance) {
            instanceCache.set(model, instance);
          }
        }

        removeDelta -= splice.addedCount;
      }

      // Instance Insertions
      for (var i = 0; i < splices.length; i++) {
        var splice = splices[i];
        var addIndex = splice.index;
        for (; addIndex < splice.index + splice.addedCount; addIndex++) {
          var model = this.iteratedValue[addIndex];
          var instance = instanceCache.get(model);
          if (instance) {
            instanceCache.delete(model);
          } else {
            if (this.instanceModelFn_) {
              model = this.instanceModelFn_(model);
            }

            if (model === undefined) {
              instance = emptyInstance;
            } else {
              instance = template.createInstance(model, undefined, delegate);
            }
          }

          this.insertInstanceAt(addIndex, instance);
        }
      }

      instanceCache.forEach(function(instance) {
        this.closeInstanceBindings(instance);
      }, this);

      if (this.instancePositionChangedFn_)
        this.reportInstancesMoved(splices);
    },

    reportInstanceMoved: function(index) {
      var instance = this.instances[index];
      if (instance === emptyInstance)
        return;

      this.instancePositionChangedFn_(instance.templateInstance_, index);
    },

    reportInstancesMoved: function(splices) {
      var index = 0;
      var offset = 0;
      for (var i = 0; i < splices.length; i++) {
        var splice = splices[i];
        if (offset != 0) {
          while (index < splice.index) {
            this.reportInstanceMoved(index);
            index++;
          }
        } else {
          index = splice.index;
        }

        while (index < splice.index + splice.addedCount) {
          this.reportInstanceMoved(index);
          index++;
        }

        offset += splice.addedCount - splice.removed.length;
      }

      if (offset == 0)
        return;

      var length = this.instances.length;
      while (index < length) {
        this.reportInstanceMoved(index);
        index++;
      }
    },

    closeInstanceBindings: function(instance) {
      var bindings = instance.bindings_;
      for (var i = 0; i < bindings.length; i++) {
        bindings[i].close();
      }
    },

    unobserve: function() {
      if (!this.arrayObserver)
        return;

      this.arrayObserver.close();
      this.arrayObserver = undefined;
    },

    close: function() {
      if (this.closed)
        return;
      this.unobserve();
      for (var i = 0; i < this.instances.length; i++) {
        this.closeInstanceBindings(this.instances[i]);
      }

      this.instances.length = 0;
      this.closeDeps();
      this.templateElement_.iterator_ = undefined;
      this.closed = true;
    }
  };

  // Polyfill-specific API.
  HTMLTemplateElement.forAllTemplatesFrom_ = forAllTemplatesFrom;
})(this);

(function(scope) {
  'use strict';

  // feature detect for URL constructor
  var hasWorkingUrl = false;
  if (!scope.forceJURL) {
    try {
      var u = new URL('b', 'http://a');
      u.pathname = 'c%20d';
      hasWorkingUrl = u.href === 'http://a/c%20d';
    } catch(e) {}
  }

  if (hasWorkingUrl)
    return;

  var relative = Object.create(null);
  relative['ftp'] = 21;
  relative['file'] = 0;
  relative['gopher'] = 70;
  relative['http'] = 80;
  relative['https'] = 443;
  relative['ws'] = 80;
  relative['wss'] = 443;

  var relativePathDotMapping = Object.create(null);
  relativePathDotMapping['%2e'] = '.';
  relativePathDotMapping['.%2e'] = '..';
  relativePathDotMapping['%2e.'] = '..';
  relativePathDotMapping['%2e%2e'] = '..';

  function isRelativeScheme(scheme) {
    return relative[scheme] !== undefined;
  }

  function invalid() {
    clear.call(this);
    this._isInvalid = true;
  }

  function IDNAToASCII(h) {
    if ('' == h) {
      invalid.call(this)
    }
    // XXX
    return h.toLowerCase()
  }

  function percentEscape(c) {
    var unicode = c.charCodeAt(0);
    if (unicode > 0x20 &&
       unicode < 0x7F &&
       // " # < > ? `
       [0x22, 0x23, 0x3C, 0x3E, 0x3F, 0x60].indexOf(unicode) == -1
      ) {
      return c;
    }
    return encodeURIComponent(c);
  }

  function percentEscapeQuery(c) {
    // XXX This actually needs to encode c using encoding and then
    // convert the bytes one-by-one.

    var unicode = c.charCodeAt(0);
    if (unicode > 0x20 &&
       unicode < 0x7F &&
       // " # < > ` (do not escape '?')
       [0x22, 0x23, 0x3C, 0x3E, 0x60].indexOf(unicode) == -1
      ) {
      return c;
    }
    return encodeURIComponent(c);
  }

  var EOF = undefined,
      ALPHA = /[a-zA-Z]/,
      ALPHANUMERIC = /[a-zA-Z0-9\+\-\.]/;

  function parse(input, stateOverride, base) {
    function err(message) {
      errors.push(message)
    }

    var state = stateOverride || 'scheme start',
        cursor = 0,
        buffer = '',
        seenAt = false,
        seenBracket = false,
        errors = [];

    loop: while ((input[cursor - 1] != EOF || cursor == 0) && !this._isInvalid) {
      var c = input[cursor];
      switch (state) {
        case 'scheme start':
          if (c && ALPHA.test(c)) {
            buffer += c.toLowerCase(); // ASCII-safe
            state = 'scheme';
          } else if (!stateOverride) {
            buffer = '';
            state = 'no scheme';
            continue;
          } else {
            err('Invalid scheme.');
            break loop;
          }
          break;

        case 'scheme':
          if (c && ALPHANUMERIC.test(c)) {
            buffer += c.toLowerCase(); // ASCII-safe
          } else if (':' == c) {
            this._scheme = buffer;
            buffer = '';
            if (stateOverride) {
              break loop;
            }
            if (isRelativeScheme(this._scheme)) {
              this._isRelative = true;
            }
            if ('file' == this._scheme) {
              state = 'relative';
            } else if (this._isRelative && base && base._scheme == this._scheme) {
              state = 'relative or authority';
            } else if (this._isRelative) {
              state = 'authority first slash';
            } else {
              state = 'scheme data';
            }
          } else if (!stateOverride) {
            buffer = '';
            cursor = 0;
            state = 'no scheme';
            continue;
          } else if (EOF == c) {
            break loop;
          } else {
            err('Code point not allowed in scheme: ' + c)
            break loop;
          }
          break;

        case 'scheme data':
          if ('?' == c) {
            query = '?';
            state = 'query';
          } else if ('#' == c) {
            this._fragment = '#';
            state = 'fragment';
          } else {
            // XXX error handling
            if (EOF != c && '\t' != c && '\n' != c && '\r' != c) {
              this._schemeData += percentEscape(c);
            }
          }
          break;

        case 'no scheme':
          if (!base || !(isRelativeScheme(base._scheme))) {
            err('Missing scheme.');
            invalid.call(this);
          } else {
            state = 'relative';
            continue;
          }
          break;

        case 'relative or authority':
          if ('/' == c && '/' == input[cursor+1]) {
            state = 'authority ignore slashes';
          } else {
            err('Expected /, got: ' + c);
            state = 'relative';
            continue
          }
          break;

        case 'relative':
          this._isRelative = true;
          if ('file' != this._scheme)
            this._scheme = base._scheme;
          if (EOF == c) {
            this._host = base._host;
            this._port = base._port;
            this._path = base._path.slice();
            this._query = base._query;
            break loop;
          } else if ('/' == c || '\\' == c) {
            if ('\\' == c)
              err('\\ is an invalid code point.');
            state = 'relative slash';
          } else if ('?' == c) {
            this._host = base._host;
            this._port = base._port;
            this._path = base._path.slice();
            this._query = '?';
            state = 'query';
          } else if ('#' == c) {
            this._host = base._host;
            this._port = base._port;
            this._path = base._path.slice();
            this._query = base._query;
            this._fragment = '#';
            state = 'fragment';
          } else {
            var nextC = input[cursor+1]
            var nextNextC = input[cursor+2]
            if (
              'file' != this._scheme || !ALPHA.test(c) ||
              (nextC != ':' && nextC != '|') ||
              (EOF != nextNextC && '/' != nextNextC && '\\' != nextNextC && '?' != nextNextC && '#' != nextNextC)) {
              this._host = base._host;
              this._port = base._port;
              this._path = base._path.slice();
              this._path.pop();
            }
            state = 'relative path';
            continue;
          }
          break;

        case 'relative slash':
          if ('/' == c || '\\' == c) {
            if ('\\' == c) {
              err('\\ is an invalid code point.');
            }
            if ('file' == this._scheme) {
              state = 'file host';
            } else {
              state = 'authority ignore slashes';
            }
          } else {
            if ('file' != this._scheme) {
              this._host = base._host;
              this._port = base._port;
            }
            state = 'relative path';
            continue;
          }
          break;

        case 'authority first slash':
          if ('/' == c) {
            state = 'authority second slash';
          } else {
            err("Expected '/', got: " + c);
            state = 'authority ignore slashes';
            continue;
          }
          break;

        case 'authority second slash':
          state = 'authority ignore slashes';
          if ('/' != c) {
            err("Expected '/', got: " + c);
            continue;
          }
          break;

        case 'authority ignore slashes':
          if ('/' != c && '\\' != c) {
            state = 'authority';
            continue;
          } else {
            err('Expected authority, got: ' + c);
          }
          break;

        case 'authority':
          if ('@' == c) {
            if (seenAt) {
              err('@ already seen.');
              buffer += '%40';
            }
            seenAt = true;
            for (var i = 0; i < buffer.length; i++) {
              var cp = buffer[i];
              if ('\t' == cp || '\n' == cp || '\r' == cp) {
                err('Invalid whitespace in authority.');
                continue;
              }
              // XXX check URL code points
              if (':' == cp && null === this._password) {
                this._password = '';
                continue;
              }
              var tempC = percentEscape(cp);
              (null !== this._password) ? this._password += tempC : this._username += tempC;
            }
            buffer = '';
          } else if (EOF == c || '/' == c || '\\' == c || '?' == c || '#' == c) {
            cursor -= buffer.length;
            buffer = '';
            state = 'host';
            continue;
          } else {
            buffer += c;
          }
          break;

        case 'file host':
          if (EOF == c || '/' == c || '\\' == c || '?' == c || '#' == c) {
            if (buffer.length == 2 && ALPHA.test(buffer[0]) && (buffer[1] == ':' || buffer[1] == '|')) {
              state = 'relative path';
            } else if (buffer.length == 0) {
              state = 'relative path start';
            } else {
              this._host = IDNAToASCII.call(this, buffer);
              buffer = '';
              state = 'relative path start';
            }
            continue;
          } else if ('\t' == c || '\n' == c || '\r' == c) {
            err('Invalid whitespace in file host.');
          } else {
            buffer += c;
          }
          break;

        case 'host':
        case 'hostname':
          if (':' == c && !seenBracket) {
            // XXX host parsing
            this._host = IDNAToASCII.call(this, buffer);
            buffer = '';
            state = 'port';
            if ('hostname' == stateOverride) {
              break loop;
            }
          } else if (EOF == c || '/' == c || '\\' == c || '?' == c || '#' == c) {
            this._host = IDNAToASCII.call(this, buffer);
            buffer = '';
            state = 'relative path start';
            if (stateOverride) {
              break loop;
            }
            continue;
          } else if ('\t' != c && '\n' != c && '\r' != c) {
            if ('[' == c) {
              seenBracket = true;
            } else if (']' == c) {
              seenBracket = false;
            }
            buffer += c;
          } else {
            err('Invalid code point in host/hostname: ' + c);
          }
          break;

        case 'port':
          if (/[0-9]/.test(c)) {
            buffer += c;
          } else if (EOF == c || '/' == c || '\\' == c || '?' == c || '#' == c || stateOverride) {
            if ('' != buffer) {
              var temp = parseInt(buffer, 10);
              if (temp != relative[this._scheme]) {
                this._port = temp + '';
              }
              buffer = '';
            }
            if (stateOverride) {
              break loop;
            }
            state = 'relative path start';
            continue;
          } else if ('\t' == c || '\n' == c || '\r' == c) {
            err('Invalid code point in port: ' + c);
          } else {
            invalid.call(this);
          }
          break;

        case 'relative path start':
          if ('\\' == c)
            err("'\\' not allowed in path.");
          state = 'relative path';
          if ('/' != c && '\\' != c) {
            continue;
          }
          break;

        case 'relative path':
          if (EOF == c || '/' == c || '\\' == c || (!stateOverride && ('?' == c || '#' == c))) {
            if ('\\' == c) {
              err('\\ not allowed in relative path.');
            }
            var tmp;
            if (tmp = relativePathDotMapping[buffer.toLowerCase()]) {
              buffer = tmp;
            }
            if ('..' == buffer) {
              this._path.pop();
              if ('/' != c && '\\' != c) {
                this._path.push('');
              }
            } else if ('.' == buffer && '/' != c && '\\' != c) {
              this._path.push('');
            } else if ('.' != buffer) {
              if ('file' == this._scheme && this._path.length == 0 && buffer.length == 2 && ALPHA.test(buffer[0]) && buffer[1] == '|') {
                buffer = buffer[0] + ':';
              }
              this._path.push(buffer);
            }
            buffer = '';
            if ('?' == c) {
              this._query = '?';
              state = 'query';
            } else if ('#' == c) {
              this._fragment = '#';
              state = 'fragment';
            }
          } else if ('\t' != c && '\n' != c && '\r' != c) {
            buffer += percentEscape(c);
          }
          break;

        case 'query':
          if (!stateOverride && '#' == c) {
            this._fragment = '#';
            state = 'fragment';
          } else if (EOF != c && '\t' != c && '\n' != c && '\r' != c) {
            this._query += percentEscapeQuery(c);
          }
          break;

        case 'fragment':
          if (EOF != c && '\t' != c && '\n' != c && '\r' != c) {
            this._fragment += c;
          }
          break;
      }

      cursor++;
    }
  }

  function clear() {
    this._scheme = '';
    this._schemeData = '';
    this._username = '';
    this._password = null;
    this._host = '';
    this._port = '';
    this._path = [];
    this._query = '';
    this._fragment = '';
    this._isInvalid = false;
    this._isRelative = false;
  }

  // Does not process domain names or IP addresses.
  // Does not handle encoding for the query parameter.
  function jURL(url, base /* , encoding */) {
    if (base !== undefined && !(base instanceof jURL))
      base = new jURL(String(base));

    this._url = url;
    clear.call(this);

    var input = url.replace(/^[ \t\r\n\f]+|[ \t\r\n\f]+$/g, '');
    // encoding = encoding || 'utf-8'

    parse.call(this, input, null, base);
  }

  jURL.prototype = {
    get href() {
      if (this._isInvalid)
        return this._url;

      var authority = '';
      if ('' != this._username || null != this._password) {
        authority = this._username +
            (null != this._password ? ':' + this._password : '') + '@';
      }

      return this.protocol +
          (this._isRelative ? '//' + authority + this.host : '') +
          this.pathname + this._query + this._fragment;
    },
    set href(href) {
      clear.call(this);
      parse.call(this, href);
    },

    get protocol() {
      return this._scheme + ':';
    },
    set protocol(protocol) {
      if (this._isInvalid)
        return;
      parse.call(this, protocol + ':', 'scheme start');
    },

    get host() {
      return this._isInvalid ? '' : this._port ?
          this._host + ':' + this._port : this._host;
    },
    set host(host) {
      if (this._isInvalid || !this._isRelative)
        return;
      parse.call(this, host, 'host');
    },

    get hostname() {
      return this._host;
    },
    set hostname(hostname) {
      if (this._isInvalid || !this._isRelative)
        return;
      parse.call(this, hostname, 'hostname');
    },

    get port() {
      return this._port;
    },
    set port(port) {
      if (this._isInvalid || !this._isRelative)
        return;
      parse.call(this, port, 'port');
    },

    get pathname() {
      return this._isInvalid ? '' : this._isRelative ?
          '/' + this._path.join('/') : this._schemeData;
    },
    set pathname(pathname) {
      if (this._isInvalid || !this._isRelative)
        return;
      this._path = [];
      parse.call(this, pathname, 'relative path start');
    },

    get search() {
      return this._isInvalid || !this._query || '?' == this._query ?
          '' : this._query;
    },
    set search(search) {
      if (this._isInvalid || !this._isRelative)
        return;
      this._query = '?';
      if ('?' == search[0])
        search = search.slice(1);
      parse.call(this, search, 'query');
    },

    get hash() {
      return this._isInvalid || !this._fragment || '#' == this._fragment ?
          '' : this._fragment;
    },
    set hash(hash) {
      if (this._isInvalid)
        return;
      this._fragment = '#';
      if ('#' == hash[0])
        hash = hash.slice(1);
      parse.call(this, hash, 'fragment');
    },

    get origin() {
      var host;
      if (this._isInvalid || !this._scheme) {
        return '';
      }
      // javascript: Gecko returns String(""), WebKit/Blink String("null")
      // Gecko throws error for "data://"
      // data: Gecko returns "", Blink returns "data://", WebKit returns "null"
      // Gecko returns String("") for file: mailto:
      // WebKit/Blink returns String("SCHEME://") for file: mailto:
      switch (this._scheme) {
        case 'data':
        case 'file':
        case 'javascript':
        case 'mailto':
          return 'null';
      }
      host = this.host;
      if (!host) {
        return '';
      }
      return this._scheme + '://' + host;
    }
  };

  // Copy over the static methods
  var OriginalURL = scope.URL;
  if (OriginalURL) {
    jURL.createObjectURL = function(blob) {
      // IE extension allows a second optional options argument.
      // http://msdn.microsoft.com/en-us/library/ie/hh772302(v=vs.85).aspx
      return OriginalURL.createObjectURL.apply(OriginalURL, arguments);
    };
    jURL.revokeObjectURL = function(url) {
      OriginalURL.revokeObjectURL(url);
    };
  }

  scope.URL = jURL;

})(this);

(function(scope) {

var iterations = 0;
var callbacks = [];
var twiddle = document.createTextNode('');

function endOfMicrotask(callback) {
  twiddle.textContent = iterations++;
  callbacks.push(callback);
}

function atEndOfMicrotask() {
  while (callbacks.length) {
    callbacks.shift()();
  }
}

new (window.MutationObserver || JsMutationObserver)(atEndOfMicrotask)
  .observe(twiddle, {characterData: true})
  ;

// exports
scope.endOfMicrotask = endOfMicrotask;
// bc 
Platform.endOfMicrotask = endOfMicrotask;

})(Polymer);


(function(scope) {

/**
 * @class Polymer
 */

// imports
var endOfMicrotask = scope.endOfMicrotask;

// logging
var log = window.WebComponents ? WebComponents.flags.log : {};

// inject style sheet
var style = document.createElement('style');
style.textContent = 'template {display: none !important;} /* injected by platform.js */';
var head = document.querySelector('head');
head.insertBefore(style, head.firstChild);


/**
 * Force any pending data changes to be observed before 
 * the next task. Data changes are processed asynchronously but are guaranteed
 * to be processed, for example, before painting. This method should rarely be 
 * needed. It does nothing when Object.observe is available; 
 * when Object.observe is not available, Polymer automatically flushes data 
 * changes approximately every 1/10 second. 
 * Therefore, `flush` should only be used when a data mutation should be 
 * observed sooner than this.
 * 
 * @method flush
 */
// flush (with logging)
var flushing;
function flush() {
  if (!flushing) {
    flushing = true;
    endOfMicrotask(function() {
      flushing = false;
      log.data && console.group('flush');
      Platform.performMicrotaskCheckpoint();
      log.data && console.groupEnd();
    });
  }
};

// polling dirty checker
// flush periodically if platform does not have object observe.
if (!Observer.hasObjectObserve) {
  var FLUSH_POLL_INTERVAL = 125;
  window.addEventListener('WebComponentsReady', function() {
    flush();
    // watch document visiblity to toggle dirty-checking
    var visibilityHandler = function() {
      // only flush if the page is visibile
      if (document.visibilityState === 'hidden') {
        if (scope.flushPoll) {
          clearInterval(scope.flushPoll);
        }
      } else {
        scope.flushPoll = setInterval(flush, FLUSH_POLL_INTERVAL);
      }
    };
    if (typeof document.visibilityState === 'string') {
      document.addEventListener('visibilitychange', visibilityHandler);
    }
    visibilityHandler();
  });
} else {
  // make flush a no-op when we have Object.observe
  flush = function() {};
}

if (window.CustomElements && !CustomElements.useNative) {
  var originalImportNode = Document.prototype.importNode;
  Document.prototype.importNode = function(node, deep) {
    var imported = originalImportNode.call(this, node, deep);
    CustomElements.upgradeAll(imported);
    return imported;
  };
}

// exports
scope.flush = flush;
// bc
Platform.flush = flush;

})(window.Polymer);


(function(scope) {

var urlResolver = {
  resolveDom: function(root, url) {
    url = url || baseUrl(root);
    this.resolveAttributes(root, url);
    this.resolveStyles(root, url);
    // handle template.content
    var templates = root.querySelectorAll('template');
    if (templates) {
      for (var i = 0, l = templates.length, t; (i < l) && (t = templates[i]); i++) {
        if (t.content) {
          this.resolveDom(t.content, url);
        }
      }
    }
  },
  resolveTemplate: function(template) {
    this.resolveDom(template.content, baseUrl(template));
  },
  resolveStyles: function(root, url) {
    var styles = root.querySelectorAll('style');
    if (styles) {
      for (var i = 0, l = styles.length, s; (i < l) && (s = styles[i]); i++) {
        this.resolveStyle(s, url);
      }
    }
  },
  resolveStyle: function(style, url) {
    url = url || baseUrl(style);
    style.textContent = this.resolveCssText(style.textContent, url);
  },
  resolveCssText: function(cssText, baseUrl, keepAbsolute) {
    cssText = replaceUrlsInCssText(cssText, baseUrl, keepAbsolute, CSS_URL_REGEXP);
    return replaceUrlsInCssText(cssText, baseUrl, keepAbsolute, CSS_IMPORT_REGEXP);
  },
  resolveAttributes: function(root, url) {
    if (root.hasAttributes && root.hasAttributes()) {
      this.resolveElementAttributes(root, url);
    }
    // search for attributes that host urls
    var nodes = root && root.querySelectorAll(URL_ATTRS_SELECTOR);
    if (nodes) {
      for (var i = 0, l = nodes.length, n; (i < l) && (n = nodes[i]); i++) {
        this.resolveElementAttributes(n, url);
      }
    }
  },
  resolveElementAttributes: function(node, url) {
    url = url || baseUrl(node);
    URL_ATTRS.forEach(function(v) {
      var attr = node.attributes[v];
      var value = attr && attr.value;
      var replacement;
      if (value && value.search(URL_TEMPLATE_SEARCH) < 0) {
        if (v === 'style') {
          replacement = replaceUrlsInCssText(value, url, false, CSS_URL_REGEXP);
        } else {
          replacement = resolveRelativeUrl(url, value);
        }
        attr.value = replacement;
      }
    });
  }
};

var CSS_URL_REGEXP = /(url\()([^)]*)(\))/g;
var CSS_IMPORT_REGEXP = /(@import[\s]+(?!url\())([^;]*)(;)/g;
var URL_ATTRS = ['href', 'src', 'action', 'style', 'url'];
var URL_ATTRS_SELECTOR = '[' + URL_ATTRS.join('],[') + ']';
var URL_TEMPLATE_SEARCH = '{{.*}}';
var URL_HASH = '#';

function baseUrl(node) {
  var u = new URL(node.ownerDocument.baseURI);
  u.search = '';
  u.hash = '';
  return u;
}

function replaceUrlsInCssText(cssText, baseUrl, keepAbsolute, regexp) {
  return cssText.replace(regexp, function(m, pre, url, post) {
    var urlPath = url.replace(/["']/g, '');
    urlPath = resolveRelativeUrl(baseUrl, urlPath, keepAbsolute);
    return pre + '\'' + urlPath + '\'' + post;
  });
}

function resolveRelativeUrl(baseUrl, url, keepAbsolute) {
  // do not resolve '/' absolute urls
  if (url && url[0] === '/') {
    return url;
  }
  // do not resolve '#' links, they are used for routing
  if (url && url[0] === '#') {
    return url;
  }
  var u = new URL(url, baseUrl);
  return keepAbsolute ? u.href : makeDocumentRelPath(u.href);
}

function makeDocumentRelPath(url) {
  var root = baseUrl(document.documentElement);
  var u = new URL(url, root);
  if (u.host === root.host && u.port === root.port &&
      u.protocol === root.protocol) {
    return makeRelPath(root, u);
  } else {
    return url;
  }
}

// make a relative path from source to target
function makeRelPath(sourceUrl, targetUrl) {
  var source = sourceUrl.pathname;
  var target = targetUrl.pathname;
  var s = source.split('/');
  var t = target.split('/');
  while (s.length && s[0] === t[0]){
    s.shift();
    t.shift();
  }
  for (var i = 0, l = s.length - 1; i < l; i++) {
    t.unshift('..');
  }
  // empty '#' is discarded but we need to preserve it.
  var hash = (targetUrl.href.slice(-1) === URL_HASH) ? URL_HASH : targetUrl.hash;
  return t.join('/') + targetUrl.search + hash;
}

// exports
scope.urlResolver = urlResolver;

})(Polymer);

(function(scope) {
  var endOfMicrotask = Polymer.endOfMicrotask;

  // Generic url loader
  function Loader(regex) {
    this.cache = Object.create(null);
    this.map = Object.create(null);
    this.requests = 0;
    this.regex = regex;
  }
  Loader.prototype = {

    // TODO(dfreedm): there may be a better factoring here
    // extract absolute urls from the text (full of relative urls)
    extractUrls: function(text, base) {
      var matches = [];
      var matched, u;
      while ((matched = this.regex.exec(text))) {
        u = new URL(matched[1], base);
        matches.push({matched: matched[0], url: u.href});
      }
      return matches;
    },
    // take a text blob, a root url, and a callback and load all the urls found within the text
    // returns a map of absolute url to text
    process: function(text, root, callback) {
      var matches = this.extractUrls(text, root);

      // every call to process returns all the text this loader has ever received
      var done = callback.bind(null, this.map);
      this.fetch(matches, done);
    },
    // build a mapping of url -> text from matches
    fetch: function(matches, callback) {
      var inflight = matches.length;

      // return early if there is no fetching to be done
      if (!inflight) {
        return callback();
      }

      // wait for all subrequests to return
      var done = function() {
        if (--inflight === 0) {
          callback();
        }
      };

      // start fetching all subrequests
      var m, req, url;
      for (var i = 0; i < inflight; i++) {
        m = matches[i];
        url = m.url;
        req = this.cache[url];
        // if this url has already been requested, skip requesting it again
        if (!req) {
          req = this.xhr(url);
          req.match = m;
          this.cache[url] = req;
        }
        // wait for the request to process its subrequests
        req.wait(done);
      }
    },
    handleXhr: function(request) {
      var match = request.match;
      var url = match.url;

      // handle errors with an empty string
      var response = request.response || request.responseText || '';
      this.map[url] = response;
      this.fetch(this.extractUrls(response, url), request.resolve);
    },
    xhr: function(url) {
      this.requests++;
      var request = new XMLHttpRequest();
      request.open('GET', url, true);
      request.send();
      request.onerror = request.onload = this.handleXhr.bind(this, request);

      // queue of tasks to run after XHR returns
      request.pending = [];
      request.resolve = function() {
        var pending = request.pending;
        for(var i = 0; i < pending.length; i++) {
          pending[i]();
        }
        request.pending = null;
      };

      // if we have already resolved, pending is null, async call the callback
      request.wait = function(fn) {
        if (request.pending) {
          request.pending.push(fn);
        } else {
          endOfMicrotask(fn);
        }
      };

      return request;
    }
  };

  scope.Loader = Loader;
})(Polymer);

(function(scope) {

var urlResolver = scope.urlResolver;
var Loader = scope.Loader;

function StyleResolver() {
  this.loader = new Loader(this.regex);
}
StyleResolver.prototype = {
  regex: /@import\s+(?:url)?["'\(]*([^'"\)]*)['"\)]*;/g,
  // Recursively replace @imports with the text at that url
  resolve: function(text, url, callback) {
    var done = function(map) {
      callback(this.flatten(text, url, map));
    }.bind(this);
    this.loader.process(text, url, done);
  },
  // resolve the textContent of a style node
  resolveNode: function(style, url, callback) {
    var text = style.textContent;
    var done = function(text) {
      style.textContent = text;
      callback(style);
    };
    this.resolve(text, url, done);
  },
  // flatten all the @imports to text
  flatten: function(text, base, map) {
    var matches = this.loader.extractUrls(text, base);
    var match, url, intermediate;
    for (var i = 0; i < matches.length; i++) {
      match = matches[i];
      url = match.url;
      // resolve any css text to be relative to the importer, keep absolute url
      intermediate = urlResolver.resolveCssText(map[url], url, true);
      // flatten intermediate @imports
      intermediate = this.flatten(intermediate, base, map);
      text = text.replace(match.matched, intermediate);
    }
    return text;
  },
  loadStyles: function(styles, base, callback) {
    var loaded=0, l = styles.length;
    // called in the context of the style
    function loadedStyle(style) {
      loaded++;
      if (loaded === l && callback) {
        callback();
      }
    }
    for (var i=0, s; (i<l) && (s=styles[i]); i++) {
      this.resolveNode(s, base, loadedStyle);
    }
  }
};

var styleResolver = new StyleResolver();

// exports
scope.styleResolver = styleResolver;

})(Polymer);

(function(scope) {

  // copy own properties from 'api' to 'prototype, with name hinting for 'super'
  function extend(prototype, api) {
    if (prototype && api) {
      // use only own properties of 'api'
      Object.getOwnPropertyNames(api).forEach(function(n) {
        // acquire property descriptor
        var pd = Object.getOwnPropertyDescriptor(api, n);
        if (pd) {
          // clone property via descriptor
          Object.defineProperty(prototype, n, pd);
          // cache name-of-method for 'super' engine
          if (typeof pd.value == 'function') {
            // hint the 'super' engine
            pd.value.nom = n;
          }
        }
      });
    }
    return prototype;
  }


  // mixin

  // copy all properties from inProps (et al) to inObj
  function mixin(inObj/*, inProps, inMoreProps, ...*/) {
    var obj = inObj || {};
    for (var i = 1; i < arguments.length; i++) {
      var p = arguments[i];
      try {
        for (var n in p) {
          copyProperty(n, p, obj);
        }
      } catch(x) {
      }
    }
    return obj;
  }

  // copy property inName from inSource object to inTarget object
  function copyProperty(inName, inSource, inTarget) {
    var pd = getPropertyDescriptor(inSource, inName);
    Object.defineProperty(inTarget, inName, pd);
  }

  // get property descriptor for inName on inObject, even if
  // inName exists on some link in inObject's prototype chain
  function getPropertyDescriptor(inObject, inName) {
    if (inObject) {
      var pd = Object.getOwnPropertyDescriptor(inObject, inName);
      return pd || getPropertyDescriptor(Object.getPrototypeOf(inObject), inName);
    }
  }

  // exports

  scope.extend = extend;
  scope.mixin = mixin;

  // for bc
  Platform.mixin = mixin;

})(Polymer);

(function(scope) {
  
  // usage
  
  // invoke cb.call(this) in 100ms, unless the job is re-registered,
  // which resets the timer
  // 
  // this.myJob = this.job(this.myJob, cb, 100)
  //
  // returns a job handle which can be used to re-register a job

  var Job = function(inContext) {
    this.context = inContext;
    this.boundComplete = this.complete.bind(this)
  };
  Job.prototype = {
    go: function(callback, wait) {
      this.callback = callback;
      var h;
      if (!wait) {
        h = requestAnimationFrame(this.boundComplete);
        this.handle = function() {
          cancelAnimationFrame(h);
        }
      } else {
        h = setTimeout(this.boundComplete, wait);
        this.handle = function() {
          clearTimeout(h);
        }
      }
    },
    stop: function() {
      if (this.handle) {
        this.handle();
        this.handle = null;
      }
    },
    complete: function() {
      if (this.handle) {
        this.stop();
        this.callback.call(this.context);
      }
    }
  };
  
  function job(job, callback, wait) {
    if (job) {
      job.stop();
    } else {
      job = new Job(this);
    }
    job.go(callback, wait);
    return job;
  }
  
  // exports 

  scope.job = job;
  
})(Polymer);

(function(scope) {

  // dom polyfill, additions, and utility methods

  var registry = {};

  HTMLElement.register = function(tag, prototype) {
    registry[tag] = prototype;
  };

  // get prototype mapped to node <tag>
  HTMLElement.getPrototypeForTag = function(tag) {
    var prototype = !tag ? HTMLElement.prototype : registry[tag];
    // TODO(sjmiles): creating <tag> is likely to have wasteful side-effects
    return prototype || Object.getPrototypeOf(document.createElement(tag));
  };

  // we have to flag propagation stoppage for the event dispatcher
  var originalStopPropagation = Event.prototype.stopPropagation;
  Event.prototype.stopPropagation = function() {
    this.cancelBubble = true;
    originalStopPropagation.apply(this, arguments);
  };
  
  
  // polyfill DOMTokenList
  // * add/remove: allow these methods to take multiple classNames
  // * toggle: add a 2nd argument which forces the given state rather
  //  than toggling.

  var add = DOMTokenList.prototype.add;
  var remove = DOMTokenList.prototype.remove;
  DOMTokenList.prototype.add = function() {
    for (var i = 0; i < arguments.length; i++) {
      add.call(this, arguments[i]);
    }
  };
  DOMTokenList.prototype.remove = function() {
    for (var i = 0; i < arguments.length; i++) {
      remove.call(this, arguments[i]);
    }
  };
  DOMTokenList.prototype.toggle = function(name, bool) {
    if (arguments.length == 1) {
      bool = !this.contains(name);
    }
    bool ? this.add(name) : this.remove(name);
  };
  DOMTokenList.prototype.switch = function(oldName, newName) {
    oldName && this.remove(oldName);
    newName && this.add(newName);
  };

  // add array() to NodeList, NamedNodeMap, HTMLCollection

  var ArraySlice = function() {
    return Array.prototype.slice.call(this);
  };

  var namedNodeMap = (window.NamedNodeMap || window.MozNamedAttrMap || {});

  NodeList.prototype.array = ArraySlice;
  namedNodeMap.prototype.array = ArraySlice;
  HTMLCollection.prototype.array = ArraySlice;

  // utility

  function createDOM(inTagOrNode, inHTML, inAttrs) {
    var dom = typeof inTagOrNode == 'string' ?
        document.createElement(inTagOrNode) : inTagOrNode.cloneNode(true);
    dom.innerHTML = inHTML;
    if (inAttrs) {
      for (var n in inAttrs) {
        dom.setAttribute(n, inAttrs[n]);
      }
    }
    return dom;
  }

  // exports

  scope.createDOM = createDOM;

})(Polymer);

(function(scope) {
    // super

    // `arrayOfArgs` is an optional array of args like one might pass
    // to `Function.apply`

    // TODO(sjmiles):
    //    $super must be installed on an instance or prototype chain
    //    as `super`, and invoked via `this`, e.g.
    //      `this.super();`

    //    will not work if function objects are not unique, for example,
    //    when using mixins.
    //    The memoization strategy assumes each function exists on only one 
    //    prototype chain i.e. we use the function object for memoizing)
    //    perhaps we can bookkeep on the prototype itself instead
    function $super(arrayOfArgs) {
      // since we are thunking a method call, performance is important here: 
      // memoize all lookups, once memoized the fast path calls no other 
      // functions
      //
      // find the caller (cannot be `strict` because of 'caller')
      var caller = $super.caller;
      // memoized 'name of method' 
      var nom = caller.nom;
      // memoized next implementation prototype
      var _super = caller._super;
      if (!_super) {
        if (!nom) {
          nom = caller.nom = nameInThis.call(this, caller);
        }
        if (!nom) {
          console.warn('called super() on a method not installed declaratively (has no .nom property)');
        }
        // super prototype is either cached or we have to find it
        // by searching __proto__ (at the 'top')
        // invariant: because we cache _super on fn below, we never reach 
        // here from inside a series of calls to super(), so it's ok to 
        // start searching from the prototype of 'this' (at the 'top')
        // we must never memoize a null super for this reason
        _super = memoizeSuper(caller, nom, getPrototypeOf(this));
      }
      // our super function
      var fn = _super[nom];
      if (fn) {
        // memoize information so 'fn' can call 'super'
        if (!fn._super) {
          // must not memoize null, or we lose our invariant above
          memoizeSuper(fn, nom, _super);
        }
        // invoke the inherited method
        // if 'fn' is not function valued, this will throw
        return fn.apply(this, arrayOfArgs || []);
      }
    }

    function nameInThis(value) {
      var p = this.__proto__;
      while (p && p !== HTMLElement.prototype) {
        // TODO(sjmiles): getOwnPropertyNames is absurdly expensive
        var n$ = Object.getOwnPropertyNames(p);
        for (var i=0, l=n$.length, n; i<l && (n=n$[i]); i++) {
          var d = Object.getOwnPropertyDescriptor(p, n);
          if (typeof d.value === 'function' && d.value === value) {
            return n;
          }
        }
        p = p.__proto__;
      }
    }

    function memoizeSuper(method, name, proto) {
      // find and cache next prototype containing `name`
      // we need the prototype so we can do another lookup
      // from here
      var s = nextSuper(proto, name, method);
      if (s[name]) {
        // `s` is a prototype, the actual method is `s[name]`
        // tag super method with it's name for quicker lookups
        s[name].nom = name;
      }
      return method._super = s;
    }

    function nextSuper(proto, name, caller) {
      // look for an inherited prototype that implements name
      while (proto) {
        if ((proto[name] !== caller) && proto[name]) {
          return proto;
        }
        proto = getPrototypeOf(proto);
      }
      // must not return null, or we lose our invariant above
      // in this case, a super() call was invoked where no superclass
      // method exists
      // TODO(sjmiles): thow an exception?
      return Object;
    }

    // NOTE: In some platforms (IE10) the prototype chain is faked via 
    // __proto__. Therefore, always get prototype via __proto__ instead of
    // the more standard Object.getPrototypeOf.
    function getPrototypeOf(prototype) {
      return prototype.__proto__;
    }

    // utility function to precompute name tags for functions
    // in a (unchained) prototype
    function hintSuper(prototype) {
      // tag functions with their prototype name to optimize
      // super call invocations
      for (var n in prototype) {
        var pd = Object.getOwnPropertyDescriptor(prototype, n);
        if (pd && typeof pd.value === 'function') {
          pd.value.nom = n;
        }
      }
    }

    // exports

    scope.super = $super;

})(Polymer);

(function(scope) {

  function noopHandler(value) {
    return value;
  }

  // helper for deserializing properties of various types to strings
  var typeHandlers = {
    string: noopHandler,
    'undefined': noopHandler,
    date: function(value) {
      return new Date(Date.parse(value) || Date.now());
    },
    boolean: function(value) {
      if (value === '') {
        return true;
      }
      return value === 'false' ? false : !!value;
    },
    number: function(value) {
      var n = parseFloat(value);
      // hex values like "0xFFFF" parseFloat as 0
      if (n === 0) {
        n = parseInt(value);
      }
      return isNaN(n) ? value : n;
      // this code disabled because encoded values (like "0xFFFF")
      // do not round trip to their original format
      //return (String(floatVal) === value) ? floatVal : value;
    },
    object: function(value, currentValue) {
      if (currentValue === null) {
        return value;
      }
      try {
        // If the string is an object, we can parse is with the JSON library.
        // include convenience replace for single-quotes. If the author omits
        // quotes altogether, parse will fail.
        return JSON.parse(value.replace(/'/g, '"'));
      } catch(e) {
        // The object isn't valid JSON, return the raw value
        return value;
      }
    },
    // avoid deserialization of functions
    'function': function(value, currentValue) {
      return currentValue;
    }
  };

  function deserializeValue(value, currentValue) {
    // attempt to infer type from default value
    var inferredType = typeof currentValue;
    // invent 'date' type value for Date
    if (currentValue instanceof Date) {
      inferredType = 'date';
    }
    // delegate deserialization via type string
    return typeHandlers[inferredType](value, currentValue);
  }

  // exports

  scope.deserializeValue = deserializeValue;

})(Polymer);

(function(scope) {

  // imports

  var extend = scope.extend;

  // module

  var api = {};

  api.declaration = {};
  api.instance = {};

  api.publish = function(apis, prototype) {
    for (var n in apis) {
      extend(prototype, apis[n]);
    }
  };

  // exports

  scope.api = api;

})(Polymer);

(function(scope) {

  /**
   * @class polymer-base
   */

  var utils = {

    /**
      * Invokes a function asynchronously. The context of the callback
      * function is bound to 'this' automatically. Returns a handle which may 
      * be passed to <a href="#cancelAsync">cancelAsync</a> to cancel the 
      * asynchronous call.
      *
      * @method async
      * @param {Function|String} method
      * @param {any|Array} args
      * @param {number} timeout
      */
    async: function(method, args, timeout) {
      // when polyfilling Object.observe, ensure changes 
      // propagate before executing the async method
      Polymer.flush();
      // second argument to `apply` must be an array
      args = (args && args.length) ? args : [args];
      // function to invoke
      var fn = function() {
        (this[method] || method).apply(this, args);
      }.bind(this);
      // execute `fn` sooner or later
      var handle = timeout ? setTimeout(fn, timeout) :
          requestAnimationFrame(fn);
      // NOTE: switch on inverting handle to determine which time is used.
      return timeout ? handle : ~handle;
    },

    /**
      * Cancels a pending callback that was scheduled via 
      * <a href="#async">async</a>. 
      *
      * @method cancelAsync
      * @param {handle} handle Handle of the `async` to cancel.
      */
    cancelAsync: function(handle) {
      if (handle < 0) {
        cancelAnimationFrame(~handle);
      } else {
        clearTimeout(handle);
      }
    },

    /**
      * Fire an event.
      *
      * @method fire
      * @returns {Object} event
      * @param {string} type An event name.
      * @param {any} detail
      * @param {Node} onNode Target node.
      * @param {Boolean} bubbles Set false to prevent bubbling, defaults to true
      * @param {Boolean} cancelable Set false to prevent cancellation, defaults to true
      */
    fire: function(type, detail, onNode, bubbles, cancelable) {
      var node = onNode || this;
      var detail = detail === null || detail === undefined ? {} : detail;
      var event = new CustomEvent(type, {
        bubbles: bubbles !== undefined ? bubbles : true,
        cancelable: cancelable !== undefined ? cancelable : true,
        detail: detail
      });
      node.dispatchEvent(event);
      return event;
    },

    /**
      * Fire an event asynchronously.
      *
      * @method asyncFire
      * @param {string} type An event name.
      * @param detail
      * @param {Node} toNode Target node.
      */
    asyncFire: function(/*inType, inDetail*/) {
      this.async("fire", arguments);
    },

    /**
      * Remove class from old, add class to anew, if they exist.
      *
      * @param classFollows
      * @param anew A node.
      * @param old A node
      * @param className
      */
    classFollows: function(anew, old, className) {
      if (old) {
        old.classList.remove(className);
      }
      if (anew) {
        anew.classList.add(className);
      }
    },

    /**
      * Inject HTML which contains markup bound to this element into
      * a target element (replacing target element content).
      *
      * @param String html to inject
      * @param Element target element
      */
    injectBoundHTML: function(html, element) {
      var template = document.createElement('template');
      template.innerHTML = html;
      var fragment = this.instanceTemplate(template);
      if (element) {
        element.textContent = '';
        element.appendChild(fragment);
      }
      return fragment;
    }
  };

  // no-operation function for handy stubs
  var nop = function() {};

  // null-object for handy stubs
  var nob = {};

  // deprecated

  utils.asyncMethod = utils.async;

  // exports

  scope.api.instance.utils = utils;
  scope.nop = nop;
  scope.nob = nob;

})(Polymer);

(function(scope) {

  // imports

  var log = window.WebComponents ? WebComponents.flags.log : {};
  var EVENT_PREFIX = 'on-';

  // instance events api
  var events = {
    // read-only
    EVENT_PREFIX: EVENT_PREFIX,
    // event listeners on host
    addHostListeners: function() {
      var events = this.eventDelegates;
      log.events && (Object.keys(events).length > 0) && console.log('[%s] addHostListeners:', this.localName, events);
      // NOTE: host events look like bindings but really are not;
      // (1) we don't want the attribute to be set and (2) we want to support
      // multiple event listeners ('host' and 'instance') and Node.bind
      // by default supports 1 thing being bound.
      for (var type in events) {
        var methodName = events[type];
        PolymerGestures.addEventListener(this, type, this.element.getEventHandler(this, this, methodName));
      }
    },
    // call 'method' or function method on 'obj' with 'args', if the method exists
    dispatchMethod: function(obj, method, args) {
      if (obj) {
        log.events && console.group('[%s] dispatch [%s]', obj.localName, method);
        var fn = typeof method === 'function' ? method : obj[method];
        if (fn) {
          fn[args ? 'apply' : 'call'](obj, args);
        }
        log.events && console.groupEnd();
        // NOTE: dirty check right after calling method to ensure 
        // changes apply quickly; in a very complicated app using high 
        // frequency events, this can be a perf concern; in this case,
        // imperative handlers can be used to avoid flushing.
        Polymer.flush();
      }
    }
  };

  // exports

  scope.api.instance.events = events;

  /**
   * @class Polymer
   */

  /**
   * Add a gesture aware event handler to the given `node`. Can be used 
   * in place of `element.addEventListener` and ensures gestures will function
   * as expected on mobile platforms. Please note that Polymer's declarative
   * event handlers include this functionality by default.
   * 
   * @method addEventListener
   * @param {Node} node node on which to listen
   * @param {String} eventType name of the event
   * @param {Function} handlerFn event handler function
   * @param {Boolean} capture set to true to invoke event capturing
   * @type Function
   */
  // alias PolymerGestures event listener logic
  scope.addEventListener = function(node, eventType, handlerFn, capture) {
    PolymerGestures.addEventListener(wrap(node), eventType, handlerFn, capture);
  };

  /**
   * Remove a gesture aware event handler on the given `node`. To remove an
   * event listener, the exact same arguments are required that were passed
   * to `Polymer.addEventListener`.
   * 
   * @method removeEventListener
   * @param {Node} node node on which to listen
   * @param {String} eventType name of the event
   * @param {Function} handlerFn event handler function
   * @param {Boolean} capture set to true to invoke event capturing
   * @type Function
   */
  scope.removeEventListener = function(node, eventType, handlerFn, capture) {
    PolymerGestures.removeEventListener(wrap(node), eventType, handlerFn, capture);
  };

})(Polymer);

(function(scope) {

  // instance api for attributes

  var attributes = {
    // copy attributes defined in the element declaration to the instance
    // e.g. <polymer-element name="x-foo" tabIndex="0"> tabIndex is copied
    // to the element instance here.
    copyInstanceAttributes: function () {
      var a$ = this._instanceAttributes;
      for (var k in a$) {
        if (!this.hasAttribute(k)) {
          this.setAttribute(k, a$[k]);
        }
      }
    },
    // for each attribute on this, deserialize value to property as needed
    takeAttributes: function() {
      // if we have no publish lookup table, we have no attributes to take
      // TODO(sjmiles): ad hoc
      if (this._publishLC) {
        for (var i=0, a$=this.attributes, l=a$.length, a; (a=a$[i]) && i<l; i++) {
          this.attributeToProperty(a.name, a.value);
        }
      }
    },
    // if attribute 'name' is mapped to a property, deserialize
    // 'value' into that property
    attributeToProperty: function(name, value) {
      // try to match this attribute to a property (attributes are
      // all lower-case, so this is case-insensitive search)
      var name = this.propertyForAttribute(name);
      if (name) {
        // filter out 'mustached' values, these are to be
        // replaced with bound-data and are not yet values
        // themselves
        if (value && value.search(scope.bindPattern) >= 0) {
          return;
        }
        // get original value
        var currentValue = this[name];
        // deserialize Boolean or Number values from attribute
        var value = this.deserializeValue(value, currentValue);
        // only act if the value has changed
        if (value !== currentValue) {
          // install new value (has side-effects)
          this[name] = value;
        }
      }
    },
    // return the published property matching name, or undefined
    propertyForAttribute: function(name) {
      var match = this._publishLC && this._publishLC[name];
      return match;
    },
    // convert representation of `stringValue` based on type of `currentValue`
    deserializeValue: function(stringValue, currentValue) {
      return scope.deserializeValue(stringValue, currentValue);
    },
    // convert to a string value based on the type of `inferredType`
    serializeValue: function(value, inferredType) {
      if (inferredType === 'boolean') {
        return value ? '' : undefined;
      } else if (inferredType !== 'object' && inferredType !== 'function'
          && value !== undefined) {
        return value;
      }
    },
    // serializes `name` property value and updates the corresponding attribute
    // note that reflection is opt-in.
    reflectPropertyToAttribute: function(name) {
      var inferredType = typeof this[name];
      // try to intelligently serialize property value
      var serializedValue = this.serializeValue(this[name], inferredType);
      // boolean properties must reflect as boolean attributes
      if (serializedValue !== undefined) {
        this.setAttribute(name, serializedValue);
        // TODO(sorvell): we should remove attr for all properties
        // that have undefined serialization; however, we will need to
        // refine the attr reflection system to achieve this; pica, for example,
        // relies on having inferredType object properties not removed as
        // attrs.
      } else if (inferredType === 'boolean') {
        this.removeAttribute(name);
      }
    }
  };

  // exports

  scope.api.instance.attributes = attributes;

})(Polymer);

(function(scope) {

  /**
   * @class polymer-base
   */

  // imports

  var log = window.WebComponents ? WebComponents.flags.log : {};

  // magic words

  var OBSERVE_SUFFIX = 'Changed';

  // element api

  var empty = [];

  var updateRecord = {
    object: undefined,
    type: 'update',
    name: undefined,
    oldValue: undefined
  };

  var numberIsNaN = Number.isNaN || function(value) {
    return typeof value === 'number' && isNaN(value);
  };

  function areSameValue(left, right) {
    if (left === right)
      return left !== 0 || 1 / left === 1 / right;
    if (numberIsNaN(left) && numberIsNaN(right))
      return true;
    return left !== left && right !== right;
  }

  // capture A's value if B's value is null or undefined,
  // otherwise use B's value
  function resolveBindingValue(oldValue, value) {
    if (value === undefined && oldValue === null) {
      return value;
    }
    return (value === null || value === undefined) ? oldValue : value;
  }

  var properties = {

    // creates a CompoundObserver to observe property changes
    // NOTE, this is only done there are any properties in the `observe` object
    createPropertyObserver: function() {
      var n$ = this._observeNames;
      if (n$ && n$.length) {
        var o = this._propertyObserver = new CompoundObserver(true);
        this.registerObserver(o);
        // TODO(sorvell): may not be kosher to access the value here (this[n]);
        // previously we looked at the descriptor on the prototype
        // this doesn't work for inheritance and not for accessors without
        // a value property
        for (var i=0, l=n$.length, n; (i<l) && (n=n$[i]); i++) {
          o.addPath(this, n);
          this.observeArrayValue(n, this[n], null);
        }
      }
    },

    // start observing property changes
    openPropertyObserver: function() {
      if (this._propertyObserver) {
        this._propertyObserver.open(this.notifyPropertyChanges, this);
      }
    },

    // handler for property changes; routes changes to observing methods
    // note: array valued properties are observed for array splices
    notifyPropertyChanges: function(newValues, oldValues, paths) {
      var name, method, called = {};
      for (var i in oldValues) {
        // note: paths is of form [object, path, object, path]
        name = paths[2 * i + 1];
        method = this.observe[name];
        if (method) {
          var ov = oldValues[i], nv = newValues[i];
          // observes the value if it is an array
          this.observeArrayValue(name, nv, ov);
          if (!called[method]) {
            // only invoke change method if one of ov or nv is not (undefined | null)
            if ((ov !== undefined && ov !== null) || (nv !== undefined && nv !== null)) {
              called[method] = true;
              // TODO(sorvell): call method with the set of values it's expecting;
              // e.g. 'foo bar': 'invalidate' expects the new and old values for
              // foo and bar. Currently we give only one of these and then
              // deliver all the arguments.
              this.invokeMethod(method, [ov, nv, arguments]);
            }
          }
        }
      }
    },

    // call method iff it exists.
    invokeMethod: function(method, args) {
      var fn = this[method] || method;
      if (typeof fn === 'function') {
        fn.apply(this, args);
      }
    },

    /**
     * Force any pending property changes to synchronously deliver to
     * handlers specified in the `observe` object.
     * Note, normally changes are processed at microtask time.
     *
     * @method deliverChanges
     */
    deliverChanges: function() {
      if (this._propertyObserver) {
        this._propertyObserver.deliver();
      }
    },

    observeArrayValue: function(name, value, old) {
      // we only care if there are registered side-effects
      var callbackName = this.observe[name];
      if (callbackName) {
        // if we are observing the previous value, stop
        if (Array.isArray(old)) {
          log.observe && console.log('[%s] observeArrayValue: unregister observer [%s]', this.localName, name);
          this.closeNamedObserver(name + '__array');
        }
        // if the new value is an array, being observing it
        if (Array.isArray(value)) {
          log.observe && console.log('[%s] observeArrayValue: register observer [%s]', this.localName, name, value);
          var observer = new ArrayObserver(value);
          observer.open(function(splices) {
            this.invokeMethod(callbackName, [splices]);
          }, this);
          this.registerNamedObserver(name + '__array', observer);
        }
      }
    },

    emitPropertyChangeRecord: function(name, value, oldValue) {
      var object = this;
      if (areSameValue(value, oldValue)) {
        return;
      }
      // invoke property change side effects
      this._propertyChanged(name, value, oldValue);
      // emit change record
      if (!Observer.hasObjectObserve) {
        return;
      }
      var notifier = this._objectNotifier;
      if (!notifier) {
        notifier = this._objectNotifier = Object.getNotifier(this);
      }
      updateRecord.object = this;
      updateRecord.name = name;
      updateRecord.oldValue = oldValue;
      notifier.notify(updateRecord);
    },

    _propertyChanged: function(name, value, oldValue) {
      if (this.reflect[name]) {
        this.reflectPropertyToAttribute(name);
      }
    },

    // creates a property binding (called via bind) to a published property.
    bindProperty: function(property, observable, oneTime) {
      if (oneTime) {
        this[property] = observable;
        return;
      }
      var computed = this.element.prototype.computed;
      // Binding an "out-only" value to a computed property. Note that
      // since this observer isn't opened, it doesn't need to be closed on
      // cleanup.
      if (computed && computed[property]) {
        var privateComputedBoundValue = property + 'ComputedBoundObservable_';
        this[privateComputedBoundValue] = observable;
        return;
      }
      return this.bindToAccessor(property, observable, resolveBindingValue);
    },

    // NOTE property `name` must be published. This makes it an accessor.
    bindToAccessor: function(name, observable, resolveFn) {
      var privateName = name + '_';
      var privateObservable  = name + 'Observable_';
      // Present for properties which are computed and published and have a
      // bound value.
      var privateComputedBoundValue = name + 'ComputedBoundObservable_';
      this[privateObservable] = observable;
      var oldValue = this[privateName];
      // observable callback
      var self = this;
      function updateValue(value, oldValue) {
        self[privateName] = value;
        var setObserveable = self[privateComputedBoundValue];
        if (setObserveable && typeof setObserveable.setValue == 'function') {
          setObserveable.setValue(value);
        }
        self.emitPropertyChangeRecord(name, value, oldValue);
      }
      // resolve initial value
      var value = observable.open(updateValue);
      if (resolveFn && !areSameValue(oldValue, value)) {
        var resolvedValue = resolveFn(oldValue, value);
        if (!areSameValue(value, resolvedValue)) {
          value = resolvedValue;
          if (observable.setValue) {
            observable.setValue(value);
          }
        }
      }
      updateValue(value, oldValue);
      // register and return observable
      var observer = {
        close: function() {
          observable.close();
          self[privateObservable] = undefined;
          self[privateComputedBoundValue] = undefined;
        }
      };
      this.registerObserver(observer);
      return observer;
    },

    createComputedProperties: function() {
      if (!this._computedNames) {
        return;
      }
      for (var i = 0; i < this._computedNames.length; i++) {
        var name = this._computedNames[i];
        var expressionText = this.computed[name];
        try {
          var expression = PolymerExpressions.getExpression(expressionText);
          var observable = expression.getBinding(this, this.element.syntax);
          this.bindToAccessor(name, observable);
        } catch (ex) {
          console.error('Failed to create computed property', ex);
        }
      }
    },

    // property bookkeeping
    registerObserver: function(observer) {
      if (!this._observers) {
        this._observers = [observer];
        return;
      }
      this._observers.push(observer);
    },

    closeObservers: function() {
      if (!this._observers) {
        return;
      }
      // observer array items are arrays of observers.
      var observers = this._observers;
      for (var i = 0; i < observers.length; i++) {
        var observer = observers[i];
        if (observer && typeof observer.close == 'function') {
          observer.close();
        }
      }
      this._observers = [];
    },

    // bookkeeping observers for memory management
    registerNamedObserver: function(name, observer) {
      var o$ = this._namedObservers || (this._namedObservers = {});
      o$[name] = observer;
    },

    closeNamedObserver: function(name) {
      var o$ = this._namedObservers;
      if (o$ && o$[name]) {
        o$[name].close();
        o$[name] = null;
        return true;
      }
    },

    closeNamedObservers: function() {
      if (this._namedObservers) {
        for (var i in this._namedObservers) {
          this.closeNamedObserver(i);
        }
        this._namedObservers = {};
      }
    }

  };

  // logging
  var LOG_OBSERVE = '[%s] watching [%s]';
  var LOG_OBSERVED = '[%s#%s] watch: [%s] now [%s] was [%s]';
  var LOG_CHANGED = '[%s#%s] propertyChanged: [%s] now [%s] was [%s]';

  // exports

  scope.api.instance.properties = properties;

})(Polymer);

(function(scope) {

  /**
   * @class polymer-base
   */

  // imports

  var log = window.WebComponents ? WebComponents.flags.log : {};

  // element api supporting mdv
  var mdv = {

    /**
     * Creates dom cloned from the given template, instantiating bindings
     * with this element as the template model and `PolymerExpressions` as the
     * binding delegate.
     *
     * @method instanceTemplate
     * @param {Template} template source template from which to create dom.
     */
    instanceTemplate: function(template) {
      // ensure template is decorated (lets' things like <tr template ...> work)
      HTMLTemplateElement.decorate(template);
      // ensure a default bindingDelegate
      var syntax = this.syntax || (!template.bindingDelegate &&
          this.element.syntax);
      var dom = template.createInstance(this, syntax);
      var observers = dom.bindings_;
      for (var i = 0; i < observers.length; i++) {
        this.registerObserver(observers[i]);
      }
      return dom;
    },

    // Called by TemplateBinding/NodeBind to setup a binding to the given
    // property. It's overridden here to support property bindings
    // in addition to attribute bindings that are supported by default.
    bind: function(name, observable, oneTime) {
      var property = this.propertyForAttribute(name);
      if (!property) {
        // TODO(sjmiles): this mixin method must use the special form
        // of `super` installed by `mixinMethod` in declaration/prototype.js
        return this.mixinSuper(arguments);
      } else {
        // use n-way Polymer binding
        var observer = this.bindProperty(property, observable, oneTime);
        // NOTE: reflecting binding information is typically required only for
        // tooling. It has a performance cost so it's opt-in in Node.bind.
        if (Platform.enableBindingsReflection && observer) {
          observer.path = observable.path_;
          this._recordBinding(property, observer);
        }
        if (this.reflect[property]) {
          this.reflectPropertyToAttribute(property);
        }
        return observer;
      }
    },

    _recordBinding: function(name, observer) {
      this.bindings_ = this.bindings_ || {};
      this.bindings_[name] = observer;
    },

    // Called by TemplateBinding when all bindings on an element have been 
    // executed. This signals that all element inputs have been gathered
    // and it's safe to ready the element, create shadow-root and start
    // data-observation.
    bindFinished: function() {
      this.makeElementReady();
    },

    // called at detached time to signal that an element's bindings should be
    // cleaned up. This is done asynchronously so that users have the chance
    // to call `cancelUnbindAll` to prevent unbinding.
    asyncUnbindAll: function() {
      if (!this._unbound) {
        log.unbind && console.log('[%s] asyncUnbindAll', this.localName);
        this._unbindAllJob = this.job(this._unbindAllJob, this.unbindAll, 0);
      }
    },
    
    /**
     * This method should rarely be used and only if 
     * <a href="#cancelUnbindAll">`cancelUnbindAll`</a> has been called to 
     * prevent element unbinding. In this case, the element's bindings will 
     * not be automatically cleaned up and it cannot be garbage collected 
     * by the system. If memory pressure is a concern or a 
     * large amount of elements need to be managed in this way, `unbindAll`
     * can be called to deactivate the element's bindings and allow its 
     * memory to be reclaimed.
     *
     * @method unbindAll
     */
    unbindAll: function() {
      if (!this._unbound) {
        this.closeObservers();
        this.closeNamedObservers();
        this._unbound = true;
      }
    },

    /**
     * Call in `detached` to prevent the element from unbinding when it is 
     * detached from the dom. The element is unbound as a cleanup step that 
     * allows its memory to be reclaimed. 
     * If `cancelUnbindAll` is used, consider calling 
     * <a href="#unbindAll">`unbindAll`</a> when the element is no longer
     * needed. This will allow its memory to be reclaimed.
     * 
     * @method cancelUnbindAll
     */
    cancelUnbindAll: function() {
      if (this._unbound) {
        log.unbind && console.warn('[%s] already unbound, cannot cancel unbindAll', this.localName);
        return;
      }
      log.unbind && console.log('[%s] cancelUnbindAll', this.localName);
      if (this._unbindAllJob) {
        this._unbindAllJob = this._unbindAllJob.stop();
      }
    }

  };

  function unbindNodeTree(node) {
    forNodeTree(node, _nodeUnbindAll);
  }

  function _nodeUnbindAll(node) {
    node.unbindAll();
  }

  function forNodeTree(node, callback) {
    if (node) {
      callback(node);
      for (var child = node.firstChild; child; child = child.nextSibling) {
        forNodeTree(child, callback);
      }
    }
  }

  var mustachePattern = /\{\{([^{}]*)}}/;

  // exports

  scope.bindPattern = mustachePattern;
  scope.api.instance.mdv = mdv;

})(Polymer);

(function(scope) {

  /**
   * Common prototype for all Polymer Elements.
   * 
   * @class polymer-base
   * @homepage polymer.github.io
   */
  var base = {
    /**
     * Tags this object as the canonical Base prototype.
     *
     * @property PolymerBase
     * @type boolean
     * @default true
     */
    PolymerBase: true,

    /**
     * Debounce signals. 
     * 
     * Call `job` to defer a named signal, and all subsequent matching signals, 
     * until a wait time has elapsed with no new signal.
     * 
     *     debouncedClickAction: function(e) {
     *       // processClick only when it's been 100ms since the last click
     *       this.job('click', function() {
     *        this.processClick;
     *       }, 100);
     *     }
     *
     * @method job
     * @param String {String} job A string identifier for the job to debounce.
     * @param Function {Function} callback A function that is called (with `this` context) when the wait time elapses.
     * @param Number {Number} wait Time in milliseconds (ms) after the last signal that must elapse before invoking `callback`
     * @type Handle
     */
    job: function(job, callback, wait) {
      if (typeof job === 'string') {
        var n = '___' + job;
        this[n] = Polymer.job.call(this, this[n], callback, wait);
      } else {
        // TODO(sjmiles): suggest we deprecate this call signature
        return Polymer.job.call(this, job, callback, wait);
      }
    },

    /**
     * Invoke a superclass method. 
     * 
     * Use `super()` to invoke the most recently overridden call to the 
     * currently executing function. 
     * 
     * To pass arguments through, use the literal `arguments` as the parameter 
     * to `super()`.
     *
     *     nextPageAction: function(e) {
     *       // invoke the superclass version of `nextPageAction`
     *       this.super(arguments); 
     *     }
     *
     * To pass custom arguments, arrange them in an array.
     *
     *     appendSerialNo: function(value, serial) {
     *       // prefix the superclass serial number with our lot # before
     *       // invoking the superlcass
     *       return this.super([value, this.lotNo + serial])
     *     }
     *
     * @method super
     * @type Any
     * @param {args) An array of arguments to use when calling the superclass method, or null.
     */
    super: Polymer.super,

    /**
     * Lifecycle method called when the element is instantiated.
     * 
     * Override `created` to perform custom create-time tasks. No need to call 
     * super-class `created` unless you are extending another Polymer element.
     * Created is called before the element creates `shadowRoot` or prepares
     * data-observation.
     * 
     * @method created
     * @type void
     */
    created: function() {
    },

    /**
     * Lifecycle method called when the element has populated it's `shadowRoot`,
     * prepared data-observation, and made itself ready for API interaction.
     * 
     * @method ready
     * @type void
     */
    ready: function() {
    },

    /**
     * Low-level lifecycle method called as part of standard Custom Elements
     * operation. Polymer implements this method to provide basic default 
     * functionality. For custom create-time tasks, implement `created` 
     * instead, which is called immediately after `createdCallback`. 
     * 
     * @method createdCallback
     */
    createdCallback: function() {
      if (this.templateInstance && this.templateInstance.model) {
        console.warn('Attributes on ' + this.localName + ' were data bound ' +
            'prior to Polymer upgrading the element. This may result in ' +
            'incorrect binding types.');
      }
      this.created();
      this.prepareElement();
      if (!this.ownerDocument.isStagingDocument) {
        this.makeElementReady();
      }
    },

    // system entry point, do not override
    prepareElement: function() {
      if (this._elementPrepared) {
        console.warn('Element already prepared', this.localName);
        return;
      }
      this._elementPrepared = true;
      // storage for shadowRoots info
      this.shadowRoots = {};
      // install property observers
      this.createPropertyObserver();
      this.openPropertyObserver();
      // install boilerplate attributes
      this.copyInstanceAttributes();
      // process input attributes
      this.takeAttributes();
      // add event listeners
      this.addHostListeners();
    },

    // system entry point, do not override
    makeElementReady: function() {
      if (this._readied) {
        return;
      }
      this._readied = true;
      this.createComputedProperties();
      this.parseDeclarations(this.__proto__);
      // NOTE: Support use of the `unresolved` attribute to help polyfill
      // custom elements' `:unresolved` feature.
      this.removeAttribute('unresolved');
      // user entry point
      this.ready();
    },

    /**
     * Low-level lifecycle method called as part of standard Custom Elements
     * operation. Polymer implements this method to provide basic default 
     * functionality. For custom tasks in your element, implement `attributeChanged` 
     * instead, which is called immediately after `attributeChangedCallback`. 
     * 
     * @method attributeChangedCallback
     */
    attributeChangedCallback: function(name, oldValue) {
      // TODO(sjmiles): adhoc filter
      if (name !== 'class' && name !== 'style') {
        this.attributeToProperty(name, this.getAttribute(name));
      }
      if (this.attributeChanged) {
        this.attributeChanged.apply(this, arguments);
      }
    },

    /**
     * Low-level lifecycle method called as part of standard Custom Elements
     * operation. Polymer implements this method to provide basic default 
     * functionality. For custom create-time tasks, implement `attached` 
     * instead, which is called immediately after `attachedCallback`. 
     * 
     * @method attachedCallback
     */
     attachedCallback: function() {
      // when the element is attached, prevent it from unbinding.
      this.cancelUnbindAll();
      // invoke user action
      if (this.attached) {
        this.attached();
      }
      if (!this.hasBeenAttached) {
        this.hasBeenAttached = true;
        if (this.domReady) {
          this.async('domReady');
        }
      }
    },

     /**
     * Implement to access custom elements in dom descendants, ancestors, 
     * or siblings. Because custom elements upgrade in document order, 
     * elements accessed in `ready` or `attached` may not be upgraded. When
     * `domReady` is called, all registered custom elements are guaranteed
     * to have been upgraded.
     * 
     * @method domReady
     */

    /**
     * Low-level lifecycle method called as part of standard Custom Elements
     * operation. Polymer implements this method to provide basic default 
     * functionality. For custom create-time tasks, implement `detached` 
     * instead, which is called immediately after `detachedCallback`. 
     * 
     * @method detachedCallback
     */
    detachedCallback: function() {
      if (!this.preventDispose) {
        this.asyncUnbindAll();
      }
      // invoke user action
      if (this.detached) {
        this.detached();
      }
      // TODO(sorvell): bc
      if (this.leftView) {
        this.leftView();
      }
    },

    /**
     * Walks the prototype-chain of this element and allows specific
     * classes a chance to process static declarations.
     * 
     * In particular, each polymer-element has it's own `template`.
     * `parseDeclarations` is used to accumulate all element `template`s
     * from an inheritance chain.
     *
     * `parseDeclaration` static methods implemented in the chain are called
     * recursively, oldest first, with the `<polymer-element>` associated
     * with the current prototype passed as an argument.
     * 
     * An element may override this method to customize shadow-root generation. 
     * 
     * @method parseDeclarations
     */
    parseDeclarations: function(p) {
      if (p && p.element) {
        this.parseDeclarations(p.__proto__);
        p.parseDeclaration.call(this, p.element);
      }
    },

    /**
     * Perform init-time actions based on static information in the
     * `<polymer-element>` instance argument.
     *
     * For example, the standard implementation locates the template associated
     * with the given `<polymer-element>` and stamps it into a shadow-root to
     * implement shadow inheritance.
     *  
     * An element may override this method for custom behavior. 
     * 
     * @method parseDeclaration
     */
    parseDeclaration: function(elementElement) {
      var template = this.fetchTemplate(elementElement);
      if (template) {
        var root = this.shadowFromTemplate(template);
        this.shadowRoots[elementElement.name] = root;
      }
    },

    /**
     * Given a `<polymer-element>`, find an associated template (if any) to be
     * used for shadow-root generation.
     *
     * An element may override this method for custom behavior. 
     * 
     * @method fetchTemplate
     */
    fetchTemplate: function(elementElement) {
      return elementElement.querySelector('template');
    },

    /**
     * Create a shadow-root in this host and stamp `template` as it's 
     * content. 
     *
     * An element may override this method for custom behavior. 
     * 
     * @method shadowFromTemplate
     */
    shadowFromTemplate: function(template) {
      if (template) {
        // make a shadow root
        var root = this.createShadowRoot();
        // stamp template
        // which includes parsing and applying MDV bindings before being
        // inserted (to avoid {{}} in attribute values)
        // e.g. to prevent <img src="images/{{icon}}"> from generating a 404.
        var dom = this.instanceTemplate(template);
        // append to shadow dom
        root.appendChild(dom);
        // perform post-construction initialization tasks on shadow root
        this.shadowRootReady(root, template);
        // return the created shadow root
        return root;
      }
    },

    // utility function that stamps a <template> into light-dom
    lightFromTemplate: function(template, refNode) {
      if (template) {
        // TODO(sorvell): mark this element as an eventController so that
        // event listeners on bound nodes inside it will be called on it.
        // Note, the expectation here is that events on all descendants
        // should be handled by this element.
        this.eventController = this;
        // stamp template
        // which includes parsing and applying MDV bindings before being
        // inserted (to avoid {{}} in attribute values)
        // e.g. to prevent <img src="images/{{icon}}"> from generating a 404.
        var dom = this.instanceTemplate(template);
        // append to shadow dom
        if (refNode) {
          this.insertBefore(dom, refNode);
        } else {
          this.appendChild(dom);
        }
        // perform post-construction initialization tasks on ahem, light root
        this.shadowRootReady(this);
        // return the created shadow root
        return dom;
      }
    },

    shadowRootReady: function(root) {
      // locate nodes with id and store references to them in this.$ hash
      this.marshalNodeReferences(root);
    },

    // locate nodes with id and store references to them in this.$ hash
    marshalNodeReferences: function(root) {
      // establish $ instance variable
      var $ = this.$ = this.$ || {};
      // populate $ from nodes with ID from the LOCAL tree
      if (root) {
        var n$ = root.querySelectorAll("[id]");
        for (var i=0, l=n$.length, n; (i<l) && (n=n$[i]); i++) {
          $[n.id] = n;
        };
      }
    },

    /**
     * Register a one-time callback when a child-list or sub-tree mutation
     * occurs on node. 
     *
     * For persistent callbacks, call onMutation from your listener. 
     * 
     * @method onMutation
     * @param Node {Node} node Node to watch for mutations.
     * @param Function {Function} listener Function to call on mutation. The function is invoked as `listener.call(this, observer, mutations);` where `observer` is the MutationObserver that triggered the notification, and `mutations` is the native mutation list.
     */
    onMutation: function(node, listener) {
      var observer = new MutationObserver(function(mutations) {
        listener.call(this, observer, mutations);
        observer.disconnect();
      }.bind(this));
      observer.observe(node, {childList: true, subtree: true});
    }
  };

  /**
   * @class Polymer
   */
  
  /**
   * Returns true if the object includes <a href="#polymer-base">polymer-base</a> in it's prototype chain.
   * 
   * @method isBase
   * @param Object {Object} object Object to test.
   * @type Boolean
   */
  function isBase(object) {
    return object.hasOwnProperty('PolymerBase')
  }

  // name a base constructor for dev tools

  /**
   * The Polymer base-class constructor.
   * 
   * @property Base
   * @type Function
   */
  function PolymerBase() {};
  PolymerBase.prototype = base;
  base.constructor = PolymerBase;

  // exports

  scope.Base = PolymerBase;
  scope.isBase = isBase;
  scope.api.instance.base = base;

})(Polymer);

(function(scope) {

  // imports

  var log = window.WebComponents ? WebComponents.flags.log : {};
  var hasShadowDOMPolyfill = window.ShadowDOMPolyfill;

  // magic words
  
  var STYLE_SCOPE_ATTRIBUTE = 'element';
  var STYLE_CONTROLLER_SCOPE = 'controller';
  
  var styles = {
    STYLE_SCOPE_ATTRIBUTE: STYLE_SCOPE_ATTRIBUTE,
    /**
     * Installs external stylesheets and <style> elements with the attribute 
     * polymer-scope='controller' into the scope of element. This is intended
     * to be a called during custom element construction.
    */
    installControllerStyles: function() {
      // apply controller styles, but only if they are not yet applied
      var scope = this.findStyleScope();
      if (scope && !this.scopeHasNamedStyle(scope, this.localName)) {
        // allow inherited controller styles
        var proto = getPrototypeOf(this), cssText = '';
        while (proto && proto.element) {
          cssText += proto.element.cssTextForScope(STYLE_CONTROLLER_SCOPE);
          proto = getPrototypeOf(proto);
        }
        if (cssText) {
          this.installScopeCssText(cssText, scope);
        }
      }
    },
    installScopeStyle: function(style, name, scope) {
      var scope = scope || this.findStyleScope(), name = name || '';
      if (scope && !this.scopeHasNamedStyle(scope, this.localName + name)) {
        var cssText = '';
        if (style instanceof Array) {
          for (var i=0, l=style.length, s; (i<l) && (s=style[i]); i++) {
            cssText += s.textContent + '\n\n';
          }
        } else {
          cssText = style.textContent;
        }
        this.installScopeCssText(cssText, scope, name);
      }
    },
    installScopeCssText: function(cssText, scope, name) {
      scope = scope || this.findStyleScope();
      name = name || '';
      if (!scope) {
        return;
      }
      if (hasShadowDOMPolyfill) {
        cssText = shimCssText(cssText, scope.host);
      }
      var style = this.element.cssTextToScopeStyle(cssText,
          STYLE_CONTROLLER_SCOPE);
      Polymer.applyStyleToScope(style, scope);
      // cache that this style has been applied
      this.styleCacheForScope(scope)[this.localName + name] = true;
    },
    findStyleScope: function(node) {
      // find the shadow root that contains this element
      var n = node || this;
      while (n.parentNode) {
        n = n.parentNode;
      }
      return n;
    },
    scopeHasNamedStyle: function(scope, name) {
      var cache = this.styleCacheForScope(scope);
      return cache[name];
    },
    styleCacheForScope: function(scope) {
      if (hasShadowDOMPolyfill) {
        var scopeName = scope.host ? scope.host.localName : scope.localName;
        return polyfillScopeStyleCache[scopeName] || (polyfillScopeStyleCache[scopeName] = {});
      } else {
        return scope._scopeStyles = (scope._scopeStyles || {});
      }
    }
  };

  var polyfillScopeStyleCache = {};
  
  // NOTE: use raw prototype traversal so that we ensure correct traversal
  // on platforms where the protoype chain is simulated via __proto__ (IE10)
  function getPrototypeOf(prototype) {
    return prototype.__proto__;
  }

  function shimCssText(cssText, host) {
    var name = '', is = false;
    if (host) {
      name = host.localName;
      is = host.hasAttribute('is');
    }
    var selector = WebComponents.ShadowCSS.makeScopeSelector(name, is);
    return WebComponents.ShadowCSS.shimCssText(cssText, selector);
  }

  // exports

  scope.api.instance.styles = styles;
  
})(Polymer);

(function(scope) {

  // imports

  var extend = scope.extend;
  var api = scope.api;

  // imperative implementation: Polymer()

  // specify an 'own' prototype for tag `name`
  function element(name, prototype) {
    if (typeof name !== 'string') {
      var script = prototype || document._currentScript;
      prototype = name;
      name = script && script.parentNode && script.parentNode.getAttribute ?
          script.parentNode.getAttribute('name') : '';
      if (!name) {
        throw 'Element name could not be inferred.';
      }
    }
    if (getRegisteredPrototype(name)) {
      throw 'Already registered (Polymer) prototype for element ' + name;
    }
    // cache the prototype
    registerPrototype(name, prototype);
    // notify the registrar waiting for 'name', if any
    notifyPrototype(name);
  }

  // async prototype source

  function waitingForPrototype(name, client) {
    waitPrototype[name] = client;
  }

  var waitPrototype = {};

  function notifyPrototype(name) {
    if (waitPrototype[name]) {
      waitPrototype[name].registerWhenReady();
      delete waitPrototype[name];
    }
  }

  // utility and bookkeeping

  // maps tag names to prototypes, as registered with
  // Polymer. Prototypes associated with a tag name
  // using document.registerElement are available from
  // HTMLElement.getPrototypeForTag().
  // If an element was fully registered by Polymer, then
  // Polymer.getRegisteredPrototype(name) === 
  //   HTMLElement.getPrototypeForTag(name)

  var prototypesByName = {};

  function registerPrototype(name, prototype) {
    return prototypesByName[name] = prototype || {};
  }

  function getRegisteredPrototype(name) {
    return prototypesByName[name];
  }

  function instanceOfType(element, type) {
    if (typeof type !== 'string') {
      return false;
    }
    var proto = HTMLElement.getPrototypeForTag(type);
    var ctor = proto && proto.constructor;
    if (!ctor) {
      return false;
    }
    if (CustomElements.instanceof) {
      return CustomElements.instanceof(element, ctor);
    }
    return element instanceof ctor;
  }

  // exports

  scope.getRegisteredPrototype = getRegisteredPrototype;
  scope.waitingForPrototype = waitingForPrototype;
  scope.instanceOfType = instanceOfType;

  // namespace shenanigans so we can expose our scope on the registration 
  // function

  // make window.Polymer reference `element()`

  window.Polymer = element;

  // TODO(sjmiles): find a way to do this that is less terrible
  // copy window.Polymer properties onto `element()`

  extend(Polymer, scope);

  // Under the HTMLImports polyfill, scripts in the main document
  // do not block on imports; we want to allow calls to Polymer in the main
  // document. WebComponents collects those calls until we can process them, which
  // we do here.

  if (WebComponents.consumeDeclarations) {
    WebComponents.consumeDeclarations(function(declarations) {
      if (declarations) {
        for (var i=0, l=declarations.length, d; (i<l) && (d=declarations[i]); i++) {
          element.apply(null, d);
        }
      }
    });
  }

})(Polymer);

(function(scope) {

/**
 * @class polymer-base
 */

 /**
  * Resolve a url path to be relative to a `base` url. If unspecified, `base`
  * defaults to the element's ownerDocument url. Can be used to resolve
  * paths from element's in templates loaded in HTMLImports to be relative
  * to the document containing the element. Polymer automatically does this for
  * url attributes in element templates; however, if a url, for
  * example, contains a binding, then `resolvePath` can be used to ensure it is 
  * relative to the element document. For example, in an element's template,
  *
  *     <a href="{{resolvePath(path)}}">Resolved</a>
  * 
  * @method resolvePath
  * @param {String} url Url path to resolve.
  * @param {String} base Optional base url against which to resolve, defaults
  * to the element's ownerDocument url.
  * returns {String} resolved url.
  */

var path = {
  resolveElementPaths: function(node) {
    Polymer.urlResolver.resolveDom(node);
  },
  addResolvePathApi: function() {
    // let assetpath attribute modify the resolve path
    var assetPath = this.getAttribute('assetpath') || '';
    var root = new URL(assetPath, this.ownerDocument.baseURI);
    this.prototype.resolvePath = function(urlPath, base) {
      var u = new URL(urlPath, base || root);
      return u.href;
    };
  }
};

// exports
scope.api.declaration.path = path;

})(Polymer);

(function(scope) {

  // imports

  var log = window.WebComponents ? WebComponents.flags.log : {};
  var api = scope.api.instance.styles;
  var STYLE_SCOPE_ATTRIBUTE = api.STYLE_SCOPE_ATTRIBUTE;

  var hasShadowDOMPolyfill = window.ShadowDOMPolyfill;

  // magic words

  var STYLE_SELECTOR = 'style';
  var STYLE_LOADABLE_MATCH = '@import';
  var SHEET_SELECTOR = 'link[rel=stylesheet]';
  var STYLE_GLOBAL_SCOPE = 'global';
  var SCOPE_ATTR = 'polymer-scope';

  var styles = {
    // returns true if resources are loading
    loadStyles: function(callback) {
      var template = this.fetchTemplate();
      var content = template && this.templateContent();
      if (content) {
        this.convertSheetsToStyles(content);
        var styles = this.findLoadableStyles(content);
        if (styles.length) {
          var templateUrl = template.ownerDocument.baseURI;
          return Polymer.styleResolver.loadStyles(styles, templateUrl, callback);
        }
      }
      if (callback) {
        callback();
      }
    },
    convertSheetsToStyles: function(root) {
      var s$ = root.querySelectorAll(SHEET_SELECTOR);
      for (var i=0, l=s$.length, s, c; (i<l) && (s=s$[i]); i++) {
        c = createStyleElement(importRuleForSheet(s, this.ownerDocument.baseURI),
            this.ownerDocument);
        this.copySheetAttributes(c, s);
        s.parentNode.replaceChild(c, s);
      }
    },
    copySheetAttributes: function(style, link) {
      for (var i=0, a$=link.attributes, l=a$.length, a; (a=a$[i]) && i<l; i++) {
        if (a.name !== 'rel' && a.name !== 'href') {
          style.setAttribute(a.name, a.value);
        }
      }
    },
    findLoadableStyles: function(root) {
      var loadables = [];
      if (root) {
        var s$ = root.querySelectorAll(STYLE_SELECTOR);
        for (var i=0, l=s$.length, s; (i<l) && (s=s$[i]); i++) {
          if (s.textContent.match(STYLE_LOADABLE_MATCH)) {
            loadables.push(s);
          }
        }
      }
      return loadables;
    },
    /**
     * Install external stylesheets loaded in <polymer-element> elements into the 
     * element's template.
     * @param elementElement The <element> element to style.
     */
    installSheets: function() {
      this.cacheSheets();
      this.cacheStyles();
      this.installLocalSheets();
      this.installGlobalStyles();
    },
    /**
     * Remove all sheets from element and store for later use.
     */
    cacheSheets: function() {
      this.sheets = this.findNodes(SHEET_SELECTOR);
      this.sheets.forEach(function(s) {
        if (s.parentNode) {
          s.parentNode.removeChild(s);
        }
      });
    },
    cacheStyles: function() {
      this.styles = this.findNodes(STYLE_SELECTOR + '[' + SCOPE_ATTR + ']');
      this.styles.forEach(function(s) {
        if (s.parentNode) {
          s.parentNode.removeChild(s);
        }
      });
    },
    /**
     * Takes external stylesheets loaded in an <element> element and moves
     * their content into a <style> element inside the <element>'s template.
     * The sheet is then removed from the <element>. This is done only so 
     * that if the element is loaded in the main document, the sheet does
     * not become active.
     * Note, ignores sheets with the attribute 'polymer-scope'.
     * @param elementElement The <element> element to style.
     */
    installLocalSheets: function () {
      var sheets = this.sheets.filter(function(s) {
        return !s.hasAttribute(SCOPE_ATTR);
      });
      var content = this.templateContent();
      if (content) {
        var cssText = '';
        sheets.forEach(function(sheet) {
          cssText += cssTextFromSheet(sheet) + '\n';
        });
        if (cssText) {
          var style = createStyleElement(cssText, this.ownerDocument);
          content.insertBefore(style, content.firstChild);
        }
      }
    },
    findNodes: function(selector, matcher) {
      var nodes = this.querySelectorAll(selector).array();
      var content = this.templateContent();
      if (content) {
        var templateNodes = content.querySelectorAll(selector).array();
        nodes = nodes.concat(templateNodes);
      }
      return matcher ? nodes.filter(matcher) : nodes;
    },
    /**
     * Promotes external stylesheets and <style> elements with the attribute 
     * polymer-scope='global' into global scope.
     * This is particularly useful for defining @keyframe rules which 
     * currently do not function in scoped or shadow style elements.
     * (See wkb.ug/72462)
     * @param elementElement The <element> element to style.
    */
    // TODO(sorvell): remove when wkb.ug/72462 is addressed.
    installGlobalStyles: function() {
      var style = this.styleForScope(STYLE_GLOBAL_SCOPE);
      applyStyleToScope(style, document.head);
    },
    cssTextForScope: function(scopeDescriptor) {
      var cssText = '';
      // handle stylesheets
      var selector = '[' + SCOPE_ATTR + '=' + scopeDescriptor + ']';
      var matcher = function(s) {
        return matchesSelector(s, selector);
      };
      var sheets = this.sheets.filter(matcher);
      sheets.forEach(function(sheet) {
        cssText += cssTextFromSheet(sheet) + '\n\n';
      });
      // handle cached style elements
      var styles = this.styles.filter(matcher);
      styles.forEach(function(style) {
        cssText += style.textContent + '\n\n';
      });
      return cssText;
    },
    styleForScope: function(scopeDescriptor) {
      var cssText = this.cssTextForScope(scopeDescriptor);
      return this.cssTextToScopeStyle(cssText, scopeDescriptor);
    },
    cssTextToScopeStyle: function(cssText, scopeDescriptor) {
      if (cssText) {
        var style = createStyleElement(cssText);
        style.setAttribute(STYLE_SCOPE_ATTRIBUTE, this.getAttribute('name') +
            '-' + scopeDescriptor);
        return style;
      }
    }
  };

  function importRuleForSheet(sheet, baseUrl) {
    var href = new URL(sheet.getAttribute('href'), baseUrl).href;
    return '@import \'' + href + '\';';
  }

  function applyStyleToScope(style, scope) {
    if (style) {
      if (scope === document) {
        scope = document.head;
      }
      if (hasShadowDOMPolyfill) {
        scope = document.head;
      }
      // TODO(sorvell): necessary for IE
      // see https://connect.microsoft.com/IE/feedback/details/790212/
      // cloning-a-style-element-and-adding-to-document-produces
      // -unexpected-result#details
      // var clone = style.cloneNode(true);
      var clone = createStyleElement(style.textContent);
      var attr = style.getAttribute(STYLE_SCOPE_ATTRIBUTE);
      if (attr) {
        clone.setAttribute(STYLE_SCOPE_ATTRIBUTE, attr);
      }
      // TODO(sorvell): probably too brittle; try to figure out 
      // where to put the element.
      var refNode = scope.firstElementChild;
      if (scope === document.head) {
        var selector = 'style[' + STYLE_SCOPE_ATTRIBUTE + ']';
        var s$ = document.head.querySelectorAll(selector);
        if (s$.length) {
          refNode = s$[s$.length-1].nextElementSibling;
        }
      }
      scope.insertBefore(clone, refNode);
    }
  }

  function createStyleElement(cssText, scope) {
    scope = scope || document;
    scope = scope.createElement ? scope : scope.ownerDocument;
    var style = scope.createElement('style');
    style.textContent = cssText;
    return style;
  }

  function cssTextFromSheet(sheet) {
    return (sheet && sheet.__resource) || '';
  }

  function matchesSelector(node, inSelector) {
    if (matches) {
      return matches.call(node, inSelector);
    }
  }
  var p = HTMLElement.prototype;
  var matches = p.matches || p.matchesSelector || p.webkitMatchesSelector 
      || p.mozMatchesSelector;
  
  // exports

  scope.api.declaration.styles = styles;
  scope.applyStyleToScope = applyStyleToScope;
  
})(Polymer);

(function(scope) {

  // imports

  var log = window.WebComponents ? WebComponents.flags.log : {};
  var api = scope.api.instance.events;
  var EVENT_PREFIX = api.EVENT_PREFIX;

  var mixedCaseEventTypes = {};
  [
    'webkitAnimationStart',
    'webkitAnimationEnd',
    'webkitTransitionEnd',
    'DOMFocusOut',
    'DOMFocusIn',
    'DOMMouseScroll'
  ].forEach(function(e) {
    mixedCaseEventTypes[e.toLowerCase()] = e;
  });

  // polymer-element declarative api: events feature
  var events = {
    parseHostEvents: function() {
      // our delegates map
      var delegates = this.prototype.eventDelegates;
      // extract data from attributes into delegates
      this.addAttributeDelegates(delegates);
    },
    addAttributeDelegates: function(delegates) {
      // for each attribute
      for (var i=0, a; a=this.attributes[i]; i++) {
        // does it have magic marker identifying it as an event delegate?
        if (this.hasEventPrefix(a.name)) {
          // if so, add the info to delegates
          delegates[this.removeEventPrefix(a.name)] = a.value.replace('{{', '')
              .replace('}}', '').trim();
        }
      }
    },
    // starts with 'on-'
    hasEventPrefix: function (n) {
      return n && (n[0] === 'o') && (n[1] === 'n') && (n[2] === '-');
    },
    removeEventPrefix: function(n) {
      return n.slice(prefixLength);
    },
    findController: function(node) {
      while (node.parentNode) {
        if (node.eventController) {
          return node.eventController;
        }
        node = node.parentNode;
      }
      return node.host;
    },
    getEventHandler: function(controller, target, method) {
      var events = this;
      return function(e) {
        if (!controller || !controller.PolymerBase) {
          controller = events.findController(target);
        }

        var args = [e, e.detail, e.currentTarget];
        controller.dispatchMethod(controller, method, args);
      };
    },
    prepareEventBinding: function(pathString, name, node) {
      if (!this.hasEventPrefix(name))
        return;

      var eventType = this.removeEventPrefix(name);
      eventType = mixedCaseEventTypes[eventType] || eventType;

      var events = this;

      return function(model, node, oneTime) {
        var handler = events.getEventHandler(undefined, node, pathString);
        PolymerGestures.addEventListener(node, eventType, handler);

        if (oneTime)
          return;

        // TODO(rafaelw): This is really pointless work. Aside from the cost
        // of these allocations, NodeBind is going to setAttribute back to its
        // current value. Fixing this would mean changing the TemplateBinding
        // binding delegate API.
        function bindingValue() {
          return '{{ ' + pathString + ' }}';
        }

        return {
          open: bindingValue,
          discardChanges: bindingValue,
          close: function() {
            PolymerGestures.removeEventListener(node, eventType, handler);
          }
        };
      };
    }
  };

  var prefixLength = EVENT_PREFIX.length;

  // exports
  scope.api.declaration.events = events;

})(Polymer);

(function(scope) {

  // element api

  var observationBlacklist = ['attribute'];

  var properties = {
    inferObservers: function(prototype) {
      // called before prototype.observe is chained to inherited object
      var observe = prototype.observe, property;
      for (var n in prototype) {
        if (n.slice(-7) === 'Changed') {
          property = n.slice(0, -7);
          if (this.canObserveProperty(property)) {
            if (!observe) {
              observe  = (prototype.observe = {});
            }
            observe[property] = observe[property] || n;
          }
        }
      }
    },
    canObserveProperty: function(property) {
      return (observationBlacklist.indexOf(property) < 0);
    },
    explodeObservers: function(prototype) {
      // called before prototype.observe is chained to inherited object
      var o = prototype.observe;
      if (o) {
        var exploded = {};
        for (var n in o) {
          var names = n.split(' ');
          for (var i=0, ni; ni=names[i]; i++) {
            exploded[ni] = o[n];
          }
        }
        prototype.observe = exploded;
      }
    },
    optimizePropertyMaps: function(prototype) {
      if (prototype.observe) {
        // construct name list
        var a = prototype._observeNames = [];
        for (var n in prototype.observe) {
          var names = n.split(' ');
          for (var i=0, ni; ni=names[i]; i++) {
            a.push(ni);
          }
        }
      }
      if (prototype.publish) {
        // construct name list
        var a = prototype._publishNames = [];
        for (var n in prototype.publish) {
          a.push(n);
        }
      }
      if (prototype.computed) {
        // construct name list
        var a = prototype._computedNames = [];
        for (var n in prototype.computed) {
          a.push(n);
        }
      }
    },
    publishProperties: function(prototype, base) {
      // if we have any properties to publish
      var publish = prototype.publish;
      if (publish) {
        // transcribe `publish` entries onto own prototype
        this.requireProperties(publish, prototype, base);
        // warn and remove accessor names that are broken on some browsers
        this.filterInvalidAccessorNames(publish);
        // construct map of lower-cased property names
        prototype._publishLC = this.lowerCaseMap(publish);
      }
      var computed = prototype.computed;
      if (computed) {
        // warn and remove accessor names that are broken on some browsers
        this.filterInvalidAccessorNames(computed);
      }
    },
    // Publishing/computing a property where the name might conflict with a
    // browser property is not currently supported to help users of Polymer
    // avoid browser bugs:
    //
    // https://code.google.com/p/chromium/issues/detail?id=43394
    // https://bugs.webkit.org/show_bug.cgi?id=49739
    //
    // We can lift this restriction when those bugs are fixed.
    filterInvalidAccessorNames: function(propertyNames) {
      for (var name in propertyNames) {
        // Check if the name is in our blacklist.
        if (this.propertyNameBlacklist[name]) {
          console.warn('Cannot define property "' + name + '" for element "' +
            this.name + '" because it has the same name as an HTMLElement ' +
            'property, and not all browsers support overriding that. ' +
            'Consider giving it a different name.');
          // Remove the invalid accessor from the list.
          delete propertyNames[name];
        }
      }
    },
    //
    // `name: value` entries in the `publish` object may need to generate 
    // matching properties on the prototype.
    //
    // Values that are objects may have a `reflect` property, which
    // signals that the value describes property control metadata.
    // In metadata objects, the prototype default value (if any)
    // is encoded in the `value` property.
    //
    // publish: {
    //   foo: 5, 
    //   bar: {value: true, reflect: true},
    //   zot: {}
    // }
    //
    // `reflect` metadata property controls whether changes to the property
    // are reflected back to the attribute (default false). 
    //
    // A value is stored on the prototype unless it's === `undefined`,
    // in which case the base chain is checked for a value.
    // If the basal value is also undefined, `null` is stored on the prototype.
    //
    // The reflection data is stored on another prototype object, `reflect`
    // which also can be specified directly.
    //
    // reflect: {
    //   foo: true
    // }
    //
    requireProperties: function(propertyInfos, prototype, base) {
      // per-prototype storage for reflected properties
      prototype.reflect = prototype.reflect || {};
      // ensure a prototype value for each property
      // and update the property's reflect to attribute status
      for (var n in propertyInfos) {
        var value = propertyInfos[n];
        // value has metadata if it has a `reflect` property
        if (value && value.reflect !== undefined) {
          prototype.reflect[n] = Boolean(value.reflect);
          value = value.value;
        }
        // only set a value if one is specified
        if (value !== undefined) {
          prototype[n] = value;
        }
      }
    },
    lowerCaseMap: function(properties) {
      var map = {};
      for (var n in properties) {
        map[n.toLowerCase()] = n;
      }
      return map;
    },
    createPropertyAccessor: function(name, ignoreWrites) {
      var proto = this.prototype;

      var privateName = name + '_';
      var privateObservable  = name + 'Observable_';
      proto[privateName] = proto[name];

      Object.defineProperty(proto, name, {
        get: function() {
          var observable = this[privateObservable];
          if (observable)
            observable.deliver();

          return this[privateName];
        },
        set: function(value) {
          if (ignoreWrites) {
            return this[privateName];
          }

          var observable = this[privateObservable];
          if (observable) {
            observable.setValue(value);
            return;
          }

          var oldValue = this[privateName];
          this[privateName] = value;
          this.emitPropertyChangeRecord(name, value, oldValue);

          return value;
        },
        configurable: true
      });
    },
    createPropertyAccessors: function(prototype) {
      var n$ = prototype._computedNames;
      if (n$ && n$.length) {
        for (var i=0, l=n$.length, n, fn; (i<l) && (n=n$[i]); i++) {
          this.createPropertyAccessor(n, true);
        }
      }
      var n$ = prototype._publishNames;
      if (n$ && n$.length) {
        for (var i=0, l=n$.length, n, fn; (i<l) && (n=n$[i]); i++) {
          // If the property is computed and published, the accessor is created
          // above.
          if (!prototype.computed || !prototype.computed[n]) {
            this.createPropertyAccessor(n);
          }
        }
      }
    },
    // This list contains some property names that people commonly want to use,
    // but won't work because of Chrome/Safari bugs. It isn't an exhaustive
    // list. In particular it doesn't contain any property names found on
    // subtypes of HTMLElement (e.g. name, value). Rather it attempts to catch
    // some common cases.
    propertyNameBlacklist: {
      children: 1,
      'class': 1,
      id: 1,
      hidden: 1,
      style: 1,
      title: 1,
    }
  };

  // exports

  scope.api.declaration.properties = properties;

})(Polymer);

(function(scope) {

  // magic words

  var ATTRIBUTES_ATTRIBUTE = 'attributes';
  var ATTRIBUTES_REGEX = /\s|,/;

  // attributes api

  var attributes = {
    
    inheritAttributesObjects: function(prototype) {
      // chain our lower-cased publish map to the inherited version
      this.inheritObject(prototype, 'publishLC');
      // chain our instance attributes map to the inherited version
      this.inheritObject(prototype, '_instanceAttributes');
    },

    publishAttributes: function(prototype, base) {
      // merge names from 'attributes' attribute into the 'publish' object
      var attributes = this.getAttribute(ATTRIBUTES_ATTRIBUTE);
      if (attributes) {
        // create a `publish` object if needed.
        // the `publish` object is only relevant to this prototype, the 
        // publishing logic in `declaration/properties.js` is responsible for
        // managing property values on the prototype chain.
        // TODO(sjmiles): the `publish` object is later chained to it's 
        //                ancestor object, presumably this is only for 
        //                reflection or other non-library uses. 
        var publish = prototype.publish || (prototype.publish = {}); 
        // names='a b c' or names='a,b,c'
        var names = attributes.split(ATTRIBUTES_REGEX);
        // record each name for publishing
        for (var i=0, l=names.length, n; i<l; i++) {
          // remove excess ws
          n = names[i].trim();
          // looks weird, but causes n to exist on `publish` if it does not;
          // a more careful test would need expensive `in` operator
          if (n && publish[n] === undefined) {
            publish[n] = undefined;
          }
        }
      }
    },

    // record clonable attributes from <element>
    accumulateInstanceAttributes: function() {
      // inherit instance attributes
      var clonable = this.prototype._instanceAttributes;
      // merge attributes from element
      var a$ = this.attributes;
      for (var i=0, l=a$.length, a; (i<l) && (a=a$[i]); i++) {  
        if (this.isInstanceAttribute(a.name)) {
          clonable[a.name] = a.value;
        }
      }
    },

    isInstanceAttribute: function(name) {
      return !this.blackList[name] && name.slice(0,3) !== 'on-';
    },

    // do not clone these attributes onto instances
    blackList: {
      name: 1,
      'extends': 1,
      constructor: 1,
      noscript: 1,
      assetpath: 1,
      'cache-csstext': 1
    }
    
  };

  // add ATTRIBUTES_ATTRIBUTE to the blacklist
  attributes.blackList[ATTRIBUTES_ATTRIBUTE] = 1;

  // exports

  scope.api.declaration.attributes = attributes;

})(Polymer);

(function(scope) {

  // imports
  var events = scope.api.declaration.events;

  var syntax = new PolymerExpressions();
  var prepareBinding = syntax.prepareBinding;

  // Polymer takes a first crack at the binding to see if it's a declarative
  // event handler.
  syntax.prepareBinding = function(pathString, name, node) {
    return events.prepareEventBinding(pathString, name, node) ||
           prepareBinding.call(syntax, pathString, name, node);
  };

  // declaration api supporting mdv
  var mdv = {
    syntax: syntax,
    fetchTemplate: function() {
      return this.querySelector('template');
    },
    templateContent: function() {
      var template = this.fetchTemplate();
      return template && template.content;
    },
    installBindingDelegate: function(template) {
      if (template) {
        template.bindingDelegate = this.syntax;
      }
    }
  };

  // exports
  scope.api.declaration.mdv = mdv;

})(Polymer);

(function(scope) {

  // imports
  
  var api = scope.api;
  var isBase = scope.isBase;
  var extend = scope.extend;

  var hasShadowDOMPolyfill = window.ShadowDOMPolyfill;

  // prototype api

  var prototype = {

    register: function(name, extendeeName) {
      // build prototype combining extendee, Polymer base, and named api
      this.buildPrototype(name, extendeeName);
      // register our custom element with the platform
      this.registerPrototype(name, extendeeName);
      // reference constructor in a global named by 'constructor' attribute
      this.publishConstructor();
    },

    buildPrototype: function(name, extendeeName) {
      // get our custom prototype (before chaining)
      var extension = scope.getRegisteredPrototype(name);
      // get basal prototype
      var base = this.generateBasePrototype(extendeeName);
      // implement declarative features
      this.desugarBeforeChaining(extension, base);
      // join prototypes
      this.prototype = this.chainPrototypes(extension, base);
      // more declarative features
      this.desugarAfterChaining(name, extendeeName);
    },

    desugarBeforeChaining: function(prototype, base) {
      // back reference declaration element
      // TODO(sjmiles): replace `element` with `elementElement` or `declaration`
      prototype.element = this;
      // transcribe `attributes` declarations onto own prototype's `publish`
      this.publishAttributes(prototype, base);
      // `publish` properties to the prototype and to attribute watch
      this.publishProperties(prototype, base);
      // infer observers for `observe` list based on method names
      this.inferObservers(prototype);
      // desugar compound observer syntax, e.g. 'a b c' 
      this.explodeObservers(prototype);
    },

    chainPrototypes: function(prototype, base) {
      // chain various meta-data objects to inherited versions
      this.inheritMetaData(prototype, base);
      // chain custom api to inherited
      var chained = this.chainObject(prototype, base);
      // x-platform fixup
      ensurePrototypeTraversal(chained);
      return chained;
    },

    inheritMetaData: function(prototype, base) {
      // chain observe object to inherited
      this.inheritObject('observe', prototype, base);
      // chain publish object to inherited
      this.inheritObject('publish', prototype, base);
      // chain reflect object to inherited
      this.inheritObject('reflect', prototype, base);
      // chain our lower-cased publish map to the inherited version
      this.inheritObject('_publishLC', prototype, base);
      // chain our instance attributes map to the inherited version
      this.inheritObject('_instanceAttributes', prototype, base);
      // chain our event delegates map to the inherited version
      this.inheritObject('eventDelegates', prototype, base);
    },

    // implement various declarative features
    desugarAfterChaining: function(name, extendee) {
      // build side-chained lists to optimize iterations
      this.optimizePropertyMaps(this.prototype);
      this.createPropertyAccessors(this.prototype);
      // install mdv delegate on template
      this.installBindingDelegate(this.fetchTemplate());
      // install external stylesheets as if they are inline
      this.installSheets();
      // adjust any paths in dom from imports
      this.resolveElementPaths(this);
      // compile list of attributes to copy to instances
      this.accumulateInstanceAttributes();
      // parse on-* delegates declared on `this` element
      this.parseHostEvents();
      //
      // install a helper method this.resolvePath to aid in 
      // setting resource urls. e.g.
      // this.$.image.src = this.resolvePath('images/foo.png')
      this.addResolvePathApi();
      // under ShadowDOMPolyfill, transforms to approximate missing CSS features
      if (hasShadowDOMPolyfill) {
        WebComponents.ShadowCSS.shimStyling(this.templateContent(), name,
          extendee);
      }
      // allow custom element access to the declarative context
      if (this.prototype.registerCallback) {
        this.prototype.registerCallback(this);
      }
    },

    // if a named constructor is requested in element, map a reference
    // to the constructor to the given symbol
    publishConstructor: function() {
      var symbol = this.getAttribute('constructor');
      if (symbol) {
        window[symbol] = this.ctor;
      }
    },

    // build prototype combining extendee, Polymer base, and named api
    generateBasePrototype: function(extnds) {
      var prototype = this.findBasePrototype(extnds);
      if (!prototype) {
        // create a prototype based on tag-name extension
        var prototype = HTMLElement.getPrototypeForTag(extnds);
        // insert base api in inheritance chain (if needed)
        prototype = this.ensureBaseApi(prototype);
        // memoize this base
        memoizedBases[extnds] = prototype;
      }
      return prototype;
    },

    findBasePrototype: function(name) {
      return memoizedBases[name];
    },

    // install Polymer instance api into prototype chain, as needed 
    ensureBaseApi: function(prototype) {
      if (prototype.PolymerBase) {
        return prototype;
      }
      var extended = Object.create(prototype);
      // we need a unique copy of base api for each base prototype
      // therefore we 'extend' here instead of simply chaining
      api.publish(api.instance, extended);
      // TODO(sjmiles): sharing methods across prototype chains is
      // not supported by 'super' implementation which optimizes
      // by memoizing prototype relationships.
      // Probably we should have a version of 'extend' that is 
      // share-aware: it could study the text of each function,
      // look for usage of 'super', and wrap those functions in
      // closures.
      // As of now, there is only one problematic method, so 
      // we just patch it manually.
      // To avoid re-entrancy problems, the special super method
      // installed is called `mixinSuper` and the mixin method
      // must use this method instead of the default `super`.
      this.mixinMethod(extended, prototype, api.instance.mdv, 'bind');
      // return buffed-up prototype
      return extended;
    },

    mixinMethod: function(extended, prototype, api, name) {
      var $super = function(args) {
        return prototype[name].apply(this, args);
      };
      extended[name] = function() {
        this.mixinSuper = $super;
        return api[name].apply(this, arguments);
      }
    },

    // ensure prototype[name] inherits from a prototype.prototype[name]
    inheritObject: function(name, prototype, base) {
      // require an object
      var source = prototype[name] || {};
      // chain inherited properties onto a new object
      prototype[name] = this.chainObject(source, base[name]);
    },

    // register 'prototype' to custom element 'name', store constructor 
    registerPrototype: function(name, extendee) { 
      var info = {
        prototype: this.prototype
      }
      // native element must be specified in extends
      var typeExtension = this.findTypeExtension(extendee);
      if (typeExtension) {
        info.extends = typeExtension;
      }
      // register the prototype with HTMLElement for name lookup
      HTMLElement.register(name, this.prototype);
      // register the custom type
      this.ctor = document.registerElement(name, info);
    },

    findTypeExtension: function(name) {
      if (name && name.indexOf('-') < 0) {
        return name;
      } else {
        var p = this.findBasePrototype(name);
        if (p.element) {
          return this.findTypeExtension(p.element.extends);
        }
      }
    }

  };

  // memoize base prototypes
  var memoizedBases = {};

  // implementation of 'chainObject' depends on support for __proto__
  if (Object.__proto__) {
    prototype.chainObject = function(object, inherited) {
      if (object && inherited && object !== inherited) {
        object.__proto__ = inherited;
      }
      return object;
    }
  } else {
    prototype.chainObject = function(object, inherited) {
      if (object && inherited && object !== inherited) {
        var chained = Object.create(inherited);
        object = extend(chained, object);
      }
      return object;
    }
  }

  // On platforms that do not support __proto__ (versions of IE), the prototype
  // chain of a custom element is simulated via installation of __proto__.
  // Although custom elements manages this, we install it here so it's
  // available during desugaring.
  function ensurePrototypeTraversal(prototype) {
    if (!Object.__proto__) {
      var ancestor = Object.getPrototypeOf(prototype);
      prototype.__proto__ = ancestor;
      if (isBase(ancestor)) {
        ancestor.__proto__ = Object.getPrototypeOf(ancestor);
      }
    }
  }

  // exports

  api.declaration.prototype = prototype;

})(Polymer);

(function(scope) {

  /*

    Elements are added to a registration queue so that they register in 
    the proper order at the appropriate time. We do this for a few reasons:

    * to enable elements to load resources (like stylesheets) 
    asynchronously. We need to do this until the platform provides an efficient
    alternative. One issue is that remote @import stylesheets are 
    re-fetched whenever stamped into a shadowRoot.

    * to ensure elements loaded 'at the same time' (e.g. via some set of
    imports) are registered as a batch. This allows elements to be enured from
    upgrade ordering as long as they query the dom tree 1 task after
    upgrade (aka domReady). This is a performance tradeoff. On the one hand,
    elements that could register while imports are loading are prevented from 
    doing so. On the other, grouping upgrades into a single task means less
    incremental work (for example style recalcs),  Also, we can ensure the 
    document is in a known state at the single quantum of time when 
    elements upgrade.

  */
  var queue = {

    // tell the queue to wait for an element to be ready
    wait: function(element) {
      if (!element.__queue) {
        element.__queue = {};
        elements.push(element);
      }
    },

    // enqueue an element to the next spot in the queue.
    enqueue: function(element, check, go) {
      var shouldAdd = element.__queue && !element.__queue.check;
      if (shouldAdd) {
        queueForElement(element).push(element);
        element.__queue.check = check;
        element.__queue.go = go;
      }
      return (this.indexOf(element) !== 0);
    },

    indexOf: function(element) {
      var i = queueForElement(element).indexOf(element);
      if (i >= 0 && document.contains(element)) {
        i += (HTMLImports.useNative || HTMLImports.ready) ? 
          importQueue.length : 1e9;
      }
      return i;  
    },

    // tell the queue an element is ready to be registered
    go: function(element) {
      var readied = this.remove(element);
      if (readied) {
        element.__queue.flushable = true;
        this.addToFlushQueue(readied);
        this.check();
      }
    },

    remove: function(element) {
      var i = this.indexOf(element);
      if (i !== 0) {
        //console.warn('queue order wrong', i);
        return;
      }
      return queueForElement(element).shift();
    },

    check: function() {
      // next
      var element = this.nextElement();
      if (element) {
        element.__queue.check.call(element);
      }
      if (this.canReady()) {
        this.ready();
        return true;
      }
    },

    nextElement: function() {
      return nextQueued();
    },

    canReady: function() {
      return !this.waitToReady && this.isEmpty();
    },

    isEmpty: function() {
      for (var i=0, l=elements.length, e; (i<l) && 
          (e=elements[i]); i++) {
        if (e.__queue && !e.__queue.flushable) {
          return;
        }
      }
      return true;
    },

    addToFlushQueue: function(element) {
      flushQueue.push(element);  
    },

    flush: function() {
      // prevent re-entrance
      if (this.flushing) {
        return;
      }
      this.flushing = true;
      var element;
      while (flushQueue.length) {
        element = flushQueue.shift();
        element.__queue.go.call(element);
        element.__queue = null;
      }
      this.flushing = false;
    },

    ready: function() {
      // TODO(sorvell): As an optimization, turn off CE polyfill upgrading
      // while registering. This way we avoid having to upgrade each document
      // piecemeal per registration and can instead register all elements
      // and upgrade once in a batch. Without this optimization, upgrade time
      // degrades significantly when SD polyfill is used. This is mainly because
      // querying the document tree for elements is slow under the SD polyfill.
      var polyfillWasReady = CustomElements.ready;
      CustomElements.ready = false;
      this.flush();
      if (!CustomElements.useNative) {
        CustomElements.upgradeDocumentTree(document);
      }
      CustomElements.ready = polyfillWasReady;
      Polymer.flush();
      requestAnimationFrame(this.flushReadyCallbacks);
    },

    addReadyCallback: function(callback) {
      if (callback) {
        readyCallbacks.push(callback);
      }
    },

    flushReadyCallbacks: function() {
      if (readyCallbacks) {
        var fn;
        while (readyCallbacks.length) {
          fn = readyCallbacks.shift();
          fn();
        }
      }
    },
  
    /**
    Returns a list of elements that have had polymer-elements created but 
    are not yet ready to register. The list is an array of element definitions.
    */
    waitingFor: function() {
      var e$ = [];
      for (var i=0, l=elements.length, e; (i<l) && 
          (e=elements[i]); i++) {
        if (e.__queue && !e.__queue.flushable) {
          e$.push(e);
        }
      }
      return e$;
    },

    waitToReady: true

  };

  var elements = [];
  var flushQueue = [];
  var importQueue = [];
  var mainQueue = [];
  var readyCallbacks = [];

  function queueForElement(element) {
    return document.contains(element) ? mainQueue : importQueue;
  }

  function nextQueued() {
    return importQueue.length ? importQueue[0] : mainQueue[0];
  }

  function whenReady(callback) {
    queue.waitToReady = true;
    Polymer.endOfMicrotask(function() {
      HTMLImports.whenReady(function() {
        queue.addReadyCallback(callback);
        queue.waitToReady = false;
        queue.check();
    });
    });
  }

  /**
    Forces polymer to register any pending elements. Can be used to abort
    waiting for elements that are partially defined.
    @param timeout {Integer} Optional timeout in milliseconds
  */
  function forceReady(timeout) {
    if (timeout === undefined) {
      queue.ready();
      return;
    }
    var handle = setTimeout(function() {
      queue.ready();
    }, timeout);
    Polymer.whenReady(function() {
      clearTimeout(handle);
    });
  }

  // exports
  scope.elements = elements;
  scope.waitingFor = queue.waitingFor.bind(queue);
  scope.forceReady = forceReady;
  scope.queue = queue;
  scope.whenReady = scope.whenPolymerReady = whenReady;
})(Polymer);

(function(scope) {

  // imports

  var extend = scope.extend;
  var api = scope.api;
  var queue = scope.queue;
  var whenReady = scope.whenReady;
  var getRegisteredPrototype = scope.getRegisteredPrototype;
  var waitingForPrototype = scope.waitingForPrototype;

  // declarative implementation: <polymer-element>

  var prototype = extend(Object.create(HTMLElement.prototype), {

    createdCallback: function() {
      if (this.getAttribute('name')) {
        this.init();
      }
    },

    init: function() {
      // fetch declared values
      this.name = this.getAttribute('name');
      this.extends = this.getAttribute('extends');
      queue.wait(this);
      // initiate any async resource fetches
      this.loadResources();
      // register when all constraints are met
      this.registerWhenReady();
    },

    // TODO(sorvell): we currently queue in the order the prototypes are 
    // registered, but we should queue in the order that polymer-elements
    // are registered. We are currently blocked from doing this based on 
    // crbug.com/395686.
    registerWhenReady: function() {
     if (this.registered
       || this.waitingForPrototype(this.name)
       || this.waitingForQueue()
       || this.waitingForResources()) {
          return;
      }
      queue.go(this);
    },

    _register: function() {
      //console.log('registering', this.name);
      // warn if extending from a custom element not registered via Polymer
      if (isCustomTag(this.extends) && !isRegistered(this.extends)) {
        console.warn('%s is attempting to extend %s, an unregistered element ' +
            'or one that was not registered with Polymer.', this.name,
            this.extends);
      }
      this.register(this.name, this.extends);
      this.registered = true;
    },

    waitingForPrototype: function(name) {
      if (!getRegisteredPrototype(name)) {
        // then wait for a prototype
        waitingForPrototype(name, this);
        // emulate script if user is not supplying one
        this.handleNoScript(name);
        // prototype not ready yet
        return true;
      }
    },

    handleNoScript: function(name) {
      // if explicitly marked as 'noscript'
      if (this.hasAttribute('noscript') && !this.noscript) {
        this.noscript = true;
        // imperative element registration
        Polymer(name);
      }
    },

    waitingForResources: function() {
      return this._needsResources;
    },

    // NOTE: Elements must be queued in proper order for inheritance/composition
    // dependency resolution. Previously this was enforced for inheritance,
    // and by rule for composition. It's now entirely by rule.
    waitingForQueue: function() {
      return queue.enqueue(this, this.registerWhenReady, this._register);
    },

    loadResources: function() {
      this._needsResources = true;
      this.loadStyles(function() {
        this._needsResources = false;
        this.registerWhenReady();
      }.bind(this));
    }

  });

  // semi-pluggable APIs 

  // TODO(sjmiles): should be fully pluggable (aka decoupled, currently
  // the various plugins are allowed to depend on each other directly)
  api.publish(api.declaration, prototype);

  // utility and bookkeeping

  function isRegistered(name) {
    return Boolean(HTMLElement.getPrototypeForTag(name));
  }

  function isCustomTag(name) {
    return (name && name.indexOf('-') >= 0);
  }

  // boot tasks

  whenReady(function() {
    document.body.removeAttribute('unresolved');
    document.dispatchEvent(
      new CustomEvent('polymer-ready', {bubbles: true})
    );
  });

  // register polymer-element with document

  document.registerElement('polymer-element', {prototype: prototype});

})(Polymer);

(function(scope) {

/**
 * @class Polymer
 */

var whenReady = scope.whenReady;

/**
 * Loads the set of HTMLImports contained in `node`. Notifies when all
 * the imports have loaded by calling the `callback` function argument.
 * This method can be used to lazily load imports. For example, given a 
 * template:
 *     
 *     <template>
 *       <link rel="import" href="my-import1.html">
 *       <link rel="import" href="my-import2.html">
 *     </template>
 *
 *     Polymer.importElements(template.content, function() {
 *       console.log('imports lazily loaded'); 
 *     });
 * 
 * @method importElements
 * @param {Node} node Node containing the HTMLImports to load.
 * @param {Function} callback Callback called when all imports have loaded.
 */
function importElements(node, callback) {
  if (node) {
    document.head.appendChild(node);
    whenReady(callback);
  } else if (callback) {
    callback();
  }
}

/**
 * Loads an HTMLImport for each url specified in the `urls` array.
 * Notifies when all the imports have loaded by calling the `callback` 
 * function argument. This method can be used to lazily load imports. 
 * For example,
 *
 *     Polymer.import(['my-import1.html', 'my-import2.html'], function() {
 *       console.log('imports lazily loaded'); 
 *     });
 * 
 * @method import
 * @param {Array} urls Array of urls to load as HTMLImports.
 * @param {Function} callback Callback called when all imports have loaded.
 */
function _import(urls, callback) {
  if (urls && urls.length) {
      var frag = document.createDocumentFragment();
      for (var i=0, l=urls.length, url, link; (i<l) && (url=urls[i]); i++) {
        link = document.createElement('link');
        link.rel = 'import';
        link.href = url;
        frag.appendChild(link);
      }
      importElements(frag, callback);
  } else if (callback) {
    callback();
  }
}

// exports
scope.import = _import;
scope.importElements = importElements;

})(Polymer);

/**
 * The `auto-binding` element extends the template element. It provides a quick 
 * and easy way to do data binding without the need to setup a model. 
 * The `auto-binding` element itself serves as the model and controller for the 
 * elements it contains. Both data and event handlers can be bound. 
 *
 * The `auto-binding` element acts just like a template that is bound to 
 * a model. It stamps its content in the dom adjacent to itself. When the 
 * content is stamped, the `template-bound` event is fired.
 *
 * Example:
 *
 *     <template is="auto-binding">
 *       <div>Say something: <input value="{{value}}"></div>
 *       <div>You said: {{value}}</div>
 *       <button on-tap="{{buttonTap}}">Tap me!</button>
 *     </template>
 *     <script>
 *       var template = document.querySelector('template');
 *       template.value = 'something';
 *       template.buttonTap = function() {
 *         console.log('tap!');
 *       };
 *     <\/script>
 *
 * @module Polymer
 * @status stable
*/

(function() {

  var element = document.createElement('polymer-element');
  element.setAttribute('name', 'auto-binding');
  element.setAttribute('extends', 'template');
  element.init();

  Polymer('auto-binding', {

    createdCallback: function() {
      this.syntax = this.bindingDelegate = this.makeSyntax();
      // delay stamping until polymer-ready so that auto-binding is not
      // required to load last.
      Polymer.whenPolymerReady(function() {
        this.model = this;
        this.setAttribute('bind', '');
        // we don't bother with an explicit signal here, we could ust a MO
        // if necessary
        this.async(function() {
          // note: this will marshall *all* the elements in the parentNode
          // rather than just stamped ones. We'd need to use createInstance
          // to fix this or something else fancier.
          this.marshalNodeReferences(this.parentNode);
          // template stamping is asynchronous so stamping isn't complete
          // by polymer-ready; fire an event so users can use stamped elements
          this.fire('template-bound');
        });
      }.bind(this));
    },

    makeSyntax: function() {
      var events = Object.create(Polymer.api.declaration.events);
      var self = this;
      events.findController = function() { return self.model; };

      var syntax = new PolymerExpressions();
      var prepareBinding = syntax.prepareBinding;  
      syntax.prepareBinding = function(pathString, name, node) {
        return events.prepareEventBinding(pathString, name, node) ||
               prepareBinding.call(syntax, pathString, name, node);
      };
      return syntax;
    }

  });

})();
;


(function(scope) {

/**
  `Polymer.CoreResizable` and `Polymer.CoreResizer` are a set of mixins that can be used
  in Polymer elements to coordinate the flow of resize events between "resizers" (elements
  that control the size or hidden state of their children) and "resizables" (elements that
  need to be notified when they are resized or un-hidden by their parents in order to take
  action on their new measurements).

  Elements that perform measurement should add the `Core.Resizable` mixin to their 
  Polymer prototype definition and listen for the `core-resize` event on themselves.
  This event will be fired when they become showing after having been hidden,
  when they are resized explicitly by a `CoreResizer`, or when the window has been resized.
  Note, the `core-resize` event is non-bubbling.

  `CoreResizable`'s must manually call the `resizableAttachedHandler` from the element's
  `attached` callback and `resizableDetachedHandler` from the element's `detached`
  callback.

    @element CoreResizable
    @status beta
    @homepage github.io
*/

  scope.CoreResizable = {

    /**
     * User must call from `attached` callback
     *
     * @method resizableAttachedHandler
     */
    resizableAttachedHandler: function(cb) {
      cb = cb || this._notifyResizeSelf;
      this.async(function() {
        var detail = {callback: cb, hasParentResizer: false};
        this.fire('core-request-resize', detail);
        if (!detail.hasParentResizer) {
          this._boundWindowResizeHandler = cb.bind(this);
          // log('adding window resize handler', null, this);
          window.addEventListener('resize', this._boundWindowResizeHandler);
        }
      }.bind(this));
    },

    /**
     * User must call from `detached` callback
     *
     * @method resizableDetachedHandler
     */
    resizableDetachedHandler: function() {
      this.fire('core-request-resize-cancel', null, this, false);
      if (this._boundWindowResizeHandler) {
        window.removeEventListener('resize', this._boundWindowResizeHandler);
      }
    },

    // Private: fire non-bubbling resize event to self; returns whether
    // preventDefault was called, indicating that children should not
    // be resized
    _notifyResizeSelf: function() {
      return this.fire('core-resize', null, this, false).defaultPrevented;
    }

  };

/**
  `Polymer.CoreResizable` and `Polymer.CoreResizer` are a set of mixins that can be used
  in Polymer elements to coordinate the flow of resize events between "resizers" (elements
  that control the size or hidden state of their children) and "resizables" (elements that
  need to be notified when they are resized or un-hidden by their parents in order to take
  action on their new measurements).

  Elements that cause their children to be resized (e.g. a splitter control) or hide/show
  their children (e.g. overlay) should add the `Core.CoreResizer` mixin to their 
  Polymer prototype definition and then call `this.notifyResize()` any time the element
  resizes or un-hides its children.

  `CoreResizer`'s must manually call the `resizerAttachedHandler` from the element's
  `attached` callback and `resizerDetachedHandler` from the element's `detached`
  callback.

  Note: `CoreResizer` extends `CoreResizable`, and can listen for the `core-resize` event
  on itself if it needs to perform resize work on itself before notifying children.
  In this case, returning `false` from the `core-resize` event handler (or calling
  `preventDefault` on the event) will prevent notification of children if required.

  @element CoreResizer
  @extends CoreResizable
  @status beta
  @homepage github.io
*/

  scope.CoreResizer = Polymer.mixin({

    /**
     * User must call from `attached` callback
     *
     * @method resizerAttachedHandler
     */
    resizerAttachedHandler: function() {
      this.resizableAttachedHandler(this.notifyResize);
      this._boundResizeRequested = this._boundResizeRequested || this._handleResizeRequested.bind(this);
      var listener;
      if (this.resizerIsPeer) {
        listener = this.parentElement || (this.parentNode && this.parentNode.host);
        listener._resizerPeers = listener._resizerPeers || [];
        listener._resizerPeers.push(this);
      } else {
        listener = this;
      }
      listener.addEventListener('core-request-resize', this._boundResizeRequested);
      this._resizerListener = listener;
    },

    /**
     * User must call from `detached` callback
     *
     * @method resizerDetachedHandler
     */
    resizerDetachedHandler: function() {
      this.resizableDetachedHandler();
      this._resizerListener.removeEventListener('core-request-resize', this._boundResizeRequested);
    },

    /**
     * User should call when resizing or un-hiding children
     *
     * @method notifyResize
     */
    notifyResize: function() {
      // Notify self
      if (!this._notifyResizeSelf()) {
        // Notify requestors if default was not prevented
        var r = this.resizeRequestors;
        if (r) {
          for (var i=0; i<r.length; i++) {
            var ri = r[i];
            if (!this.resizerShouldNotify || this.resizerShouldNotify(ri.target)) {
              // log('notifying resize', null, ri.target, true);
              ri.callback.apply(ri.target);
              // logEnd();
            }
          }
        }
      }
    },

    /**
     * User should implement to introduce filtering when notifying children.
     * Generally, children that are hidden by the CoreResizer (e.g. non-active
     * pages) need not be notified during resize, since they will be notified
     * again when becoming un-hidden.
     *
     * Return `true` if CoreResizable passed as argument should be notified of
     * resize.
     *
     * @method resizeerShouldNotify
     * @param {Element} el
     */
     // resizeerShouldNotify: function(el) { }  // User to implement if needed

    /**
     * Set to `true` if the resizer is actually a peer to the elements it
     * resizes (e.g. splitter); in this case it will listen for resize requests
     * events from its peers on its parent.
     *
     * @property resizerIsPeer
     * @type Boolean
     * @default false
     */

    // Private: Handle requests for resize
    _handleResizeRequested: function(e) {
      var target = e.path[0];
      if ((target == this) || 
          (target == this._resizerListener) || 
          (this._resizerPeers && this._resizerPeers.indexOf(target) < 0)) {
        return;
      }
      // log('resize requested', target, this);
      if (!this.resizeRequestors) {
        this.resizeRequestors = [];
      }
      this.resizeRequestors.push({target: target, callback: e.detail.callback});
      target.addEventListener('core-request-resize-cancel', this._cancelResizeRequested.bind(this));
      e.detail.hasParentResizer = true;
      e.stopPropagation();
    },

    // Private: Handle cancellation requests for resize
    _cancelResizeRequested: function(e) {
      // Exit early if we're already out of the DOM (resizeRequestors will already be null)
      if (this.resizeRequestors) {
        for (var i=0; i<this.resizeRequestors.length; i++) {
          if (this.resizeRequestors[i].target == e.target) {
            // log('resizeCanceled', e.target, this);
            this.resizeRequestors.splice(i, 1);
            break;
          }
        }
      }
    }

  }, Polymer.CoreResizable);

  // function prettyName(el) {
  //   return el.localName + (el.id ? '#' : '') + el.id;
  // }

  // function log(what, from, to, group) {
  //   var args = [what];
  //   if (from) {
  //     args.push('from ' + prettyName(from));
  //   }
  //   if (to) {
  //     args.push('to ' + prettyName(to));
  //   }
  //   if (group) {
  //     console.group.apply(console, args);
  //   } else {
  //     console.log.apply(console, args);
  //   }
  // }

  // function logEnd() {
  //   console.groupEnd();
  // }

})(Polymer);

;
// Copyright 2014 Google Inc. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
//     You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//     See the License for the specific language governing permissions and
// limitations under the License.

!function(a,b){b["true"]=a;var c={},d={},e={},f=null;!function(a){function b(b,c){var d={delay:0,endDelay:0,fill:c?"both":"none",iterationStart:0,iterations:1,duration:c?"auto":0,playbackRate:1,direction:"normal",easing:"linear"};return"number"!=typeof b||isNaN(b)?void 0!==b&&Object.getOwnPropertyNames(b).forEach(function(c){if("auto"!=b[c]){if(("number"==typeof d[c]||"duration"==c)&&("number"!=typeof b[c]||isNaN(b[c])))return;if("fill"==c&&-1==p.indexOf(b[c]))return;if("direction"==c&&-1==q.indexOf(b[c]))return;if("playbackRate"==c&&a.isDeprecated("AnimationTiming.playbackRate","2014-11-28","Use AnimationPlayer.playbackRate instead."))return;d[c]=b[c]}}):d.duration=b,d}function c(a,c){var d=b(a,c);return d.easing=f(d.easing),d}function d(a,b,c,d){return 0>a||a>1||0>c||c>1?y:function(e){function f(a,b,c){return 3*a*(1-c)*(1-c)*c+3*b*(1-c)*c*c+c*c*c}for(var g=0,h=1;;){var i=(g+h)/2,j=f(a,c,i);if(Math.abs(e-j)<.001)return f(b,d,i);e>j?g=i:h=i}}}function e(a,b){return function(c){if(c>=1)return 1;var d=1/a;return c+=b*d,c-c%d}}function f(a){var b=w.exec(a);if(b)return d.apply(this,b.slice(1).map(Number));var c=x.exec(a);if(c)return e(Number(c[1]),{start:r,middle:s,end:t}[c[2]]);var f=u[a];return f?f:y}function g(a){return Math.abs(h(a)/a.playbackRate)}function h(a){return a.duration*a.iterations}function i(a,b,c){return null==b?z:b<c.delay?A:b>=c.delay+a?B:C}function j(a,b,c,d,e){switch(d){case A:return"backwards"==b||"both"==b?0:null;case C:return c-e;case B:return"forwards"==b||"both"==b?a:null;case z:return null}}function k(a,b,c,d){return(d.playbackRate<0?b-a:b)*d.playbackRate+c}function l(a,b,c,d,e){return 1/0===c||c===-1/0||c-d==b&&e.iterations&&(e.iterations+e.iterationStart)%1==0?a:c%a}function m(a,b,c,d){return 0===c?0:b==a?d.iterationStart+d.iterations-1:Math.floor(c/a)}function n(a,b,c,d){var e=a%2>=1,f="normal"==d.direction||d.direction==(e?"alternate-reverse":"alternate"),g=f?c:b-c,h=g/b;return b*d.easing(h)}function o(a,b,c){var d=i(a,b,c),e=j(a,c.fill,b,d,c.delay);if(null===e)return null;if(0===a)return d===A?0:1;var f=c.iterationStart*c.duration,g=k(a,e,f,c),o=l(c.duration,h(c),g,f,c),p=m(c.duration,o,g,c);return n(p,c.duration,o,c)/c.duration}var p="backwards|forwards|both".split("|"),q="reverse|alternate|alternate-reverse".split("|"),r=1,s=.5,t=0,u={ease:d(.25,.1,.25,1),"ease-in":d(.42,0,1,1),"ease-out":d(0,0,.58,1),"ease-in-out":d(.42,0,.58,1),"step-start":e(1,r),"step-middle":e(1,s),"step-end":e(1,t)},v="\\s*(-?\\d+\\.?\\d*|-?\\.\\d+)\\s*",w=new RegExp("cubic-bezier\\("+v+","+v+","+v+","+v+"\\)"),x=/steps\(\s*(\d+)\s*,\s*(start|middle|end)\s*\)/,y=function(a){return a},z=0,A=1,B=2,C=3;a.makeTiming=b,a.normalizeTimingInput=c,a.calculateActiveDuration=g,a.calculateTimeFraction=o,a.calculatePhase=i,a.toTimingFunction=f}(c,f),function(a){function b(a,b){return a in h?h[a][b]||b:b}function c(a,c,d){var g=e[a];if(g){f.style[a]=c;for(var h in g){var i=g[h],j=f.style[i];d[i]=b(i,j)}}else d[a]=b(a,c)}function d(b){function d(){var a=e.length;null==e[a-1].offset&&(e[a-1].offset=1),a>1&&null==e[0].offset&&(e[0].offset=0);for(var b=0,c=e[0].offset,d=1;a>d;d++){var f=e[d].offset;if(null!=f){for(var g=1;d-b>g;g++)e[b+g].offset=c+(f-c)*g/(d-b);b=d,c=f}}}if(!Array.isArray(b)&&null!==b)throw new TypeError("Keyframe effect must be null or an array of keyframes");if(null==b)return[];for(var e=b.map(function(b){var d={};for(var e in b){var f=b[e];if("offset"==e){if(null!=f&&(f=Number(f),!isFinite(f)))throw new TypeError("keyframe offsets must be numbers.")}else{if("composite"==e)throw{type:DOMException.NOT_SUPPORTED_ERR,name:"NotSupportedError",message:"add compositing is not supported"};f="easing"==e?a.toTimingFunction(f):""+f}c(e,f,d)}return void 0==d.offset&&(d.offset=null),void 0==d.easing&&(d.easing=a.toTimingFunction("linear")),d}),f=!0,g=-1/0,h=0;h<e.length;h++){var i=e[h].offset;if(null!=i){if(g>i)throw{code:DOMException.INVALID_MODIFICATION_ERR,name:"InvalidModificationError",message:"Keyframes are not loosely sorted by offset. Sort or specify offsets."};g=i}else f=!1}return e=e.filter(function(a){return a.offset>=0&&a.offset<=1}),f||d(),e}var e={background:["backgroundImage","backgroundPosition","backgroundSize","backgroundRepeat","backgroundAttachment","backgroundOrigin","backgroundClip","backgroundColor"],border:["borderTopColor","borderTopStyle","borderTopWidth","borderRightColor","borderRightStyle","borderRightWidth","borderBottomColor","borderBottomStyle","borderBottomWidth","borderLeftColor","borderLeftStyle","borderLeftWidth"],borderBottom:["borderBottomWidth","borderBottomStyle","borderBottomColor"],borderColor:["borderTopColor","borderRightColor","borderBottomColor","borderLeftColor"],borderLeft:["borderLeftWidth","borderLeftStyle","borderLeftColor"],borderRadius:["borderTopLeftRadius","borderTopRightRadius","borderBottomRightRadius","borderBottomLeftRadius"],borderRight:["borderRightWidth","borderRightStyle","borderRightColor"],borderTop:["borderTopWidth","borderTopStyle","borderTopColor"],borderWidth:["borderTopWidth","borderRightWidth","borderBottomWidth","borderLeftWidth"],flex:["flexGrow","flexShrink","flexBasis"],font:["fontFamily","fontSize","fontStyle","fontVariant","fontWeight","lineHeight"],margin:["marginTop","marginRight","marginBottom","marginLeft"],outline:["outlineColor","outlineStyle","outlineWidth"],padding:["paddingTop","paddingRight","paddingBottom","paddingLeft"]},f=document.createElementNS("http://www.w3.org/1999/xhtml","div"),g={thin:"1px",medium:"3px",thick:"5px"},h={borderBottomWidth:g,borderLeftWidth:g,borderRightWidth:g,borderTopWidth:g,fontSize:{"xx-small":"60%","x-small":"75%",small:"89%",medium:"100%",large:"120%","x-large":"150%","xx-large":"200%"},fontWeight:{normal:"400",bold:"700"},outlineWidth:g,textShadow:{none:"0px 0px 0px transparent"},boxShadow:{none:"0px 0px 0px 0px transparent"}};a.normalizeKeyframes=d}(c,f),function(a){var b={};a.isDeprecated=function(a,c,d,e){var f=e?"are":"is",g=new Date,h=new Date(c);return h.setMonth(h.getMonth()+3),h>g?(a in b||console.warn("Web Animations: "+a+" "+f+" deprecated and will stop working on "+h.toDateString()+". "+d),b[a]=!0,!1):!0},a.deprecated=function(b,c,d,e){if(a.isDeprecated(b,c,d,e))throw new Error(b+" "+auxVerb+" no longer supported. "+d)}}(c),function(){if(document.documentElement.animate){var a=document.documentElement.animate([],0),b=!0;if(a&&(b=!1,"play|currentTime|pause|reverse|playbackRate|cancel|finish|startTime|playState".split("|").forEach(function(c){void 0===a[c]&&(b=!0)})),!b)return}!function(a,b){b.AnimationNode=function(b){var c=a.calculateActiveDuration(b),d=function(d){return a.calculateTimeFraction(c,d,b)};return d._totalDuration=b.delay+c+b.endDelay,d._isCurrent=function(d){var e=a.calculatePhase(c,d,b);return e===PhaseActive||e===PhaseBefore},d}}(c,d),function(a,b){function c(a){for(var b={},c=0;c<a.length;c++)for(var d in a[c])if("offset"!=d&&"easing"!=d&&"composite"!=d){var e={offset:a[c].offset,easing:a[c].easing,value:a[c][d]};b[d]=b[d]||[],b[d].push(e)}for(var f in b){var g=b[f];if(0!=g[0].offset||1!=g[g.length-1].offset)throw{type:DOMException.NOT_SUPPORTED_ERR,name:"NotSupportedError",message:"Partial keyframes are not supported"}}return b}function d(a){var c=[];for(var d in a)for(var e=a[d],f=0;f<e.length-1;f++){var g=e[f].offset,h=e[f+1].offset,i=e[f].value,j=e[f+1].value;g==h&&(1==h?i=j:j=i),c.push({startTime:g,endTime:h,easing:e[f].easing,property:d,interpolation:b.propertyInterpolation(d,i,j)})}return c.sort(function(a,b){return a.startTime-b.startTime}),c}b.convertEffectInput=function(e){var f=a.normalizeKeyframes(e),g=c(f),h=d(g);return function(a,c){if(null!=c)h.filter(function(a){return 0>=c&&0==a.startTime||c>=1&&1==a.endTime||c>=a.startTime&&c<=a.endTime}).forEach(function(d){var e=c-d.startTime,f=d.endTime-d.startTime,g=0==f?0:d.easing(e/f);b.apply(a,d.property,d.interpolation(g))});else for(var d in g)"offset"!=d&&"easing"!=d&&"composite"!=d&&b.clear(a,d)}}}(c,d,f),function(a){function b(a,b,c){e[c]=e[c]||[],e[c].push([a,b])}function c(a,c,d){for(var e=0;e<d.length;e++){var f=d[e];b(a,c,f),/-/.test(f)&&b(a,c,f.replace(/-(.)/g,function(a,b){return b.toUpperCase()}))}}function d(b,c,d){for(var f=c==d?[]:e[b],g=0;f&&g<f.length;g++){var h=f[g][0](c),i=f[g][0](d);if(void 0!==h&&void 0!==i){var j=f[g][1](h,i);if(j){var k=a.Interpolation.apply(null,j);return function(a){return 0==a?c:1==a?d:k(a)}}}}return a.Interpolation(!1,!0,function(a){return a?d:c})}var e={};a.addPropertiesHandler=c,a.propertyInterpolation=d}(d,f),function(a,b){b.Animation=function(c,d,e){var f,g=b.AnimationNode(a.normalizeTimingInput(e)),h=b.convertEffectInput(d),i=function(){h(c,f)};return i._update=function(a){return f=g(a),null!==f},i._clear=function(){h(c,null)},i._hasSameTarget=function(a){return c===a},i._isCurrent=g._isCurrent,i._totalDuration=g._totalDuration,i},b.NullAnimation=function(a){var b=function(){a&&(a(),a=null)};return b._update=function(){return null},b._totalDuration=0,b._isCurrent=function(){return!1},b._hasSameTarget=function(){return!1},b}}(c,d,f),function(a){a.apply=function(b,c,d){b.style[a.propertyName(c)]=d},a.clear=function(b,c){b.style[a.propertyName(c)]=""}}(d,f),function(a){window.Element.prototype.animate=function(b,c){return a.timeline._play(a.Animation(this,b,c))}}(d),function(a){function b(a,c,d){if("number"==typeof a&&"number"==typeof c)return a*(1-d)+c*d;if("boolean"==typeof a&&"boolean"==typeof c)return.5>d?a:c;if(a.length==c.length){for(var e=[],f=0;f<a.length;f++)e.push(b(a[f],c[f],d));return e}throw"Mismatched interpolation arguments "+a+":"+c}a.Interpolation=function(a,c,d){return function(e){return d(b(a,c,e))}}}(d,f),function(a){var b=0,c=function(a,b,c){this.target=a,this.currentTime=b,this.timelineTime=c,this.type="finish",this.bubbles=!1,this.cancelable=!1,this.currentTarget=a,this.defaultPrevented=!1,this.eventPhase=Event.AT_TARGET,this.timeStamp=Date.now()};a.Player=function(a){this._sequenceNumber=b++,this._currentTime=0,this._startTime=null,this.paused=!1,this._playbackRate=1,this._inTimeline=!0,this._finishedFlag=!1,this.onfinish=null,this._finishHandlers=[],this._source=a,this._inEffect=this._source._update(0),this._idle=!0,this._currentTimePending=!1},a.Player.prototype={_ensureAlive:function(){this._inEffect=this._source._update(this.currentTime),this._inTimeline||!this._inEffect&&this._finishedFlag||(this._inTimeline=!0,a.timeline._players.push(this))},_tickCurrentTime:function(a,b){a!=this._currentTime&&(this._currentTime=a,this.finished&&!b&&(this._currentTime=this._playbackRate>0?this._totalDuration:0),this._ensureAlive())},get currentTime(){return this._idle||this._currentTimePending?null:this._currentTime},set currentTime(b){b=+b,isNaN(b)||(a.restart(),this.paused||null==this._startTime||(this._startTime=this._timeline.currentTime-b/this._playbackRate),this._currentTimePending=!1,this._currentTime!=b&&(this._tickCurrentTime(b,!0),a.invalidateEffects()))},get startTime(){return this._startTime},set startTime(b){b=+b,isNaN(b)||this.paused||this._idle||(this._startTime=b,this._tickCurrentTime((this._timeline.currentTime-this._startTime)*this.playbackRate),a.invalidateEffects())},get playbackRate(){return this._playbackRate},get finished(){return!this._idle&&(this._playbackRate>0&&this._currentTime>=this._totalDuration||this._playbackRate<0&&this._currentTime<=0)},get _totalDuration(){return this._source._totalDuration},get playState(){return this._idle?"idle":null==this._startTime&&!this.paused&&0!=this.playbackRate||this._currentTimePending?"pending":this.paused?"paused":this.finished?"finished":"running"},play:function(){this.paused=!1,(this.finished||this._idle)&&(this._currentTime=this._playbackRate>0?0:this._totalDuration,this._startTime=null,a.invalidateEffects()),this._finishedFlag=!1,a.restart(),this._idle=!1,this._ensureAlive()},pause:function(){this.finished||this.paused||this._idle||(this._currentTimePending=!0),this._startTime=null,this.paused=!0},finish:function(){this._idle||(this.currentTime=this._playbackRate>0?this._totalDuration:0,this._startTime=this._totalDuration-this.currentTime,this._currentTimePending=!1)},cancel:function(){this._inEffect=!1,this._idle=!0,this.currentTime=0,this._startTime=null},reverse:function(){this._playbackRate*=-1,this._startTime=null,this.play()},addEventListener:function(a,b){"function"==typeof b&&"finish"==a&&this._finishHandlers.push(b)},removeEventListener:function(a,b){if("finish"==a){var c=this._finishHandlers.indexOf(b);c>=0&&this._finishHandlers.splice(c,1)}},_fireEvents:function(a){var b=this.finished;if((b||this._idle)&&!this._finishedFlag){var d=new c(this,this._currentTime,a),e=this._finishHandlers.concat(this.onfinish?[this.onfinish]:[]);setTimeout(function(){e.forEach(function(a){a.call(d.target,d)})},0)}this._finishedFlag=b},_tick:function(a){return this._idle||this.paused||(null==this._startTime?this.startTime=a-this._currentTime/this.playbackRate:this.finished||this._tickCurrentTime((a-this._startTime)*this.playbackRate)),this._currentTimePending=!1,this._fireEvents(a),!this._idle&&(this._inEffect||!this._finishedFlag)}}}(d,f),function(a,b){function c(a){var b=i;i=[],g(a),b.forEach(function(b){b[1](a)}),m&&g(a),f()}function d(a,b){return a._sequenceNumber-b._sequenceNumber}function e(){this._players=[],this.currentTime=window.performance&&performance.now?performance.now():0}function f(){n.forEach(function(a){a()})}function g(a){l=!1;var c=b.timeline;c.currentTime=a,c._players.sort(d),k=!1;var e=c._players;c._players=[];var f=[],g=[];e=e.filter(function(b){return b._inTimeline=b._tick(a),b._inEffect?g.push(b._source):f.push(b._source),b.finished||b.paused||b._idle||(k=!0),b._inTimeline}),n.length=0,n.push.apply(n,f),n.push.apply(n,g),c._players.push.apply(c._players,e),m=!1,k&&requestAnimationFrame(function(){})}var h=window.requestAnimationFrame,i=[],j=0;window.requestAnimationFrame=function(a){var b=j++;return 0==i.length&&h(c),i.push([b,a]),b},window.cancelAnimationFrame=function(a){i.forEach(function(b){b[0]==a&&(b[1]=function(){})})},e.prototype={_play:function(c){c._timing=a.normalizeTimingInput(c.timing);var d=new b.Player(c);return d._idle=!1,d._timeline=this,this._players.push(d),b.restart(),b.invalidateEffects(),d}};var k=!1,l=!1;b.restart=function(){return k||(k=!0,requestAnimationFrame(function(){}),l=!0),l};var m=!1;b.invalidateEffects=function(){m=!0};var n=[],o=window.getComputedStyle;Object.defineProperty(window,"getComputedStyle",{configurable:!0,enumerable:!0,value:function(){return m&&g(p.currentTime),f(),o.apply(this,arguments)}});var p=new e;b.timeline=p}(c,d,f),function(a){function b(a,b){var c=a.exec(b);return c?(c=a.ignoreCase?c[0].toLowerCase():c[0],[c,b.substr(c.length)]):void 0}function c(a,b){b=b.replace(/^\s*/,"");var c=a(b);return c?[c[0],c[1].replace(/^\s*/,"")]:void 0}function d(a,d,e){a=c.bind(null,a);for(var f=[];;){var g=a(e);if(!g)return[f,e];if(f.push(g[0]),e=g[1],g=b(d,e),!g||""==g[1])return[f,e];e=g[1]}}function e(a,b){for(var c=0,d=0;d<b.length&&(!/\s|,/.test(b[d])||0!=c);d++)if("("==b[d])c++;else if(")"==b[d]&&(c--,0==c&&d++,0>=c))break;var e=a(b.substr(0,d));return void 0==e?void 0:[e,b.substr(d)]}function f(a,b){for(var c=a,d=b;c&&d;)c>d?c%=d:d%=c;return c=a*b/(c+d)}function g(a){return function(b){var c=a(b);return c&&(c[0]=void 0),c}}function h(a,b){return function(c){var d=a(c);return d?d:[b,c]}}function i(b,c){for(var d=[],e=0;e<b.length;e++){var f=a.consumeTrimmed(b[e],c);if(!f||""==f[0])return;void 0!==f[0]&&d.push(f[0]),c=f[1]}return""==c?d:void 0}function j(a,b,c,d,e){for(var g=[],h=[],i=[],j=f(d.length,e.length),k=0;j>k;k++){var l=b(d[k%d.length],e[k%e.length]);if(!l)return;g.push(l[0]),h.push(l[1]),i.push(l[2])}return[g,h,function(b){var d=b.map(function(a,b){return i[b](a)}).join(c);return a?a(d):d}]}function k(a,b,c){for(var d=[],e=[],f=[],g=0,h=0;h<c.length;h++)if("function"==typeof c[h]){var i=c[h](a[g],b[g++]);d.push(i[0]),e.push(i[1]),f.push(i[2])}else!function(a){d.push(!1),e.push(!1),f.push(function(){return c[a]})}(h);return[d,e,function(a){for(var b="",c=0;c<a.length;c++)b+=f[c](a[c]);return b}]}a.consumeToken=b,a.consumeTrimmed=c,a.consumeRepeated=d,a.consumeParenthesised=e,a.ignore=g,a.optional=h,a.consumeList=i,a.mergeNestedRepeated=j.bind(null,null),a.mergeWrappedNestedRepeated=j,a.mergeList=k}(d),function(a){function b(b){function c(b){var c=a.consumeToken(/^inset/i,b);if(c)return d.inset=!0,c;var c=a.consumeLengthOrPercent(b);if(c)return d.lengths.push(c[0]),c;var c=a.consumeColor(b);return c?(d.color=c[0],c):void 0}var d={inset:!1,lengths:[],color:null},e=a.consumeRepeated(c,/^/,b);return e&&e[0].length?[d,e[1]]:void 0}function c(c){var d=a.consumeRepeated(b,/^,/,c);return d&&""==d[1]?d[0]:void 0}function d(b,c){for(;b.lengths.length<Math.max(b.lengths.length,c.lengths.length);)b.lengths.push({px:0});for(;c.lengths.length<Math.max(b.lengths.length,c.lengths.length);)c.lengths.push({px:0});if(b.inset==c.inset&&!!b.color==!!c.color){for(var d,e=[],f=[[],0],g=[[],0],h=0;h<b.lengths.length;h++){var i=a.mergeDimensions(b.lengths[h],c.lengths[h],2==h);f[0].push(i[0]),g[0].push(i[1]),e.push(i[2])}if(b.color&&c.color){var j=a.mergeColors(b.color,c.color);f[1]=j[0],g[1]=j[1],d=j[2]}return[f,g,function(a){for(var c=b.inset?"inset ":" ",f=0;f<e.length;f++)c+=e[f](a[0][f])+" ";return d&&(c+=d(a[1])),c}]}}function e(b,c,d,e){function f(a){return{inset:a,color:[0,0,0,0],lengths:[{px:0},{px:0},{px:0},{px:0}]}}for(var g=[],h=[],i=0;i<d.length||i<e.length;i++){var j=d[i]||f(e[i].inset),k=e[i]||f(d[i].inset);g.push(j),h.push(k)}return a.mergeNestedRepeated(b,c,g,h)}var f=e.bind(null,d,", ");a.addPropertiesHandler(c,f,["box-shadow","text-shadow"])}(d),function(a){function b(a){return a.toFixed(3).replace(".000","")}function c(a,b,c){return Math.min(b,Math.max(a,c))}function d(a){return/^\s*[-+]?(\d*\.)?\d+\s*$/.test(a)?Number(a):void 0}function e(a,c){return[a,c,b]}function f(a,b){return 0!=a?h(0,1/0)(a,b):void 0}function g(a,b){return[a,b,function(a){return Math.round(c(1,1/0,a))}]}function h(a,d){return function(e,f){return[e,f,function(e){return b(c(a,d,e))}]}}function i(a,b){return[a,b,Math.round]}a.clamp=c,a.addPropertiesHandler(d,h(0,1/0),["border-image-width","line-height"]),a.addPropertiesHandler(d,h(0,1),["opacity","shape-image-threshold"]),a.addPropertiesHandler(d,h(.01,1/0),["zoom"]),a.addPropertiesHandler(d,f,["flex-grow","flex-shrink"]),a.addPropertiesHandler(d,e,["zoom"]),a.addPropertiesHandler(d,g,["orphans","widows"]),a.addPropertiesHandler(d,i,["z-index"]),a.parseNumber=d,a.mergeNumbers=e,a.numberToString=b}(d,f),function(a){function b(a,b){return"visible"==a||"visible"==b?[0,1,function(c){return 0>=c?a:c>=1?b:"visible"}]:void 0}a.addPropertiesHandler(String,b,["visibility"])}(d),function(a){function b(a){a=a.trim(),e.fillStyle="#000",e.fillStyle=a;var b=e.fillStyle;if(e.fillStyle="#fff",e.fillStyle=a,b==e.fillStyle){e.fillRect(0,0,1,1);var c=e.getImageData(0,0,1,1).data;e.clearRect(0,0,1,1);var d=c[3]/255;return[c[0]*d,c[1]*d,c[2]*d,d]}}function c(b,c){return[b,c,function(b){function c(a){return Math.max(0,Math.min(255,a))}if(b[3])for(var d=0;3>d;d++)b[d]=Math.round(c(b[d]/b[3]));return b[3]=a.numberToString(a.clamp(0,1,b[3])),"rgba("+b.join(",")+")"}]}var d=document.createElementNS("http://www.w3.org/1999/xhtml","canvas");d.width=d.height=1;var e=d.getContext("2d");a.addPropertiesHandler(b,c,["background-color","border-bottom-color","border-left-color","border-right-color","border-top-color","color","outline-color","text-decoration-color"]),a.consumeColor=a.consumeParenthesised.bind(null,b),a.mergeColors=c}(d,f),function(a,b){function c(a,b){if(b=b.trim().toLowerCase(),"0"==b&&"px".search(a)>=0)return{px:0};if(/^[^(]*$|^calc/.test(b)){b=b.replace(/calc\(/g,"(");var c={};b=b.replace(a,function(a){return c[a]=null,"U"+a});for(var d="U("+a.source+")",e=b.replace(/[-+]?(\d*\.)?\d+/g,"N").replace(new RegExp("N"+d,"g"),"D").replace(/\s[+-]\s/g,"O").replace(/\s/g,""),f=[/N\*(D)/g,/(N|D)[*/]N/g,/(N|D)O\1/g,/\((N|D)\)/g],g=0;g<f.length;)f[g].test(e)?(e=e.replace(f[g],"$1"),g=0):g++;if("D"==e){for(var h in c){var i=eval(b.replace(new RegExp("U"+h,"g"),"").replace(new RegExp(d,"g"),"*0"));if(!isFinite(i))return;c[h]=i}return c}}}function d(a,b){return e(a,b,!0)}function e(b,c,d){var e,f=[];for(e in b)f.push(e);for(e in c)f.indexOf(e)<0&&f.push(e);return b=f.map(function(a){return b[a]||0}),c=f.map(function(a){return c[a]||0}),[b,c,function(b){var c=b.map(function(c,e){return 1==b.length&&d&&(c=Math.max(c,0)),a.numberToString(c)+f[e]}).join(" + ");return b.length>1?"calc("+c+")":c}]}var f="px|em|ex|ch|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc",g=c.bind(null,new RegExp(f,"g")),h=c.bind(null,new RegExp(f+"|%","g")),i=c.bind(null,/deg|rad|grad|turn/g);a.parseLength=g,a.parseLengthOrPercent=h,a.consumeLengthOrPercent=a.consumeParenthesised.bind(null,h),a.parseAngle=i,a.mergeDimensions=e;var j=a.consumeParenthesised.bind(null,g),k=a.consumeRepeated.bind(void 0,j,/^/),l=a.consumeRepeated.bind(void 0,k,/^,/);a.consumeSizePairList=l;var m=function(a){var b=l(a);return b&&""==b[1]?b[0]:void 0},n=a.mergeNestedRepeated.bind(void 0,d," "),o=a.mergeNestedRepeated.bind(void 0,n,",");a.mergeNonNegativeSizePair=n,a.addPropertiesHandler(m,o,["background-size"]),a.addPropertiesHandler(h,d,["border-bottom-width","border-image-width","border-left-width","border-right-width","border-top-width","flex-basis","font-size","height","line-height","max-height","max-width","outline-width","width"]),a.addPropertiesHandler(h,e,["border-bottom-left-radius","border-bottom-right-radius","border-top-left-radius","border-top-right-radius","bottom","left","letter-spacing","margin-bottom","margin-left","margin-right","margin-top","min-height","min-width","outline-offset","padding-bottom","padding-left","padding-right","padding-top","perspective","right","shape-margin","text-indent","top","vertical-align","word-spacing"])}(d,f),function(a){function b(b){return a.consumeLengthOrPercent(b)||a.consumeToken(/^auto/,b)}function c(c){var d=a.consumeList([a.ignore(a.consumeToken.bind(null,/^rect/)),a.ignore(a.consumeToken.bind(null,/^\(/)),a.consumeRepeated.bind(null,b,/^,/),a.ignore(a.consumeToken.bind(null,/^\)/))],c);return d&&4==d[0].length?d[0]:void 0}function d(b,c){return"auto"==b||"auto"==c?[!0,!1,function(d){var e=d?b:c;if("auto"==e)return"auto";var f=a.mergeDimensions(e,e);return f[2](f[0])}]:a.mergeDimensions(b,c)}function e(a){return"rect("+a+")"}var f=a.mergeWrappedNestedRepeated.bind(null,e,d,", ");a.parseBox=c,a.mergeBoxes=f,a.addPropertiesHandler(c,f,["clip"])}(d,f),function(a){function b(a){return function(b){var c=0;return a.map(function(a){return a===j?b[c++]:a})}}function c(a){return a}function d(b){if(b=b.toLowerCase().trim(),"none"==b)return[];for(var c,d=/\s*(\w+)\(([^)]*)\)/g,e=[],f=0;c=d.exec(b);){if(c.index!=f)return;f=c.index+c[0].length;var g=c[1],h=m[g];if(!h)return;var i=c[2].split(","),j=h[0];if(j.length<i.length)return;for(var n=[],o=0;o<j.length;o++){var p,q=i[o],r=j[o];if(p=q?{A:function(b){return"0"==b.trim()?l:a.parseAngle(b)},N:a.parseNumber,T:a.parseLengthOrPercent,L:a.parseLength}[r.toUpperCase()](q):{a:l,n:n[0],t:k}[r],void 0===p)return;n.push(p)}if(e.push({t:g,d:n}),d.lastIndex==b.length)return e}}function e(a){return a.toFixed(6).replace(".000000","")}function f(b,c){if(b.decompositionPair!==c){b.decompositionPair=c;var d=a.makeMatrixDecomposition(b)}if(c.decompositionPair!==b){c.decompositionPair=b;var f=a.makeMatrixDecomposition(c)}return null==d[0]||null==f[0]?[[!1],[!0],function(a){return a?c[0].d:b[0].d}]:(d[0].push(0),f[0].push(1),[d,f,function(b){var c=a.quat(d[0][3],f[0][3],b[5]),g=a.composeMatrix(b[0],b[1],b[2],c,b[4]),h=g.map(e).join(",");return h}])}function g(a){return a.replace(/[xy]/,"")}function h(a){return a.replace(/(x|y|z|3d)?$/,"3d")}function i(b,c){var d=a.makeMatrixDecomposition&&!0,e=!1;if(!b.length||!c.length){b.length||(e=!0,b=c,c=[]);for(var i=0;i<b.length;i++){var j=b[i].t,k=b[i].d,l="scale"==j.substr(0,5)?1:0;c.push({t:j,d:k.map(function(a){if("number"==typeof a)return l;var b={};for(var c in a)b[c]=l;return b})})}}var n=function(a,b){return"perspective"==a&&"perspective"==b||("matrix"==a||"matrix3d"==a)&&("matrix"==b||"matrix3d"==b)},o=[],p=[],q=[];if(b.length!=c.length){if(!d)return;var r=f(b,c);o=[r[0]],p=[r[1]],q=[["matrix",[r[2]]]]}else for(var i=0;i<b.length;i++){var j,s=b[i].t,t=c[i].t,u=b[i].d,v=c[i].d,w=m[s],x=m[t];if(n(s,t)){if(!d)return;var r=f([b[i]],[c[i]]);o.push(r[0]),p.push(r[1]),q.push(["matrix",[r[2]]])}else{if(s==t)j=s;else if(w[2]&&x[2]&&g(s)==g(t))j=g(s),u=w[2](u),v=x[2](v);else{if(!w[1]||!x[1]||h(s)!=h(t)){if(!d)return;var r=f(b,c);o=[r[0]],p=[r[1]],q=[["matrix",[r[2]]]];break}j=h(s),u=w[1](u),v=x[1](v)}for(var y=[],z=[],A=[],B=0;B<u.length;B++){var C="number"==typeof u[B]?a.mergeNumbers:a.mergeDimensions,r=C(u[B],v[B]);y[B]=r[0],z[B]=r[1],A.push(r[2])}o.push(y),p.push(z),q.push([j,A])}}if(e){var D=o;o=p,p=D}return[o,p,function(a){return a.map(function(a,b){var c=a.map(function(a,c){return q[b][1][c](a)}).join(",");return"matrix"==q[b][0]&&16==c.split(",").length&&(q[b][0]="matrix3d"),q[b][0]+"("+c+")"}).join(" ")}]}var j=null,k={px:0},l={deg:0},m={matrix:["NNNNNN",[j,j,0,0,j,j,0,0,0,0,1,0,j,j,0,1],c],matrix3d:["NNNNNNNNNNNNNNNN",c],rotate:["A"],rotatex:["A"],rotatey:["A"],rotatez:["A"],rotate3d:["NNNA"],perspective:["L"],scale:["Nn",b([j,j,1]),c],scalex:["N",b([j,1,1]),b([j,1])],scaley:["N",b([1,j,1]),b([1,j])],scalez:["N",b([1,1,j])],scale3d:["NNN",c],skew:["Aa",null,c],skewx:["A",null,b([j,l])],skewy:["A",null,b([l,j])],translate:["Tt",b([j,j,k]),c],translatex:["T",b([j,k,k]),b([j,k])],translatey:["T",b([k,j,k]),b([k,j])],translatez:["L",b([k,k,j])],translate3d:["TTL",c]};a.addPropertiesHandler(d,i,["transform"])}(d,f),function(a){function b(a,b){b.concat([a]).forEach(function(b){b in document.documentElement.style&&(c[a]=b)})}var c={};b("transform",["webkitTransform","msTransform"]),b("transformOrigin",["webkitTransformOrigin"]),b("perspective",["webkitPerspective"]),b("perspectiveOrigin",["webkitPerspectiveOrigin"]),a.propertyName=function(a){return c[a]||a}}(d,f)}(),!function(a,b){function c(a){var b=window.document.timeline;b.currentTime=a,b._discardPlayers(),0==b._players.length?d=!1:requestAnimationFrame(c)}b.AnimationTimeline=function(){this._players=[],this.currentTime=void 0},b.AnimationTimeline.prototype={getAnimationPlayers:function(){return this._discardPlayers(),this._players.slice()},_discardPlayers:function(){this._players=this._players.filter(function(a){return"finished"!=a.playState&&"idle"!=a.playState})},play:function(a){var c=new b.Player(a);return this._players.push(c),b.restartWebAnimationsNextTick(),c.play(),c}};var d=!1;b.restartWebAnimationsNextTick=function(){d||(d=!0,requestAnimationFrame(c))};var e=new b.AnimationTimeline;b.timeline=e;try{Object.defineProperty(window.document,"timeline",{configurable:!0,get:function(){return e}})}catch(f){}try{window.document.timeline=e}catch(f){}}(c,e,f),function(a,b){b.Player=function(a){this.source=a,a&&(a.player=this),this._isGroup=!1,this._player=null,this._childPlayers=[],this._callback=null,this._rebuildUnderlyingPlayer(),this._player.cancel()},b.Player.prototype={_rebuildUnderlyingPlayer:function(){this._player&&(this._player.cancel(),this._player=null),(!this.source||this.source instanceof window.Animation)&&(this._player=b.newUnderlyingPlayerForAnimation(this.source),b.bindPlayerForAnimation(this)),(this.source instanceof window.AnimationSequence||this.source instanceof window.AnimationGroup)&&(this._player=b.newUnderlyingPlayerForGroup(this.source),b.bindPlayerForGroup(this))},get paused(){return this._player.paused},get playState(){return this._player.playState},get onfinish(){return this._onfinish},set onfinish(a){"function"==typeof a?(this._onfinish=a,this._player.onfinish=function(b){b.target=this,a.call(this,b)}.bind(this)):(this._player.onfinish=a,this.onfinish=this._player.onfinish)},get currentTime(){return this._player.currentTime},set currentTime(a){this._player.currentTime=a,this._register(),this._forEachChild(function(b,c){b.currentTime=a-c})},get startTime(){return this._player.startTime},set startTime(a){this._player.startTime=a,this._register(),this._forEachChild(function(b,c){b.startTime=a+c})},get playbackRate(){return this._player.playbackRate},get finished(){return this._player.finished},play:function(){this._player.play(),this._register(),b.awaitStartTime(this),this._forEachChild(function(a){var b=a.currentTime;a.play(),a.currentTime=b})},pause:function(){this._player.pause(),this._register(),this._forEachChild(function(a){a.pause()})},finish:function(){this._player.finish(),this._register()},cancel:function(){this._player.cancel(),this._register(),this._removePlayers()},reverse:function(){this._player.reverse(),b.awaitStartTime(this),this._register(),this._forEachChild(function(a,b){a.reverse(),a.startTime=this.startTime+b*this.playbackRate,a.currentTime=this.currentTime+b*this.playbackRate})},addEventListener:function(a,b){var c=b;"function"==typeof b&&(c=function(a){a.target=this,b.call(this,a)}.bind(this),b._wrapper=c),this._player.addEventListener(a,c)},removeEventListener:function(a,b){this._player.removeEventListener(a,b&&b._wrapper||b)},_removePlayers:function(){for(;this._childPlayers.length;)this._childPlayers.pop().cancel()},_forEachChild:function(a){var b=0;this._childPlayers.forEach(function(c){a.call(this,c,b),this.source instanceof window.AnimationSequence&&(b+=c.source.activeDuration)}.bind(this))}}}(c,e,f),function(a,b){function c(a){return a._timing.delay+a.activeDuration+a._timing.endDelay}function d(b){this._frames=a.normalizeKeyframes(b)}function e(){for(var a=!1;h.length;)h.shift()._updateChildren(),a=!0;return a}d.prototype={getFrames:function(){return this._frames}},b.Animation=function(b,c,e){return this.target=b,this._timingInput=e,this._timing=a.normalizeTimingInput(e),this.timing=a.makeTiming(e),this.effect="function"==typeof c?c:new d(c),this._effect=c,this.activeDuration=a.calculateActiveDuration(this._timing),this};var f=Element.prototype.animate;Element.prototype.animate=function(a,c){return b.timeline.play(new b.Animation(this,a,c))};var g=document.createElementNS("http://www.w3.org/1999/xhtml","div");b.newUnderlyingPlayerForAnimation=function(a){var b=a.target||g,c=a._effect;return"function"==typeof c&&(c=[]),f.apply(b,[c,a._timingInput])},b.bindPlayerForAnimation=function(a){a.source&&"function"==typeof a.source.effect&&b.bindPlayerForCustomEffect(a)};var h=[];b.awaitStartTime=function(a){null===a.startTime&&a._isGroup&&(0==h.length&&requestAnimationFrame(e),h.push(a))};var i=window.getComputedStyle;Object.defineProperty(window,"getComputedStyle",{configurable:!0,enumerable:!0,value:function(){var a=i.apply(this,arguments);return e()&&(a=i.apply(this,arguments)),a}}),b.Player.prototype._updateChildren=function(){if(!this.paused&&this.source&&this._isGroup)for(var a=this.source._timing.delay,b=0;b<this.source.children.length;b++){var d,e=this.source.children[b];b>=this._childPlayers.length?(d=window.document.timeline.play(e),this._childPlayers.push(d)):d=this._childPlayers[b],e.player=this.source.player,d.startTime!=this.startTime+a&&(null===this.startTime?(d.currentTime=this.source.player.currentTime-a,d._startTime=null):d.startTime=this.startTime+a,d._updateChildren()),-1==this.playbackRate&&this.currentTime<a&&-1!==d.currentTime&&(d.currentTime=-1),this.source instanceof window.AnimationSequence&&(a+=c(e))}},window.Animation=b.Animation,window.Element.prototype.getAnimationPlayers=function(){return document.timeline.getAnimationPlayers().filter(function(a){return null!==a.source&&a.source.target==this}.bind(this))},b.groupChildDuration=c}(c,e,f),function(a,b){function c(a){a._registered||(a._registered=!0,f.push(a),g||(g=!0,requestAnimationFrame(d)))}function d(){var a=f;f=[],a.sort(function(a,b){return a._sequenceNumber-b._sequenceNumber}),a.filter(function(a){return a(),(!a._player||a._player.finished||a._player.paused)&&(a._registered=!1),a._registered
}),f.push.apply(f,a),f.length?(g=!0,requestAnimationFrame(d)):g=!1}var e=(document.createElementNS("http://www.w3.org/1999/xhtml","div"),0);b.bindPlayerForCustomEffect=function(b){var d=b.source.target,f=b.source.effect,g=b.source.timing,h=void 0;g=a.normalizeTimingInput(g);var i=function(){var c=i._player?i._player.currentTime:null;null!==c&&(c=a.calculateTimeFraction(a.calculateActiveDuration(g),c,g),isNaN(c)&&(c=null)),c!==h&&f(c,d,b.source),h=c};i._player=b,i._registered=!1,i._sequenceNumber=e++,b._callback=i,c(i)};var f=[],g=!1;b.Player.prototype._register=function(){this._callback&&c(this._callback)}}(c,e,f),function(a,b){function c(b,c){this.children=b||[],this._timing=a.normalizeTimingInput(c,!0),this.timing=a.makeTiming(c,!0),"auto"===this._timing.duration&&(this._timing.duration=this.activeDuration)}window.AnimationSequence=function(){c.apply(this,arguments)},window.AnimationGroup=function(){c.apply(this,arguments)},window.AnimationSequence.prototype={get activeDuration(){var a=0;return this.children.forEach(function(c){a+=b.groupChildDuration(c)}),Math.max(a,0)}},window.AnimationGroup.prototype={get activeDuration(){var a=0;return this.children.forEach(function(c){a=Math.max(a,b.groupChildDuration(c))}),a}},b.newUnderlyingPlayerForGroup=function(a){var c,d=function(a){var b=c._wrapper;return b.source?null==a?void b._removePlayers():void(null!==b.startTime&&b._updateChildren()):void 0};return c=b.timeline.play(new b.Animation(null,d,a._timing))},b.bindPlayerForGroup=function(a){a._player._wrapper=a,a._isGroup=!0,b.awaitStartTime(a),a._updateChildren()}}(c,e,f)}({},function(){return this}());
//# sourceMappingURL=web-animations-next-lite.min.js.map;
Polymer.mixin2 = function(prototype, mixin) {

  // adds a single mixin to prototype

  if (mixin.mixinPublish) {
    prototype.publish = prototype.publish || {};
    Polymer.mixin(prototype.publish, mixin.mixinPublish);
  }

  if (mixin.mixinDelegates) {
    prototype.eventDelegates = prototype.eventDelegates || {};
    for (var e in mixin.mixinDelegates) {
      if (!prototype.eventDelegates[e]) {
        prototype.eventDelegates[e] = mixin.mixinDelegates[e];
      }
    }
  }

  if (mixin.mixinObserve) {
    prototype.observe = prototype.observe || {};
    for (var o in mixin.mixinObserve) {
      if (!prototype.observe[o] && !prototype[o + 'Changed']) {
        prototype.observe[o] = mixin.mixinObserve[o];
      }
    }
  }

  Polymer.mixin(prototype, mixin);

  delete prototype.mixinPublish;
  delete prototype.mixinDelegates;
  delete prototype.mixinObserve;

  return prototype;
};;
/**
 * @group Polymer Mixins
 *
 * `Polymer.CoreFocusable` is a mixin for elements that the user can interact with.
 * Elements using this mixin will receive attributes reflecting the focus, pressed
 * and disabled states.
 *
 * @element Polymer.CoreFocusable
 * @status unstable
 */

Polymer.CoreFocusable = {

  mixinPublish: {

    /**
     * If true, the element is currently active either because the
     * user is touching it, or the button is a toggle
     * and is currently in the active state.
     *
     * @attribute active
     * @type boolean
     * @default false
     */
    active: {value: false, reflect: true},

    /**
     * If true, the element currently has focus due to keyboard
     * navigation.
     *
     * @attribute focused
     * @type boolean
     * @default false
     */
    focused: {value: false, reflect: true},

    /**
     * If true, the user is currently holding down the button.
     *
     * @attribute pressed
     * @type boolean
     * @default false
     */
    pressed: {value: false, reflect: true},

    /**
     * If true, the user cannot interact with this element.
     *
     * @attribute disabled
     * @type boolean
     * @default false
     */
    disabled: {value: false, reflect: true},

    /**
     * If true, the button toggles the active state with each tap.
     * Otherwise, the button becomes active when the user is holding
     * it down.
     *
     * @attribute toggle
     * @type boolean
     * @default false
     */
    toggle: false

  },

  mixinDelegates: {
    contextMenu: '_contextMenuAction',
    down: '_downAction',
    up: '_upAction',
    focus: '_focusAction',
    blur: '_blurAction'
  },

  mixinObserve: {
    disabled: '_disabledChanged'
  },

  _disabledChanged: function() {
    if (this.disabled) {
      this.style.pointerEvents = 'none';
      this.removeAttribute('tabindex');
      this.setAttribute('aria-disabled', '');
    } else {
      this.style.pointerEvents = '';
      this.setAttribute('tabindex', 0);
      this.removeAttribute('aria-disabled');
    }
  },

  _downAction: function() {
    this.pressed = true;

    if (this.toggle) {
      this.active = !this.active;
    } else {
      this.active = true;
    }
  },

  // Pulling up the context menu for an item should focus it; but we need to
  // be careful about how we deal with down/up events surrounding context
  // menus. The up event typically does not fire until the context menu
  // closes: so we focus immediately.
  //
  // This fires _after_ downAction.
  _contextMenuAction: function(e) {
    // Note that upAction may fire _again_ on the actual up event.
    this._upAction(e);
    this._focusAction();
  },

  _upAction: function() {
    this.pressed = false;

    if (!this.toggle) {
      this.active = false;
    }
  },

  _focusAction: function() {
    if (!this.pressed) {
      // Only render the "focused" state if the element gains focus due to
      // keyboard navigation.
      this.focused = true;
    }
  },

  _blurAction: function() {
    this.focused = false;
  }

}
