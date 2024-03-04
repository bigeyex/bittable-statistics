import Statistics from 'statistics.js';

var testData = [
	{ gender: 'male', voting: 'republican' },
	{ gender: 'male', voting: 'democrat' },
	{ gender: 'male', voting: 'independent' },
    { gender: 'male', voting: 'republican' },
	{ gender: 'male', voting: 'independent' },
	{ gender: 'female', voting: 'republican' },
	{ gender: 'female', voting: 'democrat' },
    { gender: 'female', voting: 'democrat' },
    { gender: 'female', voting: 'democrat' },
	{ gender: 'female', voting: 'independent' },
];

var testVars = {
	gender: {
		scale: 'nominal',
	},
	voting: {
		scale: 'nominal',
	}
};

var stats = new Statistics(testData, testVars);
var chiSquared = stats.chiSquaredTest('gender', 'voting');

console.log(chiSquared);