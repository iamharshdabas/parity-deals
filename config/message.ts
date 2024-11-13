export const errorMessage = {
  product: {
    created: "There was an error creating the product",
    deleted: "There was an error deleting the product",
  },
};

export const successMessage = {
  product: {
    created: (name: string) => `Product ${name} created successfully!`,
    deleted: (name: string) => `Product ${name} deleted successfully!`,
  },
};
