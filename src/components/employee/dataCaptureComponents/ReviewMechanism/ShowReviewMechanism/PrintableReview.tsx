import { forwardRef } from "react";

import { Details } from "@/types/employee/dataCaptureTypes";
import ReviewMechanismFirst from "../ReviewMechanismFirst";
import ShowReviewMechanismSecond from "./ShowReviewMechanismSecond";
import ShowReviewMechanismThird from "./ShowReviewMechanismThird";
import ShowReviewMechanismFourth from "./ShowReviewMechanismFourth";

const PrintableReview = forwardRef<HTMLDivElement, { singleData: Details }>(
  ({ singleData }, ref) => {
    return (
      <div ref={ref} className="print-root">
        <div className="a4-page">
          <ReviewMechanismFirst singleData={singleData} />
        </div>

        <div className="a4-page">
          <ShowReviewMechanismSecond singleData={singleData} />
        </div>

        <div className="a4-page">
          <ShowReviewMechanismThird singleData={singleData} />
        </div>

        <div className="a4-page">
          <ShowReviewMechanismFourth singleData={singleData} />
        </div>
      </div>
    );
  }
);

export default PrintableReview;
