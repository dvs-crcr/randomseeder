# randomseeder
---
generate array with random object and specified options 

e.g.
```js
const variants = {
      id: [
        [ SEEDER_PARAMS.VALUE.RANGE, [5, 108] ],
        [ SEEDER_PARAMS.OPTIONS.UNIQUE ],
        [ SEEDER_PARAMS.OPTIONS.RANDOM ],
      ],
      name: [
        [ SEEDER_PARAMS.VALUE.ARRAY, [ 'Name 1', 'Name 2', 'Name 3' ] ],
      ],
      thickness: [
        [ SEEDER_PARAMS.VALUE.RANGE, [0.5, 75] ],
        [ SEEDER_PARAMS.CONVERT_TO.FLOAT ],
        [ SEEDER_PARAMS.OPTIONS.DIGITS, 1 ],
        [ SEEDER_PARAMS.OPTIONS.RANDOM ],
      ],
      weight: [
        [ SEEDER_PARAMS.VALUE.RANGE, [0, 8] ],
        [ SEEDER_PARAMS.CONVERT_TO.FLOAT ],
        [ SEEDER_PARAMS.OPTIONS.DIGITS, 3 ],
        [ SEEDER_PARAMS.OPTIONS.RANDOM ],
      ],
      price: [
        [ SEEDER_PARAMS.VALUE.RANGE, [1, 1000000] ],
        [ SEEDER_PARAMS.OPTIONS.RANDOM ],
      ],
      fixed: [
        [ SEEDER_PARAMS.VALUE.FIXED, true ],
      ],
    };

    const seeder = new RandomSeeder(variants);
    const results = seeder.create(100);
```
