import {
  BOOKING_STATUS,
  PAYMENT_MODULES,
} from "../constants/payment.constants.js";
import { Store } from "../models/store.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Customer } from "../models/customer.model.js";
import { Professional } from "../models/professional.model.js";
import { ServiceBookingOrder } from "../models/serviceBookingOrder.model.js";
import { ServiceBookings } from "../models/serviceBooking.model.js";
import { Services } from "../models/service.model.js";
import { Product } from "../models/product.model.js";
import { ProductOrder } from "../models/productOrder.model.js";
import sendEmail from "../services/mail.service.js";
import paymentConfirmationTemplate from "../template/paymentConfirmation.mail.template.js";

const sendPaymentConfirmationEmail = async (transaction) => {
  if (!transaction?.user || !transaction?.amount) return false;

  const userModels = [
    { Model: Customer, emailField: "email", nameField: "name" },
    { Model: Store, emailField: "storeEmail", nameField: "storeName" },
    { Model: Professional, emailField: "email", nameField: "name" },
  ];

  for (const { Model, emailField, nameField } of userModels) {
    const user = await Model.findById(transaction.user).lean();
    if (!user) continue;

    const recipientEmail = user[emailField];
    const recipientName = user[nameField] || "there";

    if (!recipientEmail) continue;

    const moduleLabel =
      transaction.module === PAYMENT_MODULES.SUBSCRIPTION
        ? "subscription"
        : transaction.module === PAYMENT_MODULES.REGISTRATION_CHARGE
          ? "registration fee"
          : "payment";

    await sendEmail({
      to: recipientEmail,
      subject: "Payment Confirmation",
      html: paymentConfirmationTemplate({
        name: recipientName,
        amount: transaction.amount,
        moduleName: moduleLabel,
        transactionNumber: transaction.transactionNumber,
        paymentDate: transaction.paymentDate || new Date(),
      }),
    });

    return true;
  }

  return false;
};

/**
 * CITY DARSHAN HANDLER
 * transaction.moduleId = CityDarshanBooking._id
 */
const cityDarshanHandler = {
  onPaymentSuccess: async (transaction) => {
    const booking = await CityDarshanBooking.findById(transaction.moduleId);

    if (!booking) {
      return false;
    }

    /**
     * Idempotency:
     * if already captured / confirmed, do nothing
     */
    if (
      booking.paymentStatus === "Captured" &&
      booking.bookingStatus === "Confirmed"
    ) {
      return true;
    }

    booking.paymentTransaction = transaction._id;
    booking.paymentStatus = "Captured";
    booking.bookingStatus = "Confirmed";
    booking.gatewayOrderId = transaction.gatewayOrderId || null;
    booking.gatewayPaymentId = transaction.gatewayPaymentId || null;
    booking.gatewaySignature = transaction.gatewaySignature || null;
    booking.paymentDate = transaction.paymentDate || new Date();
    booking.remarks = "Payment successful and booking confirmed";

    await booking.save();
    return true;
  },

  onPaymentFailed: async (transaction) => {
    const booking = await CityDarshanBooking.findById(transaction.moduleId);

    if (!booking) {
      return false;
    }

    booking.paymentTransaction = transaction._id;
    booking.paymentStatus = "Failed";
    booking.bookingStatus = "Pending";
    booking.remarks = transaction.remarks || "Payment failed";

    await booking.save();
    return true;
  },
};

const hotelHandler = {
  onPaymentSuccess: async () => true,
  onPaymentFailed: async () => true,
};

const travelPackageHandler = {
  onPaymentSuccess: async () => true,
  onPaymentFailed: async () => true,
};

const facilitatorHandler = {
  onPaymentSuccess: async () => true,
  onPaymentFailed: async () => true,
};

const clubHandler = {
  onPaymentSuccess: async () => true,
  onPaymentFailed: async () => true,
};

const promotionHandler = {
  onPaymentSuccess: async () => true,
  onPaymentFailed: async () => true,
};

const subscriptionHandler = {
  onPaymentSuccess: async (transaction) => {
    const subscription = await Subscription.findById(transaction.moduleId);
    if (!subscription || !subscription.isActive) return false;

    const validity = new Date();
    validity.setMonth(
      validity.getMonth() + (subscription.validity.months || 0),
    );
    const subscriptionData = {
      subscriptionModel: subscription._id,
      subscriptionPurchased: true,
      subscriptionValidity: validity,
    };

    const models = {
      customer: Customer,
      store: Store,
      professional: Professional,
    };
    const Model = models[subscription.planFor];
    if (!Model) return false;

    const user = await Model.findByIdAndUpdate(transaction.user, {
      subscription: subscriptionData,
    });
    return Boolean(user);
  },
  onPaymentFailed: async () => true,
};

const registrationHandler = {
  onPaymentSuccess: async (transaction) => {
    const store = await Store.findById(transaction.user);

    if (!store) return false;

    if (store.isRegistrationFeePaid) return true;

    store.isRegistrationFeePaid = true;
    store.registrationFeePaidAt = new Date();
    store.registrationPaymentTransaction = transaction._id;

    await store.save();

    return true;
  },

  onPaymentFailed: async () => true,
};

const serviceBookingHandler = {
  onPaymentSuccess: async (transaction) => {
    const order = await ServiceBookingOrder.findById(transaction.moduleId);
    if (!order) return false;
    if (order.status === "Confirmed") return true;

    const processingOrder = await ServiceBookingOrder.findOneAndUpdate(
      { _id: order._id, status: "Pending" },
      { $set: { status: "Processing" } },
      { new: true },
    );
    if (!processingOrder) {
      const latestOrder = await ServiceBookingOrder.findById(order._id);
      return latestOrder?.status === "Confirmed";
    }

    try {
      const customer = await Customer.findById(order.customer);
      if (!customer) throw new Error("Booking customer no longer exists");

      const serviceIds = order.items.map((item) => item.service);
      const services = await Services.find({ _id: { $in: serviceIds } })
        .populate("store", "storeName storeEmail storeContactNumber")
        .populate("professional", "name email contactNumber");
      const servicesById = new Map(
        services.map((service) => [service._id.toString(), service]),
      );

      if (servicesById.size !== order.items.length) {
        throw new Error("One or more services in the booking order are missing");
      }

      const existingBookings = await ServiceBookings.find({
        bookingOrder: order._id,
      });
      let bookings = existingBookings;
      if (existingBookings.length !== order.items.length) {
        if (existingBookings.length) {
          await ServiceBookings.deleteMany({ bookingOrder: order._id });
        }
        bookings = await ServiceBookings.insertMany(
          order.items.map((item) => {
            const service = servicesById.get(item.service.toString());
            return {
              service: item.service,
              customer: order.customer,
              address: order.address,
              store: service.store?._id,
              professional: service.professional?._id,
              dateOfBooking: new Date(),
              dateForBooking: item.dateForBooking,
              modeOfPayment: "Online Payment",
              bookingAmount: item.bookingAmount,
              status: BOOKING_STATUS.CONFIRMED,
              paymentTransaction: transaction._id,
              bookingOrder: order._id,
            };
          }),
        );
      }

      await Customer.updateOne(
        { _id: order.customer },
        { $addToSet: { bookings: { $each: bookings.map(({ _id }) => _id) } } },
      );

      order.bookings = bookings.map(({ _id }) => _id);
      order.status = "Confirmed";
      await order.save();

      for (const booking of bookings) {
        const service = servicesById.get(booking.service.toString());
        const providerEmail = service.store?.storeEmail || service.professional?.email;
        const providerName = service.store?.storeName || service.professional?.name;
        const providerContact =
          service.store?.storeContactNumber || service.professional?.contactNumber;
        const date = new Date(booking.dateForBooking);
        const formattedDate = `${String(date.getDate()).padStart(2, "0")}/${String(
          date.getMonth() + 1,
        ).padStart(2, "0")}/${String(date.getFullYear()).slice(-2)}`;

        try {
          await sendEmail({
            to: customer.email,
            subject: "Appointment booking confirmation",
            html: serviceBookingTemplate(
              customer.name,
              service.name,
              formattedDate,
              providerName,
              providerContact,
            ),
          });
          if (providerEmail) {
            await sendEmail({
              to: providerEmail,
              subject: "Appointment booking confirmation",
              html: serviceBookingTemplate(
                customer.name,
                service.name,
                formattedDate,
                providerName,
                providerContact,
              ),
            });
          }
        } catch (error) {
          console.error("Booking confirmation email failed:", error);
        }
      }

      return Boolean(order.bookings.length);
    } catch (error) {
      await ServiceBookingOrder.updateOne(
        { _id: order._id, status: "Processing" },
        { $set: { status: "Pending" } },
      );
      throw error;
    }
  },

  onPaymentFailed: async () => true,
};

const productOrderHandler = {
  onPaymentSuccess: async (transaction) => {
    const updatedOrder = await ProductOrder.findOneAndUpdate(
      { _id: transaction.moduleId, status: "Pending Payment" },
      {
        status: "Processing",
        paymentTransaction: transaction._id,
      },
      { new: true },
    );
    if (updatedOrder) return true;
    const existingOrder = await ProductOrder.findById(transaction.moduleId);
    return ["Processing", "Packed", "Shipped", "Delivered"].includes(
      existingOrder?.status,
    );
  },

  onPaymentFailed: async (transaction) => {
    const order = await ProductOrder.findOneAndUpdate(
      {
        _id: transaction.moduleId,
        status: "Pending Payment",
        stockReleased: false,
      },
      { status: "Payment Failed", stockReleased: true },
      { new: true },
    );
    if (!order) return true;

    await Promise.all(
      order.items.map((item) =>
        Product.updateOne(
          { _id: item.product },
          { $inc: { stock: item.quantity } },
        ),
      ),
    );
    return true;
  },
};

const handlers = {
  [PAYMENT_MODULES.REGISTRATION_CHARGE]: registrationHandler,
  [PAYMENT_MODULES.SUBSCRIPTION]: subscriptionHandler,
  [PAYMENT_MODULES.SERVICE_BOOKING]: serviceBookingHandler,
  [PAYMENT_MODULES.PRODUCT_ORDER]: productOrderHandler,
};

const notifyPaymentSuccess = async (transaction) => {
  if (!transaction) return false;

  try {
    return await sendPaymentConfirmationEmail(transaction);
  } catch (error) {
    console.error("Payment confirmation email failed:", error);
    return false;
  }
};

export const getPaymentModuleHandler = (module) => {
  return handlers[module] || null;
};

export const runPaymentSuccessHandler = async (transaction) => {
  const handler = getPaymentModuleHandler(transaction.module);
  const result = handler?.onPaymentSuccess
    ? await handler.onPaymentSuccess(transaction)
    : null;

  await notifyPaymentSuccess(transaction);

  return result;
};

export const runPaymentFailedHandler = async (transaction) => {
  const handler = getPaymentModuleHandler(transaction.module);
  if (handler?.onPaymentFailed) {
    return handler.onPaymentFailed(transaction);
  }
  return null;
};
