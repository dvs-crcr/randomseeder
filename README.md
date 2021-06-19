# randomseeder
---
generate array with random object and specified options 

e.g.
```js
const options = {
  id: [
    [ 'RANGE', [5, 1005] ],
    [ 'UNIQUE' ],
    [ 'RANDOM' ],
  ],
  name: [
    [ 'ARRAY', [ 'Name 1', 'Name 2', 'Name 3' ] ],
  ],
  thickness: [
    [ 'RANGE', [0.5, 75] ],
    [ 'FLOAT' ],
    [ 'DIGITS', 1 ],
    [ 'RANDOM' ],
  ],
  weight: [
    [ 'RANGE', [0, 8] ],
    [ 'FLOAT' ],
    [ 'DIGITS', 3 ],
    [ 'RANDOM' ],
  ],
  price: [
    [ 'RANGE', [1, 1000000] ],
    [ 'RANDOM' ],
  ],
  fixed: [
    [ 'FIXED', true ],
  ],
};

const seeder = new RandomSeeder(options);
const results = seeder.create(1000);
```
