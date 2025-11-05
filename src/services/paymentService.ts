import axios from "axios";
import { toast } from "sonner";

export const handlePayment = async (
  userId: string,
  user: { firstName?: string; lastName?: string },
  quizId: string,
  token: string,
  formData: {
    billing_name: string;
    billing_email: string;
    billing_tel: string;
    currency: string;
    order_id: string;
  },
  redeemPoints: number,
  appliedDiscount: number,
  handleRedeemPoints: (points: number, orderId: string) => void,
  rewardPurchaseProduct: (productId: string) => void,
  currentQuiz: {
    questionsByDifficulty: {
      [key: string]: any[];
    };
  },
  difficulty: string,
  orderType: string
) => {
  const handleProceedToPay = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const formattedItems = {
        product: quizId,
        quantity: 1,
        price: 9,
        productName: `Quiz Unlock (${currentQuiz.questionsByDifficulty[difficulty].length} questions)`,
        productType: "quiz",
      };

      const productInfo = `Quiz Unlock (${currentQuiz.questionsByDifficulty[difficulty].length} questions)`;

      const totalAmount = 9;

      const orderData = {
        user: userId,
        items: [formattedItems],
        paymentDetails: {
          paymentMethod: "credit_card",
          paymentStatus: "initiated",
        },
        orderStatus: "pending",
        totalAmount,
        amount: totalAmount,
        currency: formData.currency || "INR",
        order_type: orderType,
        productInfo,
        customerName: formData.billing_name,
        email: formData.billing_email,
        phone: formData.billing_tel,
        status: "PENDING",
        firstName: user?.firstName || "",
        lastName: user?.lastName || "",
        rewardPointsRedeemed: redeemPoints,
        discountApplied: appliedDiscount,
        orderId: formData.order_id,
      };

      console.log("Order Data:", orderData);

      const response = await axios.post(
        `${import.meta.env.VITE_PROD_URL}/payment/initiate`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response:", response.data);

      if (redeemPoints > 0) {
        try {
          handleRedeemPoints(-redeemPoints, orderData.orderId);
          toast.success(`${redeemPoints} points redeemed successfully!`);
        } catch (error) {
          console.error("Error deducting reward points:", error);
        }
      }

      rewardPurchaseProduct(quizId);

      if (response.data && typeof response.data === "string") {
        const tempDiv = document.createElement("div");
        tempDiv.innerHTML = response.data;
        const form = tempDiv.querySelector("form");
        if (form) {
          document.body.appendChild(form);
          form.submit();
        } else {
          console.error("Form not found in the response HTML.");
          toast.error("Payment initiation failed. Please try again.");
        }
      } else {
        console.error("Unexpected response format:", response.data);
        toast.error("Payment initiation failed. Please try again.");
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error.message || "Failed to process payment. Please try again later."
      );
      throw error;
    }
  };

  return handleProceedToPay;
};
