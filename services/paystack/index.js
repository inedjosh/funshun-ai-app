import { configs } from "../../config";
import { isSuccessfulResponse } from "../../helpers/isSuccesfulResponse";
import { getRequest, postRequest } from "../apiRequests";

class PaystackApi {
  SECRET_KEY;
  BASE_URL;
  SUBSCRIPTION_PLAN;
  CREATED_DATE;

  constructor() {
    this.SECRET_KEY = configs.PAYSTACK_SECRET;
    this.BASE_URL = `https://api.paystack.co`;
    this.SUBSCRIPTION_PLAN = configs.SUBSCRIPTION_PLAN;
    this.CREATED_DATE = new Date();
  }

  // console.log(event.toISOString());

  handleError = (error) => {
    console.log(`${error.name}: ${error.message}`);
    return false;
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
      logger.error(`${error.name}: ${error.message}`);
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
      logger.error(`${error.name}: ${error.message}`);
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
      logger.error(`${error.name}: ${error.message}`);
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
      logger.error(`${error.name}: ${error.message}`);
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
      logger.error(`${error.name}: ${error.message}`);
      return false;
    }
  };
}

export default PaystackApi;
