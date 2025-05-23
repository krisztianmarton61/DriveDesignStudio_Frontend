import { FC, useState } from "react";
import style from "./Checkout.module.scss";
import {
  address,
  addressError,
  cart,
  cartCount,
  cartImages,
  city,
  cityError,
  country,
  county,
  countyError,
  createAccount,
  email,
  emailError,
  firstName,
  firstNameError,
  lastName,
  lastNameError,
  orderId,
  orderPosted,
  password,
  passwordError,
  phoneNumber,
  phoneNumberError,
  products,
  resetCartState,
  resetCheckoutState,
  setAddress,
  setAddressError,
  setAlert,
  setCity,
  setCityError,
  setCounty,
  setCountyError,
  setCreateAccount,
  setEmail,
  setEmailError,
  setFirstName,
  setFirstNameError,
  setLastName,
  setLastNameError,
  setOrderId,
  setOrderPosted,
  setPassword,
  setPasswordError,
  setPhoneNumber,
  setPhoneNumberError,
  setProduct,
  setShipAddress,
  setShipAddressError,
  setShipCity,
  setShipCityError,
  setShipCounty,
  setShipCountyError,
  setShipFirstName,
  setShipFirstNameError,
  setShipLastName,
  setShipLastNameError,
  setShippingInformationSameAsBilling,
  shipAddress,
  shipAddressError,
  shipCity,
  shipCityError,
  shipCountry,
  shipCountryError,
  shipCounty,
  shipCountyError,
  shipFirstName,
  shipFirstNameError,
  shipLastName,
  shipLastNameError,
  shippingCost,
  shippingInformationSameAsBilling,
  user,
} from "../../states";
import {
  useSignal,
  useSignalEffect,
  useSignals,
} from "@preact/signals-react/runtime";
import { getImage, getProduct, postOrder } from "../../services";
import { IOrder } from "../../types";
import { State } from "country-state-city";
import { IState } from "country-state-city";
import { Signal } from "@preact/signals-react";
import { useNavigate } from "react-router-dom";

export const Checkout: FC = () => {
  useSignals();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [productsLoaded, setProductsLoaded] = useState(false);
  const [cartImagesLoaded, setCartImagesLoaded] = useState(false);

  const Countys: Signal<IState[]> = useSignal(State.getStatesOfCountry("RO"));

  useSignalEffect(() => {
    const newProducts = cart.value.filter(
      (item) => !products.value[item.productId]
    );
    const promises = newProducts.map(async (item) => {
      await getProduct(item.productId, setAlert, setProduct);
    });
    Promise.all(promises).then(() => setProductsLoaded(true));
  });

  useSignalEffect(() => {
    if (cartCount.value === 0) {
      return;
    }
    const promises = cart.value.map(async (item) => {
      if (cartImages.value[item.imageId]) {
        return;
      }
      const image = await getImage(setAlert, item.imageId);
      if (image) {
        cartImages.value[item.imageId] = image.src;
      }
    });
    Promise.all(promises).then(() => setCartImagesLoaded(true));
  });

  const validateData = () => {
    let isValid = true;
    if (email.value === "") {
      setEmailError("Email is required");
      isValid = false;
    } else if (
      !/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email.value)
    ) {
      setEmailError("Invalid email address");
      isValid = false;
    }
    if (createAccount.value && password.value === "") {
      setPasswordError("Password is required");
      isValid = false;
    } else if (createAccount.value && password.value.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      isValid = false;
    }
    if (firstName.value === "") {
      setFirstNameError("First name is required");
      isValid = false;
    }
    if (lastName.value === "") {
      setLastNameError("Last name is required");
      isValid = false;
    }
    if (phoneNumber.value === "") {
      setPhoneNumberError("Phone number is required");
      isValid = false;
    } else if (!/^[0-9]{10}$/.test(phoneNumber.value)) {
      setPhoneNumberError("Invalid phone number");
      isValid = false;
    }
    if (address.value === "") {
      setAddressError("Address is required");
      isValid = false;
    }
    if (county.value === "") {
      setCountyError("County is required");
      isValid = false;
    }
    if (city.value === "") {
      setCityError("City is required");
      isValid = false;
    }
    if (shippingInformationSameAsBilling.value === false) {
      if (shipFirstName.value === "") {
        setShipFirstNameError("First name is required");
        isValid = false;
      }
      if (shipLastName.value === "") {
        setShipLastNameError("Last name is required");
        isValid = false;
      }

      if (shipAddress.value === "") {
        setShipAddressError("Address is required");
        isValid = false;
      }
      if (shipCounty.value === "") {
        setShipCountyError("County is required");
        isValid = false;
      }
      if (shipCity.value === "") {
        setShipCityError("City is required");
        isValid = false;
      }
    }
    return isValid;
  };

  const handlePlaceOrder = () => {
    if (!validateData()) {
      return;
    }
    const order: IOrder = {
      email: email.value,
      password: password.value,
      userId: user.value?.sub,
      billingInformation: {
        firstName: firstName.value,
        lastName: lastName.value,
        address: address.value,
        phone: phoneNumber.value,
        country: country.value,
        county: county.value,
        city: city.value,
      },
      shippingInformation: shippingInformationSameAsBilling.value
        ? undefined
        : {
            firstName: firstName.value,
            lastName: lastName.value,
            address: address.value,
            country: country.value,
            county: county.value,
            city: city.value,
            phone: phoneNumber.value,
          },
      products: cart.value.map((item) => {
        return {
          productId: item.productId.toString(),
          quantity: item.quantity,
          imageId: item.imageId,
        };
      }),
    };
    postOrder(order, setOrderId, setOrderPosted, setAlert, setIsLoading);
  };

  if (orderPosted.value && orderId.value !== "") {
    const orderIdValue = orderId.value;
    resetCartState();
    resetCheckoutState();
    navigate("/orders/confirm/" + orderIdValue);
  }

  return (
    <>
      {productsLoaded && cartImagesLoaded ? (
        <div className={style["checkout-container"]}>
          <div className={style["information-container"]}>
            <div className={style["billing-information-container"]}>
              <h1>Billing information</h1>
              <div className={style["form"]}>
                <div className={style["input-container"]}>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    value={email.value}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                  {emailError.value !== "" && (
                    <span className={style["error"]}>{emailError.value}</span>
                  )}
                </div>

                <div className={style["input-container"]}>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    value={firstName.value}
                    onChange={(e) => {
                      setFirstName(e.target.value);
                    }}
                  />
                  <span className={style["error"]}>{firstNameError.value}</span>
                </div>
                <div className={style["input-container"]}>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    value={lastName.value}
                    onChange={(e) => {
                      setLastName(e.target.value);
                    }}
                  />
                  <span className={style["error"]}>{lastNameError.value}</span>
                </div>
                <div className={style["input-container"]}>
                  <label htmlFor="phoneNumber">Phone Number</label>
                  <input
                    type="text"
                    value={phoneNumber.value}
                    onChange={(e) => {
                      setPhoneNumber(e.target.value);
                    }}
                  />
                  <span className={style["error"]}>
                    {phoneNumberError.value}
                  </span>
                </div>
                <div className={style["input-container"]}>
                  <label htmlFor="address">Address</label>
                  <input
                    type="textarea"
                    value={address.value}
                    onChange={(e) => {
                      setAddress(e.target.value);
                    }}
                  />
                  <span className={style["error"]}>{addressError.value}</span>
                </div>
                <div className={style["input-container"]}>
                  <label htmlFor="country">Country</label>
                  <input type="text" defaultValue={country.value} disabled />
                </div>
                <div className={style["select-container"]}>
                  {Countys.value.length > 0 && (
                    <>
                      <label htmlFor="county"> County</label>
                      <select
                        onChange={(e) => {
                          setCounty(
                            Countys.value[e.target.selectedIndex].name.replace(
                              "County",
                              ""
                            )
                          );
                        }}
                      >
                        <option value="">Select a county</option>
                        {Countys.value.map((county, index) => {
                          return (
                            <option key={index} value={county.name}>
                              {county.name.replace("County", "")}
                            </option>
                          );
                        })}
                      </select>
                      <span className={style["error"]}>
                        {countyError.value}
                      </span>
                    </>
                  )}
                </div>
                <div className={style["input-container"]}>
                  <label htmlFor="city"> City</label>
                  <input
                    type="text"
                    value={city.value}
                    onChange={(e) => {
                      setCity(e.target.value);
                    }}
                  />
                  <span className={style["error"]}>{cityError.value}</span>
                </div>
              </div>
            </div>
            {user.value ? null : (
              <>
                <div className={style["create-account-container"]}>
                  <input
                    type="checkbox"
                    id="createaccount"
                    checked={createAccount.value}
                    onChange={() => {
                      setCreateAccount(!createAccount.value);
                    }}
                  />
                  <label htmlFor="createaccount">Create account</label>
                </div>
                {createAccount.value && (
                  <div className={style["form"]}>
                    <div className={style["input-container"]}>
                      <label htmlFor="password">Password</label>
                      <input
                        type="password"
                        value={password.value}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                      {passwordError.value !== "" && (
                        <span className={style["error"]}>
                          {passwordError.value}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
            <div className={style["shipping-information-container"]}>
              <h1>Shipping information</h1>
              <div>
                <input
                  type="checkbox"
                  id="sameAsBilling"
                  checked={shippingInformationSameAsBilling.value}
                  onChange={() => {
                    setShippingInformationSameAsBilling(true);
                  }}
                />
                <label htmlFor="sameAsBilling">
                  Same as billing information
                </label>
              </div>
              <div>
                <input
                  type="checkbox"
                  id="differentAddress"
                  checked={!shippingInformationSameAsBilling.value}
                  onChange={() => {
                    setShippingInformationSameAsBilling(false);
                  }}
                />
                <label htmlFor="differentAddress">
                  Ship to a different address
                </label>
              </div>
            </div>
            {!shippingInformationSameAsBilling.value && (
              <div className={style["form"]}>
                <div className={style["input-container"]}>
                  <label htmlFor="shipFirstName">First Name</label>
                  <input
                    type="text"
                    value={shipFirstName.value}
                    onChange={(e) => {
                      setShipFirstName(e.target.value);
                    }}
                  />
                  <span className={style["error"]}>
                    {shipFirstNameError.value}
                  </span>
                </div>
                <div className={style["input-container"]}>
                  <label htmlFor="shipLastName">Last Name</label>
                  <input
                    type="text"
                    value={shipLastName.value}
                    onChange={(e) => {
                      setShipLastName(e.target.value);
                    }}
                  />
                  <span className={style["error"]}>
                    {shipLastNameError.value}
                  </span>
                </div>
                <div className={style["input-container"]}>
                  <label htmlFor="shipAddress">Address</label>
                  <input
                    type="textarea"
                    value={shipAddress.value}
                    onChange={(e) => {
                      setShipAddress(e.target.value);
                    }}
                  />
                  <span className={style["error"]}>
                    {shipAddressError.value}
                  </span>
                </div>
                <div className={style["input-container"]}>
                  <label htmlFor="shipCountry">Country</label>
                  <input
                    type="text"
                    defaultValue={shipCountry.value}
                    disabled
                  />
                  <span className={style["error"]}>
                    {shipCountryError.value}
                  </span>
                </div>
                <div className={style["select-container"]}>
                  {Countys.value.length > 0 && (
                    <>
                      <label htmlFor="county"> County</label>
                      <select
                        onChange={(e) => {
                          setShipCounty(
                            Countys.value[e.target.selectedIndex].name.replace(
                              "County",
                              ""
                            )
                          );
                        }}
                      >
                        <option value="">Select a county</option>
                        {Countys.value.map((county, index) => {
                          return (
                            <option key={index} value={county.name}>
                              {county.name.replace("County", "")}
                            </option>
                          );
                        })}
                      </select>
                      <span className={style["error"]}>
                        {shipCountyError.value}
                      </span>
                    </>
                  )}
                </div>
                <div className={style["input-container"]}>
                  <label htmlFor="city"> City</label>
                  <input
                    type="text"
                    value={shipCity.value}
                    onChange={(e) => {
                      setShipCity(e.target.value);
                    }}
                  />
                  <span className={style["error"]}>{shipCityError.value}</span>
                </div>
              </div>
            )}
            <div className={style["payment-information-container"]}>
              <h1>Payment details</h1>
              <div>
                <input
                  type="checkbox"
                  id="payOnDelivery"
                  checked={true}
                  onChange={() => {}}
                />
                <label htmlFor="payOnDelivery">Pay on delivery</label>
              </div>
            </div>
          </div>
          <div className={style["summary-container"]}>
            <h1>Order summary</h1>
            <div className={style["cart-items-container"]}>
              {cartCount.value > 0 &&
                cart.value.map((item, index) => {
                  return (
                    <div key={index} className={style["cart-item"]}>
                      <div className={style["cart-item-image-container"]}>
                        <img
                          src={cartImages.value[item.imageId]}
                          alt="Product"
                        />
                      </div>
                      <div className={style["cart-item-details-container"]}>
                        <p>{products.value[item.productId]?.name.toString()}</p>
                      </div>
                      <div className={style["cart-item-actions-container"]}>
                        <p>
                          {" "}
                          <b>
                            {products.value[item.productId]?.price.toString()}{" "}
                            Lei
                          </b>
                        </p>
                      </div>
                    </div>
                  );
                })}
              <div>
                <div className={style["divider"]}></div>
                <div className={style["price-summary"]}>
                  <div>Shipping:</div>
                  <div>{shippingCost.value.toFixed(2)} Lei</div>
                </div>
                <div className={style["price-summary"]}>
                  <p>
                    <b>Subtotal:</b>
                  </p>
                  <p>
                    <b>
                      {(
                        cart.value.reduce((total, item) => {
                          return (
                            total +
                            parseFloat(
                              products.value[item.productId]?.price.toString()
                            ) *
                              item.quantity
                          );
                        }, 0) + parseFloat(shippingCost.value.toString())
                      ).toFixed(2)}{" "}
                      Lei
                    </b>
                  </p>
                </div>
              </div>
              <button className={style["primary"]} onClick={handlePlaceOrder}>
                Place order
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
};
