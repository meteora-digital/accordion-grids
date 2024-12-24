# Accordion Grid

Use this class to make Accordion Grid Layouts a breeze

## Installation

```bash
npm i @meteora-digital/accordion-grids
yarn add @meteora-digital/accordion-grids
```

## Usage

```es6
import AccordionGridController from '@meteora-digital/accordion-grids';

// Setting animate to false will prevent the TweenController dependency from being loaded and allow you to animate the content yourself
const Dropdown = new AccordionGridController(element, {
    // Defaults
    animate: true,
    duration: 300,
});

// Load the content into the dropdown controller
Dropdown.setContent(content);

// Event listeners
Dropdown.on('open', () => element.classList.add('active'));
Dropdown.on('close', () => element.classList.remove('active'));

element.addEventListener('click', () => Dropdown.toggle());
```

## License
[MIT](https://choosealicense.com/licenses/mit/)
