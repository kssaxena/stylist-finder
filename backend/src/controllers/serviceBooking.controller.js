import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Services } from "../models/service.model.js";
import { Store } from "../models/store.model.js";
import { Professional } from "../models/professional.model.js";
import { Customer } from "../models/customer.model.js";
import { ServiceBookings } from "../models/serviceBooking.model.js";
import { BOOKING_STATUS } from "../constants/payment.constants.js";
import sendEmail from "../services/mail.service.js";
import serviceBookingTemplate from "../template/booking.mail.template.js";

const createAppointment = asyncHandler(async (req, res) => {
  const { serviceId, customerId, storeId } = req.params;
  const { dateForBooking, modeOfPayment, bookingAmount, address } = req.body;
  if (!serviceId || !customerId || !dateForBooking || !modeOfPayment)
    throw new ApiError(400, "Something went wrong, please try again ");

  if (!address)
    throw new ApiError(400, "Please add an address first to proceed");

  const newService = await ServiceBookings.create({
    service: serviceId,
    customer: customerId,
    address: address,
    store: storeId,
    dateOfBooking: new Date(),
    dateForBooking: dateForBooking,
    modeOfPayment: modeOfPayment,
    bookingAmount: bookingAmount,
  });
  if (!newService)
    throw new ApiError(400, "Unable to book appointment, please retry !");

  const customerExists = await Customer.exists({
    _id: customerId,
  });

  if (!customerExists) {
    throw new ApiError(404, "Customer not found");
  }

  const customer = await Customer.findByIdAndUpdate(customerId, {
    $push: {
      bookings: newService._id,
    },
  });
  if (!customer) throw new ApiError(400, "Something went wrong");

  const service = await Services.findById(serviceId);
  const store = await Store.findById(storeId);
  function formatDate(mongoDate) {
    const date = new Date(mongoDate);
    const dd = String(date.getDate()).padStart(2, "0");
    const mm = String(date.getMonth() + 1).padStart(2, "0");
    const yy = String(date.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
  }

  const formattedDate = formatDate(dateForBooking);

  await sendEmail({
    to: customer?.email,
    subject: "Appointment booking confirmation",
    html: serviceBookingTemplate(
      customer?.name,
      service?.name,
      formattedDate,
      store?.storeName,
      store?.storeContactNumber,
    ),
  });

  if (store?.storeEmail) {
    await sendEmail({
      to: store?.storeEmail,
      subject: "Appointment booking confirmation",
      html: serviceBookingTemplate(
        customer?.name,
        service?.name,
        formattedDate,
        store?.storeName,
        store?.storeContactNumber,
      ),
    });
  }

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Appointment booked successfully !"));
});

const cancelAppointment = asyncHandler(async (req, res) => {
  const { bookingId, customerId } = req.params;
  const { reason } = req.body;

  if (!bookingId || !customerId || !reason?.trim())
    throw new ApiError(400, "Booking ID and cancellation reason are required");

  if (req.user._id.toString() !== customerId)
    throw new ApiError(403, "You can only cancel your own bookings");

  const booking = await ServiceBookings.findOne({
    _id: bookingId,
    customer: customerId,
  });

  if (!booking) throw new ApiError(404, "Booking not found");
  if (booking.status === BOOKING_STATUS.CANCELLED)
    throw new ApiError(400, "Booking is already cancelled");
  if (booking.status === BOOKING_STATUS.COMPLETED)
    throw new ApiError(400, "Completed bookings cannot be cancelled");

  booking.status = BOOKING_STATUS.CANCELLED;
  booking.cancellation = {
    reason: reason.trim(),
    cancelledAt: new Date(),
    cancelledBy: customerId,
    cancelledByModel: "Customer",
  };
  await booking.save();

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Appointment cancelled successfully"));
});

const cancelAppointmentByStore = asyncHandler(async (req, res) => {
  const { bookingId, storeId } = req.params;
  const { reason } = req.body;

  if (!bookingId || !storeId || !reason?.trim())
    throw new ApiError(400, "Booking ID and cancellation reason are required");

  if (req.user._id.toString() !== storeId)
    throw new ApiError(403, "You can only cancel bookings for your own store");

  const booking = await ServiceBookings.findOne({
    _id: bookingId,
    store: storeId,
  });

  if (!booking) throw new ApiError(404, "Booking not found");
  if (booking.status === BOOKING_STATUS.CANCELLED)
    throw new ApiError(400, "Booking is already cancelled");
  if (booking.status === BOOKING_STATUS.COMPLETED)
    throw new ApiError(400, "Completed bookings cannot be cancelled");

  booking.status = BOOKING_STATUS.CANCELLED;
  booking.cancellation = {
    reason: reason.trim(),
    cancelledAt: new Date(),
    cancelledBy: storeId,
    cancelledByModel: "Store",
  };
  await booking.save();

  return res
    .status(200)
    .json(new ApiResponse(200, booking, "Appointment cancelled successfully"));
});

export { createAppointment, cancelAppointment, cancelAppointmentByStore };
