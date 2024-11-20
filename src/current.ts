interface UserProfile {
    username: string;
    age: number;
    isActive: boolean;
  }
  
  interface Product {
    id: number;
    name: string;
    price: number;
    inStock: boolean;
    tags: string[];
  }
  
  class GenericFactory<T extends object> {
    private prototype: T;
  
    constructor(prototype: T) {
      this.prototype = prototype;
    }
  
    instance(): T {
      return { ...this.prototype };
    }
  
    fields(): { [K in keyof T]: string } {
      // Create an object with the same keys as T, but all values are empty strings
      const fieldNames = {} as { [K in keyof T]: string };
  
      // TypeScript ensures that the keys are the same as in T
      return fieldNames;
    }
  }
  
  // Example usage:
  
  // Creating a UserProfile instance
  const userProfilePrototype: UserProfile = {
    username: 'JohnDoe',
    age: 30,
    isActive: true,
  };
  
  const userProfileFactory = new GenericFactory<UserProfile>(userProfilePrototype);
  const newUserProfile = userProfileFactory.instance();
  console.log(newUserProfile);
  
  const userProfileFields = userProfileFactory.fields();
  console.log(userProfileFields); // { username: '', age: '', isActive: '' }
  
  // Creating a Product instance
  const productPrototype: Product = {
    id: 1,
    name: 'Laptop',
    price: 999.99,
    inStock: true,
    tags: ['electronics', 'computers'],
  };
  
  const productFactory = new GenericFactory<Product>(productPrototype);
  const newProduct = productFactory.instance();
  console.log(newProduct);
  
  const productFields = productFactory.fields();
  console.log(productFields); // { id: '', name: '', price: '', inStock: '', tags: '' }