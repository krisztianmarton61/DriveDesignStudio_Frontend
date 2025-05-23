import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  SignInPage,
  SignUpPage,
  SignUpConfirmPage,
  ForgotPasswordPage,
  HomePage,
  ProfilePage,
  ProductPage,
  CartPage,
  CheckoutPage,
  OrderPage,
  OrdersPage,
} from "./pages";
import { DynamicAlert, Footer, Header } from "./components";
import { OrderConfirmationPage } from "./pages/OrderConfirmation";
import { Amplify } from "aws-amplify";
import { config } from "./config";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: config.cognito.userPoolId,
      userPoolClientId: config.cognito.clientId,
    },
  },
});

function App() {
  return (
    <>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="sign-in" element={<SignInPage />} />
          <Route path="sign-up">
            <Route index element={<SignUpPage />} />
            <Route path="confirm" element={<SignUpConfirmPage />} />
          </Route>
          <Route path="forgot-password" element={<ForgotPasswordPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="products/:id" element={<ProductPage />} />
          <Route path="cart" element={<CartPage />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="admin/orders" element={<OrdersPage />} />
          <Route path="admin/orders/:id" element={<OrderPage />} />
          <Route
            path="orders/confirm/:id"
            element={<OrderConfirmationPage />}
          />
          <Route path="*" element={<div>Not found</div>} />
        </Routes>
        <Footer />
      </BrowserRouter>
      <DynamicAlert />
    </>
  );
}

export default App;
