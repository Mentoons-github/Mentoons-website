import axios from "axios";
import { useState } from "react";

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    merchant_id: "3545043",
    order_id: `#ORD-${Date.now()}`,
    currency: "INR",
    amount: "1.00",
    redirect_url: "https://www.mentoons.com/mentons-store",
    cancel_url: "https://www.mentoons.com/mentons-store",
    language: "EN",
    billing_name: "Peter",
    billing_address: "Santacruz",
    billing_city: "Mumbai",
    billing_state: "MH",
    billing_zip: "400054",
    billing_country: "India",
    billing_tel: "9876543210",
    billing_email: "testing@domain.com",
    delivery_name: "Sam",
    delivery_address: "Vile Parle",
    delivery_city: "Mumbai",
    delivery_state: "Maharashtra",
    delivery_zip: "400038",
    delivery_country: "India",
    delivery_tel: "0123456789",
    merchant_param1: "additional Info.",
    merchant_param2: "additional Info.",
    merchant_param3: "additional Info.",
    merchant_param4: "additional Info.",
    merchant_param5: "additional Info.",
    promo_code: "",
    customer_identifier: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_DEV_URL}/ccavRequestHandler`,
        formData,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      // Assuming the response contains the HTML string for the form
      const formHtml = response.data; // This should be the HTML string

      // Create a temporary container to hold the form HTML
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = formHtml;

      // Append the form to the body and submit it
      const form = tempDiv.querySelector("form");
      if (form) {
        document.body.appendChild(form);
        form.submit(); // Submit the form
      } else {
        console.error("Form not found in the response HTML.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <form
      onSubmit={(e) => handleSubmit(e)}
      className="p-4 bg-gray-100 rounded-lg shadow-md"
    >
      <table className="w-full">
        <tbody>
          <tr>
            <td className="py-2">Merchant Id:</td>
            <td>
              <input
                type="text"
                name="merchant_id"
                value={formData.merchant_id}
                onChange={(e) => handleChange(e)}
                className="border rounded-md p-2 w-full"
              />
            </td>
          </tr>
          <tr>
            <td className="py-2">Order Id:</td>
            <td>
              <input
                type="text"
                name="order_id"
                value={formData.order_id}
                onChange={handleChange}
                className="border rounded-md p-2 w-full"
              />
            </td>
          </tr>
          <tr>
            <td className="py-2">Amount:</td>
            <td>
              <input
                type="text"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                className="border rounded-md p-2 w-full"
              />
            </td>
          </tr>
          {/* Add other fields similarly */}
          <tr>
            <td></td>
            <td>
              <input
                type="submit"
                value="Checkout"
                className="bg-blue-500 text-white rounded-md p-2 hover:bg-blue-600 transition duration-200"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
};

export default PaymentForm;
