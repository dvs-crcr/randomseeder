const SEEDER_PARAMS = {
  VALUE: {
    ARRAY: 'ARRAY', // Use value from array
    RANGE: 'RANGE', // Use value in range of 2 numbers
    FIXED: 'FIXED', // Fixed value, e.g. true | 1 | "some_string"
  },
  CONVERT_TO: {
    STRING: 'STRING',
    FLOAT: 'FLOAT',
    INT: 'INT',
  },
  OPTIONS: {
    RANDOM: 'RANDOM', // Random from array (use it with ARRAY or RANGE)
    DIGITS: 'DIGITS', // Number of digits after comma in float
    UNIQUE: 'UNIQUE', // Unique field
    TRANSFORMERS: 'TRANSFORMERS', // Array of funcs that modify value after generation
  },
};

class RandomSeeder {
  constructor(options= {}) {
    this.options = Object.fromEntries(
      Object.keys(options).map((field) => [field, new Map(options[field])]),
    );
    this.unique_fields = this._getUniqueFields();
  }

  create(count = 1) {
    const results = new Array(count);
    results.fill(undefined);
    Object.seal(results);

    for (let unique_set of this.unique_fields.values()) {
      unique_set.clear();
    }

    for (let i = 0; i < count; i++) {
      results[i] = this._generateSeed(i, count);
    }

    return results;
  }

  _generateSeed(iteration = 0, count) {
    return Object.fromEntries(Object.keys(this.options).map((field) => {
        let seed_value = this._generateSeedValue(
          field, this.options[field], iteration, count,
        );
        if (this.options[field].has(SEEDER_PARAMS.OPTIONS.TRANSFORMERS)) {
          seed_value = this._transformValue(
            seed_value, this.options[field].get(SEEDER_PARAMS.OPTIONS.TRANSFORMERS),
          );
        }
        return [field, seed_value];
      },
    ));
  }

  _generateSeedValue(field, options, iteration = 0, count) {
    let value = undefined;

    switch (true) {
    case options.has(SEEDER_PARAMS.VALUE.FIXED):
      value = options.get(SEEDER_PARAMS.VALUE.FIXED);
      break;
    case options.has(SEEDER_PARAMS.VALUE.ARRAY):
      {
        const values = options.get(SEEDER_PARAMS.VALUE.ARRAY);
        if (!Array.isArray(values)) break;
        let index = values.length > iteration ? iteration : iteration % values.length;
        if (options.has(SEEDER_PARAMS.OPTIONS.RANDOM)) {
          index = Math.floor(Math.random() * values.length);
        }
        value = values[index];
      }
      break;
    case options.has(SEEDER_PARAMS.VALUE.RANGE):
      {
        const values = options.get(SEEDER_PARAMS.VALUE.RANGE);
        if (!Array.isArray(values)) break;
        if (values.length !== 2) break;

        let min = values[0];
        let max = values[1];

        if (typeof min !== 'number' && typeof max !== 'number') break;
        if (min > max) break;

        if (options.has(SEEDER_PARAMS.OPTIONS.DIGITS)) {
          const digits = options.get(SEEDER_PARAMS.OPTIONS.DIGITS);
          if (digits > 0) {
            min *= Math.pow(10, digits);
            max *= Math.pow(10, digits);
          }
        }

        if (count > (max - min)) break;

        if (options.has(SEEDER_PARAMS.OPTIONS.RANDOM)) {
          value = Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min) + 1)) + Math.ceil(min);
        } else {
          value = min + iteration;
        }

        if (options.has(SEEDER_PARAMS.OPTIONS.DIGITS)) {
          const digits = options.get(SEEDER_PARAMS.OPTIONS.DIGITS);
          if (digits > 0) {
            value /= Math.pow(10, digits);
            value = +value.toFixed(digits);
          }
        }
      }
      break;
    }

    switch (true) {
    case options.has(SEEDER_PARAMS.CONVERT_TO.STRING):
      value = String(value);
      break;
    case options.has(SEEDER_PARAMS.CONVERT_TO.FLOAT):
      value = parseFloat(value);
      break;
    case options.has(SEEDER_PARAMS.CONVERT_TO.INT):
      value = parseInt(value);
      break;
    }

    if (this.unique_fields.has(field)) {
      const unique_set = this.unique_fields.get(field)
      if (unique_set.has(value)) {
        return this._generateSeedValue(field, options, iteration, count);
      } else {
        this.unique_fields.set(field, unique_set.add(value));
      }
    }
    return value;
  }

  _getUniqueFields() {
    const unique_fields = new Map();
    Object.keys(this.options).forEach((field_name) => {
      if (this.options[field_name].has(SEEDER_PARAMS.OPTIONS.UNIQUE)) {
        unique_fields.set(field_name, new Set());
      }
    });
    return unique_fields;
  }

  _transformValue(value, transformers = []) {
    if (!Array.isArray(transformers)) return value;
    return transformers.reduce((acc, fn) => {
      if (typeof fn !== 'function') return acc;
      return fn.call(this, acc);
    }, value);
  }
}
