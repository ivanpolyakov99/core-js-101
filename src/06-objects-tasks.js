/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return { width, height, getArea: () => width * height };
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

class Builder {
  constructor(options) {
    this.selector = {
      element: options.element || '',
      id: options.id || '',
      class: options.class || [],
      attr: options.attr || [],
      pseudoClass: options.pseudoClass || [],
      pseudoElement: options.pseudoElement || '',
    };
  }

  static createSelector(selector) {
    const arr = [];
    arr.push(selector.element);
    if (selector.id !== '') arr.push(`#${selector.id}`);
    if (typeof selector.class === 'object' && selector.class.length) arr.push(`.${selector.class.join('.')}`);
    if (typeof selector.attr === 'object') {
      selector.attr.forEach((element) => {
        arr.push(`[${element}]`);
      });
    }
    if (typeof selector.pseudoClass === 'object' && selector.pseudoClass.length) arr.push(`:${selector.pseudoClass.join(':')}`);
    if (selector.pseudoElement !== '') arr.push(`::${selector.pseudoElement}`);
    return arr.join('');
  }

  stringify() {
    const result = Builder.createSelector(this.selector);
    this.resetData();
    return result;
  }

  resetData() {
    this.selector.element = '';
    this.selector.id = '';
    this.selector.class = [];
    this.selector.attr = [];
    this.selector.pseudoClass = [];
    this.selector.pseudoElement = '';
  }

  element(value) {
    if (this.selector.id !== '' || this.selector.class.length > 0 || this.selector.attr.length > 0 || this.selector.pseudoClass.length > 0 || this.selector.pseudoElement !== '') {
      this.resetData();
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (this.selector.element !== '') {
      this.resetData();
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.selector.element = value;
    return this;
  }

  id(value) {
    if (this.selector.class.length > 0 || this.selector.attr.length > 0 || this.selector.pseudoClass.length > 0 || this.selector.pseudoElement !== '') {
      this.resetData();
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    if (this.selector.id !== '') {
      this.resetData();
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.selector.id = value;
    return this;
  }

  class(value) {
    if (this.selector.attr.length > 0 || this.selector.pseudoClass.length > 0 || this.selector.pseudoElement !== '') {
      this.resetData();
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selector.class.push(value);
    return this;
  }

  attr(value) {
    if (this.selector.pseudoClass.length > 0 || this.selector.pseudoElement !== '') {
      this.resetData();
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selector.attr.push(value);
    return this;
  }

  pseudoClass(value) {
    if (this.selector.pseudoElement !== '') {
      this.resetData();
      throw new Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    }
    this.selector.pseudoClass.push(value);
    return this;
  }

  pseudoElement(value) {
    if (this.selector.pseudoElement !== '') {
      this.resetData();
      throw new Error('Element, id and pseudo-element should not occur more then one time inside the selector');
    }
    this.selector.pseudoElement = value;
    return this;
  }
}

const cssSelectorBuilder = {
  element(value) {
    return new Builder({ element: value });
  },

  id(value) {
    return new Builder({ id: value });
  },

  class(value) {
    return new Builder({ class: [value] });
  },

  attr(value) {
    return new Builder({ attr: [value] });
  },

  pseudoClass(value) {
    return new Builder({ pseudoClass: [value] });
  },

  pseudoElement(value) {
    return new Builder({ pseudoElement: value });
  },

  combine(selector1, combinator, selector2) {
    const sel1 = selector1.stringify();
    const sel2 = selector2.stringify();
    const result = [sel1, combinator, sel2].join(' ');
    return {
      stringify() {
        return result;
      },
    };
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
