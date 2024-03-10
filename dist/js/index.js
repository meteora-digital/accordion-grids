"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _tween = _interopRequireDefault(require("@meteora-digital/tween"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }

/* ---------------------------------------------------------
Accoprdion Grid Controller
--------------------------------------------------------- */
var AccoprdionGridController = /*#__PURE__*/function () {
  function AccoprdionGridController(element) {
    var _this = this;

    _classCallCheck(this, AccoprdionGridController);

    // Store the events here
    this.events = {}; // The dropdown element

    this.element = element; // The element's parent

    this.parent = this.element.parentNode; // The element's siblings

    this.siblings = _toConsumableArray(this.parent.children); // The element's index

    this.index = this.siblings.indexOf(this.element); // The content that will show / hide

    this.content = null; // A cache to stop things repeating unnecessarily

    this.cache = {
      width: this.parent.clientWidth
    }; // We will use this to aniomate the height of the content

    this.height = {}; // An animation controller

    this.height.controller = new _tween["default"](); // A resize observer so we can check if things have rearranged on the page

    this.resizeObserver = new ResizeObserver(function () {
      // If the width has actually changed
      if (_this.cache.width != _this.parent.clientWidth) {
        // Update the cache
        _this.cache.width = _this.parent.clientWidth; // Update the layout

        _this.layout();
      }
    }); // Add the parent to the resize observer

    this.resizeObserver.observe(this.parent); // Once the animation has ended

    this.height.controller.on('end', function () {
      // If the dropdown is active
      if (_this.active) {
        // Make sure it's height is set to auto
        _this.content.style.height = 'auto';
      } else {
        // Otherwise remove the content from the page
        if (_this.element.parentNode == _this.parent) {
          // Remove the content from the page
          _this.content.parentNode.removeChild(_this.content);
        }
      }
    });
  }

  _createClass(AccoprdionGridController, [{
    key: "layout",
    value: function layout() {
      // If the Dropdown is open
      if (!this.active) return; // If we have content

      if (!this.content) return; // If the content is on the page

      if (this.content.parentNode == this.parent) {
        // Remove the content from the page
        this.content.parentNode.removeChild(this.content);
      } // Add the content to the page after the last element in the row


      try {
        this.parent.insertBefore(this.content, this.getLastInRow().nextSibling);
      } catch (err) {
        // If there is no next sibling, then add it to the end of the parent container
        this.parent.appendChild(this.content);
      } // Call the callback function


      this.callback('layout');
    }
  }, {
    key: "open",
    value: function open() {
      var _this2 = this;

      // If the Dropdown is already open, then return
      if (this.active) return; // If we dont have content, then return

      if (!this.content) return; // Set the active state to true

      this.active = true; // Add the content to the page

      this.layout(); // Set the content height to 'auto';

      this.content.style.height = 'auto'; // Update the height object

      this.height.auto = this.content.clientHeight; // Set the content height to 0;

      this.content.style.height = '0px'; // Animate the content height to its 'auto' height

      this.height.controller.tween({
        from: 0,
        to: this.height.auto
      }, function (value) {
        _this2.content.style.height = value + 'px';
      }); // Call the callback function

      this.callback('open');
    }
  }, {
    key: "close",
    value: function close() {
      var _this3 = this;

      // If the Dropdown is already closed, then return
      if (!this.active) return; // If we dont have content, then return

      if (!this.content) return; // Set the active state to false

      this.active = false; // Animate the content height to 0

      this.height.controller.tween({
        from: this.content.clientHeight,
        to: 0
      }, function (value) {
        _this3.content.style.height = value + 'px';
      }); // Call the callback function

      this.callback('close');
    }
  }, {
    key: "toggle",
    value: function toggle() {
      // If the dropdown is active
      if (this.active) {
        // Close the dropdown
        this.close();
      } else {
        // Open the dropdown
        this.open();
      } // Call the callback function


      this.callback('toggle');
    } // Method to set what content we want to show / hide

  }, {
    key: "setContent",
    value: function setContent(element) {
      // Make sure the element is a DOM element
      if (element instanceof HTMLElement) {
        // Set the content to the element
        this.content = element; // If this element is on the page and the dropdown isn't active

        if (this.element.parentNode == this.parent) {
          // Remove the content from the page
          this.content.parentNode.removeChild(this.content);
        } // Call the callback function


        this.callback('setContent');
      } else {
        // Call the error function
        this.error('setContent: The element is not a DOM element');
      }
    }
  }, {
    key: "getCurrentRow",
    value: function getCurrentRow() {
      // The y offset of the element
      var elementY = this.element.getBoundingClientRect().top; // The elements in the current row

      var currentRow = []; // Loop the siblings, starting from the first one

      for (var i = 0; i < this.siblings.length; i++) {
        // Calculate the y offset of the sibling
        var siblingY = this.siblings[i].getBoundingClientRect().top; // If the y offset is equal to the element's y offset, then this is in the current row

        if (siblingY == elementY) currentRow.push(this.siblings[i]); // If the y offset is greater than the element's y offset, then we've passed the current row
        else if (siblingY > elementY) break;
      }

      return currentRow;
    }
  }, {
    key: "getLastInRow",
    value: function getLastInRow() {
      // Get the current row
      var currentRow = this.getCurrentRow(); // Return the last element in the current row

      return currentRow[currentRow.length - 1];
    }
  }, {
    key: "error",
    value: function error(message) {
      // Call the callback function
      this.callback('error', message);
    }
  }, {
    key: "callback",
    value: function callback(type) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      // run the callback functions
      if (this.events[type]) this.events[type].forEach(function (event) {
        return event(data);
      });
    }
  }, {
    key: "on",
    value: function on(event, func) {
      // If we loaded an event and it's not the on event and we also loaded a function
      if (event && event != 'on' && event != 'callback' && this[event] && func && typeof func == 'function') {
        if (this.events[event] == undefined) this.events[event] = []; // Push a new event to the event array

        this.events[event].push(func);
      }
    }
  }]);

  return AccoprdionGridController;
}();

exports["default"] = AccoprdionGridController;