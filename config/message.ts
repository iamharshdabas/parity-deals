function defaultPermissionTitle(title = "perform this action") {
  return `You do not have permission to ${title}.`;
}

function defaultPermissionDescription(title = "access this feature") {
  return `Please upgrade your account to ${title}.`;
}

export const errorMessage = {
  defaultPermission: {
    title: defaultPermissionTitle(),
    description: defaultPermissionDescription(),
  },
  countryGroupDiscount: {
    updated: "There was an error updating the country group discount",
  },
  product: {
    permission: {
      title: "You have reached the limit of products you can create",
      description: defaultPermissionDescription("create more products"),
    },
    created: "There was an error creating the product",
    deleted: "There was an error deleting the product",
    updated: "There was an error updating the product",
  },
  productCustomization: {
    permission: {
      title: defaultPermissionTitle("update product customizations"),
      description: defaultPermissionDescription(
        "update product customizations",
      ),
    },
    updated: "There was an error updating the product customization",
  },
};

export const successMessage = {
  countryGroupDiscount: {
    updated: "Country group discount updated successfully!",
  },
  product: {
    created: "Product created successfully!",
    deleted: "Product deleted successfully!",
    updated: "Product updated successfully!",
  },
  productCustomization: {
    updated: "Product customization updated successfully!",
  },
};
