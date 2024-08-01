Library's in the support folder should have the following property's
1. All functions in a class must be static Eg: 
```javascript
export class Example {
	static exampleFunction(name) {
		console.log(`Hi ${name}`);
	}
}
```
2. A support Library is allow to import extra code, but only if it is from the support folder. An example of this is in `tile.js` where in line 1 it imports `style.js`. 