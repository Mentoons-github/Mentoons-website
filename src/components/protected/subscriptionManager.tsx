import React from "react";
import SubscriptionLimitModal from "../modals/SubscriptionLimitModal";
import PlatinumMembershipModal from "../common/modal/platinumSubscriptionModal";
import { useNavigate } from "react-router-dom";

export interface AccessCheckResponse {
  allowed: boolean;
  upgradeRequired?: boolean;
  upgradeTo?: string;
  planType?: "free" | "prime" | "platinum";
  modalType?: "freeToPrime" | "primeToPlatinum" | "freeToPlatinum";
  message?: string;
  currentPrimeConnections?: number;
}

interface SubscriptionModalManagerProps {
  accessCheck: AccessCheckResponse | null;
  isOpen: boolean;
  onClose: () => void;
  productId?: string;
  message?: string;
}

const SubscriptionModalManager: React.FC<SubscriptionModalManagerProps> = ({
  accessCheck,
  isOpen,
  onClose,
  productId = "",
}) => {
  const navigate = useNavigate();
  if (!isOpen || !accessCheck?.upgradeRequired) return null;

  const { modalType, message = "Please upgrade your plan." } = accessCheck;

  const modalConfig = {
    freeToPrime: {
      Component: SubscriptionLimitModal,
      title: "Upgrade to Prime Plan",
      planType: "free" as const,
    },
    primeToPlatinum: {
      Component: PlatinumMembershipModal,
      title: "Upgrade to Platinum Plan",
      planType: "prime" as const,
    },
    freeToPlatinum: {
      Component: PlatinumMembershipModal,
      title: "Upgrade to Platinum Plan",
      planType: "free" as const,
    },
  };

  const { Component, title, planType } =
    modalConfig[modalType || "freeToPrime"] || modalConfig.freeToPrime;

  return (
    <Component
      isOpen={isOpen}
      message={message}
      onClose={onClose}
      planType={planType}
      title={title}
      productId={productId}
      onNavigate={() => navigate("/membership")}
    />
  );
};

export default SubscriptionModalManager;
