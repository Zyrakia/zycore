import { Strings } from 'Strings';

export = () => {
	describe('randomChar', () => {
		it('should return a random character', () => {
			const char = Strings.randomChar();
			expect(
				[
					'a',
					'b',
					'c',
					'd',
					'e',
					'f',
					'g',
					'h',
					'i',
					'j',
					'k',
					'l',
					'm',
					'n',
					'o',
					'p',
					'q',
					'r',
					's',
					't',
					'u',
					'v',
					'w',
					'x',
					'y',
					'z',
				].includes(char),
			).to.equal(true);
		});
	});

	describe('random', () => {
		it('should return a random string', () => {
			const random = Strings.random(25);
			expect(random.size()).to.equal(25);
		});
	});

	describe('trim', () => {
		it('should return a trimmed string', () => {
			const trimmed = Strings.trim('  foo  ');
			expect(trimmed).to.equal('foo');
		});
	});

	describe('trimStart', () => {
		it('should return a trimmed string', () => {
			const trimmed = Strings.trimStart('  foo  ');
			expect(trimmed).to.equal('foo  ');
		});
	});

	describe('trimEnd', () => {
		it('should return a trimmed string', () => {
			const trimmed = Strings.trimEnd('  foo  ');
			expect(trimmed).to.equal('  foo');
		});
	});

	describe('startsWith', () => {
		it('should return true if the string starts with the search string', () => {
			const startsWith = Strings.startsWith('foo', 'fo');
			expect(startsWith).to.equal(true);
		});
	});

	describe('endsWith', () => {
		it('should return true if the string ends with the search string', () => {
			const endsWith = Strings.endsWith('foo', 'oo');
			expect(endsWith).to.equal(true);
		});
	});

	describe('slice', () => {
		it('should return a slice of the string', () => {
			const slice = Strings.slice('foo', 2);
			expect(slice).to.equal('oo');
		});
	});

	describe('includes', () => {
		it('should return true if the string contains the search string', () => {
			const includes = Strings.includes('foo', 'o');
			expect(includes).to.equal(true);

			const includes2 = Strings.includes('foo', 'o', 1);
			expect(includes2).to.equal(true);

			const includes3 = Strings.includes('foooooo', 'oooooo');
			expect(includes3).to.equal(true);

			const includes4 = Strings.includes('Parent is locked.', 'locked');
			expect(includes4).to.equal(true);

			const includes5 = Strings.includes('Attempt to set Part as its own parent', 'locked');
			expect(includes5).to.equal(false);

			const includes6 = Strings.includes(
				'The Parent property of Part is locked, current parent: NULL, new parent Part',
				'locked',
			);
			expect(includes6).to.equal(true);
		});
	});

	describe('lastCamel', () => {
		it('should return the last camel case word', () => {
			const lastCamel = Strings.lastCamel('fooBarBaz');
			expect(lastCamel).to.equal('Baz');
		});
	});
};
