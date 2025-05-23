import { signal } from "@preact/signals-react";

export const firstName = signal("");
export const lastName = signal("");
export const email = signal("");
export const password = signal<string>("");
export const phoneNumber = signal("");
export const address = signal("");
export const county = signal("");
export const city = signal("");
export const country = signal("Romania");
export const createAccount = signal(true);

export const firstNameError = signal("");
export const lastNameError = signal("");
export const emailError = signal("");
export const passwordError = signal("");
export const phoneNumberError = signal("");
export const addressError = signal("");
export const countyError = signal("");
export const cityError = signal("");
export const countryError = signal("");

export const shipFirstName = signal("");
export const shipLastName = signal("");
export const shipAddress = signal("");
export const shipCounty = signal("");
export const shipCity = signal("");
export const shipCountry = signal("Romania");

export const shipFirstNameError = signal("");
export const shipLastNameError = signal("");
export const shipAddressError = signal("");
export const shipCountyError = signal("");
export const shipCityError = signal("");
export const shipCountryError = signal("");

export const shippingInformationSameAsBilling = signal(true);
export const shippingCost = signal(14.99);

export const orderId = signal("");
export const orderPosted = signal(false);

export const resetCheckoutState = () => {
  firstName.value = "";
  lastName.value = "";
  email.value = "";
  password.value = "";
  phoneNumber.value = "";
  address.value = "";
  county.value = "";
  city.value = "";
  country.value = "Romania";

  firstNameError.value = "";
  lastNameError.value = "";
  emailError.value = "";
  phoneNumberError.value = "";
  addressError.value = "";
  countyError.value = "";
  cityError.value = "";
  countryError.value = "";

  shipFirstName.value = "";
  shipLastName.value = "";
  shipAddress.value = "";
  shipCounty.value = "";
  shipCity.value = "";
  shipCountry.value = "Romania";

  shipFirstNameError.value = "";
  shipLastNameError.value = "";
  shipAddressError.value = "";
  shipCountyError.value = "";
  shipCityError.value = "";
  shipCountryError.value = "";

  shippingInformationSameAsBilling.value = true;
  shippingCost.value = 14.99;

  orderId.value = "";
  orderPosted.value = false;
};

export const setCreateAccount = (value: boolean) => {
  createAccount.value = value;
};

export const setOrderId = (value: string) => {
  orderId.value = value;
};

export const setOrderPosted = (value: boolean) => {
  orderPosted.value = value;
};

export const setFirstName = (value: string) => {
  if (firstNameError.value !== "" && value !== "") {
    firstNameError.value = "";
  }
  firstName.value = value;
};
export const setFirstNameError = (value: string) => {
  firstNameError.value = value;
};

export const setLastName = (value: string) => {
  if (lastNameError.value !== "" && value !== "") {
    lastNameError.value = "";
  }
  lastName.value = value;
};
export const setLastNameError = (value: string) => {
  lastNameError.value = value;
};

export const setEmail = (value: string) => {
  if (emailError.value !== "" && value !== "") {
    if (!/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(value)) {
      emailError.value = "Invalid email address";
    } else {
      emailError.value = "";
    }
  }
  email.value = value;
};
export const setEmailError = (value: string) => {
  emailError.value = value;
};

export const setPassword = (value: string) => {
  if (passwordError.value !== "" && value !== "") {
    if (value.length < 6) {
      passwordError.value = "Password must be at least 6 characters long";
    } else {
      passwordError.value = "";
    }
  }
  password.value = value;
};

export const setPasswordError = (value: string) => {
  passwordError.value = value;
};

export const setPhoneNumber = (value: string) => {
  if (phoneNumberError.value !== "" && value !== "") {
    if (!/^[0-9]{10}$/.test(value)) {
      phoneNumberError.value = "Invalid phone number";
    } else {
      phoneNumberError.value = "";
    }
  }
  phoneNumber.value = value;
};
export const setPhoneNumberError = (value: string) => {
  phoneNumberError.value = value;
};

export const setAddress = (value: string) => {
  if (addressError.value !== "" && value !== "") {
    addressError.value = "";
  }
  address.value = value;
};
export const setAddressError = (value: string) => {
  addressError.value = value;
};

export const setCounty = (value: string) => {
  if (countyError.value !== "" && value !== "") {
    countyError.value = "";
  }
  county.value = value;
};
export const setCountyError = (value: string) => {
  countyError.value = value;
};

export const setCity = (value: string) => {
  if (cityError.value !== "" && value !== "") {
    cityError.value = "";
  }
  city.value = value;
};
export const setCityError = (value: string) => {
  cityError.value = value;
};

export const setCountry = (value: string) => {
  if (countryError.value !== "" && value !== "") {
    countryError.value = "";
  }
  country.value = value;
};
export const setCountryError = (value: string) => {
  countryError.value = value;
};

export const setShippingInformationSameAsBilling = (value: boolean) => {
  shippingInformationSameAsBilling.value = value;
};

export const setShipFirstName = (value: string) => {
  if (shipFirstNameError.value !== "" && value !== "") {
    shipFirstNameError.value = "";
  }
  shipFirstName.value = value;
};
export const setShipFirstNameError = (value: string) => {
  shipFirstNameError.value = value;
};

export const setShipLastName = (value: string) => {
  if (shipLastNameError.value !== "" && value !== "") {
    shipLastNameError.value = "";
  }
  shipLastName.value = value;
};
export const setShipLastNameError = (value: string) => {
  shipLastNameError.value = value;
};

export const setShipAddress = (value: string) => {
  if (shipAddressError.value !== "" && value !== "") {
    shipAddressError.value = "";
  }
  shipAddress.value = value;
};
export const setShipAddressError = (value: string) => {
  shipAddressError.value = value;
};

export const setShipCounty = (value: string) => {
  if (shipCountyError.value !== "" && value !== "") {
    shipCountyError.value = "";
  }
  shipCounty.value = value;
};
export const setShipCountyError = (value: string) => {
  shipCountyError.value = value;
};

export const setShipCity = (value: string) => {
  if (shipCityError.value !== "" && value !== "") {
    shipCityError.value = "";
  }
  shipCity.value = value;
};
export const setShipCityError = (value: string) => {
  shipCityError.value = value;
};

export const setShipCountry = (value: string) => {
  if (shipCountryError.value !== "" && value !== "") {
    shipCountryError.value = "";
  }
  shipCountry.value = value;
};
export const setShipCountryError = (value: string) => {
  shipCountryError.value = value;
};
