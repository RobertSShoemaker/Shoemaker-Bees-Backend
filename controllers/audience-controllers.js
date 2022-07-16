const { validationResult } = require("express-validator");
const https = require("https");

const HttpError = require("../models/http-error");

const client = require("@mailchimp/mailchimp_marketing");

const addAudienceMember = async (req, res, next) => {
  //validate the input
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { email, fName, lName } = req.body;

  client.setConfig({
    apiKey: process.env.MAILCHIMP_API_KEY,
    server: process.env.MAILCHIMP_SERVER,
  });

  //adds user to the email list; if they're already in the list, then it will update their info

  const run = async () => {
    try {
      const response = await client.lists.setListMember(process.env.MAILCHIMP_LIST, email, {
        email_address: email,
        merge_fields: {
          FNAME: fName,
          LNAME: lName,
        },
        status: "pending",
      });
      console.log(response);
    } catch (err) {
      const error = new HttpError(
        "Signing up failed, please try again later.",
        500
      );
      return next(error);
    }

    res.status(201).json({ email: email });
  };

  run();

};

exports.addAudienceMember = addAudienceMember;
