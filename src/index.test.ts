import clone = require('../dist');

describe('When cloning', () => {

  describe('a string', () => {
    it('should return a matching string', () => {
      expect(clone('Hello world')).toEqual('Hello world');
    });
  });

  describe('a number', () => {
    it('should return a matching number', () => {
      expect(clone(3.14)).toEqual(3.14);
      expect(clone(-1)).toEqual(-1);
    });
  });

  describe('a boolean', () => {
    it('should return a matching boolean', () => {
      expect(clone(true)).toEqual(true);
      expect(clone(false)).toEqual(false);
    });
  });

  describe('NaN', () => {
    it('should return NaN', () => {
      expect(clone(NaN)).toBeNaN()
    });
  });

  describe('Infinity', () => {
    it('should return Infinity', () => {
      expect(clone(Number.POSITIVE_INFINITY)).toEqual(Number.POSITIVE_INFINITY);
    });
  });

  describe('Negative Infinity', () => {
    it('should return Negative Infinity', () => {
      expect(clone(Number.NEGATIVE_INFINITY)).toEqual(Number.NEGATIVE_INFINITY);
    });
  });

  describe('null', () => {
    it('should return null', () => {
      expect(clone(null)).toBeNull()
    });
  });

  describe('undefined', () => {
    it('should return undefined', () => {
      expect(clone(undefined)).toBeUndefined()
    });
  });

  describe('a RegExp', () => {
    let expected: RegExp;
    let actual: any;
    let hisName = 'Mr Plow, thats his name, that name again is Mr Plow'

    beforeEach(() => {
      expected = new RegExp("plow", "gi");
      actual = clone(expected);
    });

    it('should return a different RexExp Object', () => {
      expect(actual).not.toBe(expected);
    });

    it('should have the same pattern', () => {
      expect(actual.source).toEqual(expected.source);
    });

    it('should have the same flags', () => {
      expect(actual.global).toEqual(expected.global);
      expect(actual.ignoreCase).toEqual(expected.ignoreCase);
      expect(actual.multiline).toEqual(expected.multiline);
    });

    it('should match the same string', () => {
      expect(hisName.search(actual)).toEqual(hisName.search(expected));

      const expectedMatch = hisName.match(expected);
      const actualMatch = hisName.match(actual);

      expectedMatch!.forEach(function (match, key) {
        expect(actualMatch![key]).toEqual(match);
      });

    });
  });

  describe('a date', () => {
    let expected: Date;
    let actual: any;

    beforeEach(() => {
      expected = new Date('1997-08-29T00:00:00.000+1000');
      actual = clone(expected);
    });

    it('should return the same date', () => {
      expect(actual.getFullYear()).toEqual(expected.getFullYear());
      expect(actual.getMonth()).toEqual(expected.getMonth());
      expect(actual.getDate()).toEqual(expected.getDate());
    });

    it('should return the same time', () => {
      expect(actual.getTime()).toEqual(expected.getTime());
    });

    it('should return the same timezone', () => {
      expect(actual.getTimezoneOffset()).toEqual(expected.getTimezoneOffset());
    });
  });

  describe('an array', () => {
    it('should return a new array', () => {
      const a = [1, 2, 3];
      const b = clone(a);
      expect(b).not.toBe(a);
    });

    describe('of numbers', () => {
      it('should return array of matching numbers', () => {
        const a = [1, 2, 3];
        const b = clone(a);
        expect(b).toEqual(a);
      });

      describe('containing NaN and Infinity', () => {
        it('should return array of NaN and Infinity', () => {
          const a = [NaN, Infinity];
          const b = clone(a);
          expect(b[0]).toBeNaN();
          expect(b[1]).toEqual(Infinity);
        });
      });
    });

    describe('of strings', () => {
      it('should return array of matching strings', () => {
        const a = ['a', 'b', 'c'];
        const b = clone(a);
        expect(b).toEqual(a);
      });
    });

    describe('of booleans', () => {
      it('should return array of matching booleans', () => {
        const a = [true, false];
        const b = clone(a);
        expect(b).toEqual(a);
      });
    });

    describe('of Dates', () => {
      let a: Date[];
      let b: any;

      beforeEach(() => {
        a = [new Date()];
        b = clone(a);
      });

      it('should return array containing new Date instances', () => {
        expect(b[0]).not.toBe(a[0]);
      });

      it('should return array of matching Dates', () => {
        expect(b).toEqual(a);
      });
    });

    describe('of Regex', () => {
      let expected: RegExp[];
      let actual: any;
      const hisName = 'Mr Plow, thats his name, that name again is Mr Plow'

      beforeEach(() => {
        expected = [new RegExp("plow", "gi"), /mr/gi, /name/];
        actual = clone(expected);
      });

      it('should return array containing new RexExp instances', () => {
        for (let i = 0; i < expected.length; i++) {
          expect(actual[i]).not.toBe(expected[i]);
        }
      });

      it('should return array of matching RegExp', () => {
        for (let i = 0; i < expected.length; i++) {

          expect(actual[i].source).toEqual(expected[i].source);

          expect(actual[i].global).toEqual(expected[i].global);
          expect(actual[i].ignoreCase).toEqual(expected[i].ignoreCase);
          expect(actual[i].multiline).toEqual(expected[i].multiline);

          expect(hisName.search(actual[i])).toEqual(hisName.search(expected[i]));

          const expectedMatch = hisName.match(expected[i]);
          const actualMatch = hisName.match(actual[i]);

          expectedMatch!.forEach(function (match, key) {
            expect(actualMatch![key]).toEqual(match);
          });
        }
      });


    })
  });

  describe('an object', () => {
    let a: any;
    let b: any;

    beforeEach(() => {
      a = {
        text: 'Mr Plow, thats his name, that name again is Mr Plow',
        num: 3.14,
        day: new Date('1997-08-29T00:00:00.000Z'),
        yes: true,
        no: false,
        badNum: NaN,
        lots: Infinity,
        nothing: null,

        subObject: {
          text: 'Mr Plow, thats his name, that name again is Mr Plow',
          num: 3.14,
          day: new Date('1997-08-29T00:00:00.000Z'),
          yes: true,
          no: false,
          badNum: NaN,
          lots: Infinity
        },

        items: [
          'Mr Plow, thats his name, that name again is Mr Plow',
          3.14,
          new Date('1997-08-29T00:00:00.000Z'),
          true,
          false,
          NaN,
          Infinity,
          {
            text: 'Mr Plow, thats his name, that name again is Mr Plow',
            num: 3.14,
            day: new Date('1997-08-29T00:00:00.000Z'),
            yes: true,
            no: false,
            badNum: NaN,
            lots: Infinity
          },
          [
            'Yo dawg, I heard you like arrays',
            [
              'So we put an array',
              { text: 'In your array' }
            ]
          ]
        ]
      };

      b = clone(a);
    });

    it('should return a new object', () => {
      // Objects should be different instances
      expect(b).not.toBe(a);
      expect(b.subObject).not.toBe(a.subObject);
      expect(b.items).not.toBe(a.items);
      expect(b.items[7]).not.toBe(a.items[7]);
      expect(b.items[8][1][1]).not.toBe(a.items[8][1][1]);
    });

    it('should have properties and sub-properties that match', () => {
      expect(b).toEqual(a);
    });
  });
});
