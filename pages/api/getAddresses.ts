import type { NextApiRequest, NextApiResponse } from "next";

import generateMockAddresses from "../../src/utils/generateMockAddresses";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { postcode, streetnumber },
  } = req;

  if (!postcode || !streetnumber) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode and street number fields mandatory!",
    });
  }

  if (postcode.length < 4) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode must be at least 4 digits!",
    });
  }

  const isStrictlyNumeric = (value: string) => {
    return /^\d+$/.test(value) && parseInt(value, 10) >= 0;
  };

  const validateNumericField = (value: string, fieldName: string) => {
    if (!isStrictlyNumeric(value)) {
      return {
        status: "error",
        errormessage: `${fieldName} must be all digits and non negative!`,
      };
    }
    return null;
  };

  const postcodeValidation = validateNumericField(postcode as string, "Postcode");
  if (postcodeValidation) {
    return res.status(400).send(postcodeValidation);
  }

  const streetnumberValidation = validateNumericField(streetnumber as string, "Street Number");
  if (streetnumberValidation) {
    return res.status(400).send(streetnumberValidation);
  }

  const mockAddresses = generateMockAddresses(
    postcode as string,
    streetnumber as string
  );
  if (mockAddresses) {
    const timeout = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    // delay the response by 500ms - for loading status check
    await timeout(500);
    return res.status(200).json({
      status: "ok",
      details: mockAddresses,
    });
  }

  return res.status(404).json({
    status: "error",
    // DO NOT MODIFY MSG - used for grading
    errormessage: "No results found!",
  });
}
