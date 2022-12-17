const configs = require("../../config");
const { isSuccessfulResponse } = require("../../helpers/isSuccesfulResponse");
const generateRef = require("../../utils/generateRef");
const { getRequest, postRequest } = require("../apiRequests");

class FlutterwaveApi {
  SECRET_KEY;
  BASE_URL;
  SUBSCRIPTION_PLAN;
  CREATED_DATE;
  TRX_REF;

  constructor() {
    this.FLW_SECRET_KEY = configs.FLW_SECRET_KEY;
    this.BASE_URL = `https://api.flutterwave.com/v3/`;
    this.SUBSCRIPTION_PLAN = configs.SUBSCRIPTION_PLAN;
    this.CREATED_DATE = new Date();
    this.TRX_REF = generateRef();
  }

  handleError = (error) => {
    console.log(`${error.name}: ${error.message}`);
    return false;
  };

  chargeAuthorization = async ({ email, userId, amount }) => {
    try {
      const endpoint = `${this.BASE_URL}/payments`;
      const data = {
        tx_ref: this.TRX_REF,
        amount: amount,
        currency: "USD",
        redirect_url: `http://localhost:3000/callback?email=${email}`,
        meta: {
          consumer_id: userId,
        },
        customer: {
          email: email,
        },
        customizations: {
          title: "Funshun AI Pro",
          logo: "http://www.piedpiper.com/app/themes/joystick-v27/images/logo.png",
        },
      };

      const response = await postRequest({
        endpoint,
        data,
        headers: {
          Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`,
        },
      });

      if (isSuccessfulResponse(response) && response.data.data) {
        return response.data.data;
      }
      return false;
    } catch (error) {
      throw new Error(error);
    }
  };

  createSubscription = async ({ email }) => {
    try {
      const endpoint = `${this.BASE_URL}/subscription`;

      const data = {
        customer: email,
        plan: this.SUBSCRIPTION_PLAN,
        start_date: this.CREATED_DATE.toISOString(),
      };

      const response = await postRequest({
        endpoint,
        data,
        headers: { Authorization: `Bearer ${this.SECRET_KEY}` },
      });

      if (isSuccessfulResponse(response) && response.data.data)
        return response.data.data;

      return false;
    } catch (error) {
      return false;
    }
  };

  listSubscriptions = async () => {
    try {
      const endpoint = `${this.BASE_URL}/subscription`;

      const response = await getRequest({
        endpoint,
        headers: { Authorization: `Bearer ${this.SECRET_KEY}` },
      });

      if (isSuccessfulResponse(response) && response.data)
        return response.data.content.varations;

      return false;
    } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return false;
    }
  };

  fetchSubscription = async ({ id }) => {
    try {
      const endpoint = `${this.BASE_URL}/subscription/:${id}`;

      const response = await getRequest({
        endpoint,
        headers: { Authorization: `Bearer ${this.SECRET_KEY}` },
      });

      if (isSuccessfulResponse(response) && response.data)
        return response.data.content.varations;

      return false;
    } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return false;
    }
  };

  enableSubscription = async ({ subCode, emailCode }) => {
    try {
      const endpoint = `${this.BASE_URL}/subscription/enable`;

      const data = {
        code: subCode,
        token: emailCode,
      };

      const response = await postRequest({
        endpoint,
        data,
        headers: { Authorization: `Bearer ${this.SECRET_KEY}` },
      });

      if (isSuccessfulResponse(response) && response.data)
        return response.data.content.varations;

      return false;
    } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return false;
    }
  };

  disableSubscription = async ({ subCode, emailCode }) => {
    try {
      const endpoint = `${this.BASE_URL}/subscription/disable`;

      const data = {
        code: subCode,
        token: emailCode,
      };

      const response = await postRequest({
        endpoint,
        data,
        headers: { Authorization: `Bearer ${this.SECRET_KEY}` },
      });

      if (isSuccessfulResponse(response) && response.data)
        return response.data.content.varations;

      return false;
    } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return false;
    }
  };

  updateSubscription = async (code) => {
    try {
      const endpoint = `${this.BASE_URL}/${code}/manage/link/`;

      const response = await getRequest({
        endpoint,
        headers: { Authorization: `Bearer ${this.SECRET_KEY}` },
      });

      if (isSuccessfulResponse(response) && response.data)
        return response.data.content.varations;

      return false;
    } catch (error) {
      console.error(`${error.name}: ${error.message}`);
      return false;
    }
  };
}

module.exports = FlutterwaveApi;
