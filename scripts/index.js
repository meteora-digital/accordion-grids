/* ---------------------------------------------------------
Import modules
--------------------------------------------------------- */

import TweenController from '@meteora-digital/tween';

/* ---------------------------------------------------------
Accoprdion Grid Controller
--------------------------------------------------------- */

export default class AccoprdionGridController {
  constructor(element, options = {}) {
    // Store the events here
    this.events = {};
    // The dropdown element
    this.element = element;
    // The element's parent
    this.parent = this.element.parentNode;
    // The element's siblings
    this.siblings = [...this.parent.children];
    // The element's index
    this.index = this.siblings.indexOf(this.element);
    // The content that will show / hide
    this.content = null;
    // A cache to stop things repeating unnecessarily
    this.cache = {
      width: this.parent.clientWidth,
    };

    this.settings = Object.assign({
      animate: true,
      duration: 300,
    }, options);

    if (this.settings.animate) {
      Promise.all([
        import('@meteora-digital/tween'),
      ]).then(([moduleTween]) => {
        const TweenController = moduleTween.default;

        // We will use this to aniomate the height of the content
        this.height = {};

        // An animation controller
        this.height.controller = new TweenController();

        // Once the animation has ended
        this.height.controller.on('end', () => {
          // If the dropdown is active
          if (this.active) {
            // Make sure it's height is set to auto
            this.content.style.height = 'auto';
          } else {
            // Otherwise remove the content from the page
            if (this.element.parentNode == this.parent) {
              // Remove the content from the page
              this.content.parentNode.removeChild(this.content);
            }
          }
        });
      }).catch((err) => {
        console.error(err);
      });
    }

    // A resize observer so we can check if things have rearranged on the page
    this.resizeObserver = new ResizeObserver(() => {
      // If the width has actually changed
      if (this.cache.width != this.parent.clientWidth) {
        // Update the cache
        this.cache.width = this.parent.clientWidth;
        // Update the layout
        this.layout();
      }
    });

    // Add the parent to the resize observer
    this.resizeObserver.observe(this.parent);
  }

  layout() {
    // If the Dropdown is open
    if (!this.active) return;
    // If we have content
    if (!this.content) return;

    // If the content is on the page
    if (this.content.parentNode == this.parent) {
      // Remove the content from the page
      this.content.parentNode.removeChild(this.content);
    }

    // Add the content to the page after the last element in the row
    try {
      this.parent.insertBefore(this.content, this.getLastInRow().nextSibling);
    } catch (err) {
      // If there is no next sibling, then add it to the end of the parent container
      this.parent.appendChild(this.content);
    }

    // Call the callback function
    this.callback('layout');
  }

  open() {
    // If the Dropdown is already open, then return
    if (this.active) return;
    // If we dont have content, then return
    if (!this.content) return;

    // Set the active state to true
    this.active = true;

    // Add the content to the page
    this.layout();

    if (this.height) {
      // Set the content height to 'auto';
      this.content.style.height = 'auto';
      // Update the height object
      this.height.auto = this.content.clientHeight;
      // Set the content height to 0;
      this.content.style.height = '0px';

      // Animate the content height to its 'auto' height
      this.height.controller.tween({ from: 0, to: this.height.auto }, (value) => {
        this.content.style.height = value + 'px';
      }, this.settings.duration);
    }

    // Call the callback function
    window.requestAnimationFrame(() => {
      this.callback('open');
    });
  }

  close() {
    // If the Dropdown is already closed, then return
    if (!this.active) return;
    // If we dont have content, then return
    if (!this.content) return;

    // Set the active state to false
    this.active = false;

    if (this.height) {
      // Animate the content height to 0
      this.height.controller.tween({ from: this.content.clientHeight, to: 0 }, (value) => {
        this.content.style.height = value + 'px';
      }, this.settings.duration);
    }

    // Call the callback function
    window.requestAnimationFrame(() => {
      this.callback('close');
    });
  }

  toggle() {
    // If the dropdown is active
    if (this.active) {
      // Close the dropdown
      this.close();
    } else {
      // Open the dropdown
      this.open();
    }

    // Call the callback function
    window.requestAnimationFrame(() => {
      this.callback('toggle');
    });
  }

  // Method to set what content we want to show / hide
  setContent(element) {
    // Make sure the element is a DOM element
    if (element instanceof HTMLElement) {
      // Set the content to the element
      this.content = element;

      // If this element is on the page and the dropdown isn't active
      if (this.element.parentNode == this.parent) {
        // Remove the content from the page
        this.content.parentNode.removeChild(this.content);
      }

      // Call the callback function
      this.callback('setContent');
    } else {
      // Call the error function
      this.error('setContent: The element is not a DOM element');
    }
  }

  getCurrentRow() {
    // The y offset of the element
    const elementY = this.element.getBoundingClientRect().top;
    // The elements in the current row
    let currentRow = [];

    // Loop the siblings, starting from the first one
    for (let i = 0; i < this.siblings.length; i++) {
      // Calculate the y offset of the sibling
      const siblingY = this.siblings[i].getBoundingClientRect().top;
      // If the y offset is equal to the element's y offset, then this is in the current row
      if (siblingY == elementY) currentRow.push(this.siblings[i]);
      // If the y offset is greater than the element's y offset, then we've passed the current row
      else if (siblingY > elementY) break;
    }

    return currentRow;
  }

  getLastInRow() {
    // Get the current row
    const currentRow = this.getCurrentRow();
    // Return the last element in the current row
    return currentRow[currentRow.length - 1];
  }

  error(message) {
    // Call the callback function
    this.callback('error', message);
  }

  callback(type, data = false) {
    // run the callback functions
    if (this.events[type]) this.events[type].forEach((event) => event(data));
  }

  on(event, func) {
    // If we loaded an event and it's not the on event and we also loaded a function
    if (event && event != 'on' && event != 'callback' && this[event] && func && typeof func == 'function') {
      if (this.events[event] == undefined) this.events[event] = [];
      // Push a new event to the event array
      this.events[event].push(func);
    }
  }
}
