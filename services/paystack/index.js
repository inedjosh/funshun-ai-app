const configs = require("../../config");
const { isSuccessfulResponse } = require("../../helpers/isSuccesfulResponse");
const generateRef = require("../../utils/generateRef");
const { getRequest, postRequest } = require("../apiRequests");

class PaystackApi {
  SECRET_KEY;
  BASE_URL;
  SUBSCRIPTION_PLAN;
  CREATED_DATE;

  constructor() {
    this.PAYSTACK_SECRET_KEY = configs.PAYSTACK_SECRET;
    this.BASE_URL = `https://api.paystack.co/`;
    this.SUBSCRIPTION_PLAN = configs.SUBSCRIPTION_PLAN;
    this.CREATED_DATE = new Date();
  }

  handleError = (error) => {
    console.log(`${error.name}: ${error.message}`);
    return false;
  };

  chargeAuthorization = async ({ email, userId, amount }) => {
    try {
      const endpoint = `${this.BASE_URL}/transaction/initialize`;
      const data = {
        amount: amount * 100,
        callback_url: `${configs.CLIENT_URL}/confirmpayment?email=${email}`,
        channel: [
          "card",
          "bank",
          "ussd",
          "qr",
          "mobile_money",
          "bank_transfer",
          "eft",
        ],
        currency: "USD",
        meta: {
          consumer_id: userId,
        },
        reference: generateRef(),
        email: email,
      };

      const response = await postRequest({
        endpoint,
        data,
        headers: {
          Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`,
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

  verifyTransaction = async (ref) => {
    try {
      const endpoint = `${this.BASE_URL}transaction/verify/${ref}`;

      const response = await getRequest({
        endpoint,
        headers: {
          Authorization: `Bearer ${this.PAYSTACK_SECRET_KEY}`,
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
}

module.exports = PaystackApi;
