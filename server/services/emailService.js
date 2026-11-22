
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

// Verify the Gmail connection.
const verifyEmailConnection = async () => {
  try {
    await transporter.verify();
    console.log("Gmail email service connected successfully.");
    return true;
  } catch (error) {
    console.error("Gmail connection failed:", error.message);
    return false;
  }
};

// Send a booking reminder email.
const sendBookingReminder = async (booking) => {
  const restaurantName =
    process.env.RESTAURANT_NAME || "Spice Route Restaurant";

  const bookingDate = new Date(booking.date).toLocaleDateString("en-PK", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const mailOptions = {
    from: `"${restaurantName}" <${process.env.GMAIL_USER}>`,
    to: booking.customerEmail,
    subject: `Reminder: Your reservation at ${restaurantName}`,
    text: `
Hello ${booking.customerName},

This is a friendly reminder about your upcoming reservation.

Restaurant: ${restaurantName}
Date: ${bookingDate}
Time: ${booking.slot}

We look forward to welcoming you!

Thank you,
${restaurantName}
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  transporter,
  verifyEmailConnection,
  sendBookingReminder,
};
